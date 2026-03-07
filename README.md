# Kairo Email Service

A robust, high-performance email delivery microservice built with **Node.js**, **Express**, and **Nodemailer**. Designed for seamless integration, security, and scalability.

---

## Key Features

- **Template System**: Rich HTML templates for:
  - Password Recovery
  - Email Verification (with 6-digit codes)
  - Workspace and Space Invitations
  - Task Assignments
  - Mentions and Notifications
  - PR Merged Announcements
  - Deadline Reminders
- **Database Integration**: Automatic PostgreSQL migrations for audit logs.
- **Security**: 
  - API Key based authentication (`X-Api-Key`).
  - Request validation via `express-validator`.
  - Secure environment configuration.
- **Developer Experience**:
  - Colorized terminal logs with `picocolors`.
  - Comprehensive integration test suite with **Jest** and **Supertest**.
  - ESLint configuration for code quality.
  - ESM (EcmaScript Modules) support.
- **Reliability**: 
  - Graceful connection handling for DB and SMTP.
  - Health checks (`/health`) with detailed component status.
  - Error middleware for centralized stability.

---

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/) (optional, but recommended for logging)

### Clone and Install
```bash
git clone https://github.com/Keiver-Dev/Kairo-Email-Service.git
cd Kairo-Email-Service
npm install
```

---

## Configuration

Create a `.env` file based on `.env.example`:

```env
# Server
PORT=3001
NODE_ENV=development

# Security
INTERNAL_API_KEY=your_secure_32_char_key

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kairo_email
DB_USER=postgres
DB_PASSWORD=your_password

# ─── Email ───────────────────────────────────────
# true = uses Ethereal (test emails, no real account needed)
# false = uses Gmail with the credentials below
EMAIL_TEST_MODE=true
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM_NAME=Mail Service

# ─── Frontend ────────────────────────────────────
# Base URL to build links inside emails
FRONTEND_URL=http://localhost:3000
```

---

## Running the Service

### Development Mode
Runs with `nodemon` for automatic restarts and detailed colorized logs.
```bash
npm run dev
```

### Run Tests
Executes integration tests for all endpoints.
```bash
npm test
```

### Production Build
```bash
npm start
```

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Status of DB and SMTP connections |
| `POST` | `/api/email/password-recovery` | Send recovery links |
| `POST` | `/api/email/verify-email` | Send 6-digit verification codes |
| `POST` | `/api/email/workspace-invitation` | Invite users to workspaces |
| `POST` | `/api/email/task-assignment` | Notify task assignments |
| `POST` | `/api/email/mention` | Notify user mentions |

*For full details on payloads, see the [Endpiont Documentation](./docs/ENDPOINTS.md).*

---

## Project Structure

```text
├── src/
│   ├── config/       # Configurations (DB, Email, Migrations)
│   ├── controllers/  # Request handlers
│   ├── middlewares/  # Auth, Validation, Error Handling
│   ├── routes/       # API Route definitions
│   ├── services/     # Business logic (Mailer Service)
│   ├── templates/    # HTML/Text Email templates
│   └── utils/        # Loggers and helpers
├── tests/            # Integration and Unit tests
└── docs/             # Detailed technical documentation
```

---

## License
Released under the [MIT License](LICENSE).
Built with care by **Keiver-Dev**.
