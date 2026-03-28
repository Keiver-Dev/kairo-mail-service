import { baseTemplate } from './base.template.js';

export const passwordChangedTemplate = ({ userName, changedAt, recoveryLink, appName = 'Letterbox' }) => {
  const subject = `Your password was successfully changed - ${appName}`;
  const headerColor = '#10b981'; // Success green

  const bodyContent = `
    <p>Hi <span class="highlight">${userName}</span>,</p>
    <p>This is a confirmation that the password for your <span class="highlight">${appName}</span> account was changed on <strong>${new Date(changedAt).toLocaleString()}</strong>.</p>
    
    <div class="info-box">
      <p>If you made this change, you can safely ignore this email.</p>
    </div>
    
    <p><strong>Wasn't you?</strong> If you didn't change your password, your account may have been compromised. Please use the link below to recover your account and secure it:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${recoveryLink}" class="button">Recover Account</a>
    </div>
    
    <p>For security reasons, we recommend that you do not reuse passwords across different platforms.</p>
  `;

  return {
    subject,
    html: baseTemplate({ headerColor, headerTitle: 'Password Changed', bodyContent }),
    text: `Hi ${userName}, your password was changed on ${changedAt}. If this wasn't you, recover your account here: ${recoveryLink}`
  };
};
