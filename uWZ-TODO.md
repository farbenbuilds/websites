# µWebZockets documentation website: master roadmap

> Status: active
> Canonical path: `uWZ-TODO.md` (repository root)
> Owner: `docs-writer` with `dx_router` as product reviewer; `architect` approves scope, `integrator` closes milestones
> Last updated: 2026-10-31
> Product baseline: µWebZockets 2.1.6, Zig 0.16.0
> Site baseline: Blume 2.2.6, Astro, Svelte 5 islands, English and Vietnamese

This file is the single planning surface for the uWebZockets documentation site.
It is intentionally more detailed than a normal backlog: a human contributor
must be able to open any task and know what to write, which source proves it,
what "done" means, and which command produces the evidence. An agent must be
able to do the same without guessing an API or inventing a feature.

The page is a living document. Update the status columns and the milestone
dashboard in the same change that ships a page. Do not create parallel planning
files for the same scope.

## 0. How to use this file

### 0.1 Reading order

| Reader          | Start at                                | Use it for                                           |
| --------------- | --------------------------------------- | ---------------------------------------------------- |
| New contributor | Section 1, then Section 4               | Understand the product, audience, and URL model      |
| Docs writer     | Section 5, then Section 6               | Pick a page and follow its content contract          |
| Agent           | Section 0.3, then the assigned task row | Execute one bounded slice and report evidence        |
| Reviewer        | Section 11 and the page row             | Check acceptance criteria without rewriting the page |
| Maintainer      | Sections 12 and 13                      | Track risk, decisions, releases, and drift           |

### 0.2 Status vocabulary

| Status     | Meaning                                                                    |
| ---------- | -------------------------------------------------------------------------- |
| `Live`     | Published, reviewed, linked, and passing the docs gates                    |
| `Draft`    | Content exists but is not launch-ready or is missing translations/evidence |
| `Planned`  | Scoped here but not started                                                |
| `Blocked`  | Cannot proceed until a named decision or upstream change lands             |
| `Deferred` | Deliberately outside the current milestone; keep the row for visibility    |

Priority vocabulary:

| Priority | Meaning                                                                            |
| -------- | ---------------------------------------------------------------------------------- |
| `P0`     | Required before the public launch; the site is misleading without it               |
| `P1`     | Required for a complete first-class docs experience; ship immediately after launch |
| `P2`     | Depth, polish, or long-tail material; schedule when the backlog allows             |

### 0.3 Agent operating contract

Every agent assigned a documentation task must follow this sequence:

1. Read `AGENTS.md`, `CODING_CONVENTION.md`, `uWZ-TODO.md`, and
   the `docs-site-authoring` skill before touching content.
2. Pick exactly one task row. Do not broaden the slice without recording why.
3. Resolve every technical claim against the owning source of truth, in this
   order: public API and implementation, tests and fixtures, `README.md` and
   `CHANGELOG.md`, `docs/*.md`, then the existing website page. The website is
   never the source of truth for behavior.
4. Use graphify for codebase questions and Context7 for Blume/Astro/library
   questions. Do not rely on memory for an API signature, limit, error name, or
   platform claim.
5. Write the English page first. Add the Vietnamese mirror only when the
   translation can be reviewed; never publish machine translation unchecked.
6. Keep code samples complete enough to compile or run. If a sample is an
   excerpt, name the full source file it comes from.
7. Run the page gate and the site gate. Paste the commands and outcomes into the
   task report.
8. Update the page row status, the milestone dashboard, and any source map entry
   that changed. Do not mark a page `Live` because it renders; mark it `Live`
   only when every acceptance criterion passes.

If a source conflict cannot be resolved, stop and write the conflict into the
task report. Do not silently choose the friendlier claim.

### 0.4 Definition of done for any docs change

- The page has a unique reader goal, a `title`, and a one-sentence
  `description` in frontmatter.
- The first paragraph states the outcome, not the history of the framework.
- Every command is copy-pasteable and was run against the stated version.
- Every Zig, C, C++, JSON, or shell fence declares a language.
- Every public type, function, error, and limit named on the page exists in the
  current source or is explicitly marked as planned/unsupported.
- English and Vietnamese routes resolve; if the Vietnamese page is intentionally
  pending, the task row says so and the English page is not marked fully `Live`.
- `blume validate --strict` reports no broken internal links, anchors, assets, or
  redirects.
- `blume audit --fail-on warning` reports no warnings for the built site.
- Search finds the page by title and by one distinctive phrase from the body.
- The page is reachable from the sidebar and from at least one contextual link.
- The page works at 320 px, 768 px, and 1280 px; keyboard focus and reduced
  motion behave correctly.
- No emoji, exclamation mark, marketing filler, unverified benchmark, secret, or
  generated-output edit was introduced.
- The changed files and exact verification commands are reported.

## 1. Mission, success, and non-goals

### 1.1 Mission

Build the reference documentation site a Zig team can use to evaluate,
integrate, operate, and debug µWebZockets without reading the repository's
Markdown files first. The site must feel like a mature framework docs product:
clear onboarding, a stable information architecture, task-led guides, complete
protocol coverage, an honest feature matrix, and machine-readable output for
agents.

The site is not a prettier mirror of `docs/`. The repository documents are
source material: accurate in places, dense, and organized by implementation
history. The website must reorganize that material around reader goals, then
add the missing tutorials, recipes, reference pages, and evidence.

### 1.2 Launch success metrics

| Metric                          | Target                                                                                                    | Evidence                                                 |
| ------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| P0 pages published              | 100%                                                                                                      | Page register below; no `Planned` P0 rows                |
| P0 Vietnamese coverage          | 100%                                                                                                      | Mirrored `docs/vi/` pages, anchor parity                 |
| Public features documented      | 100% of Appendix A rows                                                                                   | Coverage matrix has an owner page and example            |
| Broken links and anchors        | 0                                                                                                         | `blume validate --strict`                                |
| Site audit warnings             | 0                                                                                                         | `blume audit --fail-on warning`                          |
| Search smoke tests              | 100% of canonical queries return the intended page in the top three                                       | Search test table in Section 9                           |
| Code samples verified           | 100% of samples labelled `runnable`                                                                       | Snippet manifest and CI job                              |
| Accessibility                   | WCAG 2.2 AA for templates and interactive components                                                      | Automated checks plus manual keyboard/screen-reader pass |
| Performance budgets             | Docs pages: LCP <= 2.0 s on a mid-tier mobile profile, CLS <= 0.05, no client framework JS on prose pages | Lighthouse/DevTools evidence and build budget            |
| Time to first successful server | A new Zig developer reaches `curl` output in <= 10 minutes                                                | Quickstart tested with a clean checkout                  |
| Support deflection              | Top five repeated support questions answerable by a linked page                                           | FAQ and issue-label review after launch                  |

### 1.3 Non-goals

- Do not eject Blume or replace it with Docusaurus, Starlight, Nextra, or a
  hand-rolled Astro site. Blume owns routing, search, i18n, llms output, and the
  build; the site owns content and presentation hooks.
- Do not create a separate marketing site in this app. The root `/` remains the
  existing editorial landing page; the docs live under `/docs` and `/reference`.
- Do not duplicate the repository's `TODO.md` editorial design plan. That plan
  owns the landing page and visual grammar; this plan owns documentation scope.
- Do not claim features that are helper-only, experimental, platform-gated, or
  planned. WebTransport, Windows support, HTTP/3 metrics, HTTP/2 push, h2c
  Upgrade, request-body streaming, and kTLS integration all have explicit
  boundaries in `docs/roadmap.md`; those boundaries are contracts.
- Do not hand-edit `dist/`, `.blume/`, or generated search/AI artifacts.
- Do not add page prose to x18n locale JSON. MDX content is localized by mirrored
  files, not by `locales/en.json`.
- Do not ship AI-generated prose without source verification, a technical
  review, and a copy edit. Volume is not success.

## 2. Product context and current audit

### 2.1 What µWebZockets is

µWebZockets is a zero-allocation, shared-nothing server framework for Zig
0.16.0. One type-safe `Request`/`Response` API serves HTTP/1.1, HTTP/2, HTTP/3,
WebSocket, and JSON-RPC from bounded slabs allocated once at startup, owned by
one thread each, and reused without locking. The framework also ships a bounded
HTTP/1.1 client, TLS termination through BoringSSL, a C ABI, a thread-per-core
cluster, metrics, a development log, fuzz targets, and a compliance-oriented
test matrix.

The docs must make three things inseparable:

1. **The programming model:** bounded capacities, borrowed slices, explicit
   ownership, asynchronous tokens, and deterministic shutdown.
2. **The protocol surface:** one handler boundary across HTTP/1.1, HTTP/2,
   HTTP/3, and WebSocket, with different wire behavior and limits underneath.
3. **The operational contract:** fixed slabs, per-worker TLS, cluster lifecycle,
   platform support, and evidence-gated performance.

### 2.2 Current website audit

Checked on 2026-10-31 with `blume doctor` and `blume validate` from
`apps/uwz-docs`.

| Area             | Current state                                                                            | Gap                                                                              |
| ---------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Pages            | 4 total: `/`, `/getting-started`, plus Vietnamese mirrors                                | No protocol, concept, reference, operations, migration, or recipe pages          |
| Navigation       | Blume infers a flat tree from two files                                                  | No grouped sidebar, tabs, section indexes, or previous/next flow                 |
| Content source   | `getting-started.mdx` links to GitHub for every deeper topic                             | Readers leave the site for the material the site exists to provide               |
| Feature coverage | HTTP/1.1, WebSocket, TLS, architecture, memory, deployment exist only as repository docs | No dedicated HTTP/2, HTTP/3, JSON-RPC, type-safety, client, or C ABI pages       |
| Metadata         | Two pages have descriptions; no page-level SEO plan                                      | No `deployment.site`, no OG strategy, no canonical/sitemap plan                  |
| Search           | Default Orama index over four pages                                                      | No synonyms, tags, popular pages, or search QA                                   |
| Agent surface    | Blume defaults are available                                                             | No curated `llms.txt` details, no page inventory audit, no MCP decision          |
| Verification     | `blume check` and `blume validate` pass                                                  | No `blume audit` gate, no code-sample gate, no accessibility or performance gate |
| i18n             | English and Vietnamese getting-started                                                   | No translation policy for the full tree                                          |
| URL stability    | `/getting-started` exists at the root                                                    | No decision for `/docs/...`; moving later will create avoidable redirects        |

The existing `getting-started.mdx` is a useful seed. It is not the final page:
it mixes install, package setup, HTTP, WebSocket, TLS, cluster, examples, and a
link dump. The rewrite splits it by reader goal and keeps the first successful
server as the primary path.

### 2.3 Source inventory

| Source                            | Use on the site                                                              |
| --------------------------------- | ---------------------------------------------------------------------------- |
| `README.md`                       | Positioning, quick start, feature tour, examples table, platform summary     |
| `docs/getting_started.md`         | Onboarding sequence and first-run troubleshooting                            |
| `docs/api.md`                     | Application types, lifecycle, routing, middleware, async, cluster, ownership |
| `docs/http.md`                    | HTTP/1.1 parsing, limits, routing, middleware, static files, helpers         |
| `docs/http2.md`                   | HTTP/2 startup, frames, HPACK, flow control, RFC 8441, capacities            |
| `docs/quic.md`                    | HTTP/3, QPACK, QUIC policy, `QUERY`, WebTransport status                     |
| `docs/websocket.md`               | RFC 6455, RFC 7692, pub/sub, heartbeats, HTTP/2 tunnels, compliance          |
| `docs/json_rpc.md`                | JSON-RPC 2.0 service, typed procedures, batches, capacities                  |
| `docs/tls.md`                     | TLS 1.3, ephemeral PEM, mTLS, clusters, ALPN, 0-RTT, errors                  |
| `docs/client.md`                  | Bounded HTTP/1.1 client, TLS trust, timeouts, failure semantics              |
| `docs/memory_model.md`            | Slab layout, presets, SoA, capacities, backpressure, rejection documents     |
| `docs/architecture.md`            | Shared-nothing workers, event loop, transports, shutdown                     |
| `docs/callback_lifecycle.md`      | Completion ordering and async token lifecycle                                |
| `docs/operations.md`              | Build, tests, sanitizers, fuzzing, cross targets, C ABI, releases            |
| `docs/deployment.md`              | Production checklist and platform/security posture                           |
| `docs/troubleshooting.md`         | Build, capacity, TLS, client, signal, cluster, HTTP/3 failures               |
| `docs/protocols.md`               | Cross-protocol boundary and compliance summary                               |
| `docs/roadmap.md`                 | Deliberate boundaries and future direction                                   |
| `docs/dependency_forks.md`        | Maintained fork policy and provenance                                        |
| `CODEBASE.md`                     | Internal ownership map and file-level architecture                           |
| `CHANGELOG.md`                    | Release notes, migration facts, exact patch behavior                         |
| `SECURITY.md`                     | Disclosure policy, supported versions, trust boundaries                      |
| `CONTRIBUTE.md`                   | Build, test, and contribution workflow                                       |
| `CI_CD_PIPELINE.md`               | CI gates, sanitizer matrix, compliance jobs                                  |
| `examples/*.zig`                  | Canonical runnable examples                                                  |
| `src/root.zig`                    | Public API index and module ownership                                        |
| `include/uWebZockets.h`           | C ABI declarations                                                           |
| `builds/*.zig`                    | Build steps, targets, and sanitizer/fuzz graph                               |
| `tests/*`, `fuzz/*`, `oss-fuzz/*` | Verification evidence and test targets                                       |

### 2.4 What the repository docs do well

- They are honest about limits, unsupported paths, and deliberate boundaries.
- They explain ownership and capacity consequences, not just call signatures.
- They name errors and failure modes.
- They include verification commands and compliance results.
- They separate protocol behavior from application API.

The website must preserve those strengths while adding progressive disclosure,
task orientation, cross-links, diagrams, and runnable examples.

### 2.5 What the repository docs do not provide

- A guided path from "what is this" to "ship it".
- A consistent tutorial layer with complete, tested programs.
- A visual information architecture with search, tags, and section landing pages.
- A single reference surface for configuration, limits, errors, and the C ABI.
- Recipes for common application shapes.
- Migration guidance from uWebSockets, `std.http`, C, and earlier µWebZockets
  versions.
- A machine-readable agent surface curated for this product.
- A documentation maintenance contract that keeps the site from drifting.

## 3. Audience, jobs, and narrative

### 3.1 Personas

| Persona                        | Context                                                         | Primary jobs                                                                          | What convinces them                                                                 |
| ------------------------------ | --------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Zig application developer      | Building an API, realtime service, or internal tool in Zig 0.16 | Evaluate the framework, get a server running, add routes and WebSockets, ship         | Clear quickstart, complete API, honest limits, examples that compile                |
| Performance engineer           | Comparing server frameworks or replacing a C++ stack            | Understand the allocation model, benchmark methodology, cluster scaling, tuning knobs | Cost model, capacity math, reproducible benchmarks, no unsourced claims             |
| Library or platform maintainer | Embedding µWebZockets in another product or C/C++ host          | Understand ownership, C ABI, build graph, dependency policy, release cadence          | Architecture, ABI reference, fork policy, compatibility matrix                      |
| SRE / operations engineer      | Running the service in production                               | Configure TLS, size slabs, expose metrics, drain on SIGTERM, debug failures           | Deployment checklist, observability, shutdown semantics, troubleshooting            |
| Security reviewer              | Assessing parser hardening, TLS policy, auth, input limits      | Map trust boundaries, verify defaults, find the disclosure process                    | Threat model, security headers, auth and rate-limit pages, `SECURITY.md`            |
| AI coding agent                | Answering questions or writing integrations from docs           | Find the right page, follow exact signatures, avoid unsupported features              | `llms.txt`, `.md` mirrors, stable anchors, explicit status badges, reference tables |

### 3.2 Jobs to be done

1. "Explain in five minutes why this framework exists and whether it fits my
   problem."
2. "Get a working HTTP server, then a WebSocket, then JSON-RPC, without reading
   the source."
3. "Show me how to add TLS, HTTP/2, HTTP/3, clustering, and a C ABI without
   breaking the ownership model."
4. "Tell me the exact capacity limit and what happens when I exceed it."
5. "Show me how to size a slab for my traffic and verify the memory footprint."
6. "Help me diagnose a failed build, handshake, TLS load, cluster start, or
   HTTP/3 request."
7. "Give me a migration path from uWebSockets or `std.http`."
8. "Let an agent retrieve the same answer in Markdown or through MCP."

### 3.3 Narrative

The site should tell one story in this order:

1. **Why:** practical Zig servers need bounded memory, predictable latency, and
   one API across protocols.
2. **How:** one slab, one loop per worker, one request/response boundary, and
   explicit ownership.
3. **Show:** a working server in minutes, then protocol-specific depth.
4. **Prove:** limits, failure modes, compliance, benchmarks, and tests.
5. **Operate:** TLS, capacities, observability, deployment, and shutdown.
6. **Extend:** C ABI, WASM, cluster, and integrations.
7. **Maintain:** roadmap, changelog, security policy, and contribution path.

### 3.4 Voice and tone

- Direct, technical, and calm.
- Second person for procedures; third person for architecture.
- Present tense. "The router returns `error.RoutesLocked`", not "the router will
  probably return".
- Explain the "why" before a non-obvious constraint, then show the API.
- Prefer concrete nouns and measured claims.
- Never use "simply", "just", "obviously", "blazing fast", "production-ready",
  or "battle-tested" without a linked definition and evidence.
- Do not use emoji or exclamation marks.
- Use "µWebZockets" in prose, `uz` in Zig code, and `UWEBZOCKETS_*` for
  environment variables.

## 4. Information architecture

### 4.1 URL principles

- Stable, lowercase, kebab-case routes.
- Docs live under `/docs`; generated or hand-written reference lives under
  `/reference`; examples under `/examples`; release history under `/changelog`.
- Slugs describe the reader goal, not the source filename.
- A page that is split keeps a redirect from the old route.
- Vietnamese routes mirror the English path under `/vi`.
- Anchors are stable. When a heading changes, keep the old anchor with Blume's
  explicit `{#anchor}` syntax or add a redirect/anchor alias.
- No dates in docs URLs except changelog entries.
- No `/latest` segment. The current docs are unprefixed; versions are archived
  snapshots when versioning begins.

### 4.2 Top-level routes

| Route                     | Surface                      | Owner                       | Notes                                                                  |
| ------------------------- | ---------------------------- | --------------------------- | ---------------------------------------------------------------------- |
| `/`                       | Editorial landing page       | Existing landing components | Keep `mode: custom`; update the primary CTA to `/docs/getting-started` |
| `/docs`                   | Documentation home           | Docs                        | Reader routing page: start, concepts, protocols, operate               |
| `/docs/getting-started/*` | Onboarding                   | Docs                        | First success path                                                     |
| `/docs/concepts/*`        | Mental model                 | Docs                        | Cross-protocol explanations                                            |
| `/docs/http/*`            | HTTP/1.1 and application API | Docs                        | Largest section; includes a nested Helpers group                       |
| `/docs/websocket/*`       | WebSocket                    | Docs                        | RFC 6455/7692, pub/sub, tunnels                                        |
| `/docs/http2/*`           | HTTP/2                       | Docs                        | Frames, HPACK, flow control, RFC 8441                                  |
| `/docs/http3/*`           | HTTP/3 and QUIC              | Docs                        | QPACK, transport policy, WebTransport status                           |
| `/docs/json-rpc/*`        | JSON-RPC 2.0                 | Docs                        | Typed services, batches, errors                                        |
| `/docs/type-safety/*`     | Zig type-safety model        | Docs                        | Capacities, schema, typed RPC, C ABI                                   |
| `/docs/client/*`          | Outbound client              | Docs                        | HTTP/1.1 only                                                          |
| `/docs/security/*`        | TLS and security             | Docs                        | TLS 1.3, mTLS, auth, rate limits, threat model                         |
| `/docs/architecture/*`    | Internals                    | Docs                        | Slab, loop, router, callback lifecycle                                 |
| `/docs/performance/*`     | Performance model            | Docs                        | Sizing, benchmarking, tuning, regressions                              |
| `/docs/operations/*`      | Build and run                | Docs                        | Tests, sanitizers, fuzzing, releases                                   |
| `/docs/deployment/*`      | Production rollout           | Docs                        | Docker, Kubernetes, systemd, reverse proxy                             |
| `/docs/guides/*`          | Recipes                      | Docs                        | Task-shaped cookbook                                                   |
| `/docs/migration/*`       | Migration                    | Docs                        | uWebSockets, std.http, C, version upgrades                             |
| `/reference/*`            | Reference tab                | Docs + DX                   | API index, config, limits, errors, C ABI                               |
| `/examples/*`             | Examples tab                 | Docs                        | One page per runnable example                                          |
| `/changelog`              | Release history              | Docs                        | Generated from the repository changelog or release notes               |
| `/security`               | Security policy              | Docs                        | Public summary linking to `SECURITY.md`                                |
| `/contributing`           | Contribution guide           | Docs                        | Public summary linking to `CONTRIBUTE.md`                              |

### 4.3 Redirect map for the migration

The current site publishes `/getting-started` and `/vi/getting-started`. The
new tree moves them under `/docs`. Add these redirects in `blume.config.ts` in
the same change that creates the new pages:

| From                    | To                                 | Status                       |
| ----------------------- | ---------------------------------- | ---------------------------- |
| `/getting-started`      | `/docs/getting-started`            | 301                          |
| `/getting-started/*`    | `/docs/getting-started/:splat*`    | 301                          |
| `/vi/getting-started`   | `/vi/docs/getting-started`         | 301                          |
| `/vi/getting-started/*` | `/vi/docs/getting-started/:splat*` | 301                          |
| `/api`                  | `/reference`                       | 301, if a legacy link exists |
| `/docs/api`             | `/reference/zig`                   | 301, if a legacy link exists |

Do not add a redirect until the target page exists. `blume validate` treats a
redirect to nowhere as a warning; `blume audit` treats it as a broken redirect.

### 4.4 Header navigation and sidebar

Use Blume tabs once the `/docs` and `/reference` trees exist. Proposed tabs:

```ts
navigation: {
  tabs: [
    { label: "Docs", path: "/docs", icon: "book-open" },
    { label: "Reference", path: "/reference", icon: "braces" },
    { label: "Examples", path: "/examples", icon: "boxes" },
    { label: "Changelog", path: "/changelog", icon: "scroll-text" },
  ],
},
```

Rules:

- The `Docs` tab scopes the sidebar to `/docs/*`.
- The `Reference` tab scopes the sidebar to `/reference/*`.
- The `Examples` tab scopes the sidebar to `/examples/*`.
- The landing page at `/` stays outside the tabs and keeps its own navigation.
- Do not add a tab until every link in it resolves. `blume doctor` warns on a
  tab whose path matches no page.
- Use `meta.ts` in every section folder for title, icon, order, and child order.
- Every section gets an `index.mdx` landing page. Set `directory: "card"` on the
  folder meta so the landing page doubles as a table of contents.
- Use `sidebar.display: "group"` for the docs tree once there are more than six
  groups; keep `flat` while the tree is small so the first screen stays calm.
- The Helpers group uses `docs/http/helpers/meta.ts` with
  `title: "Helpers"`, `directory: "card"`, and an order after Response and
  before Middleware. It is a nested group, not a header tab.
- Do not hide pages that are required for navigation. Hidden pages are reserved
  for redirects, draft previews, and internal review pages.

### 4.5 Page types and shapes

| Type            | Shape                                                        | Example                     |
| --------------- | ------------------------------------------------------------ | --------------------------- |
| Tutorial        | Goal, prerequisites, numbered steps, result, next step       | First WebSocket server      |
| How-to          | Problem, assumptions, procedure, verification, failure modes | Configure mTLS              |
| Reference       | Stable facts, signatures, defaults, limits, errors, examples | `ServerConfig`              |
| Explanation     | Concept, tradeoffs, diagrams, links to tasks                 | Shared-nothing workers      |
| Recipe          | Copyable program, explanation, variations, tests             | JSON API with validation    |
| Migration       | Before/after mapping, incompatibilities, checklist           | From uWebSockets            |
| Troubleshooting | Symptom, cause, fix, prevention, related errors              | Build and cache failures    |
| Release note    | Version, date, changes, migration, evidence                  | Changelog entry             |
| Comparison      | Criteria table, honest boundaries, recommendation            | µWebZockets and uWebSockets |

