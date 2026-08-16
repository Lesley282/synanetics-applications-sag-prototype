# Synanetics prototype template

This is the starting ground for Synanetics's clickable, shareable prototypes — React + TypeScript apps in the same stack, same lint/format rules, and same Cloud Run deploy pipeline that `synanetics-applications-amber-drug-management-prototype` already proved out. It is **not itself a prototype** — it's what you clone/use-as-template every time you start a new one (SAG, Symmetry reporting, autosave, or whatever's next).

## Starting a new prototype from this template

1. On GitHub, use **"Use this template" → "Create a new repository"** (or clone this repo and re-point the remote if that button isn't enabled yet). Name the new repo following the existing convention: `synanetics-applications-<name>-prototype`.
2. Rename the app: update `name` in `package.json` and the `<title>` in `index.html`.
3. Open `.github/workflows/google-cloudrun-docker.yml` and fill in the four `TODO`s in the `env` block — at minimum, `SERVICE` needs to be unique to this prototype.
4. Confirm the repo has access to `SYNANETICS_GCP_WORKLOAD_IDENTITY_PROVIDER` and `SYNANETICS_GCP_SERVICE_ACCOUNT` (check whether these are org-level secrets first — if so, nothing to do; if repo-level only, ask whoever administers the `tooling-synanetics` GCP project to add them here).
5. `npm install && npm run dev` — you should see a working page at `http://localhost:9091` with a real, styled `@synanetics/syn-library` button. That's the whole point of `src/App.tsx` as it stands: proof the stack is wired up. Replace it with your prototype's actual screens.
6. Push to `main`. That first push is also the first deploy — the Cloud Run workflow builds, pushes, and deploys automatically, and prints the live URL in the Actions run.

## Before committing, always

```
npm run lint
npm run format:check
```

(`npm run lint:fix` and `npm run format` will fix most issues automatically.) Code that's already clean against the team's lint/format rules is what makes a prototype easy for an engineer to lift into production later, if it gets to that point.

## Sharing the result

The Cloud Run service this deploys to comes up locked to authenticated Google accounts by default. If you need people outside that — Synanetics colleagues without GCP access, or anyone external — to open the link, either add `flags: --allow-unauthenticated` to the deploy step in the workflow, or ask whoever administers the GCP project to grant the `allUsers` principal the Cloud Run Invoker role on the new service, once. Decide this per prototype: some may be fine wide open, others (anything with realistic-looking patient or user data, even fake) might warrant asking first.

## Keeping this a personal prototyping space, not an engineering interruption

A few deliberate choices, and a few things worth confirming once with whoever administers your GCP/GitHub org, so pushing prototypes here doesn't create unwanted work for the engineering team:

- **No CODEOWNERS file.** Amber and the Symmetry dashboard prototype both have one that auto-requests review from `@SynaneticsLtd/development-managers` and other real teams on every pull request. That's been left out here on purpose — if you open PRs against a prototype repo made from this template, nobody gets auto-pinged. If you ever want your own reviews, add a `.github/CODEOWNERS` with just your own GitHub handle.
- **No branch protection is configured by this template.** A brand-new repo has none by default, so pushing straight to `main` (no PR at all) works for solo prototyping. Worth a quick check that there isn't an org-wide ruleset overriding this before you rely on it.
- **Shared GCP project.** The deploy workflow targets `tooling-synanetics`, the same GCP project real infra may use. Deploying a new Cloud Run _service_ under a new name shouldn't touch anything else running there, but it's worth asking whoever administers that project two things once: (1) does the service account behind `SYNANETICS_GCP_WORKLOAD_IDENTITY_PROVIDER` / `SYNANETICS_GCP_SERVICE_ACCOUNT` have permissions scoped just to deploying/managing Cloud Run services, not broader infra, and (2) are those two secrets already available to every repo in the org, or does each new prototype repo need them added individually. Either answer is fine to work with — it's just worth knowing which one is true before assuming this is fully self-serve.

## Simulating a database, slow connections, or errors

This is deliberately **not** included in the template. Every prototype's data shape is different, so a generic mock layer here would just be more code to strip out. When a specific prototype needs to demonstrate loading states, a slow connection, or a failure path, that gets added to that prototype directly — typically a small mock-API layer (e.g. Mock Service Worker) with an injectable delay, plus an in-app "Demo controls" toggle a presenter can flip live. Ask for it when you're ready to build that prototype's data layer.

## Starting elsewhere and finishing here

You don't have to start in Claude Code. A few notes on the other entry points, so the handoff is what you expect:

- **Claude, in chat.** Fine for exploring flow and logic fast. If you want a low-rework handoff into this repo, ask for the first draft to be written directly as React/TypeScript components (using this template's structure, with plain placeholder styling), not a standalone HTML mockup — the latter is a reference to rebuild from, not code to continue.
- **A Figma agent, working in an actual design file.** Clean only if Code Connect mappings exist between your Figma components and `@synanetics/syn-library` — worth setting up once (see the `figma-code-connect` process), since it pays off on every prototype afterwards, not just one.
- **Figma Make / Figma Sites.** Its own separate, self-contained sharing lane — fastest way to get a link in front of someone, but the generated app lives on Figma's infrastructure, not in a repo, and doesn't export into this stack. Treat a Make prototype as a visual reference to rebuild from if it earns a real repo, not something to migrate.
- **Claude Code.** Always the tool that finishes: opens the repo, builds out the real screens with real components, runs lint/format, commits, pushes.

## What's deliberately not here

- No test runner (no Jest/Vitest config) — add one if a specific prototype needs it.
- No mock database or network-simulation harness — see above.
- No component library beyond `@synanetics/syn-library` itself — add per-prototype dependencies (e.g. a charting library) as needed.
