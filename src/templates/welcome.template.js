import { baseTemplate } from './base.template.js';

export const welcomeTemplate = ({ userName, ctaLabel, ctaLink, appName = 'Letterbox', supportEmail = 'support@letterbox.com' }) => {
  const subject = `Welcome to ${appName}, ${userName}!`;
  const headerColor = '#6366f1';

  const bodyContent = `
    <p>Hi <span class="highlight">${userName}</span>,</p>
    <p>We're thrilled to have you join <span class="highlight">${appName}</span>! You're now part of a community dedicated to productivity and collaboration.</p>
    
    <p>To help you get started, we've prepared a quick setup guide. Click the button below to dive in:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${ctaLink}" class="button">${ctaLabel}</a>
    </div>
    
    <div class="info-box">
      <p><strong>Need help?</strong> Our support team is always here for you. Just reply to this email or contact us at <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
    </div>
    
    <p>Welcome aboard!</p>
  `;

  return {
    subject,
    html: baseTemplate({ headerColor, headerTitle: 'Welcome to Letterbox', bodyContent }),
    text: `Hi ${userName}, welcome to ${appName}! Get started here: ${ctaLink}`
  };
};
