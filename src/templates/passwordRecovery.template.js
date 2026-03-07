export const passwordRecoveryTemplate = ({ userName, recoveryLink }) => {
  const subject = 'Reset your password - Keiver-Dev';
  const headerColor = '#4f46e5';
  
  const bodyContent = `
    <p>Hi <span class="highlight">${userName}</span>,</p>
    <p>We received a request to reset the password for your account. No worries, it happens! Click the button below to choose a new one:</p>
    <div style="text-align: center; margin: 35px 0;">
      <a href="${recoveryLink}" class="button">Reset Password</a>
    </div>
    <div class="info-box">
      <strong>Important:</strong> This secure link will expire in 1 hour. If you did not request this change, please ignore this email or contact support if you have concerns.
    </div>
    <p style="font-size: 13px; color: #94a3b8; text-align: center;">
      If the button above doesn't work, copy and paste this link into your browser:<br>
      <span style="word-break: break-all; color: #6366f1;">${recoveryLink}</span>
    </p>
  `;

  return {
    subject,
    html: baseTemplate({ headerColor, headerTitle: 'Password Recovery', bodyContent }),
    text: `Hi ${userName}, reset your password using this link: ${recoveryLink}. Valid for 1 hour.`
  };
};
