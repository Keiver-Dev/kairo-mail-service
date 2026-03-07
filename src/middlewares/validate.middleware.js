import { validationResult } from 'express-validator';
import { ValidationError } from '../utils/errors.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array().map(err => `${err.path}: ${err.msg}`).join(', ');
    throw new ValidationError(message || 'Validation Error');
  }
  next();
};
