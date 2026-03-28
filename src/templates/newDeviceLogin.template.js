import { baseTemplate } from './base.template.js';

export const newDeviceLoginTemplate = ({ userName, device, location, loginTime, blockLink, appName = 'Letterbox' }) => {
  const subject = `New device login detected - ${appName}`;
  const headerColor = '#ef4444'; // Security alert red

  const bodyContent = `
    <p>Hi <span class="highlight">${userName}</span>,</p>
    <p>We detected a new login to your account. If this was you, you can safely ignore this email.</p>
    
    <div class="info-box">
      <p><strong>Device:</strong> ${device}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Time:</strong> ${new Date(loginTime).toLocaleString()}</p>
    </div>
    
    <p><strong>Wasn't you?</strong> If you don't recognize this activity, please secure your account immediately by revoking the session below:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${blockLink}" class="button" style="background-color: #ef4444;">Revoke Session</a>
    </div>
    
    <div class="info-box">
      <strong>Security Tip:</strong> We recommend enabling Two-Factor Authentication (2FA) to keep your account even more secure.
    </div>
  `;

  return {
    subject,
    html: baseTemplate({ headerColor, headerTitle: 'New Login Detected', bodyContent }),
    text: `Hi ${userName}, a new login was detected on your account from ${device} in ${location} at ${loginTime}. If this wasn't you, revoke the session here: ${blockLink}`
  };
};
