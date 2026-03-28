import { baseTemplate } from './base.template.js';

export const subscriptionCancelledTemplate = ({ userName, planName, accessUntil, feedbackLink, reactivateLink, appName = 'Letterbox' }) => {
  const subject = `Subscription cancelled - ${appName}`;
  const headerColor = '#64748b';

  const bodyContent = `
    <p>Hi <span class="highlight">${userName}</span>,</p>
    <p>This email confirms that your <strong>${planName}</strong> subscription has been cancelled.</p>
    
    <div class="info-box">
      <p>You will continue to have access to your premium features until <strong>${new Date(accessUntil).toLocaleDateString()}</strong>.</p>
    </div>
    
    ${feedbackLink ? `
    <p>We're sad to see you go! If you have a moment, we'd love to hear why you decided to leave:</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${feedbackLink}" style="color: #6366f1; font-weight: 500;">Share your feedback</a>
    </div>
    ` : ''}
    
    ${reactivateLink ? `
    <p>If this was a mistake or you change your mind, you can reactivate your subscription anytime:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${reactivateLink}" class="button">Reactivate Subscription</a>
    </div>
    ` : ''}
  `;

  return {
    subject,
    html: baseTemplate({ headerColor, headerTitle: 'Subscription Cancelled', bodyContent }),
    text: `Hi ${userName}, your ${planName} subscription was cancelled. You have access until ${accessUntil}.`
  };
};
