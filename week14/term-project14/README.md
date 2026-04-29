Sort of a combined checkpoint for week 12/13

Late to the party with finishing up the marketing page sections, but I'm happy with how they turned out.
The Hero Section's rotating images looks really clean and the amenities implementation adds a lot towards marking a property for me.
Still learning React as I go, but starting to get the hang of it. I can read React code and frankenstein React code, but making React code from idea to function is just out of reach.
Implementing the charts started off as diving through tons of chart.js documentation which left me fatigued, so to speed things up I can't claim sole ownership of that code, especially the options. But there's charts, and they work.
There's certain things I'm doing that are just outside of the scope of the class, unsure if the intent was to reach out beyond the bounds a little bit because we have assisance.

AI attribution:
A lot of assistance was used in implementing chart.js quickly.
Quite a bit of assistance was used in CSS rules for time efficiency.
Some assistance was used in bug fixing the rotating hero images.
No AI agents were used. All code was typed in by me.


New this week:
Panned out => marketing page sections (hero, about, amenities, cta) and a bunch of CSS to get everything similar/clean
Partly complete => dashboard charts, weather widget

Charts:
1) Bar chart uses data from Hawaii ISL visitors (people) from 2025-02 to 2026-02. Includes labels when hovering to see the numbers behind the chart. Colors are arbitrary at the moment.
2) Doughnut chart uses data from all country indicators (US, Europe, Japan, etc.) for the latest month (2026-02). Visitor totals is statewide, so it is multiplied by the percentage of Hawaii Island visitors in the same month. Colors are arbitrary at the moment.   (total visitors) * (% of Big Island visitors) per country for that month

To-do:
- get chart data from a /api/arrivals route
--- store data in MongoDB, allow retrieval from there
- fix chart titles not showing
- have weather widget fetch the image from another openweather api call (in wk 10)
- fix @media rules surrounding dashboard and CTASection
- add css rules for charts (center, fill, colors, padding & magins)
- update models/propertySchema.js to fsollow better with how the hardcoded data is in index.js
- add Book now, about pages routing to header & footer
--- book now buttons use same booking modal as in CTA section? React forms?

Compensation: 
- hardcoded JSON data (from dbedt csv) to get charts working
- amenities section now uses useState to filter by location instead of the dashboard charts having one
- hero section cycles through images on a timer, clever use of useState and useEffect

Additions:
- Modal.jsx component for booking screen
-- reusable if I need another modal
--- w.i.p. no data yet, but modal works
--- may need to move reference upward if header/footer link also uses it

Considerations:
- add a google maps module to show the address of the property
--- pay for the openweather map api?

Dependency recovery notes (Vite/Node modules):
- Symptom:
--- `vite build` fails with `ERR_MODULE_NOT_FOUND` for files inside `node_modules` (example: `tinyglobby/dist/index.mjs` or `fdir/dist/index.mjs`).
- Root cause:
--- Corrupted/incomplete `node_modules` contents on disk.
- Recovery commands:
```bash
rm -rf node_modules
npm ci
npm run build
```
- Why this works:
--- `npm ci` recreates `node_modules` exactly from `package-lock.json`, which fixed the missing dist files in this project.

Admin account check/seed:
- Run `npm run seed:admin` before testing admin login and dashboard access.
- If at least one admin user exists, the script prints the admin count and exits.
- If no admin user exists, it creates one using:
--- `ADMIN_EMAIL` + `ADMIN_PASSWORD` if set in env, or
--- fallback dev credentials `admin@example.com` / `changeme123!`.