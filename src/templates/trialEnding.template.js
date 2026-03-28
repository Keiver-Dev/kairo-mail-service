import { baseTemplate } from './base.template.js';

export const trialEndingTemplate = ({ userName, daysLeft, upgradeLink, planName = 'Pro', appName = 'Letterbox' }) => {
  const subject = `Your ${appName} trial ends in ${daysLeft} days`;
  const headerColor = '#f59e0b'; // Warning amber

  const bodyContent = `
    <p>Hi <span class="highlight">${userName}</span>,</p>
    <p>We hope you've been enjoying <span class="highlight">${appName}</span>! This is a friendly reminder that your free trial will expire in <strong class="highlight">${daysLeft} days</strong>.</p>
    
    <div class="info-box">
      <p>To keep access to all your premium features and data, you can upgrade to the <strong>${planName}</strong> plan today.</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${upgradeLink}" class="button" style="background-color: #f59e0b;">Upgrade Now</a>
    </div>
    
    <p>If you have any questions about our plans or features, we're here to help!</p>
  `;

  return {
    subject,
    html: baseTemplate({ headerColor, headerTitle: 'Trial Ending Soon', bodyContent }),
    text: `Hi ${userName}, your trial ends in ${daysLeft} days. Upgrade here: ${upgradeLink}`
  };
};
