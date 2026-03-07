const SENSITIVE_FIELDS = ['password', 'token', 'apiKey', 'secret', 'INTERNAL_API_KEY', 'EMAIL_PASS', 'INTERNAL_API_KEY'];

/**
 * Obfuscates an email address for logs (e.g. k***@gmail.com)
 */
export const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string' || !email.includes('@')) return email;
  const [user, domain] = email.split('@');
  if (user.length <= 2) return `***@${domain}`;
  return `${user.substring(0, 2)}***@${domain}`;
};

/**
 * Truncates long strings to avoid heavy logs
 */
export const sanitizeLog = (value, maxLength = 100) => {
  if (typeof value !== 'string') return value;
  if (value.length <= maxLength) return value;
  return `${value.substring(0, maxLength)}... [recortado]`;
};

/**
 * Recursively sanitizes an object by removing or truncating sensitive fields
 */
export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    // If key is sensitive, redact it
    if (SENSITIVE_FIELDS.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
      sanitized[key] = '[REDACTED]';
    } 
    // If it's an email, sanitize it
    else if (key.toLowerCase().includes('email') && typeof value === 'string') {
      sanitized[key] = sanitizeEmail(value);
    }
    // If it's a long string, truncate it
    else if (typeof value === 'string' && value.length > 200) {
      sanitized[key] = sanitizeLog(value, 200);
    }
    // If it's an object, recurse
    else if (value && typeof value === 'object') {
      sanitized[key] = sanitizeObject(value);
    }
    else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};
