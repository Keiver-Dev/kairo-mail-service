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
  sendNewDeviceLogin: jest.fn(),
  sendTwoFactorCode: jest.fn(),
  sendPasswordChanged: jest.fn(),
  sendAccountDeleted: jest.fn(),
  sendPaymentSuccess: jest.fn(),
  sendPaymentFailed: jest.fn(),
  sendTrialEnding: jest.fn(),
  sendSubscriptionCancelled: jest.fn(),
  sendSubscriptionRenewed: jest.fn(),
  sendWelcomeEmail: jest.fn(),
  sendInactivityNudge: jest.fn(),
  sendDigestEmail: jest.fn(),
  sendMaintenanceScheduled: jest.fn(),
  sendAPIKeyEvent: jest.fn(),
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

  describe('New Auth & Security Endpoints', () => {
    it('POST /new-device-login should return 202', async () => {
      mailerService.sendNewDeviceLogin.mockResolvedValue({ success: true, messageId: 'm1' });
      const res = await request(app).post('/api/email/new-device-login').set('X-Api-Key', API_KEY).send({
        email: 't@e.com', userName: 'K', device: 'D', location: 'L', loginTime: 'T', blockLink: 'http://b.com'
      });
      expect(res.status).toBe(202);
    });

    it('POST /two-factor-code should return 202', async () => {
      mailerService.sendTwoFactorCode.mockResolvedValue({ success: true, messageId: 'm2' });
      const res = await request(app).post('/api/email/two-factor-code').set('X-Api-Key', API_KEY).send({
        email: 't@e.com', userName: 'K', code: '123456'
      });
      expect(res.status).toBe(202);
    });
  });

  describe('New Billing Endpoints', () => {
    it('POST /payment-success should return 202', async () => {
      mailerService.sendPaymentSuccess.mockResolvedValue({ success: true, messageId: 'm3' });
      const res = await request(app).post('/api/email/payment-success').set('X-Api-Key', API_KEY).send({
        email: 't@e.com', userName: 'K', amount: '1', plan: 'P', invoiceLink: 'http://i.com'
      });
      expect(res.status).toBe(202);
    });

    it('POST /payment-failed should return 202', async () => {
      mailerService.sendPaymentFailed.mockResolvedValue({ success: true, messageId: 'm4' });
      const res = await request(app).post('/api/email/payment-failed').set('X-Api-Key', API_KEY).send({
        email: 't@e.com', userName: 'K', amount: '1', updatePaymentLink: 'http://u.com'
      });
      expect(res.status).toBe(202);
    });
  });

  describe('New Onboarding & System Endpoints', () => {
    it('POST /welcome should return 202', async () => {
      mailerService.sendWelcomeEmail.mockResolvedValue({ success: true, messageId: 'm5' });
      const res = await request(app).post('/api/email/welcome').set('X-Api-Key', API_KEY).send({
        email: 't@e.com', userName: 'K', ctaLabel: 'G', ctaLink: 'http://c.com'
      });
      expect(res.status).toBe(202);
    });

    it('POST /api-key-event should return 202', async () => {
      mailerService.sendAPIKeyEvent.mockResolvedValue({ success: true, messageId: 'm6' });
      const res = await request(app).post('/api/email/api-key-event').set('X-Api-Key', API_KEY).send({
        email: 't@e.com', userName: 'K', eventType: 'generated', keyHint: '1', revokeLink: 'http://r.com'
      });
      expect(res.status).toBe(202);
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
