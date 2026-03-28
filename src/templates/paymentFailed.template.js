import { baseTemplate } from './base.template.js';

export const paymentFailedTemplate = ({ userName, amount, retryDate, updatePaymentLink, appName = 'Letterbox' }) => {
  const subject = `Urgent: Payment failed for ${appName}`;
  const headerColor = '#ef4444';

  const bodyContent = `
    <p>Hi <span class="highlight">${userName}</span>,</p>
    <p>We were unable to process your recent payment of <strong class="highlight">${amount}</strong> for your <span class="highlight">${appName}</span> subscription.</p>
    
    <div class="info-box" style="border-left: 4px solid #ef4444;">
      <p>To avoid any interruption to your service, please update your payment method.</p>
      ${retryDate ? `<p>We will automatically try again on <strong>${new Date(retryDate).toLocaleDateString()}</strong>.</p>` : ''}
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${updatePaymentLink}" class="button" style="background-color: #ef4444;">Update Payment Method</a>
    </div>
    
    <p>If you've already updated your information, please ignore this message. If you need help, don't hesitate to reach out to our support team.</p>
  `;

  return {
    subject,
    html: baseTemplate({ headerColor, headerTitle: 'Payment Failed', bodyContent }),
    text: `Hi ${userName}, your payment of ${amount} failed. Please update your payment method here: ${updatePaymentLink}`
  };
};
