export const prMergedTemplate = ({ userName, prTitle, taskTitle, taskLink, prUrl }) => {
  const subject = `PR Merged: ${prTitle}`;
  const headerColor = '#10b981'; // Green
  const headerTitle = 'Pull Request Merged';

  const bodyContent = `
    <p>Hi <span class="highlight">${userName}</span>,</p>
    <p>Excellent news! The pull request <span class="highlight">${prTitle}</span> has been successfully merged into the codebase.</p>
    
    <p>This PR is linked to the task: <span class="highlight">${taskTitle}</span>. Your contribution has been integrated!</p>
    
    <div style="text-align: center; margin: 40px 0;">
      <a href="${prUrl}" class="button" style="background-color: #059669; margin-right: 15px;">View on GitHub</a>
      <a href="${taskLink}" class="button" style="background-color: #1e293b;">View Task</a>
    </div>

    <p style="text-align: center; color: #94a3b8; font-size: 14px;">Keep up the great work!</p>
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
