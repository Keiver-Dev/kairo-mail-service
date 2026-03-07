# API Endpoints Documentation 📡

All email endpoints require a valid `X-Api-Key` header. Requests must be `POST` with `Content-Type: application/json`.

---

## [POST] /health
Returns the connectivity status of essential components. Useful for monitoring and zero-downtime deployments.

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2026-03-07T14:57:11.000Z",
  "uptime": 1234.56,
  "checks": {
    "database": "connected",
    "smtp": "ready"
  }
}
```

---

## [POST] /api/email/password-recovery
Sends a link to reset the user's password.

**Payload:**
```json
{
  "email": "user@example.com",
  "userName": "John Doe",
  "token": "recovery-token-xyz"
}
```

---

## [POST] /api/email/verify-email
Sends a 6-digit verification code and a link for email confirmation.

**Payload:**
```json
{
  "email": "user@example.com",
  "userName": "John Doe",
  "token": "verification-token-xyz",
  "code": "123456"
}
```

---

## [POST] /api/email/workspace-invitation
Invites a user to join a specific workspace.

**Payload:**
```json
{
  "email": "guest@example.com",
  "workspaceName": "Project Phoenix",
  "inviterName": "Jane Smith",
  "token": "invitation-token-xyz"
}
```

---

## [POST] /api/email/task-assignment
Notifies a user that they have been assigned a new task.

**Payload:**
```json
{
  "email": "dev@example.com",
  "userName": "Dev User",
  "assignerName": "Project Lead",
  "taskData": {
    "title": "Fix memory leak in logger",
    "workspaceName": "Backend Core",
    "id": "TASK-102"
  }
}
```

---

## [POST] /api/email/mention
Notifies a user they were mentioned in a task comment.

**Payload:**
```json
{
  "email": "user@example.com",
  "userName": "John Doe",
  "mentionData": {
    "commenterName": "Alice",
    "taskTitle": "Database cleanup",
    "commentPreview": "Great job on the schema, @John",
    "taskId": "TASK-103"
  }
}
```

---

## [POST] /api/email/deadline-reminder
Sends a reminder when a task's deadline is approaching.

**Payload:**
```json
{
  "email": "user@example.com",
  "userName": "John Doe",
  "taskData": {
    "title": "API Documentation",
    "deadline": "2026-03-10",
    "id": "TASK-104"
  }
}
```

---

## [POST] /api/email/pr-merged
Notifies a task owner that a related Pull Request has been merged.

**Payload:**
```json
{
  "email": "user@example.com",
  "userName": "John Doe",
  "prData": {
    "prTitle": "Feat: Add multi-factor authentication",
    "taskTitle": "User security revamp",
    "taskId": "TASK-105",
    "prUrl": "https://github.com/Kairo-Studios/repo/pull/1"
  }
}
```

---

## Status Codes

| Status | Description |
| :--- | :--- |
| `202 Accepted` | The request is valid and the email has been queued for delivery. |
| `400 Bad Request` | Missing or invalid required fields. Validation failed. |
| `401 Unauthorized` | Missing or invalid `X-Api-Key` header. |
| `500 Internal Server Error` | Unexpected server or SMTP failure. |
| `530 Service Unavailable` | `/health` check failed (DB or SMTP disconnected). |
