import * as mailerService from '../services/mailer.service.js';
import logger from '../utils/logger.js';

export const passwordRecovery = async (req, res, next) => {
  try {
    const { email, userName, token } = req.body;
    const result = await mailerService.sendPasswordRecoveryEmail(email, userName, token);
    
    res.status(202).json({
      success: true,
      message: 'Recovery email accepted for delivery',
      messageId: result.messageId,
      previewUrl: result.previewUrl
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { email, userName, token, code } = req.body;
    const result = await mailerService.sendEmailVerification(email, userName, token, code);
    
    res.status(202).json({
      success: true,
      message: 'Verification email accepted for delivery',
      messageId: result.messageId,
      previewUrl: result.previewUrl
    });
  } catch (error) {
    next(error);
  }
};

export const workspaceInvitation = async (req, res, next) => {
  try {
    const { email, workspaceName, inviterName, token } = req.body;
    const result = await mailerService.sendWorkspaceInvitation(email, workspaceName, inviterName, token);
    
    res.status(202).json({
      success: true,
      message: 'Workspace invitation accepted for delivery',
      messageId: result.messageId,
      previewUrl: result.previewUrl
    });
  } catch (error) {
    next(error);
  }
};

export const taskAssignment = async (req, res, next) => {
  try {
    const { email, userName, taskData, assignerName } = req.body;
    const result = await mailerService.sendTaskAssignment(email, userName, taskData, assignerName);
    
    res.status(202).json({
      success: true,
      message: 'Task notification accepted for delivery',
      messageId: result.messageId,
      previewUrl: result.previewUrl
    });
  } catch (error) {
    next(error);
  }
};

export const spaceInvitation = async (req, res, next) => {
  try {
    const { email, spaceName, inviterName, token } = req.body;
    const result = await mailerService.sendSpaceInvitation(email, spaceName, inviterName, token);
    
    res.status(202).json({
      success: true,
      message: 'Space invitation accepted for delivery',
      messageId: result.messageId,
      previewUrl: result.previewUrl
    });
  } catch (error) {
    next(error);
  }
};

export const mention = async (req, res, next) => {
  try {
    const { email, userName, mentionData } = req.body;
    const result = await mailerService.sendMentionEmail(email, userName, mentionData);
    
    res.status(202).json({
      success: true,
      message: 'Mention notification accepted for delivery',
      messageId: result.messageId,
      previewUrl: result.previewUrl
    });
  } catch (error) {
    next(error);
  }
};

export const deadlineReminder = async (req, res, next) => {
  try {
    const { email, userName, taskData } = req.body;
    const result = await mailerService.sendDeadlineReminder(email, userName, taskData);
    
    res.status(202).json({
      success: true,
      message: 'Deadline reminder accepted for delivery',
      messageId: result.messageId,
      previewUrl: result.previewUrl
    });
  } catch (error) {
    next(error);
  }
};

export const prMerged = async (req, res, next) => {
  try {
    const { email, userName, prData } = req.body;
    const result = await mailerService.sendPRMerged(email, userName, prData);
    
    res.status(202).json({
      success: true,
      message: 'PR merged notification accepted for delivery',
      messageId: result.messageId,
      previewUrl: result.previewUrl
    });
  } catch (error) {
    next(error);
  }
};
