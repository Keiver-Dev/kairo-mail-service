import { baseTemplate } from './base.template.js';

export const subscriptionRenewedTemplate = ({ userName, planName, amount, nextBillingDate, invoiceLink, appName = 'Letterbox' }) => {
  const subject = `Your subscription has been renewed - ${appName}`;
  const headerColor = '#10b981';

  const bodyContent = `
    <p>Hi <span class="highlight">${userName}</span>,</p>
    <p>Great news! Your <strong>${planName}</strong> subscription for <span class="highlight">${appName}</span> has been successfully renewed.</p>
    
    <div class="info-box">
      <p><strong>Amount Charged:</strong> ${amount}</p>
      <p><strong>Next Renewal Date:</strong> ${new Date(nextBillingDate).toLocaleDateString()}</p>
    </div>
    
    ${invoiceLink ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${invoiceLink}" class="button">View Invoice</a>
    </div>
    ` : ''}
    
    <p>Thank you for being a valued member of our community!</p>
  `;

  return {
    subject,
    html: baseTemplate({ headerColor, headerTitle: 'Subscription Renewed', bodyContent }),
    text: `Hi ${userName}, your ${planName} subscription was renewed for ${amount}. Next renewal: ${nextBillingDate}`
  };
};
