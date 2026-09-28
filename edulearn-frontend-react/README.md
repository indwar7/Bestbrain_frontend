# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Deploying (EC2)

```bash
git pull origin main
npm ci
npm run build          # regenerates dist/, the site is served from there
pm2 restart <app>      # or restart however `serve` is being run
```

`git pull` on its own changes nothing the browser sees: the app is served out
of `dist/`, and only `npm run build` regenerates it.

### public/serve.json

`serve -s dist` reads this file from the directory it serves, and Vite copies
`public/` into `dist/` verbatim, so it lands next to `index.html`.

It exists to pin `Cache-Control`. Without it `serve` sends no `Cache-Control`
at all, only an `ETag`, so browsers fall back to heuristic caching and can
hold a stale copy of the *unhashed* root files across a deploy. That is what
once made a rebuilt site still look unchanged on a phone: `vivid.css` keeps the
same filename every build and carries the whole mobile layer, so one cached
copy hides the entire deploy. Hashed files under `assets/` are immutable and
get the long max-age instead.

Keep it a plain object of only the keys `serve` knows, it validates the config
strictly and exits with *"must NOT have additional properties"* on anything
else, including a `"//"` key used as a comment. That is why the notes live here
rather than inside the JSON.

The `.htaccess` beside it expresses the same policy for Apache hosting
(Hostinger). Keep the two in step.
