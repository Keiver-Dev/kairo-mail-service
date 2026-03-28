import { Router } from 'express';
import { body } from 'express-validator';
import * as emailController from '../controllers/email.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/password-recovery', [
  body('email').isEmail().withMessage('Invalid email'),
  body('userName').notEmpty().withMessage('User name is required'),
  body('token').notEmpty().withMessage('Recovery token is required'),
  validate
], emailController.passwordRecovery);

router.post('/verify-email', [
  body('email').isEmail().withMessage('Invalid email'),
  body('userName').notEmpty().withMessage('User name is required'),
  body('token').notEmpty().withMessage('Verification token is required'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('Code must be 6 digits'),
  validate
], emailController.verifyEmail);

router.post('/workspace-invitation', [
  body('email').isEmail().withMessage('Invalid email'),
  body('workspaceName').notEmpty().withMessage('Workspace name is required'),
  body('inviterName').notEmpty().withMessage('Inviter name is required'),
  body('token').notEmpty().withMessage('Invitation token is required'),
  validate
], emailController.workspaceInvitation);

router.post('/task-assignment', [
  body('email').isEmail().withMessage('Invalid email'),
  body('userName').notEmpty().withMessage('User name is required'),
  body('taskData.title').notEmpty().withMessage('Task title is required'),
  body('taskData.workspaceName').notEmpty().withMessage('Workspace name is required'),
  body('taskData.id').notEmpty().withMessage('Task ID is required'),
  body('assignerName').notEmpty().withMessage('Assigner name is required'),
  validate
], emailController.taskAssignment);

router.post('/space-invitation', [
  body('email').isEmail().withMessage('Invalid email'),
  body('spaceName').notEmpty().withMessage('Space name is required'),
  body('inviterName').notEmpty().withMessage('Inviter name is required'),
  body('token').notEmpty().withMessage('Invitation token is required'),
  validate
], emailController.spaceInvitation);

router.post('/mention', [
  body('email').isEmail().withMessage('Invalid email'),
  body('userName').notEmpty().withMessage('User name is required'),
  body('mentionData.commenterName').notEmpty().withMessage('Commenter name is required'),
  body('mentionData.taskTitle').notEmpty().withMessage('Task title is required'),
  body('mentionData.commentPreview').notEmpty().withMessage('Comment preview is required'),
  body('mentionData.taskId').notEmpty().withMessage('Task ID is required'),
  validate
], emailController.mention);

router.post('/deadline-reminder', [
  body('email').isEmail().withMessage('Invalid email'),
  body('userName').notEmpty().withMessage('User name is required'),
  body('taskData.title').notEmpty().withMessage('Task title is required'),
  body('taskData.deadline').notEmpty().withMessage('Deadline is required'),
  body('taskData.id').notEmpty().withMessage('Task ID is required'),
  validate
], emailController.deadlineReminder);

router.post('/pr-merged', [
  body('email').isEmail().withMessage('Invalid email'),
  body('userName').notEmpty().withMessage('User name is required'),
  body('prData.prTitle').notEmpty().withMessage('PR title is required'),
  body('prData.taskTitle').notEmpty().withMessage('Task title is required'),
  body('prData.taskId').notEmpty().withMessage('Task ID is required'),
  body('prData.prUrl').isURL().withMessage('PR URL must be a valid URL'),
  validate
], emailController.prMerged);

// --- Auth & Security ---
router.post('/new-device-login', [
  body('email').isEmail().withMessage('Invalid email'),
  body('userName').notEmpty().withMessage('User name is required'),
  body('device').notEmpty().withMessage('Device is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('loginTime').notEmpty().withMessage('Login time is required'),
  body('blockLink').isURL().withMessage('Block link must be a valid URL'),
  validate
], emailController.newDeviceLogin);

router.post('/two-factor-code', [
  body('email').isEmail().withMessage('Invalid email'),
  body('userName').notEmpty().withMessage('User name is required'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('Code must be 6 digits'),
  validate
], emailController.twoFactorCode);

router.post('/password-changed', [
  body('email').isEmail().withMessage('Invalid email'),
  body('userName').notEmpty().withMessage('User name is required'),
  body('changedAt').notEmpty().withMessage('Changed at timestamp is required'),
  body('recoveryLink').isURL().withMessage('Recovery link must be a valid URL'),
  validate
], emailController.passwordChanged);

router.post('/account-deleted', [
  body('email').isEmail().withMessage('Invalid email'),
  body('userName').notEmpty().withMessage('User name is required'),
  body('deletionDate').notEmpty().withMessage('Deletion date is required'),
  validate
], emailController.accountDeleted);

// --- Billing & Subscriptions ---
router.post('/payment-success', [
  body('email').isEmail().withMessage('Invalid email'),
  body('userName').notEmpty().withMessage('User name is required'),
  body('amount').notEmpty().withMessage('Amount is required'),
  body('plan').notEmpty().withMessage('Plan is required'),
  body('invoiceLink').isURL().withMessage('Invoice link must be a valid URL'),
  validate
], emailController.paymentSuccess);

router.post('/payment-failed', [
  body('email').isEmail().withMessage('Invalid email'),
  body('userName').notEmpty().withMessage('User name is required'),
  body('amount').notEmpty().withMessage('Amount is required'),
  body('updatePaymentLink').isURL().withMessage('Update payment link must be a valid URL'),
  validate
], emailController.paymentFailed);

router.post('/trial-ending', [
  body('email').isEmail().withMessage('Invalid email'),
  body('userName').notEmpty().withMessage('User name is required'),
  body('daysLeft').isInt({ min: 0 }).withMessage('Days left must be a positive integer'),
  body('upgradeLink').isURL().withMessage('Upgrade link must be a valid URL'),
  validate
], emailController.trialEnding);

router.post('/subscription-cancelled', [
  body('email').isEmail().withMessage('Invalid email'),
  body('userName').notEmpty().withMessage('User name is required'),
  body('planName').notEmpty().withMessage('Plan name is required'),
  body('accessUntil').notEmpty().withMessage('Access until date is required'),
  validate
], emailController.subscriptionCancelled);

router.post('/subscription-renewed', [
  body('email').isEmail().withMessage('Invalid email'),
  body('userName').notEmpty().withMessage('User name is required'),
  body('planName').notEmpty().withMessage('Plan name is required'),
  body('amount').notEmpty().withMessage('Amount is required'),
  body('nextBillingDate').notEmpty().withMessage('Next billing date is required'),
  validate
], emailController.subscriptionRenewed);

// --- Onboarding & Engagement ---
router.post('/welcome', [
  body('email').isEmail().withMessage('Invalid email'),
  body('userName').notEmpty().withMessage('User name is required'),
  body('ctaLabel').notEmpty().withMessage('CTA label is required'),
  body('ctaLink').isURL().withMessage('CTA link must be a valid URL'),
  validate
], emailController.welcome);

router.post('/inactivity-nudge', [
  body('email').isEmail().withMessage('Invalid email'),
  body('userName').notEmpty().withMessage('User name is required'),
  body('lastLoginDate').notEmpty().withMessage('Last login date is required'),
  body('ctaLabel').notEmpty().withMessage('CTA label is required'),
  body('ctaLink').isURL().withMessage('CTA link must be a valid URL'),
  validate
], emailController.inactivityNudge);

router.post('/digest', [
  body('email').isEmail().withMessage('Invalid email'),
  body('userName').notEmpty().withMessage('User name is required'),
  body('periodLabel').notEmpty().withMessage('Period label is required'),
  body('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
  validate
], emailController.digest);

// --- System & Admin ---
router.post('/maintenance-scheduled', [
  body('email').isEmail().withMessage('Invalid email'),
  body('userName').notEmpty().withMessage('User name is required'),
  body('startTime').notEmpty().withMessage('Start time is required'),
  body('estimatedDuration').notEmpty().withMessage('Estimated duration is required'),
  validate
], emailController.maintenanceScheduled);

router.post('/api-key-event', [
  body('email').isEmail().withMessage('Invalid email'),
  body('userName').notEmpty().withMessage('User name is required'),
  body('eventType').isIn(['generated', 'rotated']).withMessage('Event type must be generated or rotated'),
  body('keyHint').notEmpty().withMessage('Key hint is required'),
  body('revokeLink').isURL().withMessage('Revoke link must be a valid URL'),
  validate
], emailController.apiKeyEvent);

export default router;