Do not mix a tutorial with a reference dump. Split the page when the reader's
goal changes. A page may link to a reference table instead of owning it.

### 4.6 Cross-linking rules

- Every protocol page links to the shared `Request`/`Response` pages and to the
  capacity model.
- Every tutorial ends with one "next step" and two related links, not a link
  dump.
- Every reference page links back to the task page that uses the API.
- Every unsupported boundary links to `roadmap.md` or the owning ADR.
- Every security claim links to `SECURITY.md` or the TLS/security page.
- Every performance number links to the benchmark evidence page with commit,
  date, hardware, and command.
- Every code sample that is an excerpt names the canonical example file.

### 4.7 Helpers category decision

Hono groups small, composable utilities under a top-level **Helpers** category.
The pattern is useful, but copying its boundary literally would hurt this site:
Hono's Helpers includes WebSocket, streaming, SSE, and middleware-like auth
helpers because Hono exposes them as importable helper packages. µWebZockets
does not have that packaging boundary. Its WebSocket, HTTP/2, HTTP/3, and
security surfaces carry protocol behavior, limits, and ownership rules that
deserve their own sections.

Decision: adopt the **Helpers label and card-style hub**, but make it a nested
group under the HTTP/application API section at `/docs/http/helpers`. Do not
create a top-level Helpers tab or a second copy of protocol pages.

Why this shape:

- It matches the reader's task. "I need a cookie helper" and "I need to
  understand HTTP/1.1 request parsing" are different jobs.
- It compacts the HTTP sidebar without hiding the protocol model.
- It keeps security middleware out of a neutral utilities bucket. Auth, rate
  limiting, CORS, and security headers are security controls, not convenience
  helpers.
- It keeps one canonical page per topic. The Helpers index links to core pages
  such as JSON, SSE, streaming, static files, errors, and schema validation; it
  does not duplicate them.
- Hono's top-level placement works for a framework whose helpers are optional
  imports. Our helpers are part of one fixed public API, so the hierarchy should
  reflect the protocol boundary.

What belongs in Helpers:

- Query and form parsing.
- Multipart parsing.
- Cookies and signed cookies.
- Compression streams and the per-worker codec pool, plus `end_gzip`.
- ETag, conditional GET, and cache helpers.
- `Accept` content negotiation.
- Fetch/Streams/abort primitives.
- WebSocket stream adapters, as an adapter page that links to the WebSocket
  protocol section.

What does not belong in Helpers:

- Routing, handlers, `Request`, `Response`, JSON bodies, static files, OpenAPI,
  SSE, and response streaming. These are core application or protocol surfaces.
- Auth, rate limiting, CORS, and security headers. These live under Security and
  the HTTP middleware page, where their trust boundaries are explained.
- HTTP/2, HTTP/3, WebSocket, JSON-RPC, TLS, cluster, or C ABI. These are
  first-class sections, not utilities.
- `uz.schema` and typed RPC. They are type-safety features even though they are
  small APIs; the Helpers index links to them.

The Helpers index must answer "which helper do I need?" in one screen, with
cards grouped as Input, State, Wire, and Adapters. Each card links to the
canonical page and names the public module.

## 5. Page register

This register is the work queue. A page is not complete because the row exists;
it is complete when the section contract and the global definition of done are
satisfied. Rows marked `Live` are the current four-page site and the two pages
that will be split during M1.

### 5.1 Landing and documentation home

| ID      | Route                       | Page                | Type        | Priority | Milestone | Source             | Status |
| ------- | --------------------------- | ------------------- | ----------- | -------- | --------- | ------------------ | ------ |
| UWZ-001 | `/`                         | Landing page        | Landing     | P0       | Existing  | Landing components | Live   |
| UWZ-002 | `/docs`                     | Documentation home  | Index       | P0       | M1        | README, this file  | Live   |
| UWZ-003 | `/docs/what-is-uwebsockets` | What is µWebZockets | Explanation | P0       | M1        | README, CODEBASE   | Live   |
| UWZ-004 | `/docs/why-uwebsockets`     | Why µWebZockets     | Explanation | P1       | M1        | README, roadmap    | Live   |

### 5.2 Getting Started

| ID      | Route                                          | Page                        | Type           | Priority | Milestone | Source                              | Status |
| ------- | ---------------------------------------------- | --------------------------- | -------------- | -------- | --------- | ----------------------------------- | ------ |
| UWZ-010 | `/docs/getting-started`                        | Getting Started             | Tutorial index | P0       | M1        | `docs/getting_started.md`           | Live   |
| UWZ-011 | `/docs/getting-started/motivation`             | Motivation                  | Explanation    | P0       | M1        | README, roadmap                     | Live   |
| UWZ-012 | `/docs/getting-started/philosophy`             | Philosophy                  | Explanation    | P0       | M1        | CODEBASE, CODING_CONVENTION         | Live   |
| UWZ-013 | `/docs/getting-started/installation`           | Installation                | Tutorial       | P0       | M1        | README, operations                  | Live   |
| UWZ-014 | `/docs/getting-started/quickstart`             | Quickstart                  | Tutorial       | P0       | M1        | README, examples                    | Live   |
| UWZ-015 | `/docs/getting-started/project-structure`      | Project structure           | Explanation    | P1       | M1        | CODEBASE                            | Live   |
| UWZ-016 | `/docs/getting-started/first-http-server`      | Your first HTTP server      | Tutorial       | P0       | M1        | examples/hello_world.zig            | Live   |
| UWZ-017 | `/docs/getting-started/first-websocket`        | Your first WebSocket        | Tutorial       | P0       | M1        | examples/chat_server.zig            | Live   |
| UWZ-018 | `/docs/getting-started/first-json-rpc-service` | Your first JSON-RPC service | Tutorial       | P0       | M1        | examples/rpc_server.zig             | Live   |
| UWZ-019 | `/docs/getting-started/first-tls-server`       | Your first TLS server       | Tutorial       | P1       | M2        | examples/https_server.zig           | Live   |
| UWZ-020 | `/docs/getting-started/first-cluster`          | Your first cluster          | Tutorial       | P1       | M2        | examples/shared_nothing_cluster.zig | Live   |
| UWZ-021 | `/docs/getting-started/first-http3-server`     | Your first HTTP/3 server    | Tutorial       | P1       | M3        | examples/http3_server.zig           | Live   |
| UWZ-022 | `/docs/getting-started/examples-tour`          | Examples tour               | Index          | P1       | M1        | examples/readme_examples_test.md    | Live   |
| UWZ-023 | `/docs/getting-started/faq`                    | FAQ                         | Reference      | P0       | M1        | README, roadmap                     | Live   |
| UWZ-024 | `/docs/getting-started/glossary`               | Glossary                    | Reference      | P1       | M1        | CODEBASE, docs                      | Live   |
| UWZ-025 | `/docs/getting-started/learning-paths`         | Learning paths              | Index          | P2       | M5        | This file                           | Live   |

### 5.3 Concepts

| ID      | Route                                    | Page                     | Type        | Priority | Milestone | Source                              | Status  |
| ------- | ---------------------------------------- | ------------------------ | ----------- | -------- | --------- | ----------------------------------- | ------- |
| UWZ-030 | `/docs/concepts`                         | Concepts                 | Index       | P0       | M1        | `docs/api.md`, CODEBASE             | Planned |
| UWZ-031 | `/docs/concepts/application-model`       | Application model        | Explanation | P0       | M1        | `docs/api.md`                       | Planned |
| UWZ-032 | `/docs/concepts/request-lifecycle`       | Request lifecycle        | Explanation | P0       | M1        | `docs/architecture.md`              | Planned |
| UWZ-033 | `/docs/concepts/response-lifecycle`      | Response lifecycle       | Explanation | P0       | M1        | `docs/api.md`                       | Planned |
| UWZ-034 | `/docs/concepts/routing-model`           | Routing model            | Explanation | P0       | M1        | `docs/http.md`                      | Planned |
| UWZ-035 | `/docs/concepts/handler-shapes`          | Handler shapes           | Explanation | P0       | M1        | `docs/api.md`                       | Planned |
| UWZ-036 | `/docs/concepts/middleware-model`        | Middleware model         | Explanation | P1       | M2        | `docs/http.md`                      | Planned |
| UWZ-037 | `/docs/concepts/async-responses`         | Asynchronous responses   | Explanation | P0       | M2        | `docs/api.md`                       | Planned |
| UWZ-038 | `/docs/concepts/ownership-and-lifetimes` | Ownership and lifetimes  | Explanation | P0       | M1        | `docs/api.md`                       | Planned |
| UWZ-039 | `/docs/concepts/capacity-model`          | Capacity model           | Explanation | P0       | M1        | `docs/memory_model.md`              | Planned |
| UWZ-040 | `/docs/concepts/zero-allocation`         | Zero allocation          | Explanation | P0       | M1        | `docs/memory_model.md`              | Planned |
| UWZ-041 | `/docs/concepts/shared-nothing`          | Shared-nothing workers   | Explanation | P0       | M2        | `docs/architecture.md`              | Planned |
| UWZ-042 | `/docs/concepts/backpressure`            | Backpressure             | Explanation | P0       | M2        | `docs/memory_model.md`              | Planned |
| UWZ-043 | `/docs/concepts/protocol-negotiation`    | Protocol negotiation     | Explanation | P1       | M3        | `docs/http2.md`, `docs/quic.md`     | Planned |
| UWZ-044 | `/docs/concepts/type-safety`             | Type safety              | Explanation | P0       | M2        | `docs/api.md`, `src/root.zig`       | Planned |
| UWZ-045 | `/docs/concepts/errors`                  | Errors and failure modes | Explanation | P0       | M2        | `docs/troubleshooting.md`           | Planned |
| UWZ-046 | `/docs/concepts/cluster-model`           | Cluster model            | Explanation | P1       | M3        | `docs/architecture.md`              | Planned |
| UWZ-047 | `/docs/concepts/security-model`          | Security model           | Explanation | P0       | M4        | `SECURITY.md`, `docs/deployment.md` | Planned |
| UWZ-048 | `/docs/concepts/web-standards`           | Web standards mapping    | Explanation | P2       | M5        | `docs/protocols.md`                 | Planned |

### 5.4 HTTP/1.1 and the application API

| ID      | Route                           | Page                           | Type        | Priority | Milestone | Source                                 | Status  |
| ------- | ------------------------------- | ------------------------------ | ----------- | -------- | --------- | -------------------------------------- | ------- |
| UWZ-060 | `/docs/http`                    | HTTP/1.1                       | Index       | P0       | M2        | `docs/http.md`                         | Planned |
| UWZ-061 | `/docs/http/server-lifecycle`   | Server lifecycle               | How-to      | P0       | M2        | `docs/api.md`                          | Planned |
| UWZ-062 | `/docs/http/routing`            | Routing                        | How-to      | P0       | M2        | `docs/http.md`                         | Planned |
| UWZ-063 | `/docs/http/route-parameters`   | Route parameters and wildcards | How-to      | P0       | M2        | `docs/http.md`                         | Planned |
| UWZ-064 | `/docs/http/handlers`           | Handlers                       | How-to      | P0       | M2        | `docs/api.md`                          | Planned |
| UWZ-065 | `/docs/http/middleware`         | Middleware                     | How-to      | P0       | M2        | `docs/http.md`                         | Planned |
| UWZ-066 | `/docs/http/request`            | Request API                    | Reference   | P0       | M2        | `docs/api.md`                          | Planned |
| UWZ-067 | `/docs/http/response`           | Response API                   | Reference   | P0       | M2        | `docs/api.md`                          | Planned |
| UWZ-068 | `/docs/http/static-files`       | Static files                   | How-to      | P1       | M2        | `docs/http.md`                         | Planned |
| UWZ-069 | `/docs/http/streaming`          | Streaming responses            | How-to      | P1       | M2        | `docs/api.md`                          | Planned |
| UWZ-070 | `/docs/http/server-sent-events` | Server-Sent Events             | How-to      | P1       | M2        | `src/http/response.zig`                | Planned |
| UWZ-071 | `/docs/http/chunked`            | Chunked responses              | How-to      | P2       | M5        | `src/http/response.zig`                | Planned |
| UWZ-072 | `/docs/http/json`               | JSON responses                 | How-to      | P0       | M2        | `docs/http.md`                         | Planned |
| UWZ-076 | `/docs/http/headers`            | Headers                        | Reference   | P1       | M2        | `docs/http.md`                         | Planned |
| UWZ-080 | `/docs/http/cors`               | CORS                           | How-to      | P0       | M2        | `src/http/middleware.zig`              | Planned |
| UWZ-081 | `/docs/http/security-headers`   | Security headers               | How-to      | P0       | M2        | `src/http/middleware.zig`              | Planned |
| UWZ-082 | `/docs/http/authentication`     | Authentication                 | How-to      | P0       | M2        | `docs/http.md`                         | Planned |
| UWZ-083 | `/docs/http/rate-limiting`      | Rate limiting                  | How-to      | P0       | M2        | `docs/http.md`                         | Planned |
| UWZ-084 | `/docs/http/openapi`            | OpenAPI output                 | How-to      | P1       | M3        | `src/http/openapi.zig`                 | Planned |
| UWZ-085 | `/docs/http/errors`             | HTTP errors                    | Reference   | P0       | M2        | `src/http/errors.zig`                  | Planned |
| UWZ-086 | `/docs/http/query-method`       | RFC 10008 QUERY                | Explanation | P1       | M3        | `docs/quic.md`                         | Planned |
| UWZ-087 | `/docs/http/trace`              | TRACE                          | Explanation | P2       | M5        | `docs/roadmap.md`                      | Planned |
| UWZ-088 | `/docs/http/limits`             | HTTP limits                    | Reference   | P0       | M2        | `docs/http.md`, `docs/memory_model.md` | Planned |
| UWZ-089 | `/docs/http/testing`            | Testing an HTTP server         | How-to      | P1       | M3        | `tests/`                               | Planned |

### 5.4.1 Helpers

The Helpers group is nested under `/docs/http/helpers`. It is a discovery and
ownership boundary for small composable utilities, not a duplicate protocol
section. The decision and boundary rules are in Section 4.7.

| ID      | Route                                        | Page                       | Type   | Priority | Milestone | Source                                            | Status  |
| ------- | -------------------------------------------- | -------------------------- | ------ | -------- | --------- | ------------------------------------------------- | ------- |
| UWZ-090 | `/docs/http/helpers`                         | Helpers                    | Index  | P1       | M2        | Section 4.7                                       | Planned |
| UWZ-091 | `/docs/http/helpers/query-and-forms`         | Query and form parsing     | How-to | P1       | M2        | `src/http/query.zig`, `src/http/form.zig`         | Planned |
| UWZ-092 | `/docs/http/helpers/multipart`               | Multipart parsing          | How-to | P1       | M3        | `src/http/multipart.zig`                          | Planned |
| UWZ-093 | `/docs/http/helpers/cookies`                 | Cookies and signed cookies | How-to | P1       | M3        | `src/http/cookie.zig`                             | Planned |
| UWZ-094 | `/docs/http/helpers/compression`             | Compression helpers        | How-to | P1       | M3        | `src/http/compression_stream.zig`, `response.zig` | Planned |
| UWZ-095 | `/docs/http/helpers/caching`                 | Caching and ETags          | How-to | P1       | M3        | `src/http/cache.zig`                              | Planned |
| UWZ-096 | `/docs/http/helpers/content-negotiation`     | Content negotiation        | How-to | P2       | M5        | `src/http/negotiate.zig`                          | Planned |
| UWZ-097 | `/docs/http/helpers/fetch-streams-and-abort` | Fetch, Streams, and abort  | How-to | P1       | M3        | `src/http/fetch.zig`, `streams.zig`, `abort.zig`  | Planned |
| UWZ-098 | `/docs/http/helpers/websocket-streams`       | WebSocket stream adapters  | How-to | P2       | M5        | `src/ws/stream.zig`, `src/ws/native_stream.zig`   | Planned |

### 5.5 WebSocket

| ID      | Route                             | Page                      | Type        | Priority | Milestone | Source                             | Status  |
| ------- | --------------------------------- | ------------------------- | ----------- | -------- | --------- | ---------------------------------- | ------- |
| UWZ-100 | `/docs/websocket`                 | WebSocket                 | Index       | P0       | M2        | `docs/websocket.md`                | Planned |
| UWZ-101 | `/docs/websocket/quickstart`      | WebSocket quickstart      | Tutorial    | P0       | M2        | `docs/websocket.md`                | Planned |
| UWZ-102 | `/docs/websocket/handshake`       | Handshake and upgrade     | Explanation | P1       | M2        | `docs/websocket.md`                | Planned |
| UWZ-103 | `/docs/websocket/messages`        | Messages and framing      | How-to      | P1       | M2        | `docs/websocket.md`                | Planned |
| UWZ-104 | `/docs/websocket/backpressure`    | Backpressure and draining | How-to      | P0       | M2        | `docs/websocket.md`                | Planned |
| UWZ-105 | `/docs/websocket/compression`     | Per-message deflate       | How-to      | P1       | M3        | `docs/websocket.md`                | Planned |
| UWZ-106 | `/docs/websocket/heartbeats`      | Heartbeats and idle peers | How-to      | P1       | M2        | `docs/websocket.md`                | Planned |
| UWZ-107 | `/docs/websocket/close-codes`     | Close codes and shutdown  | Reference   | P1       | M3        | `docs/websocket.md`                | Planned |
| UWZ-108 | `/docs/websocket/pub-sub`         | Pub/sub                   | How-to      | P1       | M3        | `docs/websocket.md`                | Planned |
| UWZ-109 | `/docs/websocket/cluster-pub-sub` | Cluster pub/sub           | How-to      | P1       | M4        | `docs/architecture.md`             | Planned |
| UWZ-110 | `/docs/websocket/http2-tunnels`   | RFC 8441 tunnels          | Explanation | P1       | M3        | `docs/http2.md`                    | Planned |
| UWZ-111 | `/docs/websocket/security`        | WebSocket security        | How-to      | P0       | M2        | `SECURITY.md`, `docs/websocket.md` | Planned |
| UWZ-112 | `/docs/websocket/testing`         | Autobahn and testing      | How-to      | P1       | M4        | `tests/autobahn`                   | Planned |
| UWZ-113 | `/docs/websocket/limits`          | WebSocket limits          | Reference   | P1       | M2        | `docs/memory_model.md`             | Planned |

### 5.6 HTTP/2

| ID      | Route                            | Page                  | Type        | Priority | Milestone | Source                | Status  |
| ------- | -------------------------------- | --------------------- | ----------- | -------- | --------- | --------------------- | ------- |
| UWZ-120 | `/docs/http2`                    | HTTP/2                | Index       | P0       | M3        | `docs/http2.md`       | Planned |
| UWZ-121 | `/docs/http2/getting-started`    | HTTP/2 quickstart     | Tutorial    | P0       | M3        | `docs/http2.md`       | Planned |
| UWZ-122 | `/docs/http2/configuration`      | HTTP/2 configuration  | Reference   | P1       | M3        | `docs/http2.md`       | Planned |
| UWZ-123 | `/docs/http2/frames-and-streams` | Frames and streams    | Explanation | P1       | M3        | `docs/http2.md`       | Planned |
| UWZ-124 | `/docs/http2/hpack`              | HPACK                 | Explanation | P2       | M5        | `src/http2/hpack.zig` | Planned |
| UWZ-125 | `/docs/http2/flow-control`       | Flow control          | Explanation | P2       | M5        | `docs/http2.md`       | Planned |
| UWZ-126 | `/docs/http2/websocket-tunnels`  | WebSocket over HTTP/2 | How-to      | P1       | M3        | `docs/http2.md`       | Planned |
| UWZ-127 | `/docs/http2/limits`             | HTTP/2 limits         | Reference   | P1       | M3        | `docs/http2.md`       | Planned |
| UWZ-128 | `/docs/http2/observability`      | HTTP/2 observability  | How-to      | P2       | M5        | `docs/http2.md`       | Planned |
| UWZ-129 | `/docs/http2/testing`            | HTTP/2 testing        | How-to      | P2       | M5        | `tests/`              | Planned |

### 5.7 HTTP/3 and QUIC

| ID      | Route                         | Page                    | Type        | Priority | Milestone | Source                        | Status  |
| ------- | ----------------------------- | ----------------------- | ----------- | -------- | --------- | ----------------------------- | ------- |
| UWZ-130 | `/docs/http3`                 | HTTP/3 and QUIC         | Index       | P0       | M3        | `docs/quic.md`                | Planned |
| UWZ-131 | `/docs/http3/getting-started` | HTTP/3 quickstart       | Tutorial    | P0       | M3        | `docs/quic.md`                | Planned |
| UWZ-132 | `/docs/http3/configuration`   | HTTP/3 configuration    | Reference   | P1       | M3        | `docs/quic.md`                | Planned |
| UWZ-133 | `/docs/http3/quic-transport`  | QUIC transport          | Explanation | P1       | M3        | `docs/architecture.md`        | Planned |
| UWZ-134 | `/docs/http3/qpack`           | QPACK                   | Explanation | P2       | M5        | `src/quic/stream.zig`         | Planned |
| UWZ-135 | `/docs/http3/request-path`    | HTTP/3 request path     | Explanation | P1       | M3        | `docs/quic.md`                | Planned |
| UWZ-136 | `/docs/http3/early-data`      | Early data policy       | Explanation | P2       | M5        | `docs/tls.md`, `docs/quic.md` | Planned |
| UWZ-137 | `/docs/http3/query-method`    | QUERY over HTTP/3       | How-to      | P2       | M5        | `docs/quic.md`                | Planned |
| UWZ-138 | `/docs/http3/webtransport`    | WebTransport status     | Explanation | P1       | M4        | `docs/quic.md`, ADR 0001      | Planned |
| UWZ-139 | `/docs/http3/limits`          | HTTP/3 limits           | Reference   | P1       | M3        | `docs/memory_model.md`        | Planned |
| UWZ-140 | `/docs/http3/observability`   | HTTP/3 observability    | How-to      | P2       | M5        | `docs/quic.md`                | Planned |
| UWZ-141 | `/docs/http3/testing`         | HTTP/3 interoperability | How-to      | P1       | M4        | `CI_CD_PIPELINE.md`           | Planned |

### 5.8 JSON-RPC

| ID      | Route                                      | Page                        | Type        | Priority | Milestone | Source                 | Status  |
| ------- | ------------------------------------------ | --------------------------- | ----------- | -------- | --------- | ---------------------- | ------- |
| UWZ-150 | `/docs/json-rpc`                           | JSON-RPC 2.0                | Index       | P0       | M3        | `docs/json_rpc.md`     | Planned |
| UWZ-151 | `/docs/json-rpc/quickstart`                | JSON-RPC quickstart         | Tutorial    | P0       | M3        | `docs/json_rpc.md`     | Planned |
| UWZ-152 | `/docs/json-rpc/typed-procedures`          | Typed procedures            | How-to      | P0       | M3        | `docs/json_rpc.md`     | Planned |
| UWZ-153 | `/docs/json-rpc/context-and-decoding`      | Context and custom decoding | How-to      | P1       | M3        | `docs/json_rpc.md`     | Planned |
| UWZ-154 | `/docs/json-rpc/errors`                    | JSON-RPC errors             | Reference   | P1       | M3        | `docs/json_rpc.md`     | Planned |
| UWZ-155 | `/docs/json-rpc/batches-and-notifications` | Batches and notifications   | How-to      | P1       | M3        | `docs/json_rpc.md`     | Planned |
| UWZ-156 | `/docs/json-rpc/capacities`                | JSON-RPC capacities         | Reference   | P1       | M3        | `docs/json_rpc.md`     | Planned |
| UWZ-157 | `/docs/json-rpc/transports`                | Transports and raw dispatch | Explanation | P2       | M5        | `docs/json_rpc.md`     | Planned |
| UWZ-158 | `/docs/json-rpc/cluster-deployment`        | JSON-RPC in a cluster       | How-to      | P1       | M4        | `docs/architecture.md` | Planned |
| UWZ-159 | `/docs/json-rpc/testing`                   | Testing a JSON-RPC service  | How-to      | P2       | M5        | `tests/rpc_tests.zig`  | Planned |

