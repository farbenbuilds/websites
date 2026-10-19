const emojiPattern = /\p{Extended_Pictographic}/u;
const camelCasePattern = /^_?[a-z][a-zA-Z0-9]*$/;
const httpMethodPattern = /^(GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD)$/;

function isMemberNamed(node, name) {
  if (node.type !== "MemberExpression") return false;

  if (node.property.type !== "Identifier") return false;

  return node.property.name === name;
}

function isPrototypeReference(node) {
  return isMemberNamed(node, "prototype");
}

function isPrototypeMutationTarget(node) {
  if (node.type !== "MemberExpression") return false;

  if (isMemberNamed(node, "__proto__")) return true;

  if (isPrototypeReference(node)) return true;

  if (node.object.type !== "MemberExpression") return false;

  return isPrototypeReference(node.object);
}

function isSetPrototypeOfCall(node) {
  if (node.type !== "CallExpression") return false;

  return isMemberNamed(node.callee, "setPrototypeOf");
}

function isAllowedFunctionName(name) {
  return camelCasePattern.test(name) || httpMethodPattern.test(name);
}

const noOop = {
  meta: {
    type: "problem",
    docs: { description: "Ban classes, this, and prototype mutation" },
  },
  create(context) {
    const report = (node, message) => context.report({ message, node });

    const reportMutation = (node) => {
      if (isPrototypeMutationTarget(node.left)) report(node, "Prototype mutation is banned.");
    };

    return {
      ClassDeclaration: (node) =>
        report(node, "Classes are banned; return a state record from a factory function."),
      ClassExpression: (node) =>
        report(
          node,
          "Class expressions are banned; return a state record from a factory function.",
        ),
      ThisExpression: (node) =>
        report(node, "`this` is banned; pass state to free functions explicitly."),
      AssignmentExpression: reportMutation,
      CallExpression: (node) => {
        if (isSetPrototypeOfCall(node)) report(node, "Prototype mutation is banned.");
      },
    };
  },
};

const noEnum = {
  meta: {
    type: "problem",
    docs: { description: "Ban enums in favor of as const unions" },
  },
  create(context) {
    return {
      TSEnumDeclaration: (node) => {
        context.report({ message: "Enums are banned; use `as const` unions.", node });
      },
    };
  },
};

const noEmoji = {
  meta: {
    type: "problem",
    docs: { description: "Ban emoji code points in source files" },
  },
  create(context) {
    return {
      Program: (node) => {
        if (!emojiPattern.test(context.sourceCode.text)) return;
        context.report({
          message: "Emoji code points are banned in repository-authored files.",
          node,
        });
      },
    };
  },
};

const functionNameCamelCase = {
  meta: {
    type: "suggestion",
    docs: { description: "Require camelCase function names" },
  },
  create(context) {
    const check = (node, name) => {
      if (name === null || name === undefined || isAllowedFunctionName(name)) return;
      context.report({
        message: `Function name "${name}" must be camelCase.`,
        node,
      });
    };

    return {
      FunctionDeclaration: (node) => check(node, node.id?.name),
      FunctionExpression: (node) => check(node, node.id?.name),
      VariableDeclarator: (node) => {
        if (node.id.type !== "Identifier") return;

        if (
          node.init?.type !== "ArrowFunctionExpression" &&
          node.init?.type !== "FunctionExpression"
        ) {
          return;
        }

        check(node, node.id.name);
      },
    };
  },
};

export default {
  meta: { name: "farben" },
  rules: {
    "function-name-camel-case": functionNameCamelCase,
    "no-emoji": noEmoji,
    "no-enum": noEnum,
    "no-oop": noOop,
  },
};
