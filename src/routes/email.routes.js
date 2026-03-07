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

export default router;
