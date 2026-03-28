# Changelog

All notable changes to the **Letterbox Email Service** will be documented in this file.

---

## [0.1.4-beta] - 2026-03-28

### Added
- **Full Test Coverage**: Expanded the integration suite to cover all 23 email templates. Total tests across the project: 40 (all passing).
- **Setup Automation**: Added a Makefile and setup.sh for one-command project initialization.
- **Improved Security**: Transitioned to endpoint-specific rate limiting (globalLimiter and emailApiLimiter) to better protect sensitive routes.

### Changed
- **Database Persistence**: Finalized the database logging mechanism in mailer.service.js, replacing placeholders with robust, non-blocking logic and infrastructure warnings.
- **Emoji-Free Documentation**: Standardized the aesthetic and clarity of scripts and README by removing emojis.

### Fixed
- **History Correction**: Corrected branding references in previous changelog entries to move toward the Letterbox brand.

---

## [0.1.3-beta] - 2026-03-07
### Changed
- **Branding Update**: Migrated project branding from **Keiver-Dev** to **Letterbox**.
- **Email Design Revamp**: Completely redesigned all email templates with a premium "Glassmorphism" aesthetic.
    - Implemented `Inter` typography via Google Fonts.
    - Added linear gradients to headers and subtle shadows/borders to the main container.
    - Improved mobile responsiveness and overall spacing.
- **Enhanced Templates**: Refined the layout for task assignments, mentions, and invitations for better professional clarity.
- **Environment Validation**: Implemented a comprehensive startup audit system in `env.validation.js` to detect missing or placeholder credentials.
- **Production by Default**: Improved security by defaulting the service to `production` mode and requiring real SMTP credentials unless explicitly set to test mode.
- **Flexible Database Usage**: Refactored the system to support a "Service-Only" mode where the database is optional.

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
