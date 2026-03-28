import { baseTemplate } from './base.template.js';

export const paymentSuccessTemplate = ({ userName, amount, plan, invoiceLink, nextBillingDate, appName = 'Letterbox' }) => {
  const subject = `Your payment of ${amount} was successful - ${appName}`;
  const headerColor = '#10b981';

  const bodyContent = `
    <p>Hi <span class="highlight">${userName}</span>,</p>
    <p>Thank you for choosing <span class="highlight">${appName}</span>! This email confirms that we've successfully processed your payment.</p>
    
    <div class="info-box">
      <p><strong>Amount:</strong> ${amount}</p>
      <p><strong>Plan:</strong> ${plan}</p>
      ${nextBillingDate ? `<p><strong>Next Billing Date:</strong> ${new Date(nextBillingDate).toLocaleDateString()}</p>` : ''}
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${invoiceLink}" class="button">Download Invoice</a>
    </div>
    
    <p>We appreciate your business! If you have any questions regarding this charge, please contact our billing team.</p>
  `;

  return {
    subject,
    html: baseTemplate({ headerColor, headerTitle: 'Payment Received', bodyContent }),
    text: `Hi ${userName}, your payment of ${amount} for ${plan} was successful. Download your invoice here: ${invoiceLink}`
  };
};
