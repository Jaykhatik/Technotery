# Change Impact Protocol

Follow this 5-step protocol whenever introducing new changes to the AirBNB API project.

## 1. Clarify
- Define the exact feature or fix. Are you changing the JSON shape? Adding a new endpoint? Updating the frontend?
- Identify dependent systems. E.g., changing `backend/models/home.js` will impact `frontend/src/` data fetching.

## 2. Map
- Identify all files touched. 
- A typical feature requires modifying: `routes/` -> `validations/` -> `controllers/` -> `models/` -> `data/*.json`.

## 3. Implement Minimal
- Write the minimum viable code to satisfy the requirement.
- Do not add "speculative" fields to JSON models. Only add what is actively queried.

## 4. Validate
- Restart the backend (`npm run server`).
- Test the endpoint manually using Postman or Bruno. Check validation edge cases.
- If it affects the frontend, ensure `npm run dev` in the frontend works without TS errors.

## 5. Document Delta
- Update `API_ENDPOINTS.md` if an endpoint changed.
- Update `DATABASE_SCHEMA.md` if the JSON shape changed.

## Anti-Pattern Checklist
- [ ] Bypassing `express-validator` in routes.
- [ ] Forgetting to hash passwords before saving.
- [ ] Synchronous `fs.writeFileSync` (always use async `fs.readFile` / `fs.writeFile`).
- [ ] Mixing view rendering (e.g. `res.render`) in controllers (this is a pure API!).
