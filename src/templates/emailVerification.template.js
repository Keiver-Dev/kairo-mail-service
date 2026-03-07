export const emailVerificationTemplate = ({ userName, verificationCode, verificationLink }) => {
  const subject = 'Verify your account - Keiver-Dev';
  const headerColor = '#6366f1';

  const bodyContent = `
    <p>Hi <span class="highlight">${userName}</span>,</p>
    <p>Welcome! We're excited to have you on board. To complete your registration and activate your account, please use the verification code below:</p>
    <div style="text-align: center; margin: 40px 0;">
      <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; padding: 20px; background-color: #f1f5f9; color: #4f46e5; border-radius: 12px; display: inline-block; border: 1px solid #e2e8f0;">
        ${verificationCode}
      </div>
    </div>
    <p>Or simply click the button below to verify automatically:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationLink}" class="button">Verify My Email</a>
    </div>
    <div class="info-box">
      <strong>Note:</strong> This verification request will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
    </div>
  `;

  return {
    subject,
    html: baseTemplate({ headerColor, headerTitle: 'Confirm Your Email', bodyContent }),
    text: `Hi ${userName}, welcome! Use code ${verificationCode} or link: ${verificationLink} to verify your account.`
  };
};
