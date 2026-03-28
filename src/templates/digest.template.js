import { baseTemplate } from './base.template.js';

export const digestTemplate = ({ userName, periodLabel, items, ctaLabel = 'Go to Dashboard', ctaLink, appName = 'Letterbox' }) => {
  const subject = `Your ${periodLabel} summary - ${appName}`;
  const headerColor = '#3b82f6';

  const itemsHtml = items.map(item => `
    <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #f1f5f9;">
      <h3 style="margin: 0 0 5px 0; font-size: 16px; color: #1e293b;">${item.title}</h3>
      <p style="margin: 0 0 5px 0; font-size: 14px; color: #64748b;">${item.description}</p>
      ${item.link ? `<a href="${item.link}" style="font-size: 13px; color: #6366f1; text-decoration: none; font-weight: 500;">View details &rarr;</a>` : ''}
    </div>
  `).join('');

  const bodyContent = `
    <p>Hi <span class="highlight">${userName}</span>,</p>
    <p>Here's a summary of what's been happening in <span class="highlight">${appName}</span> during the <strong>${periodLabel}</strong>:</p>
    
    <div class="info-box" style="background-color: #ffffff;">
      ${itemsHtml}
    </div>
    
    ${ctaLink ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${ctaLink}" class="button">${ctaLabel}</a>
    </div>
    ` : ''}
  `;

  return {
    subject,
    html: baseTemplate({ headerColor, headerTitle: 'Your Activity Summary', bodyContent }),
    text: `Hi ${userName}, here is your ${periodLabel} summary from ${appName}.`
  };
};
