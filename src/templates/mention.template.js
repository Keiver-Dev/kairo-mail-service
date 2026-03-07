import { baseTemplate } from './base.template.js';

/**
 * Template for mentions in comments
 * @param {Object} params
 * @param {string} params.userName - Name of the user being mentioned
 * @param {string} params.commenterName - Name of the person who mentioned the user
 * @param {string} params.taskTitle - Title of the task where the mention occurred
 * @param {string} params.commentPreview - Preview text of the comment
 * @param {string} params.taskLink - Link to the task
 */
export const mentionTemplate = ({ userName, commenterName, taskTitle, commentPreview, taskLink }) => {
  const subject = `${commenterName} mentioned you in: ${taskTitle}`;
  const headerColor = '#8B5CF6'; // Violet
  const headerTitle = 'New Mention';

  const bodyContent = `
    <p>Hi ${userName},</p>
    <p><span class="highlight">${commenterName}</span> mentioned you in a comment on the task <span class="highlight">${taskTitle}</span>:</p>
    
    <div style="background-color: #f9fafb; border-left: 4px solid #e5e7eb; padding: 15px; font-style: italic; color: #4b5563; margin: 20px 0;">
      "${commentPreview}"
    </div>
    
    <div style="text-align: center;">
      <a href="${taskLink}" class="button">Reply to Comment</a>
    </div>

    <p>Stay productive!</p>
  `;

  const html = baseTemplate({ headerColor, headerTitle, bodyContent });
  
  const text = `
    ${commenterName} mentioned you in: ${taskTitle}
    
    Hi ${userName},
    
    ${commenterName} mentioned you in a comment on the task "${taskTitle}":
    
    "${commentPreview}"
    
    View the task and reply here:
    ${taskLink}
  `;

  return { subject, html, text };
};
