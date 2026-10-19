---
name: Web Security Review
description: Review Farben websites changes for trust boundaries, secrets, injection, unsafe links, dependency and supply-chain risk, and deployment hardening.
---

# Web Security Review

Use this skill for changes that touch content rendering, links, dependencies,
build configuration, deployment, analytics, forms, or any future server surface.

## Current Trust Boundaries

- Repository-owned MDX and Astro content is trusted after review.
- Query parameters, remote HTML, user input, and third-party embeds are
  untrusted.
- Static output under `dist/` is generated from trusted source.
- Dependencies and build scripts are part of the supply chain.
- Deployment secrets live outside the repository.

There is no account, payment, or user-data service today. A change that adds one
expands the boundary and needs a new threat model.

## Review Checklist

### Content and Rendering

- `{@html}` receives only reviewed, repository-owned content.
- No user input, query parameter, or remote response reaches `{@html}`.
- MDX imports point to repository files or pinned packages.
- No inline script executes untrusted data.
- JSON-LD and metadata escape values correctly.

### Links and Navigation

- No `javascript:`, `data:`, or open-redirect URL is constructed from input.
- External links use explicit `https` destinations.
- `target="_blank"` includes `rel="noreferrer"` or `rel="noopener"`.
- A redirect added by the host is documented and tested.

### Secrets and Data

- No token, key, webhook, or personal data is committed.
- Examples use placeholders, not live credentials.
- Logs and screenshots omit secrets and personal data.
- Environment variables are read at build or deploy time, not hard-coded.

### Dependencies

- The dependency has a stated purpose and a maintained upstream.
- The license is compatible with MIT.
- The lockfile diff matches the declared change.
- Lifecycle scripts are not approved without a build need.
- No package is installed from an unverified fork or URL.

### Build and Deployment

- Generated output is not patched by hand.
- CI permissions are least privilege.
- Workflow actions are pinned to a major version or commit.
- Build secrets are not printed.
- Security headers are configured at the host when the surface requires them.

### Future Server Surfaces

If a form, account, checkout, or API appears:

- Validate every input on the server.
- Use parameterized queries and a schema validator.
- Apply authentication and authorization at the server boundary.
- Rate-limit expensive and state-changing operations.
- Store secrets in the platform secret store.
- Add CSRF protection for cookie-authenticated writes.
- Log security events without logging secrets.

## Reporting

Do not open a public issue for an undisclosed vulnerability. Use
[SECURITY.md](../../../SECURITY.md) and the private advisory link.

## Review Output

Report findings by severity with the file and line reference, the affected trust
boundary, a concrete exploit or failure scenario, and the requested change.
State verification gaps explicitly. Do not turn a style preference into a
security finding.
