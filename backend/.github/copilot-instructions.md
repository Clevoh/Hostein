## Quick orientation for code helpers

This Node/Express backend is a small REST API backed by MongoDB (Mongoose). The goal of this file is to capture the concrete, discoverable patterns an automated coding agent needs to be productive.

### Big picture
- Entry point: `server.js` — loads env, connects DB (`config/db.js`), registers routes and starts the Express server.
- Routes: `routes/*.js` (e.g. `routes/authRoutes.js`) wire HTTP endpoints to controller functions.
- Controllers: `controllers/*.js` export async handler functions that read `req.body/params`, call Mongoose models and respond with `res.status(...).json(...)` (see `controllers/authController.js`).
- Models: `models/*.js` are Mongoose schemas (see `models/User.js`).

Use these files first to understand behavior: `server.js`, `config/db.js`, `controllers/authController.js`, `models/User.js`, and `package.json`.

### Project-specific conventions
- Controllers: always export named functions (e.g. `exports.register = async (req, res) => { ... }`). Follow same signature and respond with JSON `{ message, ... }`.
- Routes: import controller functions and map directly to routes (example: `router.post('/login', login);` in `routes/authRoutes.js`).
- Models: singular names exported via `module.exports = mongoose.model('User', userSchema);`.
- Error handling: handlers return HTTP status codes and JSON messages directly. Common codes used: 201 (created), 200 (ok), 400 (bad request), 404 (not found), 500 (server error).
- Auth: JWTs are issued in `controllers/authController.js` using `jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' })`. Passwords use `bcryptjs` (`bcrypt.hash(..., 10)` / `bcrypt.compare`). Expect the JWT to be passed in an `Authorization: Bearer <token>` header by clients (no auth middleware present in repo — add to `middleware/` if needed).

### Dev / build / run workflows
- Install deps and run locally with nodemon (recommended for iterative dev):

```powershell
npm install
npm run dev   # runs `nodemon server.js`
```

- Production / simple start:

```powershell
npm start      # runs `node server.js`
```

- Environment: create a `.env` file at repo root with at minimum:

```
MONGO_URI=<your mongo connection string>
JWT_SECRET=<your jwt secret>
PORT=5000   # optional
```

- DB connection and logs are in `config/db.js`. Connection failures call `process.exit(1)`.

### Integration points & external dependencies
- MongoDB via `mongoose` — check `process.env.MONGO_URI`.
- Auth via `jsonwebtoken` and `bcryptjs`.
- CORS is enabled globally in `server.js`.
- package.json scripts: `start`, `dev` (nodemon). No test or lint workflows are present.

### Common change pattern (how to add an endpoint)
1. Add a named async function to `controllers/<X>Controller.js` that follows the existing style (use `try/catch`, `res.status(...).json(...)`). See `controllers/authController.js`.
2. Register route in `routes/<x>Routes.js` and export the router.
3. Add `app.use('/api/<x>', require('./routes/<x>Routes'))` in `server.js`.
4. Add a Mongoose model under `models/` if you need persistent data.

### Notes about repository state
- Several files are placeholders/empty: `routes/propertyRoutes.js`, `routes/tenantRoutes.js`, `controllers/propertyController.js`, `controllers/tenantController.js`, and several `models/*.js` (Property, Tenants, Unit, Payment). Expect to implement these following the conventions above.
- Responses and error messages are concise; follow the same JSON shape when adding endpoints to stay consistent with existing handlers.

If anything here is unclear or you'd like examples for a specific feature (e.g. middleware for JWT verification, sample model for `Property`, or a tenant CRUD flow), tell me which part and I will expand with concrete, minimal patches.
