# Letterbox

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
git clone https://github.com/Keiver-Dev/letterbox-mail-service.git
cd letterbox-mail-service
npm install
```

---

## Database Setup (PostgreSQL)

This service uses PostgreSQL to store audit logs of sent emails.

### 1. Installation
- **Windows**: Download and run the installer from [postgresql.org](https://www.postgresql.org/download/windows/).
- **macOS (Homebrew)**: `brew install postgresql@15`
- **Linux (Ubuntu/Debian)**: `sudo apt install postgresql`

### 2. Create Database
Using `psql` or a tool like [pgAdmin](https://www.pgadmin.org/):
```sql
CREATE DATABASE letterbox;
```

### 3. Migrations
The service handles migrations automatically on startup. Ensure your `.env` database credentials are correct, and the tables will be created when you run `npm run dev`.

---

## Configuration

Create a `.env` file based on `.env.example`:

```env
# Server
PORT=3001
NODE_ENV=development

# Security
# Generate a secure 32-character key with: 
# node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
INTERNAL_API_KEY=your_secure_32_char_key

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=letterbox
DB_USER=postgres
DB_PASSWORD=your_password

# ─── Email ───────────────────────────────────────
# true = uses Ethereal (test emails, no real account needed)
# false = uses Gmail with the credentials below
EMAIL_TEST_MODE=true
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM_NAME=Letterbox

# ─── Environment ──────────────────────────────────
# Values: development, production, test
NODE_ENV=development

# ─── Frontend ────────────────────────────────────
# Base URL to build links inside emails
FRONTEND_URL=http://localhost:3000
```

### Gmail App Password
To use Gmail as your provider:
1. Enable **2FA** on your Google Account.
2. Go to [App Passwords](https://myaccount.google.com/apppasswords).
3. Create a new app password (e.g., "Letterbox").
4. Copy the 16-character code and use it as `EMAIL_PASS`.

### Alternative Providers
This service uses `nodemailer`. You can swap Gmail for other SMTP providers (SendGrid, Mailgun, Amazon SES) by modifying `src/config/email.config.js`.

---

## Docker Setup

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Quick Start (Service + DB)
The easiest way to run the service is using Docker Compose, which spins up both the Node.js app and a PostgreSQL instance.

```bash
# 1. Start everything
docker-compose up -d

# 2. Check logs
docker-compose logs -f letterbox
```

The service will be accessible at `http://localhost:3001`.

#### Docker Compose Overview
The `docker-compose.yml` file includes:
- **mail-service**: The Node.js microservice.
- **db**: A PostgreSQL 15 instance.
- **Volumes**: Persistent storage for the database in `postgres_data`.

> [!TIP]
> You can customize the ports and credentials directly in the `docker-compose.yml` or via environment variables.

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

### Quick Example (Verification Code)

```bash
curl -X POST http://localhost:3001/api/email/verify-email \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: your_secure_32_char_key" \
  -d '{
    "to": "user@example.com",
    "code": "123456",
    "userName": "Keiver"
  }'
```

*For full details on payloads, see the [Endpoint Documentation](./docs/ENDPOINTS.md).*

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

## Troubleshooting

### Common Issues

**1. Database Connection Failed**
- Ensure PostgreSQL is running.
- Verify `DB_HOST`, `DB_PORT`, and credentials in `.env`.
- If using Docker, ensure the `db` service is healthy.

**2. Gmail "Invalid Login"**
- Ensure `EMAIL_PASS` is an **App Password**, not your main account password.
- Verify that `EMAIL_TEST_MODE` is set to `false` for Gmail.

**3. API Key Unauthorized**
- All requests (except `/health`) require the header `X-Api-Key`.
- Ensure this matches the `INTERNAL_API_KEY` defined in your `.env`.

**4. Migrations Not Running**
- Check the console logs for `[ERROR] Migration runner failed`.
- Ensure the database user has permissions to create tables.

---

## License
Released under the [MIT License](LICENSE).
Built with care by **[Keiver-Dev](https://github.com/Keiver-Dev)**.
