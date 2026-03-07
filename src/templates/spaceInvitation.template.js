import { baseTemplate } from './base.template.js';

/**
 * Template for space invitations
 * @param {Object} params
 * @param {string} params.inviterName - Name of the person who invited the user
 * @param {string} params.spaceName - Name of the space
 * @param {string} params.acceptLink - Link to accept the invitation
 */
export const spaceInvitationTemplate = ({ inviterName, spaceName, acceptLink }) => {
  const subject = `Invitation to join the space: ${spaceName}`;
  const headerColor = '#4F46E5'; // Indigo
  const headerTitle = 'Space Invitation';

  const bodyContent = `
    <p>Hi,</p>
    <p><span class="highlight">${inviterName}</span> has invited you to join the space <span class="highlight">${spaceName}</span>.</p>
    <p>In this space, you can collaborate on tasks, share ideas, and keep everything organized.</p>
    
    <div style="text-align: center;">
      <a href="${acceptLink}" class="button">Accept Invitation</a>
    </div>

    <div class="info-box">
      <strong>Note:</strong> This invitation will expire in 7 days.
    </div>

    <p>If you didn't expect this invitation, you can safely ignore this email.</p>
  `;

  const html = baseTemplate({ headerColor, headerTitle, bodyContent });
  
  const text = `
    Invitation to join the space: ${spaceName}
    
    Hi,
    
    ${inviterName} has invited you to join the space ${spaceName}.
    
    Accept the invitation by clicking the following link:
    ${acceptLink}
    
    Note: This invitation will expire in 7 days.
    
    If you didn't expect this invitation, you can safely ignore this email.
  `;

  return { subject, html, text };
};
