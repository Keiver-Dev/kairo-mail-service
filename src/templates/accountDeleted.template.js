import { baseTemplate } from './base.template.js';

export const accountDeletedTemplate = ({ userName, deletionDate, undoLink, appName = 'Letterbox' }) => {
  const subject = `Account deletion requested - ${appName}`;
  const headerColor = '#64748b'; // Neutral slate

  const bodyContent = `
    <p>Hi <span class="highlight">${userName}</span>,</p>
    <p>We've received your request to delete your <span class="highlight">${appName}</span> account.</p>
    
    <div class="info-box">
      <p>Your data is scheduled to be fully purged on <strong>${new Date(deletionDate).toLocaleDateString()}</strong>.</p>
    </div>
    
    ${undoLink ? `
    <p><strong>Changed your mind?</strong> If you didn't mean to delete your account or if you've changed your mind, you can undo this request within the grace period by clicking the button below:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${undoLink}" class="button">Undo Deletion</a>
    </div>
    ` : '<p>If you have any questions before you go, feel free to reply to this email.</p>'}
    
    <p>We're sorry to see you go and hope to see you again in the future.</p>
  `;

  return {
    subject,
    html: baseTemplate({ headerColor, headerTitle: 'Account Deletion', bodyContent }),
    text: `Hi ${userName}, your account deletion is scheduled for ${deletionDate}. ${undoLink ? `Undo here: ${undoLink}` : ''}`
  };
};
