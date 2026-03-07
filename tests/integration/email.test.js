import { jest } from '@jest/globals';
import request from 'supertest';

// In ESM, unstable_mockModule is required for mocking modules.
// This must be called before the modules that import the mocked module are loaded.
jest.unstable_mockModule('../../src/services/mailer.service.js', () => ({
  sendPasswordRecoveryEmail: jest.fn(),
  sendEmailVerification: jest.fn(),
  sendWorkspaceInvitation: jest.fn(),
  sendSpaceInvitation: jest.fn(),
  sendTaskAssignment: jest.fn(),
  sendMentionEmail: jest.fn(),
  sendDeadlineReminder: jest.fn(),
  sendPRMerged: jest.fn(),
  sendEmail: jest.fn(), // Generic
}));

// Dynamic imports to ensure mocks are applied
const mailerService = await import('../../src/services/mailer.service.js');
const app = (await import('../../src/app.js')).default;
const pool = (await import('../../src/config/database.js')).default;

const API_KEY = process.env.INTERNAL_API_KEY || 'test_api_key_at_least_32_characters_long_12345';

describe('Email Endpoints Integration Tests', () => {
  beforeAll(() => {
    process.env.INTERNAL_API_KEY = API_KEY;
  });

  afterAll(async () => {
    if (pool && pool.end) {
      await pool.end();
    }
  });

  describe('Authentication', () => {
    it('should return 401 if X-Api-Key header is missing', async () => {
      const response = await request(app)
        .post('/api/email/password-recovery')
        .send({ email: 'test@example.com', userName: 'Test User', token: 'abc' });
      
      expect(response.status).toBe(401);
    });

    it('should return 401 if X-Api-Key is invalid', async () => {
      const response = await request(app)
        .post('/api/email/password-recovery')
        .set('X-Api-Key', 'invalid_key')
        .send({ email: 'test@example.com', userName: 'Test User', token: 'abc' });
      
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/email/password-recovery', () => {
    it('should return 202 on success', async () => {
      mailerService.sendPasswordRecoveryEmail.mockResolvedValue({
        success: true,
        messageId: 'msg-123'
      });

      const response = await request(app)
        .post('/api/email/password-recovery')
        .set('X-Api-Key', API_KEY)
        .send({
          email: 'user@example.com',
          userName: 'John Doe',
          token: 'recovery-token'
        });

      expect(response.status).toBe(202);
      expect(response.body.messageId).toBe('msg-123');
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app)
        .post('/api/email/password-recovery')
        .set('X-Api-Key', API_KEY)
        .send({ email: 'invalid', userName: 'John', token: 'tok' });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/email/verify-email', () => {
    it('should return 202 on success', async () => {
      mailerService.sendEmailVerification.mockResolvedValue({
        success: true,
        messageId: 'msg-456'
      });

      const response = await request(app)
        .post('/api/email/verify-email')
        .set('X-Api-Key', API_KEY)
        .send({
          email: 'user@example.com',
          userName: 'John',
          token: 'v-tok',
          code: '123456'
        });

      expect(response.status).toBe(202);
    });
  });

  describe('POST /api/email/mention', () => {
    it('should return 202 on success', async () => {
      mailerService.sendMentionEmail.mockResolvedValue({
        success: true,
        messageId: 'msg-mention'
      });

      const response = await request(app)
        .post('/api/email/mention')
        .set('X-Api-Key', API_KEY)
        .send({
          email: 'user@example.com',
          userName: 'John',
          mentionData: {
            commenterName: 'Sarah',
            taskTitle: 'Refactor Auth',
            commentPreview: 'Hey @John',
            taskId: 'T-1'
          }
        });

      expect(response.status).toBe(202);
    });
  });

  describe('Global Error Handling', () => {
    it('should return 500 if service fails', async () => {
      mailerService.sendPasswordRecoveryEmail.mockRejectedValue(new Error('SMTP Down'));

      const response = await request(app)
        .post('/api/email/password-recovery')
        .set('X-Api-Key', API_KEY)
        .send({ email: 'user@example.com', userName: 'John', token: 'tok' });

      expect(response.status).toBe(500);
    });
  });
});
