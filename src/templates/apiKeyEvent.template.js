import { baseTemplate } from './base.template.js';

export const apiKeyEventTemplate = ({ userName, eventType, keyHint, revokeLink, appName = 'Letterbox' }) => {
  const isGenerated = eventType === 'generated';
  const subject = `API Key ${isGenerated ? 'Generated' : 'Rotated'} - ${appName}`;
  const headerColor = '#4f46e5';

  const bodyContent = `
    <p>Hi <span class="highlight">${userName}</span>,</p>
    <p>This is an automated security notification to inform you that a new API key has been <strong>${eventType}</strong> for your account.</p>
    
    <div class="info-box">
      <p><strong>Event:</strong> API Key ${eventType}</p>
      <p><strong>Key Hint:</strong> ...${keyHint}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
    </div>
    
    <p><strong>Wasn't you?</strong> If you did not authorize this action, please revoke the key immediately to secure your account:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${revokeLink}" class="button" style="background-color: #ef4444;">Revoke API Key</a>
    </div>
    
    <p>For your security, never share your API keys or commit them to public repositories.</p>
  `;

  return {
    subject,
    html: baseTemplate({ headerColor, headerTitle: 'API Security Alert', bodyContent }),
    text: `Hi ${userName}, an API key was ${eventType} (...${keyHint}). If this wasn't you, revoke it here: ${revokeLink}`
  };
};
