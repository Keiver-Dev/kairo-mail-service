import { baseTemplate } from './base.template.js';

/**
 * Template for GitHub PR merged notifications
 * @param {Object} params
 * @param {string} params.userName - Name of the user
 * @param {string} params.prTitle - Title of the pull request
 * @param {string} params.taskTitle - Title of the related task
 * @param {string} params.taskLink - Link to the task
 * @param {string} params.prUrl - Link to the GitHub PR
 */
export const prMergedTemplate = ({ userName, prTitle, taskTitle, taskLink, prUrl }) => {
  const subject = `PR Merged: ${prTitle}`;
  const headerColor = '#10B981'; // Green
  const headerTitle = 'Pull Request Merged';

  const bodyContent = `
    <p>Hi ${userName},</p>
    <p>Great news! The pull request <span class="highlight">${prTitle}</span> has been successfully merged.</p>
    
    <p>This PR is linked to the task: <span class="highlight">${taskTitle}</span>.</p>
    
    <div style="text-align: center; margin-top: 20px;">
      <a href="${prUrl}" class="button" style="background-color: #059669; margin-right: 10px;">View on GitHub</a>
      <a href="${taskLink}" class="button">View Task</a>
    </div>

    <p>Excellent work!</p>
  `;

  const html = baseTemplate({ headerColor, headerTitle, bodyContent });
  
  const text = `
    Pull Request Merged: ${prTitle}
    
    Hi ${userName},
    
    Great news! The pull request "${prTitle}" has been successfully merged.
    
    This PR is linked to the task: "${taskTitle}".
    
    View on GitHub: ${prUrl}
    View Task: ${taskLink}
  `;

  return { subject, html, text };
};
