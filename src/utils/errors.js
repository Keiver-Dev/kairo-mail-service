export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    super(message || 'Validation error', 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message) {
    super(message || 'Unauthorized', 401);
  }
}

export class NotFoundError extends AppError {
  constructor(message) {
    super(message || 'Requested resource not found', 404);
  }
}

export class ForbiddenError extends AppError {
  constructor(message) {
    super(message || 'Forbidden access', 403);
  }
}

export class ConflictError extends AppError {
  constructor(message) {
    super(message || 'Conflict with the current state of the resource', 409);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message) {
    super(message || 'Too many requests, please try again later', 429);
  }
}