### 5.9 Type safety

| ID      | Route                                       | Page                       | Type        | Priority | Milestone | Source                                 | Status  |
| ------- | ------------------------------------------- | -------------------------- | ----------- | -------- | --------- | -------------------------------------- | ------- |
| UWZ-160 | `/docs/type-safety`                         | Type safety                | Index       | P0       | M2        | `CODING_CONVENTION.md`, `src/root.zig` | Planned |
| UWZ-161 | `/docs/type-safety/handlers`                | Typed handlers             | Explanation | P0       | M2        | `docs/api.md`                          | Planned |
| UWZ-162 | `/docs/type-safety/json`                    | Typed JSON                 | How-to      | P0       | M2        | `docs/http.md`                         | Planned |
| UWZ-163 | `/docs/type-safety/schema-validation`       | Schema validation          | How-to      | P1       | M3        | `src/http/schema.zig`                  | Planned |
| UWZ-164 | `/docs/type-safety/typed-rpc`               | Typed RPC                  | How-to      | P0       | M3        | `docs/json_rpc.md`                     | Planned |
| UWZ-165 | `/docs/type-safety/compile-time-capacities` | Compile-time capacities    | Explanation | P0       | M2        | `docs/memory_model.md`                 | Planned |
| UWZ-166 | `/docs/type-safety/error-sets`              | Error sets and failures    | Explanation | P1       | M3        | `src/root.zig`                         | Planned |
| UWZ-167 | `/docs/type-safety/c-abi-types`             | C ABI types                | Reference   | P1       | M4        | `include/uWebZockets.h`                | Planned |
| UWZ-168 | `/docs/type-safety/design-rules`            | Design rules for consumers | Explanation | P2       | M5        | `CODING_CONVENTION.md`                 | Planned |

### 5.10 Client

| ID      | Route                              | Page                | Type      | Priority | Milestone | Source           | Status  |
| ------- | ---------------------------------- | ------------------- | --------- | -------- | --------- | ---------------- | ------- |
| UWZ-170 | `/docs/client`                     | HTTP client         | Index     | P0       | M3        | `docs/client.md` | Planned |
| UWZ-171 | `/docs/client/quickstart`          | Client quickstart   | Tutorial  | P0       | M3        | `docs/client.md` | Planned |
| UWZ-172 | `/docs/client/fetch-blocking`      | `fetch_blocking`    | How-to    | P1       | M3        | `docs/client.md` | Planned |
| UWZ-173 | `/docs/client/callback-client`     | Callback client     | How-to    | P1       | M3        | `docs/client.md` | Planned |
| UWZ-174 | `/docs/client/tls-trust`           | TLS trust           | How-to    | P1       | M3        | `docs/client.md` | Planned |
| UWZ-175 | `/docs/client/timeouts-and-errors` | Timeouts and errors | Reference | P1       | M3        | `docs/client.md` | Planned |
| UWZ-176 | `/docs/client/limits`              | Client limits       | Reference | P2       | M5        | `docs/client.md` | Planned |

### 5.11 TLS and security

| ID      | Route                                    | Page                      | Type        | Priority | Milestone | Source              | Status  |
| ------- | ---------------------------------------- | ------------------------- | ----------- | -------- | --------- | ------------------- | ------- |
| UWZ-180 | `/docs/security`                         | Security                  | Index       | P0       | M4        | `SECURITY.md`       | Planned |
| UWZ-181 | `/docs/security/tls`                     | TLS 1.3 and ALPN          | Explanation | P0       | M4        | `docs/tls.md`       | Planned |
| UWZ-182 | `/docs/security/ephemeral-certificates`  | Ephemeral certificates    | How-to      | P1       | M4        | `docs/tls.md`       | Planned |
| UWZ-183 | `/docs/security/production-certificates` | Production certificates   | How-to      | P0       | M4        | `docs/tls.md`       | Planned |
| UWZ-184 | `/docs/security/mtls`                    | Mutual TLS                | How-to      | P1       | M4        | `docs/tls.md`       | Planned |
| UWZ-185 | `/docs/security/tls-clusters`            | TLS clusters              | How-to      | P1       | M4        | `docs/tls.md`       | Planned |
| UWZ-186 | `/docs/security/early-data`              | Early data and 0-RTT      | Explanation | P1       | M4        | `docs/tls.md`       | Planned |
| UWZ-187 | `/docs/security/certificate-rotation`    | Certificate rotation      | How-to      | P1       | M4        | ADR 0003            | Planned |
| UWZ-188 | `/docs/security/authentication`          | Authentication            | How-to      | P0       | M4        | `docs/http.md`      | Planned |
| UWZ-189 | `/docs/security/rate-limiting`           | Rate limiting             | How-to      | P0       | M4        | `docs/http.md`      | Planned |
| UWZ-190 | `/docs/security/cors-and-headers`        | CORS and security headers | How-to      | P0       | M4        | `docs/http.md`      | Planned |
| UWZ-191 | `/docs/security/input-hardening`         | Input hardening           | Explanation | P1       | M4        | `docs/http.md`      | Planned |
| UWZ-192 | `/docs/security/websocket-security`      | WebSocket security        | How-to      | P1       | M4        | `docs/websocket.md` | Planned |
| UWZ-193 | `/docs/security/http3-security`          | HTTP/3 security           | Explanation | P1       | M4        | `docs/quic.md`      | Planned |
| UWZ-194 | `/docs/security/threat-model`            | Threat model              | Explanation | P2       | M5        | `SECURITY.md`       | Planned |
| UWZ-195 | `/docs/security/reporting`               | Report a vulnerability    | Reference   | P1       | M4        | `SECURITY.md`       | Planned |

### 5.12 Architecture and internals

| ID      | Route                                   | Page                       | Type        | Priority | Milestone | Source                       | Status  |
| ------- | --------------------------------------- | -------------------------- | ----------- | -------- | --------- | ---------------------------- | ------- |
| UWZ-200 | `/docs/architecture`                    | Architecture               | Index       | P0       | M4        | `docs/architecture.md`       | Planned |
| UWZ-201 | `/docs/architecture/shared-nothing`     | Shared-nothing workers     | Explanation | P0       | M4        | `docs/architecture.md`       | Planned |
| UWZ-202 | `/docs/architecture/event-loop`         | Event loop and completions | Explanation | P0       | M4        | `docs/callback_lifecycle.md` | Planned |
| UWZ-203 | `/docs/architecture/memory-model`       | Slab and memory model      | Explanation | P0       | M4        | `docs/memory_model.md`       | Planned |
| UWZ-204 | `/docs/architecture/router-internals`   | Router internals           | Explanation | P2       | M5        | `src/router/radix.zig`       | Planned |
| UWZ-205 | `/docs/architecture/callback-lifecycle` | Callback lifecycle         | Reference   | P1       | M4        | `docs/callback_lifecycle.md` | Planned |
| UWZ-206 | `/docs/architecture/transports`         | Transports                 | Explanation | P1       | M4        | `docs/architecture.md`       | Planned |
| UWZ-207 | `/docs/architecture/cluster-internals`  | Cluster internals          | Explanation | P2       | M5        | ADR 0007                     | Planned |
| UWZ-208 | `/docs/architecture/shutdown`           | Shutdown ordering          | Explanation | P1       | M4        | `docs/architecture.md`       | Planned |
| UWZ-209 | `/docs/architecture/backends`           | Runtime backends           | Explanation | P2       | M5        | `docs/architecture.md`       | Planned |
| UWZ-210 | `/docs/architecture/edge-and-wasm`      | Edge and WASM              | Explanation | P2       | M5        | `docs/operations.md`         | Planned |
| UWZ-211 | `/docs/architecture/c-abi`              | C ABI architecture         | Explanation | P1       | M4        | `include/uWebZockets.h`      | Planned |
| UWZ-212 | `/docs/architecture/dependencies`       | Dependency policy          | Explanation | P2       | M5        | `docs/dependency_forks.md`   | Planned |
| UWZ-213 | `/docs/architecture/ktls-and-xdp`       | kTLS and AF_XDP            | Explanation | P2       | M5        | `docs/operations.md`         | Planned |

### 5.13 Performance

| ID      | Route                                 | Page              | Type        | Priority | Milestone | Source                 | Status  |
| ------- | ------------------------------------- | ----------------- | ----------- | -------- | --------- | ---------------------- | ------- |
| UWZ-220 | `/docs/performance`                   | Performance       | Index       | P1       | M4        | README, benchmarks     | Planned |
| UWZ-221 | `/docs/performance/cost-model`        | Cost model        | Explanation | P1       | M4        | `docs/memory_model.md` | Planned |
| UWZ-222 | `/docs/performance/capacity-sizing`   | Capacity sizing   | How-to      | P0       | M4        | `docs/memory_model.md` | Planned |
| UWZ-223 | `/docs/performance/benchmarking`      | Benchmarking      | How-to      | P1       | M5        | `CI_CD_PIPELINE.md`    | Planned |
| UWZ-224 | `/docs/performance/load-testing`      | Load testing      | How-to      | P2       | M5        | `benchmarks/`          | Planned |
| UWZ-225 | `/docs/performance/profiling`         | Profiling         | How-to      | P2       | M5        | `docs/operations.md`   | Planned |
| UWZ-226 | `/docs/performance/tuning`            | Tuning            | How-to      | P2       | M5        | `docs/architecture.md` | Planned |
| UWZ-227 | `/docs/performance/regression-policy` | Regression policy | Explanation | P2       | M5        | CI docs                | Planned |

### 5.14 Operations

| ID      | Route                                | Page                      | Type            | Priority | Milestone | Source                          | Status  |
| ------- | ------------------------------------ | ------------------------- | --------------- | -------- | --------- | ------------------------------- | ------- |
| UWZ-230 | `/docs/operations`                   | Operations                | Index           | P0       | M4        | `docs/operations.md`            | Planned |
| UWZ-231 | `/docs/operations/build`             | Build from source         | How-to          | P0       | M4        | `docs/operations.md`            | Planned |
| UWZ-232 | `/docs/operations/nix`               | Nix development shell     | How-to          | P1       | M4        | `flake.nix`                     | Planned |
| UWZ-233 | `/docs/operations/testing`           | Tests                     | How-to          | P0       | M4        | `docs/operations.md`            | Planned |
| UWZ-234 | `/docs/operations/sanitizers`        | Sanitizers                | How-to          | P1       | M4        | `docs/operations.md`            | Planned |
| UWZ-235 | `/docs/operations/fuzzing`           | Fuzzing                   | How-to          | P1       | M4        | `docs/operations.md`            | Planned |
| UWZ-236 | `/docs/operations/cross-compilation` | Cross-compilation         | How-to          | P1       | M4        | `docs/operations.md`            | Planned |
| UWZ-237 | `/docs/operations/c-abi`             | C ABI                     | Reference       | P0       | M4        | `include/uWebZockets.h`         | Planned |
| UWZ-238 | `/docs/operations/releases`          | Releases                  | Explanation     | P1       | M5        | `CHANGELOG.md`                  | Planned |
| UWZ-239 | `/docs/operations/dependencies`      | Dependencies              | Explanation     | P1       | M5        | `docs/dependency_forks.md`      | Planned |
| UWZ-240 | `/docs/operations/platforms`         | Platform support          | Reference       | P0       | M4        | README, roadmap                 | Planned |
| UWZ-241 | `/docs/operations/logging`           | Development log           | How-to          | P1       | M4        | `docs/operations.md`            | Planned |
| UWZ-242 | `/docs/operations/metrics`           | Metrics                   | How-to          | P0       | M4        | `docs/deployment.md`            | Planned |
| UWZ-243 | `/docs/operations/graceful-shutdown` | Graceful shutdown         | How-to          | P0       | M4        | `docs/api.md`                   | Planned |
| UWZ-244 | `/docs/operations/troubleshooting`   | Troubleshooting           | Troubleshooting | P0       | M4        | `docs/troubleshooting.md`       | Planned |
| UWZ-245 | `/docs/operations/development-log`   | Development log reference | Reference       | P2       | M5        | `src/observability/dev_log.zig` | Planned |
| UWZ-246 | `/docs/operations/ebpf`              | eBPF latency histogram    | How-to          | P2       | M5        | `docs/operations.md`            | Planned |
| UWZ-247 | `/docs/operations/wasm`              | WASM edge targets         | How-to          | P2       | M5        | `docs/operations.md`            | Planned |
| UWZ-248 | `/docs/operations/ktls`              | kTLS                      | How-to          | P2       | M5        | `docs/operations.md`            | Planned |
| UWZ-249 | `/docs/operations/af-xdp`            | AF_XDP                    | How-to          | P2       | M5        | `docs/operations.md`            | Planned |

### 5.15 Deployment

| ID      | Route                                | Page                  | Type      | Priority | Milestone | Source                  | Status  |
| ------- | ------------------------------------ | --------------------- | --------- | -------- | --------- | ----------------------- | ------- |
| UWZ-250 | `/docs/deployment`                   | Deployment            | Index     | P0       | M4        | `docs/deployment.md`    | Planned |
| UWZ-251 | `/docs/deployment/checklist`         | Production checklist  | Reference | P0       | M4        | `docs/deployment.md`    | Planned |
| UWZ-252 | `/docs/deployment/tls`               | TLS deployment        | How-to    | P0       | M4        | `docs/tls.md`           | Planned |
| UWZ-253 | `/docs/deployment/capacity-planning` | Capacity planning     | How-to    | P0       | M4        | `docs/memory_model.md`  | Planned |
| UWZ-254 | `/docs/deployment/hardening`         | Hardening             | How-to    | P0       | M4        | `docs/deployment.md`    | Planned |
| UWZ-255 | `/docs/deployment/observability`     | Observability         | How-to    | P0       | M4        | `docs/deployment.md`    | Planned |
| UWZ-256 | `/docs/deployment/shutdown`          | Shutdown and draining | How-to    | P0       | M4        | `docs/deployment.md`    | Planned |
| UWZ-257 | `/docs/deployment/docker`            | Docker                | How-to    | P1       | M5        | `flake.nix`, build docs | Planned |
| UWZ-258 | `/docs/deployment/kubernetes`        | Kubernetes            | How-to    | P1       | M5        | This file               | Planned |
| UWZ-259 | `/docs/deployment/systemd`           | systemd               | How-to    | P1       | M5        | This file               | Planned |
| UWZ-260 | `/docs/deployment/reverse-proxy`     | Reverse proxy         | How-to    | P1       | M5        | This file               | Planned |
| UWZ-261 | `/docs/deployment/http3`             | HTTP/3 deployment     | How-to    | P1       | M5        | `docs/quic.md`          | Planned |
| UWZ-262 | `/docs/deployment/zero-downtime`     | Zero-downtime rollout | How-to    | P1       | M5        | ADR 0003                | Planned |
| UWZ-263 | `/docs/deployment/windows`           | Windows               | Reference | P1       | M5        | roadmap, ADR 0004       | Planned |
| UWZ-264 | `/docs/deployment/bsd`               | BSD targets           | Reference | P2       | M5        | roadmap                 | Planned |

### 5.16 Guides and cookbook

| ID      | Route                            | Page                      | Type   | Priority | Milestone | Source                                | Status  |
| ------- | -------------------------------- | ------------------------- | ------ | -------- | --------- | ------------------------------------- | ------- |
| UWZ-270 | `/docs/guides`                   | Guides                    | Index  | P1       | M5        | This file                             | Planned |
| UWZ-271 | `/docs/guides/json-api`          | Build a JSON API          | Recipe | P1       | M5        | `docs/http.md`                        | Planned |
| UWZ-272 | `/docs/guides/authentication`    | Add authentication        | Recipe | P1       | M5        | `docs/http.md`                        | Planned |
| UWZ-273 | `/docs/guides/rate-limiting`     | Add rate limiting         | Recipe | P1       | M5        | `docs/http.md`                        | Planned |
| UWZ-274 | `/docs/guides/file-server`       | Serve files               | Recipe | P1       | M5        | `docs/http.md`                        | Planned |
| UWZ-275 | `/docs/guides/chat`              | Build a chat server       | Recipe | P1       | M5        | `examples/chat_server.zig`            | Planned |
| UWZ-276 | `/docs/guides/presence`          | Track presence            | Recipe | P2       | M5        | `docs/websocket.md`                   | Planned |
| UWZ-277 | `/docs/guides/rpc-service`       | Build an RPC service      | Recipe | P1       | M5        | `examples/rpc_server.zig`             | Planned |
| UWZ-278 | `/docs/guides/sse`               | Stream events with SSE    | Recipe | P1       | M5        | `src/http/response.zig`               | Planned |
| UWZ-279 | `/docs/guides/streaming`         | Stream a large response   | Recipe | P1       | M5        | `docs/http.md`                        | Planned |
| UWZ-280 | `/docs/guides/uploads`           | Handle uploads            | Recipe | P2       | M5        | `docs/http.md`                        | Planned |
| UWZ-281 | `/docs/guides/cookies`           | Use cookies safely        | Recipe | P1       | M5        | `src/http/cookie.zig`                 | Planned |
| UWZ-282 | `/docs/guides/cors`              | Configure CORS            | Recipe | P1       | M5        | `src/http/middleware.zig`             | Planned |
| UWZ-283 | `/docs/guides/openapi`           | Publish OpenAPI           | Recipe | P2       | M5        | `src/http/openapi.zig`                | Planned |
| UWZ-284 | `/docs/guides/webhooks`          | Receive webhooks          | Recipe | P2       | M5        | `docs/http.md`                        | Planned |
| UWZ-285 | `/docs/guides/health-checks`     | Add health checks         | Recipe | P1       | M5        | This file                             | Planned |
| UWZ-286 | `/docs/guides/graceful-shutdown` | Graceful shutdown         | Recipe | P1       | M5        | `docs/operations.md`                  | Planned |
| UWZ-287 | `/docs/guides/cluster`           | Scale across cores        | Recipe | P1       | M5        | `examples/shared_nothing_cluster.zig` | Planned |
| UWZ-288 | `/docs/guides/https`             | Serve HTTPS               | Recipe | P1       | M5        | `examples/https_server.zig`           | Planned |
| UWZ-289 | `/docs/guides/http3`             | Serve HTTP/3              | Recipe | P1       | M5        | `examples/http3_server.zig`           | Planned |
| UWZ-290 | `/docs/guides/c-abi`             | Embed from C or C++       | Recipe | P2       | M5        | `include/uWebZockets.h`               | Planned |
| UWZ-291 | `/docs/guides/testing`           | Test a µWebZockets app    | Recipe | P1       | M5        | `tests/`                              | Planned |
| UWZ-292 | `/docs/guides/benchmarking`      | Benchmark your deployment | Recipe | P2       | M5        | `benchmarks/`                         | Planned |

### 5.17 Migration

| ID      | Route                                       | Page                      | Type      | Priority | Milestone | Source                  | Status  |
| ------- | ------------------------------------------- | ------------------------- | --------- | -------- | --------- | ----------------------- | ------- |
| UWZ-300 | `/docs/migration`                           | Migration                 | Index     | P1       | M5        | This file               | Planned |
| UWZ-301 | `/docs/migration/from-uwebsockets`          | From uWebSockets          | Migration | P1       | M5        | `docs/api.md`           | Planned |
| UWZ-302 | `/docs/migration/from-std-http`             | From `std.http`           | Migration | P1       | M5        | `docs/http.md`          | Planned |
| UWZ-303 | `/docs/migration/from-other-zig-frameworks` | From other Zig frameworks | Migration | P2       | M5        | This file               | Planned |
| UWZ-304 | `/docs/migration/from-c`                    | From C servers            | Migration | P2       | M5        | `include/uWebZockets.h` | Planned |
| UWZ-305 | `/docs/migration/v1-to-v2`                  | v1 to v2                  | Migration | P1       | M5        | `CHANGELOG.md`          | Planned |
| UWZ-306 | `/docs/migration/v2-1-to-v2-2`              | 2.1 to 2.2                | Migration | P1       | M5        | `CHANGELOG.md`, roadmap | Planned |
| UWZ-307 | `/docs/migration/breaking-changes`          | Breaking changes          | Reference | P1       | M5        | `CHANGELOG.md`          | Planned |

### 5.18 Reference

| ID      | Route                        | Page                         | Type      | Priority | Milestone | Source                            | Status  |
| ------- | ---------------------------- | ---------------------------- | --------- | -------- | --------- | --------------------------------- | ------- |
| UWZ-310 | `/reference`                 | Reference                    | Index     | P0       | M5        | This file                         | Planned |
| UWZ-311 | `/reference/zig`             | Zig API index                | Reference | P0       | M5        | `src/root.zig`                    | Planned |
| UWZ-312 | `/reference/server-config`   | `ServerConfig`               | Reference | P0       | M5        | `src/router/config.zig`           | Planned |
| UWZ-313 | `/reference/limits`          | Capacity and protocol limits | Reference | P0       | M5        | `docs/memory_model.md`            | Planned |
| UWZ-314 | `/reference/errors`          | Error index                  | Reference | P0       | M5        | source, `docs/troubleshooting.md` | Planned |
| UWZ-315 | `/reference/c-abi`           | C ABI                        | Reference | P0       | M5        | `include/uWebZockets.h`           | Planned |
| UWZ-316 | `/reference/build-steps`     | Build steps and flags        | Reference | P1       | M5        | `builds/`                         | Planned |
| UWZ-317 | `/reference/feature-matrix`  | Feature matrix               | Reference | P0       | M5        | Appendix A                        | Planned |
| UWZ-318 | `/reference/compatibility`   | Compatibility                | Reference | P1       | M5        | roadmap                           | Planned |
| UWZ-319 | `/reference/protocol-matrix` | Protocol matrix              | Reference | P1       | M5        | `docs/protocols.md`               | Planned |
| UWZ-320 | `/reference/glossary`        | Glossary                     | Reference | P1       | M5        | This file                         | Planned |

### 5.19 Examples

| ID      | Route                              | Page                   | Type    | Priority | Milestone | Source                                | Status  |
| ------- | ---------------------------------- | ---------------------- | ------- | -------- | --------- | ------------------------------------- | ------- |
| UWZ-330 | `/examples`                        | Examples               | Index   | P1       | M5        | examples/                             | Planned |
| UWZ-331 | `/examples/hello-world`            | Hello world            | Example | P0       | M1        | `examples/hello_world.zig`            | Planned |
| UWZ-332 | `/examples/https-server`           | HTTPS server           | Example | P1       | M2        | `examples/https_server.zig`           | Planned |
| UWZ-333 | `/examples/shared-nothing-cluster` | Shared-nothing cluster | Example | P1       | M2        | `examples/shared_nothing_cluster.zig` | Planned |
| UWZ-334 | `/examples/tls-cluster`            | TLS cluster            | Example | P1       | M4        | `examples/tls_cluster.zig`            | Planned |
| UWZ-335 | `/examples/basic-microservice`     | Basic microservice     | Example | P1       | M2        | `examples/basic_microservice.zig`     | Planned |
| UWZ-336 | `/examples/custom-builder`         | Custom builder         | Example | P2       | M5        | `examples/custom_builder.zig`         | Planned |
| UWZ-337 | `/examples/chat-server`            | Chat server            | Example | P1       | M2        | `examples/chat_server.zig`            | Planned |
| UWZ-338 | `/examples/rpc-server`             | RPC server             | Example | P1       | M3        | `examples/rpc_server.zig`             | Planned |
| UWZ-339 | `/examples/http3-server`           | HTTP/3 server          | Example | P1       | M3        | `examples/http3_server.zig`           | Planned |
| UWZ-340 | `/examples/delay-server`           | Delayed response       | Example | P2       | M5        | `examples/delay_server.zig`           | Planned |

### 5.20 Project

