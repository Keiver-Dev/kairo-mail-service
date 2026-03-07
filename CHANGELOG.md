# Changelog 📜

All notable changes to the **Kairo Email Service** will be documented in this file.

---

## [0.1.2-beta] - 2026-03-07
### Added
- **Security Refinement**: Implemented `crypto.timingSafeEqual` in `auth.middleware.js` to protect against timing attacks on API keys.
- **Robustness**: Made `getTransporter` thread-safe in `email.config.js` with an initialization flag and retry logic.
- **Integration Test Suite**: Complete coverage for all endpoints using **Jest** and **Supertest** (ESM compatible).
- **Health Check**: Endpoint `/health` to monitor system component connectivity.
- **Improved Logging**: Colorized console output via `picocolors` and environment-aware formatting (JSON for production).
- **Comprehensive Documentation**: Added `README.md`, `ENDPOINTS.md`, and this `CHANGELOG.md`.

### Fixed
- Environment variable naming inconsistencies in `README.md`.
- ESM compatibility issues with Jest mocking.
- Database connection leaks during tests by implementing global teardown.

---

## [0.1.1-beta] - 2026-03-06
### Added
- **Automatic Migrations**: Integrated PostgreSQL migration runner to manage the `email_logs` table at startup.
- **Refined Templates**: New semantic templates for mentions, PR merges, deadline reminders, and space invitations.
- **Security**: Centralized `authMiddleware` for `X-Api-Key` verification across all routes.
- **Validation**: Strict request schema validation via `express-validator`.

### Changed
- Refactored `Mailer Service` to use semantic wrappers for each template.
- Updated all JSDocs and logs to English for better international consistency.

---

## [0.1.0-beta] - Initial Release
### Added
- Core Express server with ESM support.
- Nodemailer integration with Ethereal/SMTP.
- Base layout system for HTML emails.
- Initial templates for Password Recovery and Verification.
- Global error handling middleware.
