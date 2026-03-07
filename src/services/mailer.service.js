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

    // Placeholder for DB Logging (Phase 8 integration)
    try {
      if (pool) {
        // This is safe to run as it's fire-and-forget in terms of the API response
        pool.query(
          'INSERT INTO email_logs (recipient, subject, type, message_id, status) VALUES ($1, $2, $3, $4, $5)',
          [sanitizeEmail(to), subject, type, info.messageId, 'sent']
        ).catch(() => { /* Table might not exist yet, ignore silenty */ });
      }
    } catch (dbErr) {
      // Just a placeholder, don't break the email flow
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
