import { baseTemplate } from './base.template.js';

export const emailVerificationTemplate = ({ userName, verificationCode, verificationLink }) => {
  const subject = 'Verify your account - Kairo Studios';
  const headerColor = '#10B981';

  const bodyContent = `
    <p>Hi <span class="highlight">${userName}</span>,</p>
    <p>Thank you for signing up. To activate your account, please use the following verification code:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 10px 20px; border: 2px dashed ${headerColor}; border-radius: 8px;">
        ${verificationCode}
      </span>
    </div>
    <p>Alternatively, click the button below:</p>
    <div style="text-align: center;">
      <a href="${verificationLink}" class="button">Verify Email</a>
    </div>
    <div class="info-box">
      This code and link will expire in 24 hours.
    </div>
  `;

  return {
    subject,
    html: baseTemplate({ headerColor, headerTitle: 'Email Verification', bodyContent }),
    text: `Hi ${userName}, your verification code is: ${verificationCode}. Or use this link: ${verificationLink}`
  };
};
