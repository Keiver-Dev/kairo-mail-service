import { baseTemplate } from './base.template.js';

export const inactivityNudgeTemplate = ({ userName, lastLoginDate, ctaLabel, ctaLink, appName = 'Letterbox' }) => {
  const subject = `We miss you, ${userName}!`;
  const headerColor = '#4f46e5';

  const bodyContent = `
    <p>Hi <span class="highlight">${userName}</span>,</p>
    <p>It's been a while since we last saw you at <span class="highlight">${appName}</span> (last active on ${new Date(lastLoginDate).toLocaleDateString()}).</p>
    
    <p>We've been busy making improvements and adding new features that we think you'll love. Why not take a quick look?</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${ctaLink}" class="button">${ctaLabel}</a>
    </div>
    
    <div class="info-box">
      <p>If you're having any trouble with your account, please let us know. We're here to help you get back on track!</p>
    </div>
  `;

  return {
    subject,
    html: baseTemplate({ headerColor, headerTitle: 'Come Back and See Us', bodyContent }),
    text: `Hi ${userName}, we miss you! Pick up where you left off: ${ctaLink}`
  };
};