| ID      | Route                        | Page                    | Type          | Priority | Milestone | Source                     | Status  |
| ------- | ---------------------------- | ----------------------- | ------------- | -------- | --------- | -------------------------- | ------- |
| UWZ-350 | `/docs/project/roadmap`      | Roadmap                 | Reference     | P1       | M5        | `docs/roadmap.md`          | Planned |
| UWZ-351 | `/changelog`                 | Changelog               | Release index | P1       | M5        | `CHANGELOG.md`             | Planned |
| UWZ-352 | `/security`                  | Security policy         | Reference     | P0       | M4        | `SECURITY.md`              | Planned |
| UWZ-353 | `/contributing`              | Contributing            | How-to        | P1       | M5        | `CONTRIBUTE.md`            | Planned |
| UWZ-354 | `/docs/project/license`      | License                 | Reference     | P1       | M5        | `LICENSE`                  | Planned |
| UWZ-355 | `/docs/project/dependencies` | Dependencies and forks  | Explanation   | P1       | M5        | `docs/dependency_forks.md` | Planned |
| UWZ-356 | `/docs/project/adrs`         | Architecture decisions  | Index         | P2       | M5        | `docs/adr/`                | Planned |
| UWZ-357 | `/docs/project/benchmarks`   | Benchmark evidence      | Reference     | P2       | M5        | `benchmarks/`              | Planned |
| UWZ-358 | `/docs/project/support`      | Support and sponsorship | Reference     | P2       | M5        | README, landing            | Planned |

### 5.21 Page count dashboard

This dashboard is the at-a-glance scope. Update it when a page changes status.

| Section               |   Pages |     P0 |      P1 |     P2 |  Live |
| --------------------- | ------: | -----: | ------: | -----: | ----: |
| Landing and docs home |       4 |      3 |       1 |      0 |     1 |
| Getting Started       |      16 |      9 |       6 |      1 |     1 |
| Concepts              |      19 |     15 |       3 |      1 |     0 |
| HTTP                  |      24 |     15 |       7 |      2 |     0 |
| Helpers               |       9 |      0 |       7 |      2 |     0 |
| WebSocket             |      14 |      4 |      10 |      0 |     0 |
| HTTP/2                |      10 |      2 |       4 |      4 |     0 |
| HTTP/3                |      12 |      2 |       6 |      4 |     0 |
| JSON-RPC              |      10 |      3 |       5 |      2 |     0 |
| Type safety           |       9 |      5 |       3 |      1 |     0 |
| Client                |       7 |      2 |       4 |      1 |     0 |
| TLS and security      |      16 |      6 |       9 |      1 |     0 |
| Architecture          |      14 |      4 |       4 |      6 |     0 |
| Performance           |       8 |      1 |       3 |      4 |     0 |
| Operations            |      20 |      8 |       7 |      5 |     0 |
| Deployment            |      15 |      7 |       7 |      1 |     0 |
| Guides                |      23 |      0 |      17 |      6 |     0 |
| Migration             |       8 |      0 |       6 |      2 |     0 |
| Reference             |      11 |      7 |       4 |      0 |     0 |
| Examples              |      11 |      1 |       8 |      2 |     0 |
| Project               |       9 |      1 |       5 |      3 |     0 |
| **Total**             | **269** | **95** | **126** | **48** | **2** |

The counts are deliberately larger than the launch gate. M1 through M6 ship
every P0 row and enough P1 rows to make the site coherent. P2 rows may remain
`Planned` at launch only when the feature matrix marks them as depth material.

## 6. Section content contracts

Each contract states the minimum a section must cover before its pages can be
marked `Live`. A page may add depth, but it may not omit a contract item that
belongs to its reader goal.

### 6.1 Landing and documentation home

**Purpose:** convert a curious developer into a reader with a clear next step.

Required content:

- Landing hero keeps the existing editorial identity, but its primary action
  points to `/docs/getting-started` and its secondary action points to the
  repository.
- The index cards on `/` link to real pages, not `#`: start, shared-nothing,
  type safety, configuration, cluster, helpers, migration.
- `/docs` explains the three reading paths: "I am new", "I am evaluating",
  "I am operating this in production".
- `/docs` includes a search callout, a Helpers card, a link to the feature
  matrix, and a "what to read next" block.
- The docs home states the supported product version and the Zig version.
- No marketing claim appears without a link to evidence or a boundary page.

Acceptance:

- Every card and CTA resolves.
- A reader can reach the quickstart in one click from `/`.
- The landing page still passes its existing hero, motion, and image tests.
- `/docs` is useful without JavaScript and without the custom hero.

### 6.2 Getting Started

**Purpose:** take a developer from zero to a running, understandable server,
then route them to the next relevant protocol.

Required content:

- `Motivation`: the problem with unbounded allocation, per-request allocation,
  shared mutable state, and protocol-specific handler APIs; what µWebZockets
  changes; the cost of those choices.
- `Philosophy`: bounded by design, explicit ownership, pure parsers, one
  transport-neutral boundary, data-oriented memory, no hidden global state,
  evidence over claims.
- `Installation`: Nix path, plain Zig path, `zig fetch --save` with a tag or
  full commit, `build.zig` wiring, package-consumer expectations, no CMake or
  system zlib, first-build cost, offline cache behavior.
- `Quickstart`: one complete program, one command, one `curl`, one expected
  output, one next step. Do not combine six protocols in one page.
- `Project structure`: generated or hand-written `build.zig`, `src/`, `tests/`,
  `examples/`, `builds/`, `vendor/`; what a consumer needs; what is internal.
- `First HTTP server`: `App(128)`, route, `listen`, `run`, graceful shutdown,
  what happens on startup, how to change the port, how to test with `curl`.
- `First WebSocket`: `app.ws`, `open`, `message`, `close`, echo, `wscat` or a
  browser snippet, backpressure caveat, no built-in WebSocket client yet.
- `First JSON-RPC service`: typed params/result, `register_typed`, `app.rpc`,
  `curl` request and response, batch caveat.
- `First TLS server`: `init_https_ephemeral` for local, `init_https` for
  production, `curl -k`, why the certificate is untrusted, ALPN result.
- `First cluster`: `Server.builder(...).build_cluster`, `configure`, `listen`,
  `run`, `SO_REUSEPORT`, one slab per worker, shutdown; no HTTP/3 cluster.
- `First HTTP/3 server`: `init_http3`, `listen_udp`, `curl --http3`, BBRv1,
  no 0-RTT, no WebTransport live path.
- `Examples tour`: one table mapping each `zig build <step>` to what it shows,
  source file, and the site example page.
- `FAQ`: allocation model, capacity exhaustion, dynamic scaling, Windows,
  WebTransport, HTTP/2 push, h2c, TLS 1.2, request streaming, client scope.
- `Glossary`: short definitions with links, not a second concepts section.

Code requirements:

- Every tutorial has a complete `main` and imports `uWebZockets`.
- Use `std.process.Init` and `init.io` consistently with Zig 0.16.
- Show the expected terminal output for the first build and first request.
- Name the exact example step (`zig build hello_world`) and source file.
- Do not use `catch {}` in a tutorial unless the page explains why the callback
  cannot return an error; prefer explicit handling in teaching code.

Acceptance:

- A clean checkout reaches `hello` in ten minutes on a supported Linux host.
- Every command is copy-pasteable and tested.
- The initial page does not link to GitHub for material the site now owns.
- No tutorial claims a feature that is helper-only or unsupported.

### 6.3 Concepts

**Purpose:** give the reader the mental model that makes every protocol page
predictable.

Required content:

- `Application model`: `App(N)`, `ConfiguredApp`, `ConfiguredAppWithTimeout`,
  `Server.builder`, cluster, and when to choose each. Include the lifecycle
  table (init, register, listen, run, shutdown, deinit).
- `Request lifecycle`: accept -> bounded read -> strict parse -> middleware ->
  router -> handler -> response parts -> write queue -> drain -> slot reuse.
  Distinguish HTTP/1.1, HTTP/2, and HTTP/3 where behavior differs.
- `Response lifecycle`: helpers, start-once semantics, completion, best-effort
  endings, async tokens, chunked/stream/SSE/file paths.
- `Routing model`: static, `:param`, terminal `*wildcard`, precedence, duplicate
  and malformed pattern failures, route registry limits, methods.
- `Handler shapes`: sync, context, async, async-context; signatures and
  ownership. Explain why the context is `*anyopaque` and caller-owned.
- `Middleware model`: order, `.continue_dispatch` and `.stop`, response-started
  termination, 32-callback bound, per-worker state.
- `Async responses`: copyable generation-checked token, exactly-once completion,
  owning-loop requirement, `sleep`, `sleep_complete`, cancellation on disconnect.
- `Ownership and lifetimes`: borrowed request fields, WebSocket message slices,
  client response views, `Request.clone`, stable `App`/`Cluster` addresses.
- `Capacity model`: one startup slab, presets, builder overrides, exact
  `slab_bytes()`, exhaustion behavior, per-worker inbox memory.
- `Zero allocation`: define the claim precisely, list the startup and explicit
  allocation exceptions, show how to audit a handler.
- `Shared-nothing`: per-worker loop, slab, TLS context, affinity, `SO_REUSEPORT`,
  lock-free inbox, why no shared connection state exists.
- `Backpressure`: write ring, `error.WouldBlock`, WebSocket drain, stream
  producer resume, cluster publish report.
- `Protocol negotiation`: plaintext HTTP/2 preface, TLS ALPN `h2` then
  `http/1.1`, separate `h3` context, no h2c Upgrade.
- `Type safety`: compile-time capacities, typed JSON and RPC, schema rules,
  named callback types, explicit error sets, no reflection-driven public API.
- `Errors`: Zig error versus HTTP status, structured rejection documents,
  retryable versus terminal failures, where to find the named error.
- `Cluster model`: capacity versus active worker count, configure-before-listen,
  state machine, first failure, publish semantics, TLS cluster ordering.
- `Security model`: trust boundaries, parser hardening, TLS policy, auth,
  rate limiting, secrets, and the disclosure path.
- `Web standards`: Fetch/Streams-inspired names, what is not WHATWG conformance,
  and why Zig ownership is explicit.

Visual requirements:

- One request-lifecycle diagram for HTTP/1.1, one layered diagram for the
  transport stack, one slab-region diagram, one cluster topology diagram.
- Diagrams must have text alternatives and must not be the only explanation.

Acceptance:

- A reader can answer "where can this allocation happen?" and "who owns this
  slice?" after reading the concepts section.
- Every protocol page can link to a concept instead of repeating it.
- No concept page drifts into a full API dump; it links to reference pages.

### 6.4 HTTP/1.1 and the application API

**Purpose:** be the complete guide to the shared application surface and the
HTTP/1.1 transport.

Required content:

- `HTTP/1.1` overview: strict parsing, request targets, pipelining, keep-alive,
  `100 Continue`, response framing validation, limits, rejections.
- `Server lifecycle`: `init*` variants, route registration lock, `listen`,
  `listen_all` barrier, `listen_udp`, `run`, `request_shutdown`, `shutdown`,
  `deinit`, `catch_shutdown_signals`, stable-address rules.
- `Routing`: methods, registration order, static versus parameterized
  precedence, wildcard remainder, duplicate parameter failure, route limits,
  `HEAD` fallback, `OPTIONS`, `Allow`, `any`.
- `Route parameters`: capture syntax, 16 inline captures, extra slab storage,
  malformed patterns, percent decoding policy, borrowed lifetime.
- `Handlers`: sync, context, async, async-context, error reporting, response
  completion, what not to do in a callback.
- `Middleware`: registration order, stop semantics, built-in CORS, security
  headers, auth, rate limit; per-worker tables; no dynamic middleware.
- `Request API`: method, target, path, query, URL, headers, unique headers,
  token checks, body text/bytes/JSON, cloned requests, form/query helpers.
- `Response API`: text, HTML, bytes, JSON, `json_buf`, streaming JSON, redirect,
  headers, status lines, chunked, stream, SSE, file, gzip, cookie helpers.
- `Static files`: mount, confinement, symlink policy, MIME, ETag,
  Last-Modified, `If-None-Match`, `If-Range`, one range, `sendfile` boundary,
  buffered TLS/H2/H3 path, 8 mounts.
- `Streaming`: `begin_stream`, `StreamProducer`, `StreamStatus`, queue
  backpressure, producer re-entry, error handling, transport differences.
- `SSE`: event framing, data lines, heartbeat, close, client reconnect guidance.
- `Chunked`: `begin_chunked`, `write_chunk`, `end_chunks`, when to prefer
  `begin_stream`, queue behavior.
- `JSON`: `res.json`, `res.json_buf`, `begin_json`, allocator ownership,
  `req.json(T, allocator)`, size limits, parse errors.
- `Helpers`: query/form, multipart, cookies, compression, caching, content
  negotiation, fetch/streams/abort, and WebSocket stream adapters are specified
  in Section 6.4.1. The HTTP pages link to the canonical helper page instead of
  duplicating it.
- `Headers`: borrowed views, duplicate handling, unique-header access,
  control-character rejection, reserved framing fields.
- `CORS`: exact origin match, preflight, allowed methods/headers, credentials,
  max age, `Vary: Origin`, deliberate application.
- `Security headers`: actual defaults and how to override them; CSP is a
  starting point, not a complete policy.
- `Authentication`: Basic and Bearer, constant-time compare, unique header,
  challenge, multiple credentials, per-worker context.
- `Rate limiting`: token bucket, O(1) indexed table, key functions, eviction
  behavior, `429`, `Retry-After`, per-worker table.
- `OpenAPI`: `app.openapi`, generated 3.1 shape, route metadata, parameter
  conversion, 320 routes/64 KiB paths, what is not generated.
- `Errors`: `uz.errors`, structured rejection, status helpers, method-not-
  allowed, internal error, response already started.
- `QUERY`: RFC 10008 method, content-type requirement, handler-owned media
  policy, replay-safety classification.
- `TRACE`: opt-in only, no synthesized echo, redaction requirements, response
  capacity.
- `Limits`: table of every HTTP limit, default, builder override, result, and
  whether it also sizes H2/H3.
- `Testing`: in-process handler tests where possible, loopback tests, `curl`,
  h1spec, and how to assert a rejection.

Acceptance:

- Every public HTTP helper in `src/root.zig` is either documented here, in
  Section 6.4.1, or explicitly assigned to a reference page.
- Every limit table matches `ServerConfig` defaults and validation rules.
- Every failure mode names the HTTP status and the Zig error when one exists.
- The static file page does not claim range support on TLS/H2/H3 beyond the
  documented buffered path.

### 6.4.1 Helpers

**Purpose:** compact the small, composable utilities into a Hono-style Helpers
group without turning it into a second protocol section.

The group lives at `/docs/http/helpers`. Its index is a card hub grouped as
Input, State, Wire, and Adapters. Every card names the public module, the
reader outcome, and the canonical page. The index also links to core pages that
are not helpers (`/docs/http/request`, `/docs/http/response`, `/docs/http/json`,
`/docs/http/streaming`, `/docs/http/server-sent-events`, `/docs/http/errors`,
`/docs/http/static-files`, `/reference/zig`).

Required content:

- `Query and forms`: 32-pair default, percent/form decoding, `get`, `get_last`,
  `get_int`, `has`, `count_named`, content-type validation, no allocation, and
  the difference between a query string and a form body.
- `Multipart`: boundary rules, 70-byte maximum boundary length, part iteration,
  chunked part reads, upload size limits, and the fact that request bodies are
  buffered.
- `Cookies`: RFC 6265 parsing, 32-pair jar, `Set-Cookie` options, `__Host-` and
  `__Secure-` prefix enforcement, SameSite, HMAC-SHA256 signing, key rotation,
  and the explicit statement that signing is not encryption.
- `Compression`: one-shot `Response.end_gzip`, `uz.compression_stream`,
  `uz.compression_pool`, `Content-Encoding`, `Vary`, input/output bounds,
  per-worker scratch, and the compression side-channel warning.
- `Caching`: strong ETag generation, weak comparison, `If-None-Match`, `304`,
  static `Last-Modified`, `If-Range`, and the fact that cache-control policy is
  application-owned.
- `Content negotiation`: `Accept` parsing, q-values, 16-entry bound, `best`,
  and behavior when no offer matches.
- `Fetch, Streams, and abort`: `HeadersView`, header iteration, BYOB readable
  streams, writable streams, `pipe_to`, backpressure, and cooperative abort.
  State clearly that these are Fetch/Streams-inspired primitives, not a claim
  of WHATWG conformance.
- `WebSocket stream adapters`: `WebSocketStream` and
  `NativeWebSocketStream`, how they differ from callbacks, how backpressure is
  observed, and when to use them. Link to the WebSocket protocol section for
  framing and handshake rules.

Boundary rules:

- Helpers never own wire behavior. Protocol pages own HTTP/1.1, HTTP/2,
  HTTP/3, WebSocket, and JSON-RPC semantics.
- Security middleware (auth, rate limit, CORS, security headers) stays under
  Security and `/docs/http/middleware`; it is not a convenience helper.
- Core response modes (JSON, streaming, SSE, chunked, static files, OpenAPI)
  stay in the HTTP section; Helpers links to them.
- Type-safety APIs (`schema`, typed RPC) stay in Type Safety; Helpers links to
  them.
- One topic has one canonical page. Do not create a helper page that repeats a
  protocol page for search traffic.

Acceptance:

- The index lists every helper and no non-helper.
- Each helper page has a runnable example or a complete function-level excerpt.
- Each helper page links to the request/response page and the capacity model.
- The moved routes are reflected in the page register and the feature matrix.
- Search returns the helper page for its module name and task phrase.
- The HTTP sidebar shows Helpers as a nested group without hiding the protocol
  pages.

### 6.5 WebSocket

**Purpose:** make RFC 6455 and RFC 7692 behavior predictable, including the
parts the framework deliberately leaves to the application.

Required content:

- Registering a route with `WsBehavior`; default message capacity; per-route
  frame/message limits; failure at registration when limits exceed capacity.
- Handshake: version `13`, key handling, upgrade response, header validation,
  origin and subprotocol policy are application responsibilities; state this
  explicitly.
- Frame handling: text/binary, fragmentation, control frames, 125-byte control
  payload, close codes, UTF-8 validation, message slice lifetime.
- Sending: `send`, opcode, `send_close`, `terminate`, outgoing validation,
  `error.WouldBlock`, `buffered_amount`, `drain` callback.
- Streams: `WebSocketStream` and `NativeWebSocketStream` are documented as
  adapters on `/docs/http/helpers/websocket-streams`; this section owns the
  framing and backpressure they build on. `websocket_mask` and
  `websocket_backpressure` are public primitives for embedders and tests, not
  required application APIs.
- Compression: opt-in per route, no-context-takeover, window ranges, scratch
  allocation at registration, expansion cap, uncompressed fallback, HTTP/2
  tunnels are uncompressed.
- Heartbeats: five-second worker timer, ping/pong, idle timeout, zero disables.
- Pub/sub: topic and subscription limits, stable ids, O(1) lookup, publish
  cost proportional to subscribers, message bytes not retained.
- Cluster pub/sub: per-worker inbox, `publish`, `publish_report`, `queued`,
  `dropped`, `notify_failed`, `first_dropped_worker`, `ClusterStopped`.
- HTTP/2 tunnels: RFC 8441, one tunnel per connection, `503` on excess,
  `Sec-WebSocket-Version` rules, key not required, no compression.
- Security: origin checks, auth before upgrade, message size limits, rate
  limiting, compression side channels, close handling.
- Testing: Autobahn 517/517 accepted with 514 `OK` and 3 `INFORMATIONAL`,
  unit coverage, browser/`wscat` smoke, load test.
- Limits: frame, message, control, queue, subscriptions, topics, cluster inbox.

Acceptance:

- The page states that no WebSocket client is shipped yet.
- The page never implies built-in origin or subprotocol negotiation.
- Every send/backpressure example handles `error.WouldBlock`.
- The Autobahn claim is dated and linked to evidence.

### 6.6 HTTP/2

**Purpose:** explain the bounded HTTP/2 server session without implying a
general-purpose HTTP/2 implementation.

Required content:

- Startup: TLS ALPN `h2` -> `http/1.1`; cleartext prior knowledge; no h2c
  Upgrade.
- Frame state machine: preface, SETTINGS, PING, GOAWAY, RST_STREAM, HEADERS,
  CONTINUATION, DATA, trailers, padding, unknown frames ignored. Explain the
  public modules `uz.http2`, `uz.http2_hpack`, and `uz.http2_server` and which
  one an application should use.
- HPACK: bounded dynamic table, Huffman, pseudo-header ordering, field names,
  connection-specific header rejection, caller-owned storage.
- Flow control: connection and stream windows, partial DATA, backpressure.
- Streams: eight concurrent streams, per-stream request/body/response slabs,
  stream lifecycle, async tokens, reset behavior.
- RFC 8441: one WebSocket tunnel per connection, excess `503`, no deflate.
- Capacities: `with_max_h2_*` fields and the failure mode when exceeded.
- Observability: one `http_request` record per completed exchange,
  `uwz_http_requests` counter, tunnel upgrade record.
- Testing: unit suite plus shared-handler h1spec/HTTP/3 coverage.
- Boundaries: no server push, no h2c Upgrade, no >8 streams without connection
  specialization.

Acceptance:

- The page distinguishes "HTTP/2 routing works" from "full RFC 9113 feature
  parity"; it is the former.
- Every capacity name matches `ServerConfig`.
- The WebSocket tunnel section links to the WebSocket page and states the
  compression limitation.

### 6.7 HTTP/3 and QUIC

**Purpose:** document the live HTTP/3 request path and separate it from the
helper-only WebTransport surface.

Required content:

- Startup: `init_http3` / `init_http3_ephemeral`, TCP context `h2`/`http/1.1`,
  QUIC context `h3`, `listen_udp`, stable `App` address.
- Request path: HTTP/3 pseudo-headers decoded directly into `Request`, QPACK
  response headers, structured writes, partial stream writes.
- QUIC policy: BBRv1, pacing, Linux `UDP_SEGMENT` GSO, no receive GRO, no
  0-RTT, connection/stream/header/body limits.
- Header validation: pseudo-field ordering and uniqueness, lowercase names,
  authority/Host agreement, connection-specific fields, content-length.
- `QUERY`: RFC 10008, content-type syntax, handler media policy.
- WebTransport: helper-only draft-16 models; live listener rejects CONNECT
  with `501`; exact backend blockers and ADR 0001 link. Never say "supported".
- Observability: one `http_request` record per exchange; metrics registry is
  not advanced on the QUIC path.
- Testing: curl/ngtcp2 and aioquic gate, trailing field section, malformed
  header rejection, sibling-stream health, header-pool soak, clean shutdown.
- Deployment: UDP firewall, port binding, certificate context, no HTTP/3
  clustering.

Acceptance:

- The page uses a `Badge` or callout to mark WebTransport as not live.
- The page never claims HTTP/3 metrics parity with HTTP/1.1/HTTP/2.
- The page explains why receive GRO is disabled without pretending it is a
  missing application feature.

### 6.8 JSON-RPC

**Purpose:** make the typed JSON-RPC service a first-class, production-ready
choice rather than a footnote.

Required content:

- `Service`, `configured_service`, `register_typed`, `register_context`,
  `register_typed_context`, `register`, `dispatch`, `app.rpc`.
- Content-type rules (`application/json`, `application/json-rpc`), single
  calls, notifications, batches, HTTP 200 versus 204.
- Typed parameter decode, 4 KiB stack scratch, when to use the lower-level
  allocator path, result serialization bounds.
- Error model: standard JSON-RPC codes, application faults, `Call.fail`,
  protocol errors, HTTP mapping.
- Batch pre-validation before any side effect; method name copying; sealing at
  mount time.
- Capacities: 64 procedures, 4 KiB method storage, 16 KiB response defaults;
  per-worker service ownership; no sharing across loops.
- Transports: HTTP adapter versus direct `dispatch`; raw protocol layer imports
  only `std`.
- Testing: request fixtures, batch tests, error snapshots, load test.

Acceptance:

- Every example is typed end to end.
- The page explains why a service cannot be shared across cluster workers.
- The page does not imply JSON-RPC over WebSocket is implemented unless the
  application builds it on raw dispatch.

### 6.9 Type safety

**Purpose:** explain what "type-safe" means in this Zig framework without
borrowing JavaScript/TypeScript claims.

Required content:

- Compile-time capacities shape the application type; `ServerConfig` values
  must be comptime.
