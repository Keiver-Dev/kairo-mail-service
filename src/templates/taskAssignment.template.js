import { baseTemplate } from './base.template.js';

export const taskAssignmentTemplate = ({ userName, assignerName, taskTitle, workspaceName, taskLink }) => {
  const subject = `New task assigned: ${taskTitle}`;
  const headerColor = '#4F46E5';

  const bodyContent = `
    <p>Hi <span class="highlight">${userName}</span>,</p>
    <p><span class="highlight">${assignerName}</span> has assigned you a new task in <span class="highlight">${workspaceName}</span>.</p>
    <div class="info-box">
      <h3 style="margin-top: 0;">${taskTitle}</h3>
      <p style="margin-bottom: 0;">Workspace: ${workspaceName}</p>
    </div>
    <div style="text-align: center;">
      <a href="${taskLink}" class="button">View Task Details</a>
    </div>
  `;

  return {
    subject,
    html: baseTemplate({ headerColor, headerTitle: 'New Task Assigned', bodyContent }),
    text: `Hi ${userName}, ${assignerName} has assigned you the task "${taskTitle}" in ${workspaceName}. View here: ${taskLink}`
  };
};
