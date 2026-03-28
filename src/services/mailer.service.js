import { getTransporter } from '../config/email.config.js';
import logger from '../utils/logger.js';
import { sanitizeEmail } from '../utils/sanitizeLog.js';
import pool from '../config/database.js';

// --- Templates ---
import { passwordRecoveryTemplate } from '../templates/passwordRecovery.template.js';
import { emailVerificationTemplate } from '../templates/emailVerification.template.js';
import { workspaceInvitationTemplate } from '../templates/workspaceInvitation.template.js';
import { spaceInvitationTemplate } from '../templates/spaceInvitation.template.js';
import { taskAssignmentTemplate } from '../templates/taskAssignment.template.js';
import { mentionTemplate } from '../templates/mention.template.js';
import { deadlineReminderTemplate } from '../templates/deadlineReminder.template.js';
import { prMergedTemplate } from '../templates/prMerged.template.js';

// --- New Templates ---
import { newDeviceLoginTemplate } from '../templates/newDeviceLogin.template.js';
import { twoFactorCodeTemplate } from '../templates/twoFactorCode.template.js';
import { passwordChangedTemplate } from '../templates/passwordChanged.template.js';
import { accountDeletedTemplate } from '../templates/accountDeleted.template.js';
import { paymentSuccessTemplate } from '../templates/paymentSuccess.template.js';
import { paymentFailedTemplate } from '../templates/paymentFailed.template.js';
import { trialEndingTemplate } from '../templates/trialEnding.template.js';
import { subscriptionCancelledTemplate } from '../templates/subscriptionCancelled.template.js';
import { subscriptionRenewedTemplate } from '../templates/subscriptionRenewed.template.js';
import { welcomeTemplate } from '../templates/welcome.template.js';
import { inactivityNudgeTemplate } from '../templates/inactivityNudge.template.js';
import { digestTemplate } from '../templates/digest.template.js';
import { maintenanceScheduledTemplate } from '../templates/maintenanceScheduled.template.js';
import { apiKeyEventTemplate } from '../templates/apiKeyEvent.template.js';

/**
 * Generic service to send emails and log the result
 * @param {Object} params
 * @param {string} params.to - Recipient email
 * @param {string} params.subject - Email subject
 * @param {string} params.html - HTML content
 * @param {string} params.text - Plain text fallback
 * @param {string} [params.type='generic'] - Internal type for logging
 * @returns {Promise<Object>} Result status
 */
