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

  describe('POST /api/email/workspace-invitation', () => {
    it('should return 202 on success', async () => {
      mailerService.sendWorkspaceInvitation.mockResolvedValue({ success: true, messageId: 'msg-wi' });
      const res = await request(app).post('/api/email/workspace-invitation').set('X-Api-Key', API_KEY).send({
        email: 'user@example.com', workspaceName: 'Acme', inviterName: 'Jane', token: 'invite-tok'
      });
      expect(res.status).toBe(202);
    });

    it('should return 400 if token is missing', async () => {
      const res = await request(app).post('/api/email/workspace-invitation').set('X-Api-Key', API_KEY).send({
        email: 'user@example.com', workspaceName: 'Acme', inviterName: 'Jane'
      });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/email/task-assignment', () => {
    it('should return 202 on success', async () => {
      mailerService.sendTaskAssignment.mockResolvedValue({ success: true, messageId: 'msg-ta' });
      const res = await request(app).post('/api/email/task-assignment').set('X-Api-Key', API_KEY).send({
        email: 'user@example.com',
        userName: 'John',
        assignerName: 'Sarah',
        taskData: { title: 'Fix bug', workspaceName: 'Acme', id: 'T-42' }
      });
      expect(res.status).toBe(202);
    });

    it('should return 400 if taskData.id is missing', async () => {
      const res = await request(app).post('/api/email/task-assignment').set('X-Api-Key', API_KEY).send({
        email: 'user@example.com',
        userName: 'John',
        assignerName: 'Sarah',
        taskData: { title: 'Fix bug', workspaceName: 'Acme' }
      });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/email/space-invitation', () => {
    it('should return 202 on success', async () => {
      mailerService.sendSpaceInvitation.mockResolvedValue({ success: true, messageId: 'msg-si' });
      const res = await request(app).post('/api/email/space-invitation').set('X-Api-Key', API_KEY).send({
        email: 'user@example.com', spaceName: 'Design', inviterName: 'Jane', token: 'space-tok'
      });
      expect(res.status).toBe(202);
    });

    it('should return 400 if spaceName is missing', async () => {
      const res = await request(app).post('/api/email/space-invitation').set('X-Api-Key', API_KEY).send({
        email: 'user@example.com', inviterName: 'Jane', token: 'space-tok'
      });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/email/deadline-reminder', () => {
    it('should return 202 on success', async () => {
      mailerService.sendDeadlineReminder.mockResolvedValue({ success: true, messageId: 'msg-dr' });
      const res = await request(app).post('/api/email/deadline-reminder').set('X-Api-Key', API_KEY).send({
        email: 'user@example.com',
        userName: 'John',
        taskData: { title: 'Ship v1', deadline: '2026-04-01', id: 'T-10' }
      });
      expect(res.status).toBe(202);
    });

    it('should return 400 if taskData.deadline is missing', async () => {
      const res = await request(app).post('/api/email/deadline-reminder').set('X-Api-Key', API_KEY).send({
        email: 'user@example.com',
        userName: 'John',
        taskData: { title: 'Ship v1', id: 'T-10' }
      });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/email/pr-merged', () => {
    it('should return 202 on success', async () => {
      mailerService.sendPRMerged.mockResolvedValue({ success: true, messageId: 'msg-pr' });
      const res = await request(app).post('/api/email/pr-merged').set('X-Api-Key', API_KEY).send({
        email: 'user@example.com',
        userName: 'John',
        prData: { prTitle: 'feat: auth', taskTitle: 'Auth module', taskId: 'T-5', prUrl: 'http://github.com/pr/1' }
      });
      expect(res.status).toBe(202);
    });

    it('should return 400 if prData.prUrl is invalid', async () => {
      const res = await request(app).post('/api/email/pr-merged').set('X-Api-Key', API_KEY).send({
        email: 'user@example.com',
        userName: 'John',
        prData: { prTitle: 'feat: auth', taskTitle: 'Auth module', taskId: 'T-5', prUrl: 'not-a-url' }
      });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/email/password-changed', () => {
    it('should return 202 on success', async () => {
      mailerService.sendPasswordChanged.mockResolvedValue({ success: true, messageId: 'msg-pc' });
      const res = await request(app).post('/api/email/password-changed').set('X-Api-Key', API_KEY).send({
        email: 'user@example.com', userName: 'John', changedAt: '2026-03-28T10:00:00Z', recoveryLink: 'http://app.com/recover'
      });
      expect(res.status).toBe(202);
    });

    it('should return 400 if recoveryLink is invalid', async () => {
      const res = await request(app).post('/api/email/password-changed').set('X-Api-Key', API_KEY).send({
        email: 'user@example.com', userName: 'John', changedAt: '2026-03-28T10:00:00Z', recoveryLink: 'not-a-url'
      });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/email/account-deleted', () => {
    it('should return 202 on success', async () => {
      mailerService.sendAccountDeleted.mockResolvedValue({ success: true, messageId: 'msg-ad' });
      const res = await request(app).post('/api/email/account-deleted').set('X-Api-Key', API_KEY).send({
        email: 'user@example.com', userName: 'John', deletionDate: '2026-03-28'
      });
      expect(res.status).toBe(202);
    });

    it('should return 400 if deletionDate is missing', async () => {
      const res = await request(app).post('/api/email/account-deleted').set('X-Api-Key', API_KEY).send({
        email: 'user@example.com', userName: 'John'
      });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/email/trial-ending', () => {
    it('should return 202 on success', async () => {
      mailerService.sendTrialEnding.mockResolvedValue({ success: true, messageId: 'msg-te' });
      const res = await request(app).post('/api/email/trial-ending').set('X-Api-Key', API_KEY).send({
        email: 'user@example.com', userName: 'John', daysLeft: 3, upgradeLink: 'http://app.com/upgrade'
      });
      expect(res.status).toBe(202);
    });

    it('should return 400 if daysLeft is not an integer', async () => {
      const res = await request(app).post('/api/email/trial-ending').set('X-Api-Key', API_KEY).send({
        email: 'user@example.com', userName: 'John', daysLeft: 'soon', upgradeLink: 'http://app.com/upgrade'
      });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/email/subscription-cancelled', () => {
    it('should return 202 on success', async () => {
      mailerService.sendSubscriptionCancelled.mockResolvedValue({ success: true, messageId: 'msg-sc' });
      const res = await request(app).post('/api/email/subscription-cancelled').set('X-Api-Key', API_KEY).send({
        email: 'user@example.com', userName: 'John', planName: 'Pro', accessUntil: '2026-04-30'
      });
      expect(res.status).toBe(202);
    });

    it('should return 400 if accessUntil is missing', async () => {
      const res = await request(app).post('/api/email/subscription-cancelled').set('X-Api-Key', API_KEY).send({
        email: 'user@example.com', userName: 'John', planName: 'Pro'
      });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/email/subscription-renewed', () => {
    it('should return 202 on success', async () => {
      mailerService.sendSubscriptionRenewed.mockResolvedValue({ success: true, messageId: 'msg-sr' });
      const res = await request(app).post('/api/email/subscription-renewed').set('X-Api-Key', API_KEY).send({
        email: 'user@example.com', userName: 'John', planName: 'Pro', amount: '$49', nextBillingDate: '2026-04-28'
      });
      expect(res.status).toBe(202);
    });

    it('should return 400 if nextBillingDate is missing', async () => {
      const res = await request(app).post('/api/email/subscription-renewed').set('X-Api-Key', API_KEY).send({
        email: 'user@example.com', userName: 'John', planName: 'Pro', amount: '$49'
      });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/email/inactivity-nudge', () => {
    it('should return 202 on success', async () => {
      mailerService.sendInactivityNudge.mockResolvedValue({ success: true, messageId: 'msg-in' });
      const res = await request(app).post('/api/email/inactivity-nudge').set('X-Api-Key', API_KEY).send({
        email: 'user@example.com', userName: 'John', lastLoginDate: '2026-02-01', ctaLabel: 'Go back', ctaLink: 'http://app.com'
      });
      expect(res.status).toBe(202);
    });

    it('should return 400 if lastLoginDate is missing', async () => {
      const res = await request(app).post('/api/email/inactivity-nudge').set('X-Api-Key', API_KEY).send({
        email: 'user@example.com', userName: 'John', ctaLabel: 'Go back', ctaLink: 'http://app.com'
      });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/email/digest', () => {
    it('should return 202 on success', async () => {
      mailerService.sendDigestEmail.mockResolvedValue({ success: true, messageId: 'msg-dg' });
      const res = await request(app).post('/api/email/digest').set('X-Api-Key', API_KEY).send({
        email: 'user@example.com', userName: 'John', periodLabel: 'This week', items: [{ title: 'Task done' }]
      });
      expect(res.status).toBe(202);
    });

    it('should return 400 if items is empty', async () => {
      const res = await request(app).post('/api/email/digest').set('X-Api-Key', API_KEY).send({
        email: 'user@example.com', userName: 'John', periodLabel: 'This week', items: []
      });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/email/maintenance-scheduled', () => {
    it('should return 202 on success', async () => {
      mailerService.sendMaintenanceScheduled.mockResolvedValue({ success: true, messageId: 'msg-ms' });
      const res = await request(app).post('/api/email/maintenance-scheduled').set('X-Api-Key', API_KEY).send({
        email: 'user@example.com', userName: 'John', startTime: '2026-04-01T02:00:00Z', estimatedDuration: '2 hours'
      });
      expect(res.status).toBe(202);
    });

    it('should return 400 if estimatedDuration is missing', async () => {
      const res = await request(app).post('/api/email/maintenance-scheduled').set('X-Api-Key', API_KEY).send({
        email: 'user@example.com', userName: 'John', startTime: '2026-04-01T02:00:00Z'
      });
      expect(res.status).toBe(400);
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