- Typed route callbacks, named callback aliases, explicit context pointers.
- `req.json(T, allocator)`, `res.json`, `json_buf`, `json_value_buf`, and
  ownership.
- `uz.schema`: struct-level `validation` rules, `Rule` fields, `IssueKind`,
  `max_nested_depth = 4`, `validate_json` versus `validate_json_detailed`.
- Typed JSON-RPC, error sets, `HandlerError`.
- Named types over inline anonymous structs; no `anytype` in public APIs unless
  the contract is genuinely polymorphic.
- C ABI is intentionally a high-level, fixed-capacity subset; it is not a
  one-to-one projection of the Zig API.
- Limits of the type system: runtime JSON shape errors, application-defined
  semantic validation, and errors that must become HTTP responses.

Acceptance:

- The page never says "TypeScript-style inference" or "compile-time routing
  types" unless the source proves it.
- Every schema rule name and depth limit is sourced.
- The page shows both the happy path and a validation failure.

### 6.10 Client

**Purpose:** document the outbound HTTP/1.1 client as a bounded tool with a
deliberately small scope.

Required content:

- `fetch_blocking`, `FetchStorage`, `client(N)`, `fetch`, `run`, callbacks.
- Request builder: method, host, path, headers, body, reserved headers,
  `Connection: close`, numeric addresses only.
- Response parsing: content-length, chunked with trailers, close-delimited,
  `HEAD`/204/205/304, up to eight `100 Continue`, other 1xx protocol failure.
- Capacity table: in-flight requests, 16 KiB head, 64 headers, 8 KiB trailers,
  64 KiB max response body, 8 KiB read chunk, TLS staging.
- TLS trust: no default store, `ca_path` required for verification, SNI and
  SAN rules, IPv4/IPv6, no mTLS, TLS 1.3 only.
- Timeouts: connect, read (handshake/write/read), zero behavior, monotonic clock.
- Failure kinds: connect, tls, protocol, timeout, closed, capacity; setup errors
  versus callback outcomes.
- Boundaries: no DNS, redirects, cookies, proxies, retries, connection pooling,
  HTTP/2, HTTP/3, or WebSocket client.
- Testing: pure parser, loopback plaintext/TLS, slot reuse, trust failures.

Acceptance:

- The page never implies `fetch` resolves DNS.
- The page explains that a `ResponseView` is callback-scoped.
- The page states that `deinit` requires all requests drained.

### 6.11 TLS and security

**Purpose:** be the authoritative security surface, with TLS as a first-class
deployment topic rather than an appendix.

Required content:

- TLS 1.3 only; ALPN policy; no TLS 1.2 fallback.
- Ephemeral certificates: ECDSA P-256, SANs, validity, `curl -k`, why not
  production, custom names.
- Production PEM: chain order, key match check, startup failure names,
  NUL-terminated paths.
- mTLS: `none`/`optional`/`required`, CA bundle, CRL loaded but not enforced,
  early data disabled for optional/required, HTTP/3 client auth not wired.
- Web Crypto subset: `uz.crypto_subtle` algorithms and boundaries; it is not a
  complete WebCrypto implementation and does not replace a dedicated crypto
  review.
- TLS clusters: one `SSL_CTX` per worker, `enable_https` ordering, rolling
  restart, cross-worker resumption limitation, no QUIC cluster.
- 0-RTT: safe methods only, `425 Too Early`, replay considerations, QUIC
  disabled.
- Certificate rotation: rolling restart, no hot reload, ADR 0003.
- Auth: Basic/Bearer, constant time, unique header, challenge, multiple creds.
- Rate limit: token bucket, key derivation, eviction, per-worker state.
- CORS and security headers: exact defaults, preflight, `Vary`, CSP caveat.
- Input hardening: request line/header/body limits, smuggling defenses,
  control-character rejection, duplicate framing rejection, structured errors.
- WebSocket security: origin policy is app-owned, auth before upgrade, message
  limits, compression side channels.
- HTTP/3 security: 0-RTT disabled, header validation, no WebTransport live path.
- Threat model: assets, trust boundaries, attacker capabilities, non-goals.
- Reporting: link to `SECURITY.md`, supported versions, private disclosure.
- Secrets: no keys in repo, no debug dumps, log redaction, environment policy.

Acceptance:

- Every security default is sourced to code or `SECURITY.md`.
- The page does not present a framework feature as a complete security program.
- mTLS and 0-RTT interactions are explicit.

### 6.12 Architecture and internals

**Purpose:** give advanced users and maintainers a map of the runtime without
turning the docs into a source-code mirror.

Required content:

- Shared-nothing topology; one loop, slab, TLS context per worker; affinity;
  `SO_REUSEPORT`; Windows `SO_REUSEADDR` fallback.
- Event loop and completion lifecycle; backend selection; io_uring -> epoll
  fallback; process-sticky backend; no public backend introspection.
- Memory model: slab regions, SoA, freelist, activity bitmap, alignment,
  `required_bytes`/`carve`, per-worker inbox memory.
- Router internals: parallel arrays, static index, pattern side tables,
  immutability after listen.
- Callback lifecycle: accept, read, write, close, pool release, timers,
  async completion, QUIC callbacks; the release gate.
- Transports: TCP/TLS/HTTP1, HTTP/2, HTTP/3, client, edge/WASM, kTLS, XDP;
  explain `uz.transport` as the protocol-only core and `uz.udp` as the
  completion-driven QUIC transport.
- Datagram plumbing: `uz.datagram`, `uz.datagram_ring`, and the WebTransport
  helper status; do not present these as a live WebTransport server.
- Shared memory: `uz.shared_memory` generation-checked views and Cap'n Proto
  envelopes; state the trust boundary and the release rule.
- Cluster internals: worker group, lifecycle, first failure, sequence ring,
  queue scratch, publish report.
- Shutdown ordering: reject, stop timers/watcher, close listener/UDP, cancel
  completions, verify drain, release TLS/QUIC/loop/slab.
- Edge: freestanding and WASI exports, bounded alloc/free, generation-checked
  handles.
- C ABI architecture: opaque handles, fixed capacities, async tokens.
- Dependencies: BoringSSL, lsquic, libxev, zslay, libdeflate, zlib, fork policy.
- kTLS and XDP: standalone helper status, no integrated data path, privileges.
- `callback_lifecycle.md` references `file:line`; do not copy line numbers into
  the website because they drift. Explain the ordering and link to the source
  page for the current map.

Acceptance:

- Every diagram matches the current source.
- The page separates public contracts from internal implementation details.
- No internal symbol is presented as public API.

### 6.13 Performance

**Purpose:** help a team reason about cost, size capacities, benchmark
honestly, and avoid cargo-cult numbers.

Required content:

- Cost model: one startup allocation, no hot-path allocation, bounded queues,
  per-connection slab cost, HTTP/2 session dominance, per-worker inbox.
- Capacity sizing worksheet: connections, body size, WebSocket message, write
  queue, H2/H3, compression, cluster, TLS context, file server preset.
- Benchmarking: quiet-host contract, candidate versus baseline, 90 percent
  regression guard, no shared-runner claims, commit/hardware/date capture.
- Load testing: workload shape, keep-alive, TLS, HTTP/2 streams, WebSocket
  echo, `wrk`/`h2load`/custom client, error accounting.
- Profiling: `perf`, allocator instrumentation, dev log, metrics, eBPF limits.
- Tuning: TCP flags, `SO_REUSEPORT`, worker count, affinity, write queue,
  body size, compression tradeoffs, HTTP/3 GSO.
- Regression policy: how to add a benchmark, how to publish evidence, how to
  avoid comparing unlike hosts.
- Performance claim policy: no absolute claims; every number linked to an
  artifact and a date.

Acceptance:

- No benchmark number appears without commit, date, hardware, command, and
  artifact path.
- The page distinguishes regression guard from universal performance claim.
- Capacity guidance is derived from `slab_bytes()`, not invented.

### 6.14 Operations

**Purpose:** let a maintainer build, test, verify, release, and debug the
framework and an application built on it.

Required content:

- Build from source, Nix shell, plain Zig, first-build downloads, package
  manager cache, no CMake/Ninja/Go/Perl/Python/system zlib.
- Tests: unit suite, per-module tests, package consumer, h1spec, Autobahn,
  HTTP/3 interop, fuzz smoke, OSS-Fuzz objects.
- Sanitizers: ASan/UBSan/LSan, MSan C/C++ boundary, flags, Nix runtime paths,
  mutual exclusion, known ASan sigaltstack workaround.
- Fuzzing: Smith harness, OSS-Fuzz targets, seeds, ClusterFuzzLite, duration.
- Cross-compilation: musl, Windows compile, macOS cross, BSD community targets.
- C ABI: build `zig build lib`, header install, link requirements, static
  archive order, error codes, opaque handles.
- Releases: version source of truth, bump script, changelog, tag, source-only
  releases, package pinning.
- Dependencies: pins, maintained forks, mirror/integration branches, audit.
- Platforms: Linux/macOS supported, Windows gated, BSD community, no binaries.
- Logging: dev log behavior, terminal detection, file sink, dropped records.
- Metrics: counters, hidden `/metrics`, per-worker registry, HTTP/3 gap.
- Graceful shutdown: signal watcher, cluster watcher, drain order, supervisor.
- Troubleshooting: build/cache, capacity rejections, pre-handler failures, TLS,
  client, signals, cluster, kqueue timers, HTTP/3.
- Advanced: eBPF histogram, WASM, kTLS, AF_XDP, shared memory.
- Runbooks: what to capture before asking for help.

Acceptance:

- Every command has been run on a supported host or is marked as a cross-
  compile-only check.
- The C ABI page matches `include/uWebZockets.h`, not an older README snippet.
- Troubleshooting pages use symptom -> cause -> fix -> prevention.

### 6.15 Deployment

**Purpose:** turn the framework's contracts into a production checklist.

Required content:

- Pre-launch checklist with owner, evidence, and rollback.
- TLS: production certs, mTLS decision, ALPN, early data, cluster ordering,
  rotation.
- Capacity: presets, slab math, per-worker memory, body/message/write queue,
  cluster inbox, file preset, verification command.
- Hardening: auth, rate limit, CORS, security headers, idle timeouts, TRACE
  policy, request limits, secrets.
- Observability: metrics, dev log policy, eBPF optional, alert ideas, HTTP/3
  gap.
- Shutdown: SIGTERM, drain, supervisor wait, `deinit_checked`, cluster state.
- Docker: multi-stage build, Nix or Zig toolchain, non-root, read-only FS,
  CA certs, health check, signal handling.
- Kubernetes: readiness/liveness, `terminationGracePeriodSeconds`, resource
  requests from slab size, `SO_REUSEPORT`, no HTTP/3 cluster, pod disruption.
- systemd: `Type=notify`? Verify; if not supported, use `simple`/`exec` and a
  readiness probe. Do not invent sd_notify support.
- Reverse proxy: preserve client IP, TLS termination choice, WebSocket upgrade,
  HTTP/2, request limits, buffering, timeouts, HTTP/3.
- Zero downtime: rolling restart, certificate rotation, connection draining,
  cross-worker resumption caveat.
- Windows: official support gate, no binaries, compile/runtime job.
- BSD: build graph only, no hosted runtime CI.

Acceptance:

- The checklist can be executed top to bottom.
- No deployment page claims hot certificate reload, HTTP/3 clustering, or
  Windows official support.
- Every platform statement links to the roadmap or CI evidence.

### 6.16 Guides and cookbook

**Purpose:** provide complete, copyable solutions for common application
shapes, with the invariants that make them safe.

Required content:

- Every guide starts with a problem, assumptions, and a complete minimal
  program or diff.
- Every guide ends with verification and two variations.
- Guides do not re-teach the whole framework; they link to concepts.
- Each guide names its capacity assumptions and failure behavior.
- Each guide includes a test or a reproducible command.
- Guides cover at least: JSON API, auth, rate limit, static files, chat, RPC,
  SSE, streaming, uploads, cookies, CORS, OpenAPI, webhooks, health checks,
  graceful shutdown, cluster, HTTPS, HTTP/3, C ABI, testing, benchmarking.

Acceptance:

- Every guide program compiles from a clean checkout.
- Every security-sensitive guide states the trust boundary.
- No guide uses an unbounded allocation in the request path.

### 6.17 Migration

**Purpose:** reduce adoption risk and make version upgrades explicit.

Required content:

- From uWebSockets: event-loop model, handler signatures, `req`/`res`, route
  patterns, WebSocket behavior, pub/sub, compression, deployment differences.
- From `std.http`: server startup, allocator model, routing, body handling,
  response writing, TLS, limitations.
- From other Zig frameworks: what maps, what does not, and when not to migrate.
- From C: C ABI scope, handles, fixed capacities, async tokens, linking.
- v1 to v2: exact breaking changes from the changelog, not guessed.
- 2.1 to 2.2: carried boundaries, new APIs, migration steps.
- Breaking changes index: version, API, old behavior, new behavior, action.
- Checklist: dependencies, compiler, capacities, TLS, cluster, tests, rollout.

Acceptance:

- Every mapping names the source and target API.
- No migration page promises source compatibility that the changelog does not.
- The page links to the version-specific changelog entry.

### 6.18 Reference

**Purpose:** be the stable, lookup-oriented surface for exact facts.

Required content:

- Zig API index generated from `src/root.zig` or maintained in lockstep with
  it; every exported public name has a page or anchor.
- `ServerConfig` table with defaults, valid ranges, cross-field constraints,
  and the slab regions each field sizes.
- Limits table: HTTP/1.1, HTTP/2, HTTP/3, WebSocket, JSON-RPC, client, router,
  middleware, static, cluster, C ABI.
- Error index: Zig error name, cause, HTTP status if applicable, fix, source.
- C ABI: handle types, functions, error codes, capacities, ownership, async.
- Build steps and flags: example steps, test, sanitize, fuzz, lib, wasm, ebpf,
  all-targets, cross targets.
- Feature matrix: supported, helper-only, experimental, not supported.
- Compatibility: Zig version, platforms, dependency pins, release policy.
- Protocol matrix: transport, ALPN, framing, limits, compliance.
- Glossary: concise definitions with links.

Acceptance:

- No reference fact is duplicated in a tutorial without a link to the
  reference.
- Every row has a source file or generated source.
- The API index has a drift check in CI.

### 6.19 Examples

**Purpose:** show the canonical program for each framework capability.

Required content:

- One page per `examples/*.zig` step; title matches the build step.
- Full source link, build command, run command, expected output, key APIs.
- Explanation of the capacities chosen and why.
- One variation or next step.
- For cluster/TLS/HTTP3 examples, the shutdown and verification commands.

Acceptance:

- Every page builds from the current repository.
- The example source and page code do not drift; a CI check compares them.
- Examples are not used as a substitute for reference pages.

### 6.20 Project

**Purpose:** make the project's status, governance, and evidence legible.

Required content:

- Roadmap: current version, closed milestones, deliberate boundaries, near-term
  direction, how to influence.
- Changelog: chronological, linked, semantic versioning, migration notes.
- Security policy: supported versions, private disclosure, response expectations.
- Contributing: setup, checks, review, commit convention, docs contributions.
- License: MIT, third-party notices, dependency licenses.
- Dependency forks: maintained forks, mirror/integration branches, pin policy,
  audit process.
- ADR index: title, status, decision, link.
- Benchmark evidence: methodology, artifacts, host caveats.
- Support: issues, discussions, sponsorship, security contact.

Acceptance:

- The site does not become the canonical source for legal or security policy;
  it summarizes and links to the repository files.
- Every roadmap claim is dated or versioned.
- Every ADR link resolves.

## 7. Design system and components

### 7.1 Visual language

Keep the existing editorial grammar from `TODO.md`: warm paper, near-black ink,
orange accent, square geometry, display type for the landing hero, and a calm
reading surface for documentation. The docs must feel like the same publication
as the landing page without turning every page into a poster.

| Token            | Light         | Dark          | Use                          |
| ---------------- | ------------- | ------------- | ---------------------------- |
| Background       | `#f4f0e6`     | `#161513`     | Page and header paper        |
| Foreground       | `#171512`     | `#ece6da`     | Body and display ink         |
| Muted            | `#ebe5d8`     | `#211f1b`     | Callouts, table headers      |
| Muted foreground | `#5f5a52`     | `#a39c90`     | Secondary text, labels       |
| Border           | `#d3ccbe`     | `#2c2a25`     | Rules and dividers           |
| Radius           | `0`           | `0`           | Controls, cards, code blocks |
| Accent           | Orange preset | Orange preset | Links, focus, active state   |
| Content width    | `42rem`       | `42rem`       | Prose measure                |

Rules:

- Keep Blume's 64 px header, 17.5 rem rails, and 42 rem prose measure unless a
  measured readability test justifies a change.
- Use the accent for interactive meaning, not large decorative fills.
- Do not recolor Blume's syntax tokens. Flatten code chrome, keep contrast.
- Keep the landing hero's motion inside the hero; docs pages use no ambient
  animation.
- Respect `prefers-reduced-motion` for every transition and canvas.
- No emoji, no icon-only meaning, no color-only status.

### 7.2 Docs page anatomy

Every docs page uses this order:

1. Header with breadcrumb, search, locale, theme.
2. Sidebar with the current section expanded.
3. Article header: title, description, status badge if needed, last updated.
4. Body: one-sentence outcome, prerequisites, content, verification, next step.
5. Right rail: "On this page", page actions, feedback.
6. Previous/next navigation.
7. Footer.

Required elements:

- A visible `On this page` outline on pages with three or more headings.
- A `Last updated` value when the source supports it.
- An `Edit on GitHub` link that points at the actual MDX file.
- One `Copy as Markdown` surface; Blume owns it.
- A status badge for `Experimental`, `Helper-only`, `Platform-gated`, or
  `Deprecated` content.
- A clear "Prerequisites" block for tutorials.
- A "Verify" block for procedures.
- A "Next" block with one primary and two secondary links.

### 7.3 Built-in components

Use Blume components before inventing any local component. Preferred components:

| Need                       | Component                            | Rules                                                                  |
| -------------------------- | ------------------------------------ | ---------------------------------------------------------------------- |
| Section landing links      | `CardGroup` / `Card`                 | Use for `/docs` and section indexes                                    |
| Ordered procedure          | `Steps` / `Step`                     | One action per step                                                    |
| Alternative install paths  | `Tabs`                               | Use `param` for deep-linkable choices                                  |
| Audience/language variants | `View`                               | Only when most of the page changes                                     |
| Warnings and boundaries    | `Callout`                            | `warning` for unsupported, `danger` for security                       |
| Status                     | `Badge`                              | `Success` = supported, `Warning` = experimental, `Danger` = deprecated |
| File layout                | `FileTree`                           | Show only the files the reader needs                                   |
| Long config                | `TypeTable`                          | Keep types and defaults exact                                          |
| API fields                 | `ParamField` / `ResponseField`       | Only on pages with `api` frontmatter                                   |
| Request/response examples  | `RequestExample` / `ResponseExample` | Use for HTTP/JSON-RPC pages                                            |
| Long code                  | `CodeGroup`                          | Group equivalent shells, not unrelated snippets                        |
| Diffs                      | `Diff`                               | Use for migration and configuration changes                            |
| Diagrams                   | Mermaid fence                        | Keep a text explanation beside it                                      |
| Long output                | `Accordion` / `Expandable`           | Do not hide required steps                                             |

Do not add a custom MDX component unless a built-in cannot express the content.
A new interactive component is a Svelte island and needs this contract before
implementation:

```text
Props:
States:
Keyboard behavior:
Accessibility:
Failure behavior:
Hydration mode:
Test coverage:
```

Hand the island to `svelte-engineer`; hand the visual review to `ui-stylist`.
Static content stays in MDX.

### 7.4 Custom components to evaluate

These are candidates, not approved work. Each needs a demonstrated need across
at least two pages and a named owner.

| Candidate            | Need                                                   | Decision rule                                                                             |
| -------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `ProtocolBadge`      | Show HTTP/1.1, HTTP/2, HTTP/3, WS support consistently | Use `Badge` if a single label is enough; build only if a matrix is repeated on many pages |
| `FeatureStatus`      | Supported / helper-only / experimental / not supported | Prefer a plain badge plus the feature matrix; do not create a second source of truth      |
| `CapacityCalculator` | Interactive slab sizing                                | Defer until the static worksheet is validated; no client-side state in docs without tests |
| `BenchmarkChart`     | Show benchmark evidence                                | Only with a static data file, a versioned artifact, and a no-JS fallback                  |
| `ApiSignature`       | Render Zig signatures with anchors                     | Evaluate after the API reference spike; do not hand-maintain a second signature store     |
| `CopyForAgent`       | Copy page as prompt-friendly Markdown                  | Blume already ships `Copy as Markdown`; do not duplicate                                  |

### 7.5 Code block rules

- Declare a language on every fence. Use `zig`, `c`, `cpp`, `bash`, `console`,
  `json`, `toml`, `yaml`, `ts`, `text`, or `mdx`.
- Use a title when the block is a file: ` ```zig src/main.zig `.
- Use `lineNumbers` for programs over 20 lines and for diffs.
- Use `wrap` for long C signatures or shell lines; do not wrap Zig code by
  default because alignment carries meaning.
- Use `console` for terminal sessions with prompts and output; the copy button
  strips prompts.
- Use `CodeGroup` for equivalent alternatives such as Nix and plain Zig setup.
- Never put secrets, tokens, private keys, or real customer data in a fence.
- Mark excerpts explicitly: "Excerpt from `examples/chat_server.zig`; the full
  program includes the import and `main`." Do not leave a reader guessing which
  lines are missing.
- Code comments are English in both locales. Translate prose, not identifiers.

### 7.6 Diagrams

- Prefer Mermaid for request flow, state machines, and cluster topology.
- Prefer a simple ASCII or table diagram for memory layout when Mermaid would
  obscure alignment.
- Every diagram has a caption and a one-paragraph text explanation.
- Do not put secrets, hostnames, or customer identifiers in diagrams.
- Keep diagrams small enough to read at 320 px; otherwise provide a vertical
  variant or a table.

### 7.7 Accessibility

Target WCAG 2.2 AA.

- One `h1` per page; no skipped heading levels.
- Landmarks: header, navigation, main, complementary, footer.
- Skip link visible on focus.
- Keyboard access to search, locale, theme, sidebar, tabs, accordions, and copy
  buttons.
- Focus indicator with at least 3:1 contrast against the adjacent background.
- Text and UI contrast at least 4.5:1 and 3:1 respectively.
- Tables have header cells and a caption when the context is not obvious.
- Images have meaningful alt text or empty alt when decorative.
- Code blocks scroll horizontally without trapping keyboard focus.
- Reduced motion disables the hero canvas and non-essential transitions.
- Error messages and status are announced, not color-only.
- No content is available only on hover.

`blume audit` checks theme contrast, image alt text, heading levels, and some
asset rules. It does not replace a browser accessibility pass. At launch, run
Lighthouse and axe DevTools on `/`, `/docs`, `/docs/getting-started`,
`/docs/http/request`, `/docs/websocket/backpressure`, and `/reference/limits` at
mobile and desktop widths.

### 7.8 Responsive behavior

Test at 320 x 568, 375 x 812, 768 x 1024, 1280 x 800, and 1440 x 900.

- The first useful action is visible above the fold on the landing page.
- The sidebar becomes Blume's drawer, not a custom overlay.
- Tables scroll horizontally with a visible affordance; they do not force the
  page wider than the viewport.
- Code blocks scroll inside their own container.
- The right rail disappears below 1,280 px and its actions move into the
  "On this page" dropdown.
- Long headings wrap without overlapping the header or page actions.

### 7.9 Motion

- Landing hero only; docs pages have no scroll-jacking, parallax, or autoplay.
- Transitions are 120-240 ms and honor reduced motion.
- No blinking caret, flashing, or infinite decorative motion in docs chrome.
- The butterfly canvas keeps its existing pause/resume control and static
  fallback.

### 7.10 Print and export

- Print styles remove navigation, header, footer, page actions, and copy buttons.
- Code blocks print in full; collapsed/expandable content is expanded.
- Dark theme prints in light theme.
- Links print with their destination when the URL is not obvious.
- Blume's PDF/EPUB export is optional; evaluate after launch.

## 8. Content model and authoring rules

### 8.1 Frontmatter contract

Every page starts with:

```yaml
---
title: Request API
description: Read the method, target, headers, body, captures, and lifetime rules of a µWebZockets request.
sidebar:
  order: 6
  badge: Stable
