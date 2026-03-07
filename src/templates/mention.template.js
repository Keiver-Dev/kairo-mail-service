export const mentionTemplate = ({ userName, commenterName, taskTitle, commentPreview, taskLink }) => {
  const subject = `${commenterName} mentioned you in: ${taskTitle}`;
  const headerColor = '#8b5cf6'; // Violet
  const headerTitle = 'New Mention';

  const bodyContent = `
    <p>Hi <span class="highlight">${userName}</span>,</p>
    <p><span class="highlight">${commenterName}</span> mentioned you in a comment on the task <span class="highlight">${taskTitle}</span>:</p>
    
    <div style="background-color: #f8fafc; border-left: 4px solid #8b5cf6; padding: 25px; border-radius: 12px; font-style: italic; color: #475569; margin: 30px 0; border: 1px solid #e2e8f0; border-left-width: 4px;">
      "${commentPreview}"
    </div>
    
    <div style="text-align: center; margin: 35px 0;">
      <a href="${taskLink}" class="button">Reply to Comment</a>
    </div>

    <p style="text-align: center; color: #94a3b8; font-size: 14px;">Stay productive!</p>
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
