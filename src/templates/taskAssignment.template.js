export const taskAssignmentTemplate = ({ userName, assignerName, taskTitle, workspaceName, taskLink }) => {
  const subject = `New task assigned: ${taskTitle}`;
  const headerColor = '#6366f1';

  const bodyContent = `
    <p>Hi <span class="highlight">${userName}</span>,</p>
    <p><span class="highlight">${assignerName}</span> has assigned you a new task in <span class="highlight">${workspaceName}</span>.</p>
    <div class="info-box">
      <h3 style="margin-top: 0; color: #1e293b; font-size: 18px;">${taskTitle}</h3>
      <p style="margin-bottom: 0; color: #64748b;">Workspace: <span class="highlight">${workspaceName}</span></p>
    </div>
    <div style="text-align: center; margin: 35px 0;">
      <a href="${taskLink}" class="button">View Task Details</a>
    </div>
  `;

  return {
    subject,
    html: baseTemplate({ headerColor, headerTitle: 'New Task Assigned', bodyContent }),
    text: `Hi ${userName}, ${assignerName} has assigned you the task "${taskTitle}" in ${workspaceName}. View here: ${taskLink}`
  };
};
