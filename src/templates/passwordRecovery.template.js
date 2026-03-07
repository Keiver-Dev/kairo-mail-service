import { baseTemplate } from './base.template.js';

export const passwordRecoveryTemplate = ({ userName, recoveryLink }) => {
  const subject = 'Password recovery - Kairo Studios';
  const headerColor = '#4F46E5';
  
  const bodyContent = `
    <p>Hi <span class="highlight">${userName}</span>,</p>
    <p>You have requested to reset your password. Click the following button to continue with the process:</p>
    <div style="text-align: center;">
      <a href="${recoveryLink}" class="button">Reset Password</a>
    </div>
    <div class="info-box">
      <strong>Important:</strong> This link will expire in 1 hour. If you did not request this change, you can safely ignore this email.
    </div>
    <p>If the button doesn't work, copy and paste the following link into your browser:</p>
    <p style="word-break: break-all; font-size: 12px; color: #6b7280;">${recoveryLink}</p>
  `;

  return {
    subject,
    html: baseTemplate({ headerColor, headerTitle: 'Recover Password', bodyContent }),
    text: `Hi ${userName}, you have requested to reset your password. Use the following link: ${recoveryLink}. Expires in 1 hour.`
  };
};