search:
  tags: [http, reference]
seo:
  title: Request API | µWebZockets
  description: Read the method, target, headers, body, captures, and lifetime rules of a µWebZockets request.
---
```

Rules:

- `title` is sentence case and names the reader goal or the exact API.
- `description` is one sentence, 80-160 characters, and states the outcome.
- `sidebar.order` is explicit inside a group; do not rely on alphabetical order.
- `sidebar.badge` is used only for status, not decoration.
- `search.tags` use the controlled vocabulary in Section 10.2.
- `seo.title` is optional; when present, keep it under 60 characters.
- `draft: true` is allowed only for a page under active review. A draft is not
  a launch substitute for a P0 page.
- Do not add custom frontmatter keys. Blume rejects unknown keys.
- Do not put page prose in locale JSON.

### 8.2 Page brief template

Copy this into the task before writing:

```text
Page ID:
Route:
Title:
Type:
Priority / milestone:
Reader:
Reader outcome:
Prerequisites:
Source of truth:
Sections:
Required code:
Required tables/diagrams:
Claims to verify:
Cross-links:
Vietnamese status:
Acceptance:
Evidence:
```

### 8.3 Tutorial skeleton

````mdx
---
title: Your first HTTP server
description: Build, run, and verify a minimal µWebZockets server in Zig 0.16.0.
---

This tutorial takes you from an empty project to a server that answers `GET /`.

## Prerequisites

- Zig 0.16.0 on Linux or macOS.
- A terminal in the project directory.

## Create the project

<Steps>
  <Step title="Add the dependency">...</Step>
  <Step title="Write the server">...</Step>
  <Step title="Run it">...</Step>
  <Step title="Verify it">...</Step>
</Steps>

## What just happened

Explain the slab, route registration, listen, and run.

## Verify

```console
$ curl -i http://127.0.0.1:3000/
HTTP/1.1 200 OK
...
```

## Next

- [Routing](/docs/http/routing)
- [Request API](/docs/http/request)
````

### 8.4 Reference skeleton

````mdx
---
title: ServerConfig
description: Every startup capacity, timeout, and feature toggle in one table.
---

`ServerConfig` is the named capacity contract for one application slab. Values
must be compile-time constants.

## Fields

<TypeTable type={{ ... }} />

## Constraints

| Field | Default | Valid range | Sizes |
| ----- | ------: | ----------- | ----- |

## Example

```zig
...
```

## Related

- [Capacity model](/docs/concepts/capacity-model)
- [Builder](/reference/zig#Server)
````

### 8.5 Code sample policy

| Class          | Meaning                                        | Requirement                                                 |
| -------------- | ---------------------------------------------- | ----------------------------------------------------------- |
| `runnable`     | Complete program or a drop-in function         | Must compile in the snippet harness                         |
| `excerpt`      | Partial code from a canonical file             | Must name the file and explain omitted setup                |
| `signature`    | Type or function signature only                | Must match source exactly                                   |
| `shell`        | Command or terminal session                    | Must be executable or clearly marked as expected output     |
| `config`       | `build.zig`, `build.zig.zon`, TOML, YAML, JSON | Must parse; must match a repository fixture when one exists |
| `illustrative` | Pseudocode or shape only                       | Must be labelled and must not look copy-pasteable           |

No sample may use a secret. No sample may use an API that is not in the current
public surface. No sample may hide an error with `catch {}` unless the page
explains the exact reason the callback cannot fail.

### 8.6 Claims and evidence

Every factual claim falls into one of these classes:

| Claim class                 | Evidence required                                          |
| --------------------------- | ---------------------------------------------------------- |
| API existence and signature | Source file and line, or generated API index               |
| Default value or limit      | `ServerConfig` or the owning module                        |
| Wire behavior               | Protocol document plus tests                               |
| Compliance                  | Dated CI run with artifact link                            |
| Performance                 | Commit, hardware, command, date, artifact, and methodology |
| Platform support            | CI workflow and release policy                             |
| Security                    | `SECURITY.md`, code, or an ADR                             |
| Roadmap                     | `docs/roadmap.md` or an accepted ADR                       |

If evidence is missing, write "not documented yet" and file the gap. Do not
invent a number to make the page feel complete.

### 8.7 Terminology

- Use "connection slot" for one pooled `TcpConnection`.
- Use "application slab" or "startup slab" for the single contiguous allocation.
- Use "worker" for one thread with its own loop and slab.
- Use "capacity" for a compile-time or startup bound, not for throughput.
- Use "backpressure" for `error.WouldBlock` and producer resumption.
- Use "async token" for `AsyncResponse`, not "future" or "promise".
- Use "borrowed" for slices owned by the connection; "owned" for memory the
  caller explicitly allocated.
- Use "helper-only" for modules that exist but are not wired to the live server
  path, such as WebTransport helpers.
- Use "not supported" only for a deliberate boundary with a source.
- Use "µWebZockets" in prose, `uz` in code, and the repository name in URLs.

### 8.8 Links and anchors

- Internal links are root-relative: `/docs/http/routing`.
- External links name the destination in the label.
- Do not use "click here".
- Link to the exact section, not the top of a long page.
- Pin anchors when a heading is referenced from more than one page:
  `## TLS clusters {#tls-clusters}`.
- When renaming a page, add a redirect and update every internal link in the
  same change.
- Do not link to a draft page from a live page.

### 8.9 Images and media

- Prefer diagrams and text over screenshots.
- A screenshot must show the current UI; stale screenshots are removed.
- Every image has width and height to avoid layout shift.
- Use WebP or AVIF for photographic assets; SVG for diagrams and logos.
- Keep source diagrams in the repository when they are editable.
- Alt text describes the information, not the file name.
- No autoplay video or audio.

### 8.10 Versioning and deprecation

- Launch unversioned. The live tree is the current 2.x docs.
- Cut `v2.1.6` with `blume version v2.1.6` only when `2.2.0` ships, so readers
  have a stable snapshot of the version they were using.
- Archived pages declare the latest equivalent as canonical by default.
- A removed API gets a deprecation page, a migration row, and a changelog link.
- Use `Deprecated` badges and a callout with the replacement and removal
  version.
- Do not rewrite an archived snapshot. Fix the live page and note the correction
  in the changelog if a historical claim was wrong.

### 8.11 Review checklist for one page

- [ ] One reader goal; the first paragraph states it.
- [ ] The title and description are specific and sentence case.
- [ ] Prerequisites and supported versions are explicit.
- [ ] Every API name, limit, and error matches the source.
- [ ] Every unsupported or experimental claim is labelled.
- [ ] Code fences have a language; runnable samples are in the harness.
- [ ] Commands and outputs are copy-pasteable.
- [ ] Internal links and anchors resolve.
- [ ] The page is reachable from the sidebar and a contextual link.
- [ ] English and Vietnamese routes exist or the task records the gap.
- [ ] No emoji, filler, unverified benchmark, or secret.
- [ ] Accessibility, responsive behavior, and reduced motion checked.
- [ ] Search finds the page by title and a body phrase.
- [ ] The page has a next step.

## 9. Internationalization

### 9.1 Policy

English is canonical. Vietnamese is a first-class locale, not a later
afterthought. The existing site already publishes `/vi` and uses mirrored MDX;
keep that model.

| Priority | Translation requirement                               |
| -------- | ----------------------------------------------------- |
| P0       | English and Vietnamese before launch                  |
| P1       | English at launch; Vietnamese within one milestone    |
| P2       | English only until the page is stable; then translate |

A page with no Vietnamese mirror falls back to English at `/vi/...` through
Blume. That is acceptable for P1/P2 temporarily, but the task row must say so.
Do not mark a P0 page `Live` while its Vietnamese route falls back.

### 9.2 File layout

```text
docs/
  index.mdx
  docs/
    getting-started/
      index.mdx
      motivation.mdx
  vi/
    index.mdx
    docs/
      getting-started/
        index.mdx
        motivation.mdx
  <section>/
    meta.ts
```

- Mirror the English path exactly under `docs/vi/`.
- Add a `meta.ts` to each Vietnamese folder when the group title or order needs
  translation.
- Keep code fences and identifiers identical across locales.
- Translate prose, table headers, captions, alt text, and callout titles.
- Do not translate `µWebZockets`, API names, error names, header names, CLI
  flags, or file paths.
- Keep explicit English anchors on translated headings so cross-locale links
  resolve.

### 9.3 Translation workflow

1. Write and review the English page.
2. Mark the page `Draft` until a human translator or a fluent maintainer
   reviews the Vietnamese version.
3. Translate prose, not code. Keep all examples identical.
4. Run `pnpm i18n:check` only for component copy changes; do not add MDX prose
   to x18n resources.
5. Run `blume validate --strict` and `blume audit --fail-on warning` in both
   locales.
6. Check that the locale switcher lands on the same page, not the locale root.
7. Check that `hreflang` and canonical URLs are correct in the built HTML.

`blume translate` may produce a first draft, but it is not a publishing tool.
Every generated translation gets a technical review and a language review.

### 9.4 Vietnamese glossary

Keep a shared table for recurring terms. Proposed mappings:

| English      | Vietnamese        | Notes                               |
| ------------ | ----------------- | ----------------------------------- |
| application  | ứng dụng          |                                     |
| connection   | kết nối           |                                     |
| request      | yêu cầu           |                                     |
| response     | phản hồi          |                                     |
| route        | tuyến             | Keep `route` in code contexts       |
| middleware   | middleware        | Common in Vietnamese technical text |
| worker       | worker            | Keep the English term               |
| slab         | slab              | Keep the English term               |
| capacity     | dung lượng        | Explain as a fixed bound            |
| backpressure | backpressure      | Keep the English term               |
| async token  | token bất đồng bộ |                                     |
| borrowed     | mượn              | Explain ownership                   |
| owned        | sở hữu            |                                     |
| certificate  | chứng chỉ         |                                     |
| handshake    | bắt tay           |                                     |
| compression  | nén               |                                     |
| benchmark    | benchmark         | Keep the English term               |

### 9.5 i18n QA

- [ ] Page count per section matches English.
- [ ] Frontmatter translated except `slug`, code, tags, and canonical.
- [ ] Anchors match the English page or have explicit aliases.
- [ ] Locale switcher preserves the page.
- [ ] `lang` and `hreflang` are correct.
- [ ] No English paragraph accidentally left in a procedure.
- [ ] Tables fit the Vietnamese text without overflow.
- [ ] Code comments remain English and unchanged.
- [ ] Search returns the Vietnamese page for Vietnamese queries and the English
      page for English queries.

## 10. Search, SEO, and the agent surface

### 10.1 Search

Blume's local Orama search is the default and needs no hosted service. Keep it
until there is measured evidence for a different backend.

Configure:

- Popular pages: quickstart, installation, routing, request, response,
  WebSocket backpressure, ServerConfig, limits, errors, troubleshooting.
- Tags from the controlled vocabulary below.
- Ranking boosts for title matches and reference pages.
- Search analytics to capture zero-result queries and low-click queries.
- A no-results state that links to the docs home, the feature matrix, and the
  issue tracker.

### 10.2 Tag vocabulary

Use only these tags in `search.tags`:

`getting-started`, `concept`, `tutorial`, `how-to`, `reference`, `recipe`,
`migration`, `troubleshooting`, `http`, `http1`, `http2`, `http3`, `quic`,
`websocket`, `json-rpc`, `tls`, `security`, `auth`, `routing`, `middleware`,
`static-files`, `streaming`, `sse`, `json`, `schema`, `cookies`, `cors`,
`rate-limit`, `openapi`, `client`, `cluster`, `capacity`, `performance`,
`observability`, `operations`, `deployment`, `c-abi`, `wasm`, `ktls`, `xdp`,
`platform`, `migration`, `release`, `helpers`.

### 10.3 Search QA table

These queries must return the intended page in the top three at launch:

| Query                    | Intended page                                          |
| ------------------------ | ------------------------------------------------------ |
| `zero allocation`        | `/docs/concepts/zero-allocation`                       |
| `slab size`              | `/docs/concepts/capacity-model` or `/reference/limits` |
| `WouldBlock`             | `/docs/concepts/backpressure`                          |
| `cookie helper`          | `/docs/http/helpers/cookies`                           |
| `parse query string`     | `/docs/http/helpers/query-and-forms`                   |
| `compress response`      | `/docs/http/helpers/compression`                       |
| `stream adapter`         | `/docs/http/helpers/websocket-streams`                 |
| `websocket backpressure` | `/docs/websocket/backpressure`                         |
| `HTTP/2 streams`         | `/docs/http2/frames-and-streams`                       |
| `HTTP/3 QUERY`           | `/docs/http3/query-method`                             |
| `JSON-RPC typed`         | `/docs/json-rpc/typed-procedures`                      |
| `mTLS`                   | `/docs/security/mtls`                                  |
| `ephemeral certificate`  | `/docs/security/ephemeral-certificates`                |
| `C ABI`                  | `/reference/c-abi`                                     |
| `cluster shutdown`       | `/docs/operations/graceful-shutdown`                   |
| `Windows support`        | `/docs/operations/platforms`                           |
| `WebTransport`           | `/docs/http3/webtransport`                             |
| `migrate uWebSockets`    | `/docs/migration/from-uwebsockets`                     |

Add a test file under `tests/docs/` that asserts the generated search index
contains these titles and tags. The index format is a Blume implementation
detail; read it through the generated artifact rather than importing internals.

### 10.4 SEO

- Set `deployment.site` to the production origin before launch. Without it,
  sitemap, canonical, Open Graph, and RSS are incomplete.
- Every page has a unique `title` and `description`.
- Add `seo.title` only when the page title needs a product suffix.
- Generate Open Graph images for P0 pages and section indexes.
- Keep one canonical URL per page; archived versions canonicalize to the live
  equivalent.
- Use `noindex` only for drafts, internal previews, and deprecated pages with no
  replacement.
- Add JSON-LD through Blume's structured-data support; do not hand-write a
  second graph.
- Verify `/sitemap.xml`, `/robots.txt`, and canonical tags after the first
  production build.
- Do not index `/docs` duplicates under both `/getting-started` and
  `/docs/getting-started`; redirect the old URL.

### 10.5 AI and agent surface

Blume emits these by default or with small configuration:

| Artifact                   | Use                                 | Launch decision                                            |
| -------------------------- | ----------------------------------- | ---------------------------------------------------------- |
| `/llms.txt`                | Agent index of the docs             | Enable; add a curated `details` block                      |
| `/llms-full.txt`           | Flat full-content dump              | Enable; verify size and freshness                          |
| `/<route>.md`              | Raw Markdown mirror                 | Enable; verify UTF-8 and content type                      |
| `/api/docs/*`              | JSON docs API                       | Enable; document the shape for agents                      |
| `/openapi.json`            | OpenAPI description of the docs API | Enable; do not confuse with the application OpenAPI output |
| `/agent-readability.json`  | Agent discovery manifest            | Enable                                                     |
| `/.well-known/api-catalog` | RFC 9727 catalog                    | Enable when the reference surface exists                   |
| `/mcp`                     | MCP server                          | Requires a server adapter; defer until hosting is decided  |
| Site skill                 | Agent skill generated from docs     | Evaluate after launch; do not ship a stale skill           |

`llms.txt` details should include:

```text
## When to use uWebZockets

Use uWebZockets when a Zig service needs bounded memory, predictable latency,
and one Request/Response API across HTTP/1.1, HTTP/2, HTTP/3, WebSocket, and
JSON-RPC. Install Zig 0.16.0, add the package with `zig fetch --save`, and start
with `/docs/getting-started/quickstart`.

Important boundaries: WebTransport helpers are not live, HTTP/3 clustering is
not supported, TLS is 1.3 only, and the client is HTTP/1.1 only.
```

Rules:

- Do not enable MCP on a static build; Blume requires a server adapter.
- Do not publish an assistant that can answer unsupported features without a
  source-backed retrieval corpus.
- Keep `llms.txt` page order aligned with the sidebar.
- Exclude drafts and hidden pages by default.
- Re-run the agent surface audit after every major content milestone.

### 10.6 Analytics and privacy

Decision pending. Recommended default: a privacy-friendly, cookie-free
analytics provider (Plausible, Fathom, or Umami) with no consent banner because
no personal data or cookies are collected. If the provider uses cookies or
personal data, add Blume consent configuration and a privacy page.

Track only:

- Page views and referrers.
- Search queries and zero-result queries.
- Outbound clicks to the repository, examples, and security contact.
- Copy-as-Markdown and code-copy events, aggregated.
- 404 paths.

Do not track individual readers, IP addresses beyond coarse country, or
authenticated identities. Publish a short analytics note in the footer or
privacy page.

## 11. Documentation engineering and CI

### 11.1 Repository surfaces

| Surface                | Path                            | Owner                            |
| ---------------------- | ------------------------------- | -------------------------------- |
| Docs content           | `apps/uwz-docs/docs/`           | `docs-writer`                    |
| Vietnamese content     | `apps/uwz-docs/docs/vi/`        | `docs-writer` + translator       |
| Navigation meta        | `apps/uwz-docs/docs/**/meta.ts` | `astro-blume`                    |
| Site config            | `apps/uwz-docs/blume.config.ts` | `astro-blume`                    |
| Components             | `apps/uwz-docs/components/`     | `svelte-engineer` / `ui-stylist` |
| Shared docs components | `packages/docs-components/`     | `svelte-engineer`                |
| Root tests             | `tests/`                        | `verification`                   |
| CI                     | `.github/workflows/`            | `verification`                   |
| This plan              | `uWZ-TODO.md`                   | `docs-writer` + `integrator`     |

### 11.2 Content pipeline

```text
uWebZockets source and docs
        |
        v
content brief and source map
        |
        v
English MDX + meta.ts + redirects
        |
        v
Blume content graph -> Astro -> HTML, search, llms, Markdown, JSON
        |
        v
validate -> build -> audit -> link/search/accessibility tests
        |
        v
preview -> review -> merge -> deploy
```

### 11.3 Required local commands

Run from the repository root:

```sh
pnpm install
pnpm exec vp run uwz-docs#doctor
pnpm exec vp run uwz-docs#check
pnpm exec vp run uwz-docs#test
pnpm exec vp run uwz-docs#build
pnpm --filter uwz-docs exec blume validate --strict
pnpm --filter uwz-docs exec blume audit --fail-on warning
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
```

Add these scripts to `apps/uwz-docs/package.json` during M0:

```json
{
  "scripts": {
    "audit": "blume build && blume audit --fail-on warning",
    "validate:strict": "blume validate --strict"
  }
}
```

Do not add a second build system. Blume owns the build; Vite+ owns the task
runner; Oxfmt/Oxlint own format and lint.

### 11.4 CI jobs

| Job                   | Trigger                  | Command                                               | Blocks merge                        |
| --------------------- | ------------------------ | ----------------------------------------------------- | ----------------------------------- |
| Docs doctor           | PR touching docs/app     | `pnpm exec vp run uwz-docs#doctor`                    | Yes                                 |
| Docs check            | PR touching docs/app     | `pnpm exec vp run uwz-docs#check`                     | Yes                                 |
| Docs validate         | PR touching docs/app     | `pnpm --filter uwz-docs exec blume validate --strict` | Yes                                 |
| Docs build            | PR touching docs/app     | `pnpm exec vp run uwz-docs#build`                     | Yes                                 |
| Docs audit            | PR touching docs/app     | `blume audit --fail-on warning`                       | Yes                                 |
| Search smoke          | PR touching docs content | `pnpm test -- tests/docs`                             | Yes                                 |
| Snippet compile       | PR touching code fences  | `sh scripts/check-docs-snippets.sh`                   | Yes                                 |
| Link check (external) | Scheduled/nightly        | `blume validate --external --ignore ...`              | No, opens issue                     |
| Redirect check        | Scheduled/nightly        | `blume audit --url <production>`                      | No, opens issue                     |
| Lighthouse            | PR touching docs app     | Lighthouse CI on four routes                          | Warn at launch, block on regression |
| i18n parity           | PR touching MDX          | `pnpm i18n:check` plus page-count test                | Yes                                 |

The docs jobs must not run on unrelated code-only PRs unless they are cheap and
cached. Use path filters; do not make every code PR wait for a full docs build.

### 11.5 Code sample harness

Blume never compiles or runs a fence. Add a harness in three stages:

**Stage 1: fence inventory.**

- Parse every `.mdx` file.
- Record fence language, title, line count, and whether it is marked
  `runnable`, `excerpt`, or `illustrative` in a sidecar manifest.
- Fail on unknown languages and on a `zig` fence without a class.

**Stage 2: canonical files.**

- Store full programs under `docs/snippets/` in the uWebZockets repository or
  under `apps/uwz-docs/snippets/` in the websites repository.
- Generate the MDX fence from the file, or compare the fence against the file
  byte-for-byte.
- Compile every runnable Zig file with `zig build-exe` or a generated test
  harness against the pinned package.
- Compile C and C++ samples against `include/uWebZockets.h`.
- Validate JSON, YAML, and TOML samples parse.

**Stage 3: behavior tests.**

- Run the quickstart and first-server tutorials against a loopback server and
  assert the documented `curl` output.
- Run WebSocket echo, JSON-RPC, TLS, cluster, and HTTP/3 smoke tests where the
  host supports them.
- Keep expected outputs in fixtures, not in prose only.

The harness must be deterministic and skippable only with an explicit host
capability check, never silently.

### 11.6 API reference generator spike

The Zig API is the largest reference surface. Do not hand-maintain 100
signatures in MDX. Run a one-week spike before M5:

1. Try Zig's built-in documentation output for `src/root.zig` and the exported
   modules. Record the command, output format, and whether it includes doc
   comments and source links.
2. If the built-in output is usable, host it under `/reference/zig` or generate
   MDX from its JSON/HTML. Keep a stable URL and search integration.
3. If it is not usable, generate a JSON index from a small Zig program that
   reflects the public declarations and their doc comments, then render MDX.
4. In either case, add a drift check: the generated index must match
   `src/root.zig` exports and fail when a public name is missing from the site.
5. Do not document internal modules as public API. The supported surface is the
   set exported by `src/root.zig`; the C ABI is a separate, smaller surface.

Decision criteria:

- Build-time cost under 60 seconds.
- Stable anchors for types and functions.
- Source links to the exact file.
- No hand-edited generated output.
- Works in the static build.

### 11.7 Link, redirect, and anchor checks

- `blume validate --strict` is the local gate.
- `blume audit --fail-on warning` is the built-site gate.
- Nightly `blume validate --external` checks outbound links with an ignore list
  for rate-limited hosts.
- Every redirect is tested by requesting the old route in `blume preview` or
  against production.
- Anchors are pinned for headings referenced across pages.
- A page rename requires a redirect, a link update, and a search-index check.

### 11.8 Drift checks

| Drift                    | Check                                              |
| ------------------------ | -------------------------------------------------- |
| Public API changed       | Generated API index vs `src/root.zig`              |
| `ServerConfig` changed   | Reference table fixture vs `src/router/config.zig` |
| Error names changed      | Error index vs source error sets                   |
| C ABI changed            | Header snapshot vs `include/uWebZockets.h`         |
| Feature matrix changed   | Matrix vs `src/root.zig` and `docs/roadmap.md`     |
| Example changed          | Example page snippet vs `examples/*.zig`           |
| Changelog changed        | `/changelog` source vs `CHANGELOG.md`              |
| Platform support changed | Platform page vs CI workflows and roadmap          |

Run drift checks weekly and on every uWebZockets release. A release is not
complete until the docs site reflects it.

### 11.9 Previews

- Every docs PR gets a preview deployment if the host supports it.
- The preview must include search, Markdown mirrors, and redirects, not just
  static HTML.
- The reviewer checks the preview on mobile and desktop before merge.
- A preview URL is not indexed; set `X-Robots-Tag: noindex` or the host's
  preview protection.

### 11.10 Deployment

Recommended default: static output on Cloudflare Pages, Vercel, or Netlify.
Static output keeps search local, serves `llms.txt` and `.md` mirrors, and needs
no server. If MCP or the assistant is approved, switch to a server adapter in a
separate change with its own security review.