export const sendEmail = async ({ to, subject, html, text, type = 'generic' }) => {
  try {
    const transporter = await getTransporter();
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'Mail Service'}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    const previewUrl = process.env.EMAIL_TEST_MODE === 'true' 
      ? (await import('nodemailer')).default.getTestMessageUrl(info) 
      : null;

    logger.info(`Email (${type}) sent to ${sanitizeEmail(to)}. ID: ${info.messageId}`);
    if (previewUrl) logger.info(`Preview URL: ${previewUrl}`);

    // Log to Database if connected
    if (pool) {
      pool.query(
        'INSERT INTO email_logs (recipient, subject, type, message_id, status) VALUES ($1, $2, $3, $4, $5)',
        [sanitizeEmail(to), subject, type, info.messageId, 'sent']
      ).catch((err) => {
        logger.warn(`Database logging failed for email to ${sanitizeEmail(to)}: ${err.message}`);
      });
    }

    return { 
      success: true, 
      messageId: info.messageId, 
      previewUrl 
    };
  } catch (error) {
    logger.error(`Error sending ${type} email to ${sanitizeEmail(to)}:`, error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Sends a password recovery email
 * @param {string} recipient - User email
 * @param {string} userName - User name
 * @param {string} tokenOrLink - Recovery token or full link
 */
export const sendPasswordRecoveryEmail = async (recipient, userName, tokenOrLink) => {
  if (!recipient || !userName || !tokenOrLink) throw new Error('Missing required parameters for password recovery email');
  
  const recoveryLink = tokenOrLink.startsWith('http') 
    ? tokenOrLink 
    : `${process.env.FRONTEND_URL}/reset-password?token=${tokenOrLink}`;
    
  const payload = passwordRecoveryTemplate({ userName, recoveryLink });
  return sendEmail({ to: recipient, type: 'password_recovery', ...payload });
};

/**
 * Sends an email verification code
 * @param {string} recipient - User email
 * @param {string} userName - User name
 * @param {string} verificationToken - Token for the link
 * @param {string} verificationCode - 6-digit code
 */
export const sendEmailVerification = async (recipient, userName, verificationToken, verificationCode) => {
  if (!recipient || !userName || !verificationToken || !verificationCode) {
    throw new Error('Missing required parameters for email verification');
  }

  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  const payload = emailVerificationTemplate({ userName, verificationCode, verificationLink });
  return sendEmail({ to: recipient, type: 'email_verification', ...payload });
};

/**
 * Sends a workspace invitation
 * @param {string} recipient - Invitee email
 * @param {string} workspaceName - Name of the workspace
 * @param {string} inviterName - Name of the person inviting
 * @param {string} invitationToken - Token for the link
 */
export const sendWorkspaceInvitation = async (recipient, workspaceName, inviterName, invitationToken) => {
  if (!recipient || !workspaceName || !inviterName || !invitationToken) {
    throw new Error('Missing required parameters for workspace invitation');
  }

  const acceptLink = `${process.env.FRONTEND_URL}/accept-invitation?token=${invitationToken}`;
  const payload = workspaceInvitationTemplate({ inviterName, workspaceName, acceptLink });
  return sendEmail({ to: recipient, type: 'workspace_invitation', ...payload });
};

/**
 * Sends a space invitation
 * @param {string} recipient - Invitee email
 * @param {string} spaceName - Name of the space
 * @param {string} inviterName - Name of the person inviting
 * @param {string} invitationToken - Token for the link
 */
export const sendSpaceInvitation = async (recipient, spaceName, inviterName, invitationToken) => {
  if (!recipient || !spaceName || !inviterName || !invitationToken) {
    throw new Error('Missing required parameters for space invitation');
  }

  const acceptLink = `${process.env.FRONTEND_URL}/accept-space-invitation?token=${invitationToken}`;
  const payload = spaceInvitationTemplate({ inviterName, spaceName, acceptLink });
  return sendEmail({ to: recipient, type: 'space_invitation', ...payload });
};

/**
 * Sends a task assignment notification
 * @param {string} recipient - Assignee email
 * @param {string} userName - Assignee name
 * @param {Object} taskData - { title, workspaceName, id }
 * @param {string} assignerName - Name of the person assigning
 */
export const sendTaskAssignment = async (recipient, userName, taskData, assignerName) => {
  if (!recipient || !userName || !taskData?.id || !assignerName) {
    throw new Error('Missing required parameters for task assignment email');
  }

  const { title, workspaceName, id } = taskData;
  const taskLink = `${process.env.FRONTEND_URL}/tasks/${id}`;
  const payload = taskAssignmentTemplate({ 
    userName, 
    assignerName, 
    taskTitle: title, 
    workspaceName, 
    taskLink 
  });
  return sendEmail({ to: recipient, type: 'task_assignment', ...payload });
};

/**
 * Sends a mention notification
 * @param {string} recipient - User email
 * @param {string} userName - User name
 * @param {Object} mentionData - { commenterName, taskTitle, commentPreview, taskId }
 */
export const sendMentionEmail = async (recipient, userName, mentionData) => {
  if (!recipient || !userName || !mentionData?.taskId) {
    throw new Error('Missing required parameters for mention email');
  }

  const { commenterName, taskTitle, commentPreview, taskId } = mentionData;
  const taskLink = `${process.env.FRONTEND_URL}/tasks/${taskId}`;
  const payload = mentionTemplate({ 
    userName, 
    commenterName, 
    taskTitle, 
    commentPreview, 
    taskLink 
  });
  return sendEmail({ to: recipient, type: 'mention', ...payload });
};

/**
 * Sends a deadline reminder
 * @param {string} recipient - User email
 * @param {string} userName - User name
 * @param {Object} taskData - { title, deadline, id }
 */
export const sendDeadlineReminder = async (recipient, userName, taskData) => {
  if (!recipient || !userName || !taskData?.id || !taskData?.deadline) {
    throw new Error('Missing required parameters for deadline reminder');
  }

  const { title, deadline, id } = taskData;
  const taskLink = `${process.env.FRONTEND_URL}/tasks/${id}`;
  const deadlineStr = new Date(deadline).toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });
  const payload = deadlineReminderTemplate({ 
    userName, 
    taskTitle: title, 
    deadlineStr, 
    taskLink 
  });
  return sendEmail({ to: recipient, type: 'deadline_reminder', ...payload });
};

/**
 * Sends a GitHub PR merged notification
 * @param {string} recipient - User email
 * @param {string} userName - User name
 * @param {Object} prData - { prTitle, taskTitle, taskId, prUrl }
 */
export const sendPRMerged = async (recipient, userName, prData) => {
  if (!recipient || !userName || !prData?.prUrl) {
    throw new Error('Missing required parameters for PR merged email');
  }

  const { prTitle, taskTitle, taskId, prUrl } = prData;
  const taskLink = `${process.env.FRONTEND_URL}/tasks/${taskId}`;
  const payload = prMergedTemplate({ 
    userName, 
    prTitle, 
    taskTitle, 
    taskLink, 
    prUrl 
  });
  return sendEmail({ to: recipient, type: 'pr_merged', ...payload });
};

/**
 * Sends a new device login notification
 */
export const sendNewDeviceLogin = async (recipient, data) => {
  if (!recipient || !data?.userName || !data?.device) {
    throw new Error('Missing required parameters for new device login email');
  }
  const payload = newDeviceLoginTemplate(data);
  return sendEmail({ to: recipient, type: 'new_device_login', ...payload });
};

