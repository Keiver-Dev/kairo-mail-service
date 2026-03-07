export const spaceInvitationTemplate = ({ inviterName, spaceName, acceptLink }) => {
  const subject = `Invitation to join the space: ${spaceName}`;
  const headerColor = '#6366f1'; 
  const headerTitle = 'Space Invitation';

  const bodyContent = `
    <p>Hi,</p>
    <p><span class="highlight">${inviterName}</span> has invited you to join the space <span class="highlight">${spaceName}</span>.</p>
    <p>In this space, you can collaborate on tasks, share ideas, and keep everything organized efficiently.</p>
    
    <div style="text-align: center; margin: 35px 0;">
      <a href="${acceptLink}" class="button">Accept Invitation</a>
    </div>

    <div class="info-box">
      <strong>Note:</strong> This invitation will expire in 7 days. If you didn't expect this, you can safely ignore this email.
    </div>
  `;

  const html = baseTemplate({ headerColor, headerTitle, bodyContent });
  
  const text = `
    Invitation to join the space: ${spaceName}
    
    Hi,
    
    ${inviterName} has invited you to join the space ${spaceName}.
    
    Accept the invitation by clicking the following link:
    ${acceptLink}
    
    Note: This invitation will expire in 7 days.
  `;

  return { subject, html, text };
};