Deployment checklist:

- [ ] `deployment.site` set to the production origin.
- [ ] Build command `blume build`, output `dist`.
- [ ] Node version compatible with Blume and the workspace.
- [ ] Headers for `.md`, `.txt`, and `.well-known` content types.
- [ ] Redirects emitted for the host, not only meta-refresh pages.
- [ ] Search index present.
- [ ] `llms.txt`, `llms-full.txt`, `agent-readability.json` present.
- [ ] Sitemap and robots present and correct.
- [ ] Preview deployments noindexed.
- [ ] Rollback to the previous static build tested.
- [ ] Post-deploy audit with `blume audit --url`.

## 12. Milestones

The estimates assume one full-time docs engineer plus part-time reviews from the
framework owner, one protocol specialist per section, and a translator for
Vietnamese. They are working estimates, not commitments. Do not start a later
milestone by skipping an earlier exit criterion; the later content depends on
the same source-of-truth decisions.

### 12.1 Milestone summary

| Milestone | Theme                   | Target    |  Pages shipped | Exit gate                                               |
| --------- | ----------------------- | --------- | -------------: | ------------------------------------------------------- |
| M0        | Foundation              | 1 week    |              0 | IA, templates, redirects, CI, and pilot page approved   |
| M1        | First success           | 1-2 weeks |          20-24 | Clean checkout reaches a running server in ten minutes  |
| M2        | HTTP and WebSocket      | 2-3 weeks |          45-55 | Every P0 HTTP/WS page live, examples verified           |
| M3        | Protocols and types     | 2-3 weeks |          35-45 | H2/H3/RPC/type-safety/client coverage complete          |
| M4        | Operate and secure      | 2-3 weeks |          45-55 | Production checklist executable, security review passed |
| M5        | Reference and migration | 2 weeks   |          40-50 | API drift gate, cookbook, migration, examples           |
| M6        | Launch hardening        | 1 week    |          0 new | Audit, search, a11y, performance, i18n, analytics clean |
| M7        | Sustainment             | ongoing   | release-driven | Every release updates docs before the tag is announced  |

### 12.2 M0: Foundation

Scope:

- Lock the URL scheme, redirect map, tab model, sidebar groups, and page IDs.
- Add `meta.ts` skeletons and section `index.mdx` files with `Planned` content.
- Add the frontmatter contract, page templates, and page brief.
- Add the docs scripts to `package.json` and the CI path filter.
- Add the feature matrix seed and the source map.
- Write one pilot page end to end: `Motivation`.
- Run `blume doctor`, `check`, `validate --strict`, `build`, and `audit`.

Deliverables:

- `apps/uwz-docs/docs/**/meta.ts` skeleton for every top-level section.
- `apps/uwz-docs/docs/docs/...` directory tree with index pages.
- `blume.config.ts` tabs and redirects staged behind existing targets.
- `tests/docs/` category with navigation, frontmatter, and feature-matrix tests.
- `apps/uwz-docs/docs/snippets/` or an agreed external snippet location.
- A signed-off page brief and review rubric.

Exit criteria:

- `blume doctor` reports the expected page count and no configuration errors.
- Every redirect target exists.
- The pilot page passes every global definition-of-done item.
- The CI docs jobs run on a docs-only PR and are green.
- The product owner approves the page register and P0 list.

Evidence:

```sh
pnpm exec vp run uwz-docs#doctor
pnpm exec vp run uwz-docs#check
pnpm --filter uwz-docs exec blume validate --strict
pnpm exec vp run uwz-docs#build
pnpm --filter uwz-docs exec blume audit --fail-on warning
```

### 12.3 M1: First success

Scope:

- `/docs` documentation home.
- `What is µWebZockets`, `Why µWebZockets`.
- Getting Started: motivation, philosophy, installation, quickstart, project
  structure, first HTTP, first WebSocket, first JSON-RPC, examples tour, FAQ,
  glossary.
- Concepts core: application model, request lifecycle, response lifecycle,
  routing, handler shapes, ownership, capacity, zero allocation, type safety.
- Examples: hello world.
- Vietnamese mirrors for all P0 pages in this milestone.

Exit criteria:

- A clean checkout reaches `curl` output in ten minutes.
- The quickstart is tested on Linux; macOS is checked or explicitly noted.
- Every first-server code sample compiles.
- Search returns the quickstart, installation, routing, and capacity pages for
  their canonical queries.
- No link sends the reader to GitHub for a topic that the site now owns.
- `blume audit --fail-on warning` is clean for the new pages.

Evidence:

- Recorded terminal transcript for the quickstart.
- Snippet harness output.
- Search QA results.
- Preview screenshots at 375 px and 1280 px.

### 12.4 M2: HTTP and WebSocket

Scope:

- Every P0/P1 HTTP page in Section 5.4.
- Every P0/P1 Helpers page in Section 5.4.1.
- Every P0/P1 WebSocket page in Section 5.5.
- HTTP/1.1 limits, errors, auth, rate limit, CORS, security headers, static
  files, streaming, SSE, JSON, OpenAPI, QUERY, TRACE.
- Helpers: query/forms, multipart, cookies, compression, caching, content
  negotiation, fetch/streams/abort, and WebSocket stream adapters.
- WebSocket handshake, messages, backpressure, compression, heartbeats, close
  codes, pub/sub, HTTP/2 tunnels, security, limits.
- Examples: HTTPS, shared-nothing cluster, basic microservice, chat server.

Exit criteria:

- Every public HTTP helper is documented in HTTP, Helpers, or `Reference`.
- Every WebSocket callback and send path is documented with ownership.
- Every limit table matches `ServerConfig`.
- Every send/backpressure sample handles `error.WouldBlock`.
- Autobahn and HTTP/1.1 claims are linked to evidence.
- At least three guides use the new HTTP/WS pages as prerequisites.

### 12.5 M3: Protocols and types

Scope:

- HTTP/2 section.
- HTTP/3 and QUIC section, with WebTransport clearly marked helper-only.
- JSON-RPC section.
- Type-safety section.
- Client section.
- Examples: RPC server, HTTP/3 server.

Exit criteria:

- Every feature matrix row for H2/H3/RPC/type/client has an owner page.
- The HTTP/3 page states the metrics gap, no clustering, no live WebTransport,
  and no 0-RTT.
- The client page states every deliberate omission.
- The type-safety page has no TypeScript inference claim.
- JSON-RPC typed and raw paths are both documented.
- H2/H3 test evidence is linked.

### 12.6 M4: Operate and secure

Scope:

- TLS and security section.
- Architecture and internals.
- Performance model and capacity sizing.
- Operations: build, test, sanitizers, fuzzing, cross, C ABI, releases,
  dependencies, platforms, logging, metrics, shutdown, troubleshooting.
- Deployment: checklist, TLS, capacity, hardening, observability, shutdown,
  systemd, Docker, Kubernetes, reverse proxy, HTTP/3, Windows, BSD.
- Project security page.

Exit criteria:

- The production checklist can be executed from top to bottom.
- Every security default is sourced to code or `SECURITY.md`.
- The C ABI page matches `include/uWebZockets.h`.
- The platform table matches CI and `docs/roadmap.md`.
- No page claims hot certificate reload, HTTP/3 clustering, or Windows official
  support.
- The security reviewer signs off on the TLS, mTLS, early-data, auth, and
  WebSocket security pages.

### 12.7 M5: Reference, guards, migration, and examples

Scope:

- API reference generator spike and decision.
- `ServerConfig`, limits, errors, C ABI, build steps, feature matrix,
  compatibility, protocol matrix, glossary.
- Guides/cookbook P0/P1.
- Migration pages.
- Every example page.
- Project roadmap, changelog, contributing, license, dependencies, ADRs,
  benchmarks, support.

Exit criteria:

- API drift check fails when a public export is missing.
- `ServerConfig` and limits tables are generated or fixture-checked.
- Every example page matches its source file.
- The migration page names exact APIs and links to changelog entries.
- The changelog route is current.
- The feature matrix has no empty cell for a supported feature.

### 12.8 M6: Launch hardening

Scope:

- Full i18n parity for P0 pages.
- Search tuning and zero-result review.
- SEO, OG images, sitemap, robots, canonical, `deployment.site`.
- Agent surface: `llms.txt` details, `.md` mirrors, JSON API, readiness manifest,
  MCP decision.
- Accessibility audit and fixes.
- Performance budgets and Lighthouse.
- Analytics/privacy decision and implementation.
- Redirect verification.
- Final content freeze and launch checklist.

Exit criteria:

- `blume validate --strict` and `blume audit --fail-on warning` are clean on the
  production build.
- All P0 pages have en and vi.
- Search QA table passes.
- Lighthouse and manual accessibility pass.
- No P0 page is `Draft` or `Planned`.
- The launch checklist is signed by docs, product, security, and verification.
- Rollback is tested.

### 12.9 M7: Sustainment

Scope:

- Every uWebZockets release updates changelog, migration, limits, errors, feature
  matrix, platform table, and any changed protocol page before the tag is
  announced.
- Cut a docs version at the next minor release after launch.
- Quarterly link rot, search, analytics, accessibility, and source-drift review.
- Monthly review of support questions and docs issues.
- Deprecation pages and redirects.

Exit criteria:

- Release checklist includes docs.
- Docs version switcher works for the archived snapshot.
- No broken link older than 30 days.
- No search query with more than five zero-result hits in a month without a
  triage note.

### 12.10 Critical path

```text
M0 IA + templates
  -> M1 quickstart + concepts
  -> M2 HTTP + WebSocket
  -> M3 H2/H3/RPC/type/client
  -> M4 security + operations
  -> M5 reference + guides + migration
  -> M6 audit + i18n + launch
  -> M7 release sync
```

The API reference spike runs in parallel with M2 and must finish before M5. The
translation pipeline runs in parallel with M2-M5; it is not a launch-week task.
The search and agent-surface work starts in M4, not M6, because both depend on
the final page titles and tags.

## 13. Cross-cutting task queue

These tasks are not page-specific. Assign one owner and one reviewer per task.

| ID     | Task                                                                              | Priority | Milestone | Owner                               | Acceptance                              |
| ------ | --------------------------------------------------------------------------------- | -------- | --------- | ----------------------------------- | --------------------------------------- |
| TD-001 | Add the `/docs`, `/reference`, `/examples` directory skeleton and `meta.ts` files | P0       | M0        | `astro-blume`                       | `blume doctor` sees every group         |
| TD-002 | Add redirects for the `/getting-started` move                                     | P0       | M0        | `astro-blume`                       | `blume validate` and `audit` clean      |
| TD-003 | Add tabs for Docs, Reference, Examples, Changelog                                 | P0       | M0        | `astro-blume`                       | No tab points at a 404                  |
| TD-004 | Add docs scripts and path-filtered CI jobs                                        | P0       | M0        | `verification`                      | A docs-only PR runs every gate          |
| TD-005 | Add frontmatter/navigation tests under `tests/docs/`                              | P0       | M0        | `verification`                      | Missing title/description fails         |
| TD-006 | Build the code-sample manifest and compile harness                                | P0       | M1        | `verification`                      | Runnable samples compile in CI          |
| TD-007 | Add example-page synchronization                                                  | P1       | M5        | `verification`                      | Example source and page cannot drift    |
| TD-008 | API reference generator spike                                                     | P0       | M3        | `astro-blume` + `dx_router`         | Decision recorded; drift check designed |
| TD-009 | Generate `ServerConfig` and limits tables                                         | P0       | M5        | `dx_router`                         | Defaults match source                   |
| TD-010 | Generate the error index from source                                              | P1       | M5        | `dx_router`                         | No stale error name                     |
| TD-011 | Add C ABI header snapshot test                                                    | P0       | M5        | `ffi_edge`                          | Header and page stay in sync            |
| TD-012 | Add search synonyms, tags, and popular pages                                      | P1       | M4        | `docs-writer`                       | Search QA table passes                  |
| TD-013 | Add search index tests                                                            | P1       | M4        | `verification`                      | Canonical queries hit intended pages    |
| TD-014 | Add `deployment.site`, sitemap, robots, canonical, OG plan                        | P0       | M6        | `astro-blume`                       | Audit has no SEO warnings               |
| TD-015 | Add Vietnamese translation workflow and parity test                               | P0       | M1        | `docs-writer`                       | P0 pages mirrored                       |
| TD-016 | Add accessibility checks and manual audit                                         | P0       | M6        | `ui-stylist`                        | WCAG 2.2 AA checklist signed            |
| TD-017 | Add performance budgets and Lighthouse run                                        | P1       | M6        | `verification`                      | Budgets met on four routes              |
| TD-018 | Decide analytics/privacy and implement                                            | P1       | M6        | `docs-writer` + `security-reviewer` | No undeclared tracking                  |
| TD-019 | Configure `llms.txt` details, `.md` mirrors, discovery manifest                   | P1       | M6        | `astro-blume`                       | Artifacts present and current           |
| TD-020 | Decide static vs server for MCP/assistant                                         | P1       | M6        | `architect`                         | Decision recorded; no static MCP claim  |
| TD-021 | Add release docs checklist to the uWebZockets release process                     | P1       | M5        | `integrator`                        | Release cannot close without docs       |
| TD-022 | Add versioning plan and cut the first snapshot                                    | P2       | M7        | `astro-blume`                       | Switcher and canonical work             |
| TD-023 | Add changelog integration                                                         | P1       | M5        | `docs-writer`                       | `/changelog` is current                 |
| TD-024 | Add quarterly docs health review                                                  | P2       | M7        | `integrator`                        | Review recorded with actions            |
| TD-025 | Create the Helpers hub, move utility pages, and enforce the boundary rules        | P1       | M2        | `docs-writer`                       | Index complete; no duplicate pages      |
| TD-026 | Review the Helpers boundary every release and remove accidental overlap           | P2       | M7        | `docs-writer`                       | No helper duplicates a protocol page    |

## 14. Risks and mitigations

| Risk                                      | Impact                                | Likelihood     | Mitigation                                                                                         |
| ----------------------------------------- | ------------------------------------- | -------------- | -------------------------------------------------------------------------------------------------- |
| Source drift between site and uWebZockets | Wrong signatures and limits           | High           | Source map, generated reference, weekly drift checks, release checklist                            |
| Unsupported features presented as live    | Broken trust, support load            | Medium         | Feature matrix, status badges, mandatory boundary links, reviewer checklist                        |
| Scope too large for one launch            | Nothing ships                         | High           | P0 gate, milestone exits, defer P2 explicitly, one section at a time                               |
| Translation debt                          | Vietnamese readers get half a site    | High           | P0 translation gate, staged P1 policy, translator in M1                                            |
| URL churn                                 | Broken external links and SEO loss    | Medium         | Lock `/docs` before launch, redirects, no renames without a redirect                               |
| AI-generated prose with invented facts    | Reputational and technical damage     | High           | Source-first agent contract, reviewer sign-off, snippet harness, no publish without evidence       |
| Code samples rot                          | Readers copy broken code              | High           | Canonical snippet files, compile harness, example sync test                                        |
| Reference generator fails                 | API surface remains incomplete        | Medium         | Spike in M3, fallback to generated JSON index, hand-written P0 subset                              |
| Search noise                              | Readers cannot find the right page    | Medium         | Controlled tags, synonyms, popular pages, QA table, zero-result review                             |
| Helpers becomes a junk drawer             | Duplicate pages and blurred ownership | Medium         | Section 4.7 boundaries, one canonical page per topic, release review, no protocol pages in Helpers |
| Design inconsistency                      | Site feels assembled                  | Medium         | Reuse tokens and components, one visual reviewer, page anatomy contract                            |
| Build time grows with 200+ pages          | Slow CI and previews                  | Medium         | Incremental builds, path filters, cache, monitor build duration                                    |
| Static host cannot support MCP            | Broken agent claim                    | Medium         | Decide hosting before enabling MCP; static launch publishes llms/md only                           |
| Security misinformation                   | Unsafe deployment                     | Low but severe | Security review of TLS/auth/CORS/rate-limit pages, link to `SECURITY.md`                           |
| Benchmark claims without evidence         | Loss of credibility                   | Medium         | Evidence policy, no absolute numbers, link artifacts                                               |
| Single owner bottleneck                   | Stalls                                | Medium         | Page briefs, reviewer rotation, specialist assignments                                             |
| Legal or license drift                    | Compliance issue                      | Low            | Link to repository `LICENSE` and `THIRD_PARTY_NOTICES.md`; do not restate terms                    |

## 15. Open decisions

| Decision             | Recommended default                                       | Why                                 | Owner         | Needed by |
| -------------------- | --------------------------------------------------------- | ----------------------------------- | ------------- | --------- |
| Production origin    | `https://uwz.farben.dev` or the final project domain      | Required for sitemap, canonical, OG | Product owner | M0        |
| Hosting              | Cloudflare Pages or Vercel static                         | Static, fast, previews, redirects   | `astro-blume` | M0        |
| Analytics            | Cookie-free Plausible/Fathom/Umami                        | Privacy, no consent banner          | Product owner | M6        |
| MCP/assistant        | Defer until a server host is approved                     | Static build cannot serve `/mcp`    | `architect`   | M6        |
| Reference generation | Zig docs output if usable; otherwise generated JSON index | Avoid hand-maintained signatures    | `dx_router`   | M3        |
| Versioning           | Launch unversioned; cut `v2.1.6` when 2.2.0 ships         | Avoid empty version noise at launch | `docs-writer` | M7        |
| Translation depth    | P0 fully mirrored; P1 within one milestone                | Balances quality and speed          | `docs-writer` | M1        |
| Changelog source     | `CHANGELOG.md` as canonical, site renders a summary       | One source of truth                 | `docs-writer` | M5        |
| Docs owner           | `docs-writer` with `dx_router` product review             | Clear accountability                | `architect`   | M0        |
| Launch scope         | All P0 rows plus P1 rows needed for navigation            | Prevents a hollow site              | `integrator`  | M6        |

If a decision is not made by its needed-by milestone, record the blocker in the
milestone dashboard and continue with the recommended default. Do not silently
ship a different assumption.

## 16. Governance and ownership

### 16.1 Ownership matrix

| Surface                         | Accountable         | Responsible       | Consulted           | Informed      |
| ------------------------------- | ------------------- | ----------------- | ------------------- | ------------- |
| Product narrative and claims    | `dx_router`         | `docs-writer`     | `architect`         | `integrator`  |
| Page prose and examples         | `docs-writer`       | `docs-writer`     | protocol specialist | `reviewer`    |
| URL, navigation, Blume config   | `astro-blume`       | `astro-blume`     | `docs-writer`       | `integrator`  |
| Svelte islands and components   | `svelte-engineer`   | `svelte-engineer` | `ui-stylist`        | `docs-writer` |
| Visual design and accessibility | `ui-stylist`        | `ui-stylist`      | `docs-writer`       | `reviewer`    |
| Verification and CI             | `verification`      | `verification`    | `integrator`        | `docs-writer` |
| Security content                | `security-reviewer` | `docs-writer`     | `crypto_tls`        | `integrator`  |
| API reference accuracy          | `dx_router`         | `docs-writer`     | module owners       | `reviewer`    |
| Release docs                    | `integrator`        | `docs-writer`     | module owners       | community     |

### 16.2 Change process

1. A docs change starts from a page ID or a TD task.
2. The writer records the source of truth and the acceptance criteria.
3. A protocol specialist reviews technical accuracy for any page that names
   wire behavior, limits, errors, or security defaults.
4. `ui-stylist` reviews new layouts or components; `svelte-engineer` implements
   islands; `security-reviewer` reviews security claims.
5. `reviewer` checks the diff against the page contract and reports findings
   with file and line references.
6. `integrator` checks the combined diff, evidence, and milestone exit.
7. Merge only when the docs gates are green and the page row is updated.

### 16.3 Source-change protocol

When a public API, limit, error, or platform claim changes in uWebZockets:

- Update the owning repository doc and the website page in the same release
  window. If the website lags, mark the page `Draft` and add a banner rather than
  publishing a stale fact.
- Update the feature matrix, reference table, and any code sample.
- Add a changelog entry with the migration action.
- Re-run the drift checks.
- Announce the release only after the docs build is green.

### 16.4 Release docs checklist

- [ ] Changelog entry written and linked.
- [ ] Migration page updated.
- [ ] Limits, errors, `ServerConfig`, and C ABI reference updated.
- [ ] Feature matrix updated.
- [ ] Platform support table updated.
- [ ] Affected examples rebuilt.
- [ ] Search index and llms artifacts rebuilt.
- [ ] Redirects added for renamed pages.
- [ ] Version snapshot cut if this is a minor release.
- [ ] Post-deploy audit clean.

### 16.5 Issue labels

Use or add these labels in the websites repository:

`docs`, `docs/accuracy`, `docs/accessibility`, `docs/i18n`, `docs/search`,
`docs/reference`, `docs/security`, `docs/code-sample`, `docs/milestone`,
`docs/p0`, `docs/p1`, `docs/p2`.

Assign every docs PR an owner and at least one existing repository label.

## 17. Templates

### 17.1 Folder meta

```ts
import { defineMeta } from "blume";

export default defineMeta({
  title: "HTTP/1.1 and the application API",
  icon: "route",
  order: 4,
  directory: "card",
  pages: [
    "index",
    "server-lifecycle",
    "routing",
    "route-parameters",
    "request",
    "response",
    "helpers",
    "middleware",
    "errors",
    "limits",
  ],
});
```

Keep the `pages` array complete. A page missing from `pages` still builds but
falls to alphabetical order, which breaks the intended reading flow.

### 17.2 Redirects

```ts
redirects: [
  { from: "/getting-started", to: "/docs/getting-started", status: 301 },
  { from: "/getting-started/:slug*", to: "/docs/getting-started/:slug*", status: 301 },
  { from: "/vi/getting-started", to: "/vi/docs/getting-started", status: 301 },
],
```

Verify pattern syntax against the installed Blume version before shipping. Do
not use a wildcard form the host adapter cannot express.

### 17.3 Pull request checklist

- [ ] Page ID and milestone are named in the PR body.
- [ ] The page has one reader goal and a next step.
- [ ] Every technical claim has a source.
- [ ] Every code fence has a language and the sample class is recorded.
- [ ] Runnable samples are in the harness and compile.
- [ ] English and Vietnamese status is recorded.
- [ ] `blume validate --strict` and `blume audit --fail-on warning` pass.
- [ ] Search finds the page by title and a body phrase.
- [ ] Mobile and desktop preview checked.
- [ ] Accessibility and reduced motion checked.
- [ ] No unsupported feature, secret, emoji, or filler.
- [ ] Page row and milestone dashboard updated.
- [ ] Reviewer sign-off recorded.

### 17.4 Launch checklist

- [ ] All P0 pages `Live` in English and Vietnamese.
- [ ] Navigation has no dead tabs or empty groups.
- [ ] `/docs`, `/reference`, `/examples`, `/changelog` resolve.
- [ ] `/getting-started` redirects to `/docs/getting-started`.
- [ ] `deployment.site` is set.
- [ ] Sitemap, robots, canonical, OG, and JSON-LD validate.
- [ ] `llms.txt`, `llms-full.txt`, `.md` mirrors, and discovery manifest exist.
- [ ] Search QA table passes.
- [ ] Search zero-result baseline recorded.
- [ ] WCAG 2.2 AA manual and automated checks pass.
- [ ] Lighthouse budgets pass on four representative routes.
- [ ] 404 page links to docs home and search.
- [ ] Analytics/privacy decision implemented.
- [ ] Security reviewer signs off on TLS, auth, CORS, rate limit, and WebSocket.
- [ ] C ABI reference matches the header.
- [ ] Feature matrix has no unsupported claim.
- [ ] Rollback tested.
- [ ] Post-deploy `blume audit --url` clean.
- [ ] Announcement links to the docs home, not the repository.

### 17.5 Agent handoff report

Use this exact shape in the subagent result:

```text
Task:
Changed files:
What changed:
Sources verified:
Commands run:
Outcomes:
Known gaps:
Next task:
```

Do not claim a command passed unless its output is in the report. Do not mark a
page `Live` if a command was skipped.

## 18. Appendices

### 18.1 Appendix A: feature coverage matrix