/**
 * Sends a 2FA code
 */
export const sendTwoFactorCode = async (recipient, data) => {
  if (!recipient || !data?.userName || !data?.code) {
    throw new Error('Missing required parameters for 2FA code email');
  }
  const payload = twoFactorCodeTemplate(data);
  return sendEmail({ to: recipient, type: 'two_factor_code', ...payload });
};

/**
 * Sends a password changed confirmation
 */
export const sendPasswordChanged = async (recipient, data) => {
  if (!recipient || !data?.userName || !data?.changedAt) {
    throw new Error('Missing required parameters for password changed email');
  }
  const payload = passwordChangedTemplate(data);
  return sendEmail({ to: recipient, type: 'password_changed', ...payload });
};

/**
 * Sends an account deletion confirmation
 */
export const sendAccountDeleted = async (recipient, data) => {
  if (!recipient || !data?.userName || !data?.deletionDate) {
    throw new Error('Missing required parameters for account deletion email');
  }
  const payload = accountDeletedTemplate(data);
  return sendEmail({ to: recipient, type: 'account_deleted', ...payload });
};

/**
 * Sends a payment success receipt
 */
export const sendPaymentSuccess = async (recipient, data) => {
  if (!recipient || !data?.userName || !data?.amount) {
    throw new Error('Missing required parameters for payment success email');
  }
  const payload = paymentSuccessTemplate(data);
  return sendEmail({ to: recipient, type: 'payment_success', ...payload });
};

/**
 * Sends a payment failed notification
 */
export const sendPaymentFailed = async (recipient, data) => {
  if (!recipient || !data?.userName || !data?.amount) {
    throw new Error('Missing required parameters for payment failed email');
  }
  const payload = paymentFailedTemplate(data);
  return sendEmail({ to: recipient, type: 'payment_failed', ...payload });
};

/**
 * Sends a trial ending soon notification
 */
export const sendTrialEnding = async (recipient, data) => {
  if (!recipient || !data?.userName || !data?.daysLeft) {
    throw new Error('Missing required parameters for trial ending email');
  }
  const payload = trialEndingTemplate(data);
  return sendEmail({ to: recipient, type: 'trial_ending', ...payload });
};

/**
 * Sends a subscription cancelled confirmation
 */
export const sendSubscriptionCancelled = async (recipient, data) => {
  if (!recipient || !data?.userName || !data?.planName) {
    throw new Error('Missing required parameters for subscription cancelled email');
  }
  const payload = subscriptionCancelledTemplate(data);
  return sendEmail({ to: recipient, type: 'subscription_cancelled', ...payload });
};

/**
 * Sends a subscription renewed confirmation
 */
export const sendSubscriptionRenewed = async (recipient, data) => {
  if (!recipient || !data?.userName || !data?.planName) {
    throw new Error('Missing required parameters for subscription renewed email');
  }
  const payload = subscriptionRenewedTemplate(data);
  return sendEmail({ to: recipient, type: 'subscription_renewed', ...payload });
};

/**
 * Sends a welcome email
 */
export const sendWelcomeEmail = async (recipient, data) => {
  if (!recipient || !data?.userName || !data?.ctaLink) {
    throw new Error('Missing required parameters for welcome email');
  }
  const payload = welcomeTemplate(data);
  return sendEmail({ to: recipient, type: 'welcome', ...payload });
};

/**
 * Sends an inactivity nudge
 */
export const sendInactivityNudge = async (recipient, data) => {
  if (!recipient || !data?.userName || !data?.lastLoginDate) {
    throw new Error('Missing required parameters for inactivity nudge email');
  }
  const payload = inactivityNudgeTemplate(data);
  return sendEmail({ to: recipient, type: 'inactivity_nudge', ...payload });
};

/**
 * Sends a digest/summary email
 */
export const sendDigestEmail = async (recipient, data) => {
  if (!recipient || !data?.userName || !data?.items) {
    throw new Error('Missing required parameters for digest email');
  }
  const payload = digestTemplate(data);
  return sendEmail({ to: recipient, type: 'digest', ...payload });
};

/**
 * Sends a maintenance scheduled notification
 */
export const sendMaintenanceScheduled = async (recipient, data) => {
  if (!recipient || !data?.userName || !data?.startTime) {
    throw new Error('Missing required parameters for maintenance email');
  }
  const payload = maintenanceScheduledTemplate(data);
  return sendEmail({ to: recipient, type: 'maintenance_scheduled', ...payload });
};

/**
 * Sends an API key event notification
 */
export const sendAPIKeyEvent = async (recipient, data) => {
  if (!recipient || !data?.userName || !data?.eventType) {
    throw new Error('Missing required parameters for API key event email');
  }
  const payload = apiKeyEventTemplate(data);
  return sendEmail({ to: recipient, type: 'api_key_event', ...payload });
};
