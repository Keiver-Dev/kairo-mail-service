import { baseTemplate } from './base.template.js';

export const maintenanceScheduledTemplate = ({ userName, startTime, estimatedDuration, affectedServices, statusPageLink, appName = 'Letterbox' }) => {
  const subject = `Scheduled Maintenance Notice - ${appName}`;
  const headerColor = '#64748b';

  const bodyContent = `
    <p>Hi <span class="highlight">${userName}</span>,</p>
    <p>We're writing to let you know about upcoming scheduled maintenance for <span class="highlight">${appName}</span>.</p>
    
    <div class="info-box">
      <p><strong>Start Time:</strong> ${new Date(startTime).toLocaleString()}</p>
      <p><strong>Estimated Duration:</strong> ${estimatedDuration}</p>
      ${affectedServices ? `<p><strong>Affected Services:</strong> ${affectedServices}</p>` : ''}
    </div>
    
    <p>During this window, you may experience brief interruptions or be unable to access certain features. We apologize for any inconvenience this may cause.</p>
    
    ${statusPageLink ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${statusPageLink}" class="button">View Status Page</a>
    </div>
    ` : ''}
    
    <p>Thank you for your patience as we work to improve our services.</p>
  `;

  return {
    subject,
    html: baseTemplate({ headerColor, headerTitle: 'Maintenance Notice', bodyContent }),
    text: `Hi ${userName}, scheduled maintenance for ${appName} starts at ${startTime}. Expected duration: ${estimatedDuration}.`
  };
};
