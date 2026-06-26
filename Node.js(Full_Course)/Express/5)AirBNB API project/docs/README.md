# AirBNB API Project

## Purpose
This project is an API-first AirBNB clone built using Node.js, Express, and a React frontend. It serves as an educational backend focused on routing, robust authentication, data validation, and role-based access control (RBAC). It uses a local JSON file-based database for persistence.

## Read Order
To understand this project, follow this documentation read order:
1. **[PROJECT_SCOPE.md](PROJECT_SCOPE.md)** - Domain model, module overview, and complete tech stack.
2. **[ARCHITECTURE_BASELINE.md](ARCHITECTURE_BASELINE.md)** - Project structure, build/run commands, and folder conventions.
3. **[API_ENDPOINTS.md](API_ENDPOINTS.md)** - Complete list of API endpoints.
4. **[DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)** - Data models used by the JSON storage.
5. **[SECURITY_BASELINE.md](SECURITY_BASELINE.md)** - Authentication and authorization workflow.
6. **[ENGINEERING_RULES.md](ENGINEERING_RULES.md)** - Guidelines for coding, testing, and making changes.
7. **[CHANGE_IMPACT_PROTOCOL.md](CHANGE_IMPACT_PROTOCOL.md)** - Standard process for introducing modifications.

## Maintenance Model
This project requires careful alignment between the backend API schema and the frontend consumer. The data is stored in `backend/data/*.json`. Any changes to data shapes must be accompanied by updates to validations in `backend/validations/` and models in `backend/models/`.
