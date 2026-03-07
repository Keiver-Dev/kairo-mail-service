export const deadlineReminderTemplate = ({ userName, taskTitle, deadlineStr, taskLink }) => {
  const subject = `Upcoming Deadline: ${taskTitle}`;
  const headerColor = '#f43f5e'; // Rose/Red
  const headerTitle = 'Deadline Reminder';

  const bodyContent = `
    <p>Hi <span class="highlight">${userName}</span>,</p>
    <p>This is a friendly reminder that the task <span class="highlight">${taskTitle}</span> is approaching its deadline.</p>
    
    <div class="info-box" style="border-radius: 12px; border: 1px solid #fecdd3; background-color: #fff1f2;">
      <p style="margin: 0; color: #e11d48; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.025em;">Deadline</p>
      <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: 600; color: #1e293b;">${deadlineStr}</p>
    </div>
    
    <div style="text-align: center; margin: 35px 0;">
      <a href="${taskLink}" class="button" style="background-color: #f43f5e;">View Task Details</a>
    </div>

    <p style="text-align: center; color: #94a3b8; font-size: 14px;">Don't let it slip!</p>
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
