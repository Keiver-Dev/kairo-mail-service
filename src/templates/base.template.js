export const baseTemplate = ({ headerColor, headerTitle, bodyContent }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      margin: 0; 
      padding: 0; 
      background-color: #f8fafc; 
      color: #1e293b; 
      -webkit-font-smoothing: antialiased;
    }
    .wrapper { background-color: #f8fafc; padding: 40px 20px; }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: #ffffff; 
      border-radius: 16px; 
      overflow: hidden; 
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.04), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
      border: 1px solid #f1f5f9;
    }
    .header { 
      background: linear-gradient(135deg, ${headerColor} 0%, #1e1b4b 100%); 
      color: #ffffff; 
      padding: 40px 30px; 
      text-align: center; 
    }
    .header h1 { 
      margin: 0; 
      font-size: 26px; 
      font-weight: 700; 
      letter-spacing: -0.025em;
    }
    .content { 
      padding: 40px 35px; 
      line-height: 1.7; 
      font-size: 16px; 
    }
    .footer { 
      padding: 30px; 
      text-align: center; 
      font-size: 13px; 
      color: #94a3b8; 
    }
    .button { 
      display: inline-block; 
      padding: 14px 32px; 
      background-color: ${headerColor}; 
      color: #ffffff !important; 
      text-decoration: none; 
      border-radius: 12px; 
      font-weight: 600; 
      margin-top: 25px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .info-box { 
      background-color: #f8fafc; 
      border-radius: 12px;
      padding: 20px; 
      margin: 30px 0; 
      font-size: 14px; 
      border: 1px solid #e2e8f0;
      color: #64748b;
    }
    .highlight { font-weight: 600; color: #0f172a; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>${headerTitle}</h1>
      </div>
      <div class="content">
        ${bodyContent}
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Keiver-Dev. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;
