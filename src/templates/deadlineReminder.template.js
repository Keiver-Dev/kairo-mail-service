import { baseTemplate } from './base.template.js';

/**
 * Template for task deadline reminders
 * @param {Object} params
 * @param {string} params.userName - Name of the user
 * @param {string} params.taskTitle - Title of the task
 * @param {string} params.deadlineStr - Formatted deadline date string
 * @param {string} params.taskLink - Link to the task
 */
export const deadlineReminderTemplate = ({ userName, taskTitle, deadlineStr, taskLink }) => {
  const subject = `Upcoming Deadline: ${taskTitle}`;
  const headerColor = '#EF4444'; // Red
  const headerTitle = 'Deadline Reminder';

  const bodyContent = `
    <p>Hi ${userName},</p>
    <p>This is a reminder that the task <span class="highlight">${taskTitle}</span> is approaching its deadline.</p>
    
    <div class="info-box" style="border-left-color: #EF4444;">
      <strong style="color: #EF4444;">Deadline:</strong> <span style="font-weight: 600;">${deadlineStr}</span>
    </div>
    
    <div style="text-align: center;">
      <a href="${taskLink}" class="button" style="background-color: #EF4444;">View Task Details</a>
    </div>

    <p>Don't let it slip!</p>
  `;

  const html = baseTemplate({ headerColor, headerTitle, bodyContent });
  
  const text = `
    Upcoming Deadline: ${taskTitle}
    
    Hi ${userName},
    
    This is a reminder that the task "${taskTitle}" is approaching its deadline.
    
    Deadline: ${deadlineStr}
    
    View the task details here:
    ${taskLink}
  `;

  return { subject, html, text };
};