Status vocabulary: `Supported`, `Helper-only`, `Experimental`,
`Platform-gated`, `Not supported`.

| Feature                                               | Status                               | Public surface                                 | Owner page                                   | Evidence                          |
| ----------------------------------------------------- | ------------------------------------ | ---------------------------------------------- | -------------------------------------------- | --------------------------------- |
| `App(N)`, `ConfiguredApp`, `ConfiguredAppWithTimeout` | Supported                            | `uz.App`, `uz.ConfiguredApp`                   | `/docs/concepts/application-model`           | `src/router/app.zig`              |
| Fluent `Server.builder`                               | Supported                            | `uz.Server`                                    | `/docs/http/server-lifecycle`                | `src/router/builder.zig`          |
| Thread-per-core cluster                               | Supported                            | `uz.Server.builder(...).build_cluster`         | `/docs/concepts/cluster-model`               | `docs/architecture.md`            |
| Cluster TLS                                           | Supported                            | `enable_https`, `enable_https_ephemeral`       | `/docs/security/tls-clusters`                | `docs/tls.md`                     |
| HTTP/1.1 parsing and routing                          | Supported                            | `Request`, `Response`, router                  | `/docs/http`                                 | `docs/http.md`, h1spec            |
| HTTP/1.1 pipelining                                   | Supported                            | transparent                                    | `/docs/http`                                 | `docs/http.md`                    |
| Static files                                          | Supported                            | `App.static`, `static_files`                   | `/docs/http/static-files`                    | `src/http/static_files.zig`       |
| Streaming response                                    | Supported                            | `begin_stream`, `StreamProducer`               | `/docs/http/streaming`                       | `src/http/response.zig`           |
| Chunked response                                      | Supported                            | `begin_chunked`, `write_chunk`                 | `/docs/http/chunked`                         | `src/http/response.zig`           |
| SSE                                                   | Supported                            | `Response.sse`                                 | `/docs/http/server-sent-events`              | `src/http/response.zig`           |
| JSON helpers                                          | Supported                            | `json`, `json_buf`, `begin_json`               | `/docs/http/json`                            | `src/http/response.zig`           |
| Schema validation                                     | Supported                            | `uz.schema`                                    | `/docs/type-safety/schema-validation`        | `src/http/schema.zig`             |
| Query/form parsing                                    | Supported                            | `query`, `form`, `Request` helpers             | `/docs/http/helpers/query-and-forms`         | `src/http/query.zig`              |
| Multipart parsing                                     | Supported                            | `uz.multipart`                                 | `/docs/http/helpers/multipart`               | `src/http/multipart.zig`          |
| Cookies and signing                                   | Supported                            | `uz.cookie`, `Response.set_cookie`             | `/docs/http/helpers/cookies`                 | `src/http/cookie.zig`             |
| Gzip response                                         | Supported                            | `Response.end_gzip`                            | `/docs/http/helpers/compression`             | `src/http/response.zig`           |
| Compression streams and pool                          | Supported                            | `uz.compression_stream`, `uz.compression_pool` | `/docs/http/helpers/compression`             | `src/http/compression_stream.zig` |
| Fetch/Streams/abort primitives                        | Supported                            | `uz.fetch`, `uz.streams`, `uz.abort`           | `/docs/http/helpers/fetch-streams-and-abort` | `src/http/fetch.zig`              |
| ETag/cache helpers                                    | Supported                            | `uz.cache`                                     | `/docs/http/helpers/caching`                 | `src/http/cache.zig`              |
| Content negotiation                                   | Supported                            | `uz.negotiate`                                 | `/docs/http/helpers/content-negotiation`     | `src/http/negotiate.zig`          |
| CORS                                                  | Supported                            | `middleware.Cors`                              | `/docs/http/cors`                            | `src/http/middleware.zig`         |
| Security headers                                      | Supported                            | `middleware.SecurityHeaders`                   | `/docs/http/security-headers`                | `src/http/middleware.zig`         |
| Basic/Bearer auth                                     | Supported                            | `middleware.Auth`                              | `/docs/http/authentication`                  | `src/http/middleware.zig`         |
| Rate limiting                                         | Supported                            | `middleware.RateLimit`                         | `/docs/http/rate-limiting`                   | `src/http/middleware.zig`         |
| OpenAPI output                                        | Supported                            | `App.openapi`                                  | `/docs/http/openapi`                         | `src/http/openapi.zig`            |
| RFC 10008 `QUERY`                                     | Supported                            | `App.query`                                    | `/docs/http/query-method`                    | `docs/quic.md`                    |
| `TRACE`                                               | Supported, opt-in                    | `App.trace`                                    | `/docs/http/trace`                           | `docs/roadmap.md`                 |
| WebSocket server                                      | Supported                            | `App.ws`, `WebSocket`                          | `/docs/websocket`                            | Autobahn                          |
| RFC 7692 compression                                  | Supported                            | `WsBehavior.compression`                       | `/docs/websocket/compression`                | `docs/websocket.md`               |
| WebSocket pub/sub                                     | Supported                            | `subscribe`, `publish`                         | `/docs/websocket/pub-sub`                    | `docs/websocket.md`               |
| WebSocket stream adapters                             | Supported                            | `WebSocketStream`, `NativeWebSocketStream`     | `/docs/http/helpers/websocket-streams`       | `src/ws/stream.zig`               |
| Cluster pub/sub                                       | Supported                            | `Cluster.publish`                              | `/docs/websocket/cluster-pub-sub`            | ADR 0007                          |
| RFC 8441 HTTP/2 tunnel                                | Supported, one per connection        | extended CONNECT                               | `/docs/websocket/http2-tunnels`              | `docs/http2.md`                   |
| WebSocket client                                      | Not supported                        | none                                           | `/docs/websocket`                            | roadmap                           |
| WebSocket origin/subprotocol negotiation              | Application-owned                    | `Request` headers                              | `/docs/websocket/security`                   | `docs/websocket.md`               |
| HTTP/2 request routing                                | Supported, bounded                   | `init_https`, plaintext preface                | `/docs/http2`                                | `docs/http2.md`                   |
| HTTP/2 HPACK                                          | Supported, bounded                   | `uz.http2_hpack`                               | `/docs/http2/hpack`                          | `src/http2/hpack.zig`             |
| HTTP/2 flow control                                   | Supported                            | transparent                                    | `/docs/http2/flow-control`                   | `src/http2`                       |
| HTTP/2 server push                                    | Not supported                        | none                                           | `/docs/http2`                                | roadmap                           |
| h2c Upgrade                                           | Not supported                        | prior knowledge only                           | `/docs/http2`                                | roadmap                           |
| HTTP/2 more than 8 streams                            | Not supported without specialization | compile-time                                   | `/docs/http2/limits`                         | roadmap                           |
| HTTP/3 request routing                                | Supported                            | `init_http3`, `listen_udp`                     | `/docs/http3`                                | curl/ngtcp2, aioquic              |
| HTTP/3 QPACK                                          | Supported, bounded                   | `src/quic/stream.zig`                          | `/docs/http3/qpack`                          | `docs/quic.md`                    |
| HTTP/3 0-RTT                                          | Not supported                        | disabled on live listener                      | `/docs/http3/early-data`                     | `docs/quic.md`                    |
| HTTP/3 clustering                                     | Not supported                        | none                                           | `/docs/http3`                                | roadmap                           |
| HTTP/3 metrics parity                                 | Not supported                        | dev log only                                   | `/docs/http3/observability`                  | roadmap                           |
| WebTransport live                                     | Not supported                        | helper models only                             | `/docs/http3/webtransport`                   | ADR 0001                          |
| WebTransport helpers                                  | Helper-only                          | `uz.webtransport`, `uz.http3_extensions`       | `/docs/http3/webtransport`                   | source                            |
| JSON-RPC single call                                  | Supported                            | `Service.dispatch`, `App.rpc`                  | `/docs/json-rpc`                             | `docs/json_rpc.md`                |
| JSON-RPC batch/notification                           | Supported                            | `Service`                                      | `/docs/json-rpc/batches-and-notifications`   | `docs/json_rpc.md`                |
| Typed JSON-RPC                                        | Supported                            | `register_typed`                               | `/docs/json-rpc/typed-procedures`            | `docs/json_rpc.md`                |
| HTTP/1.1 client                                       | Supported, bounded                   | `uz.client`                                    | `/docs/client`                               | `docs/client.md`                  |
| Client DNS                                            | Not supported                        | numeric hosts only                             | `/docs/client/limits`                        | `docs/client.md`                  |
| Client redirects/cookies/proxy/retries                | Not supported                        | none                                           | `/docs/client/limits`                        | `docs/client.md`                  |
| Client mTLS                                           | Not supported                        | none                                           | `/docs/client/tls-trust`                     | `docs/client.md`                  |
| Client HTTP/2/HTTP/3                                  | Not supported                        | none                                           | `/docs/client/limits`                        | `docs/client.md`                  |
| TLS 1.3 termination                                   | Supported                            | `init_https`, `init_https_mtls`                | `/docs/security/tls`                         | `docs/tls.md`                     |
| Ephemeral certificates                                | Supported, development               | `init_https_ephemeral`                         | `/docs/security/ephemeral-certificates`      | `docs/tls.md`                     |
| Production PEM                                        | Supported                            | `init_https`                                   | `/docs/security/production-certificates`     | `docs/tls.md`                     |
| mTLS                                                  | Supported, TCP only                  | `init_https_mtls`                              | `/docs/security/mtls`                        | `docs/tls.md`                     |
| TLS 1.2                                               | Not supported                        | none                                           | `/docs/security/tls`                         | roadmap                           |
| Hot certificate reload                                | Not supported                        | rolling restart                                | `/docs/security/certificate-rotation`        | ADR 0003                          |
| C ABI                                                 | Supported, high-level subset         | `include/uWebZockets.h`                        | `/reference/c-abi`                           | header, C tests                   |
| Metrics registry                                      | Supported on TCP                     | `metrics`, `/metrics`                          | `/docs/operations/metrics`                   | `src/observability`               |
| Development log                                       | Supported                            | `dev_log`, `ServerConfig.enable_dev_log`       | `/docs/operations/logging`                   | `src/observability`               |
| eBPF histogram                                        | Optional                             | `ebpf` build step, pinned map                  | `/docs/operations/ebpf`                      | `docs/operations.md`              |
| kTLS                                                  | Helper-only                          | `uz.ktls`                                      | `/docs/operations/ktls`                      | roadmap                           |
| AF_XDP                                                | Helper-only, data path unwired       | `uz.xdp`, `uz.xdp_transport`                   | `/docs/operations/af-xdp`                    | roadmap                           |
| WASM edge                                             | Supported builds, bounded API        | `wasm-freestanding`, `wasm-wasi`               | `/docs/operations/wasm`                      | `docs/operations.md`              |
| Shared memory / Cap'n Proto                           | Supported module                     | `uz.shared_memory`                             | `/docs/architecture`                         | source                            |
| Web Crypto subset                                     | Supported                            | `uz.crypto_subtle`                             | `/docs/security`                             | source                            |
| Fuzzing                                               | Supported                            | `zig build fuzz`, OSS-Fuzz                     | `/docs/operations/fuzzing`                   | `docs/operations.md`              |
| Windows official support                              | Platform-gated                       | compile plus runtime job                       | `/docs/deployment/windows`                   | ADR 0004, roadmap                 |
| BSD runtime support                                   | Community build only                 | shared graph                                   | `/docs/deployment/bsd`                       | roadmap                           |
| Dynamic capacity growth                               | Not supported                        | fixed slabs                                    | `/docs/concepts/capacity-model`              | roadmap                           |
| Request-body streaming                                | Not supported                        | buffered bodies                                | `/docs/concepts/request-lifecycle`           | roadmap                           |

#### 18.1.1 Public module coverage

Every export in `src/root.zig` must map to at least one page or be explicitly
marked internal. This table is the audit seed; the API reference generator and
the drift check own the exhaustive list.

| Public surface                                                                                | Primary page                                 |
| --------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `App`, `ConfiguredApp`, `ConfiguredAppWithTimeout`, `Server`                                  | `/docs/concepts/application-model`           |
| `ServerConfig`, `Presets`, `SlabLayout`, `TransportMode`                                      | `/reference/server-config`                   |
| `default_idle_timeout_ms`, `http3_available`                                                  | `/reference/server-config`                   |
| `ClusterOptions`, `ClusterState`, `WorkerFailure`, `FailurePhase`, `PublishReport`, `cluster` | `/docs/concepts/cluster-model`               |
| `Request`, `OwnedRequest`                                                                     | `/docs/http/request`                         |
| `Response`, `AsyncResponse`, `AsyncResponseState`, `AsyncResponseStatus`                      | `/docs/http/response`                        |
| `StreamProducer`, `StreamStatus`                                                              | `/docs/http/streaming`                       |
| `JsonStream`                                                                                  | `/docs/http/json`                            |
| `chunked`                                                                                     | `/docs/http/chunked`                         |
| `fetch`                                                                                       | `/docs/http/helpers/fetch-streams-and-abort` |
| `client`                                                                                      | `/docs/client`                               |
| `streams`, `abort`                                                                            | `/docs/http/helpers/fetch-streams-and-abort` |
| `compression_stream`, `compression_pool`                                                      | `/docs/http/helpers/compression`             |
| `multipart`                                                                                   | `/docs/http/helpers/multipart`               |
| `query`, `form`                                                                               | `/docs/http/helpers/query-and-forms`         |
| `cookie`                                                                                      | `/docs/http/helpers/cookies`                 |
| `middleware`                                                                                  | `/docs/http/middleware`                      |
| `schema`                                                                                      | `/docs/type-safety/schema-validation`        |
| `status`, `errors`                                                                            | `/docs/http/errors`                          |
| `negotiate`                                                                                   | `/docs/http/helpers/content-negotiation`     |
| `cache`                                                                                       | `/docs/http/helpers/caching`                 |
| `openapi`                                                                                     | `/docs/http/openapi`                         |
| `static_files`                                                                                | `/docs/http/static-files`                    |
| `json_rpc`                                                                                    | `/docs/json-rpc`                             |
| `ServerSentEvents`                                                                            | `/docs/http/server-sent-events`              |
| `HttpMethod`, `Handler`, `ContextHandler`, `AsyncHandler`, `ContextAsyncHandler`              | `/docs/concepts/handler-shapes`              |
| `MiddlewareResult`, `MiddlewareHandler`                                                       | `/docs/http/middleware`                      |
| `WebSocket`, `WsBehavior`, `WsCompression`, `Opcode`                                          | `/docs/websocket`                            |
| `websocket_mask`, `websocket_backpressure`                                                    | `/docs/websocket/messages`                   |
| `WebSocketStream`, `NativeWebSocketStream`                                                    | `/docs/http/helpers/websocket-streams`       |
| `tls`                                                                                         | `/docs/security/tls`                         |
| `crypto_subtle`                                                                               | `/docs/security`                             |
| `transport`                                                                                   | `/docs/architecture/transports`              |
| `ktls`                                                                                        | `/docs/operations/ktls`                      |
| `xdp`, `xdp_transport`                                                                        | `/docs/operations/af-xdp`                    |
| `metrics`                                                                                     | `/docs/operations/metrics`                   |
| `dev_log`                                                                                     | `/docs/operations/logging`                   |
| `ebpf`                                                                                        | `/docs/operations/ebpf`                      |
| `shared_memory`                                                                               | `/docs/architecture`                         |
| `udp`                                                                                         | `/docs/http3/quic-transport`                 |
| `http2`, `http2_hpack`, `http2_server`                                                        | `/docs/http2`                                |
| `http3_extensions`, `webtransport`, `datagram_ring`, `datagram`                               | `/docs/http3/webtransport`                   |

Any export without a row is either added to the site in the same change or
marked internal in the reference generator. A public name must never be
discoverable only by reading the source.

### 18.2 Appendix B: source-to-site map

| Repository source            | Primary site sections                                                               |
| ---------------------------- | ----------------------------------------------------------------------------------- |
| `README.md`                  | `/docs`, `/docs/getting-started`, `/docs/why-uwebsockets`, `/examples`              |
| `docs/getting_started.md`    | `/docs/getting-started/*`                                                           |
| `docs/api.md`                | `/docs/concepts/*`, `/docs/http/*`, `/docs/websocket/*`, `/docs/security/*`         |
| `docs/http.md`               | `/docs/http/*`                                                                      |
| `docs/http2.md`              | `/docs/http2/*`, `/docs/websocket/http2-tunnels`                                    |
| `docs/quic.md`               | `/docs/http3/*`                                                                     |
| `docs/websocket.md`          | `/docs/websocket/*`                                                                 |
| `docs/json_rpc.md`           | `/docs/json-rpc/*`                                                                  |
| `docs/tls.md`                | `/docs/security/*`, `/docs/deployment/tls`                                          |
| `docs/client.md`             | `/docs/client/*`                                                                    |
| `docs/memory_model.md`       | `/docs/concepts/capacity-model`, `/docs/concepts/backpressure`, `/reference/limits` |
| `docs/architecture.md`       | `/docs/architecture/*`, `/docs/concepts/shared-nothing`                             |
| `docs/callback_lifecycle.md` | `/docs/architecture/callback-lifecycle`                                             |
| `docs/operations.md`         | `/docs/operations/*`                                                                |
| `docs/deployment.md`         | `/docs/deployment/*`                                                                |
| `docs/troubleshooting.md`    | `/docs/operations/troubleshooting`                                                  |
| `docs/protocols.md`          | `/reference/protocol-matrix`                                                        |
| `docs/roadmap.md`            | `/docs/project/roadmap`, `/reference/compatibility`                                 |
| `docs/dependency_forks.md`   | `/docs/operations/dependencies`, `/docs/project/dependencies`                       |
| `CODEBASE.md`                | `/docs/architecture/*`, `/docs/concepts/*`                                          |
| `CHANGELOG.md`               | `/changelog`, `/docs/migration/*`                                                   |
| `SECURITY.md`                | `/security`, `/docs/security/*`                                                     |
| `CONTRIBUTE.md`              | `/contributing`                                                                     |
| `CI_CD_PIPELINE.md`          | `/docs/operations/*`, `/docs/performance/benchmarking`                              |
| `examples/*.zig`             | `/examples/*`, `/docs/getting-started/first-*`                                      |
| `src/root.zig`               | `/reference/zig`                                                                    |
| `include/uWebZockets.h`      | `/reference/c-abi`                                                                  |
| `builds/*.zig`               | `/reference/build-steps`, `/docs/operations/*`                                      |

### 18.3 Appendix C: command and evidence matrix

| Purpose               | Command                                                     | Evidence                            |
| --------------------- | ----------------------------------------------------------- | ----------------------------------- |
| Diagnose Blume config | `pnpm exec vp run uwz-docs#doctor`                          | Page count, adapter, search, errors |
| Type-check Astro/MDX  | `pnpm exec vp run uwz-docs#check`                           | 0 errors                            |
| Validate links        | `pnpm exec vp run uwz-docs#test`                            | `blume validate` output             |
| Strict link gate      | `pnpm --filter uwz-docs exec blume validate --strict`       | 0 errors, 0 warnings                |
| Production build      | `pnpm exec vp run uwz-docs#build`                           | `dist/` generated                   |
| Built-site audit      | `pnpm --filter uwz-docs exec blume audit --fail-on warning` | 0 warnings                          |
| Live audit            | `pnpm --filter uwz-docs exec blume audit --url <origin>`    | Status, headers, redirects          |
| Root lint             | `pnpm lint`                                                 | 0 errors                            |
| Root format           | `pnpm format:check`                                         | 0 differences                       |
| Root types            | `pnpm typecheck`                                            | 0 errors                            |
| Root tests            | `pnpm test`                                                 | All pass                            |
| i18n keys             | `pnpm i18n:check`                                           | 0 missing keys                      |
| Site size             | `pnpm check:size`                                           | No source over 400 lines            |
| Snippet compile       | `sh scripts/check-docs-snippets.sh`                         | All runnable samples compile        |
| Search smoke          | `pnpm test -- tests/docs`                                   | Canonical queries pass              |
| Lighthouse            | `pnpm lighthouse:docs` (to add)                             | Budgets pass                        |

The exact command names may change during M0. Record the final command in this
table and in the root README so contributors do not guess.

### 18.4 Appendix D: glossary seed

| Term             | Definition                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------- |
| Application slab | The one contiguous allocation that holds pools, buffers, queues, and router storage for one application |
| Backpressure     | A bounded producer signal, usually `error.WouldBlock`, that asks the caller to resume later             |
| Capacity         | A startup or compile-time bound, not a throughput number                                                |
| Completion       | An event-loop operation result for accept, read, write, close, timer, or async wake                     |
| Connection slot  | One reusable `TcpConnection` in the pool                                                                |
| Drain            | The callback invoked when a bounded write queue has room again                                          |
| Handler          | A function registered on a route and invoked by the dispatcher                                          |
| HPACK            | HTTP/2 header compression                                                                               |
| Middleware       | An ordered callback that runs before route dispatch and may stop the chain                              |
| mTLS             | Mutual TLS, where the client also presents a certificate                                                |
| Preset           | A named `ServerConfig` tuned for a workload shape                                                       |
| Pub/sub          | Bounded topic subscription and publish within one application or cluster                                |
| QPACK            | HTTP/3 header compression                                                                               |
| Route capture    | A borrowed `:name` or `*name` value extracted from the path                                             |
| Shared-nothing   | A design where each worker owns its loop, slab, and mutable state                                       |
| Slab layout      | The computed partition of the application slab                                                          |
| SoA              | Structure of arrays, grouping hot fields for cache-friendly scans                                       |
| 0-RTT            | TLS 1.3 early data; replayable and restricted to safe methods on TCP                                    |
| Async token      | A copyable, generation-checked `AsyncResponse` completed exactly once                                   |
| Worker           | One OS thread with its own event loop, slab, and optional TLS context                                   |

### 18.5 Appendix E: research and evidence log

Research performed for this plan on 2026-10-31:

- `graphify query` over `graphify-out/graph.json` (4,683 nodes) for the public
  feature surface, docs index, JSON-RPC, HTTP/2, HTTP/3, WebSocket, TLS,
  cluster, and capacity topics.
- Context7 library `/haydenbleasel/blume` for Blume navigation, frontmatter,
  i18n, search, versioning, deployment, redirects, OpenAPI, llms.txt, MCP, and
  agent discovery.
- Context7 library `/websites/hono_dev` for Hono's Helpers category, including
  its cookie, JWT, compress, WebSocket, and streaming/SSE helper pages. The
  comparison informed Section 4.7; it did not override the uWebZockets protocol
  boundaries.
- Local Blume 2.2.6 documentation under
  `apps/uwz-docs/node_modules/blume/docs/`, including `content/navigation`,
  `content/meta`, `content/versioning`, `cli/audit`, `cli/validate`,
  `discoverability/agent-discovery`, and `discoverability/llms-txt`.
- Repository sources: `README.md`, `docs/*.md`, `CODEBASE.md`, `CHANGELOG.md`,
  `SECURITY.md`, `src/root.zig`, `src/router/config.zig`,
  `src/http/response.zig`, `src/http/middleware.zig`, and `examples/`.
- Current site audit: `blume doctor` reports 4 pages, static output, Orama
  search, no references, no analytics, no assistant. `blume validate --strict`
  reports no broken links.

The plan does not claim a page exists or a feature is supported because a
repository doc says so alone. Each page task must re-verify against the current
source at the time it is written.

### 18.6 Appendix F: document change log

| Date       | Change                                                                                         | Author             |
| ---------- | ---------------------------------------------------------------------------------------------- | ------------------ |
| 2026-10-31 | Initial comprehensive roadmap; page register, milestones, contracts, templates, and appendices | Docs planning pass |
| 2026-10-31 | Renamed from `DOCS-TODO.md` to `uWZ-TODO.md` and moved to the repository root                  | Docs planning pass |
| 2026-10-31 | Added the nested Helpers category after the Hono comparison; total page register is now 269    | Docs planning pass |
| 2026-10-31 | Shipped `/docs`, What/Why, and all Getting Started pages with Vietnamese mirrors and redirects | Docs writing pass  |

Keep this table short. Detailed page changes belong in the page rows and the
repository changelog, not here.
