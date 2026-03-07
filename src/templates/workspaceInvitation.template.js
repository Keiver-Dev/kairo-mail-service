export const workspaceInvitationTemplate = ({ inviterName, workspaceName, acceptLink }) => {
  const subject = `Invitation to Workspace: ${workspaceName}`;
  const headerColor = '#3b82f6';

  const bodyContent = `
    <p>Hi there,</p>
    <p><span class="highlight">${inviterName}</span> has invited you to join the workspace <span class="highlight">${workspaceName}</span>.</p>
    <p>We're excited to have you on the team! Collaborative work is just one click away.</p>
    <div style="text-align: center; margin: 35px 0;">
      <a href="${acceptLink}" class="button">Accept Invitation</a>
    </div>
    <div class="info-box">
      <strong>Note:</strong> This invitation will expire in 7 days.
    </div>
  `;

  return {
    subject,
    html: baseTemplate({ headerColor, headerTitle: 'Workspace Invitation', bodyContent }),
    text: `${inviterName} has invited you to ${workspaceName}. Accept here: ${acceptLink}`
  };
};
