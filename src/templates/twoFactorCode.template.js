import { baseTemplate } from './base.template.js';

export const twoFactorCodeTemplate = ({ userName, code, expiresIn = '5 minutes', appName = 'Letterbox' }) => {
  const subject = `${code} is your 2FA verification code`;
  const headerColor = '#4f46e5';

  const bodyContent = `
    <p>Hi <span class="highlight">${userName}</span>,</p>
    <p>Use the following code to complete your two-factor authentication for <span class="highlight">${appName}</span>:</p>
    
    <div style="text-align: center; margin: 40px 0;">
      <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; padding: 20px; background-color: #f1f5f9; color: #4f46e5; border-radius: 12px; display: inline-block; border: 1px solid #e2e8f0;">
        ${code}
      </div>
    </div>
    
    <p>This code will expire in <strong class="highlight">${expiresIn}</strong>.</p>
    
    <div class="info-box">
      <strong>Important:</strong> If you did not request this code, your account password may be compromised. Please change your password immediately.
    </div>
  `;

  return {
    subject,
    html: baseTemplate({ headerColor, headerTitle: 'Two-Factor Authentication', bodyContent }),
    text: `Hi ${userName}, your 2FA code is ${code}. It expires in ${expiresIn}.`
  };
};
