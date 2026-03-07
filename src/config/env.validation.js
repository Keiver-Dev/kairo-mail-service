import pc from 'picocolors';
import logger from '../utils/logger.js';

/**
 * Validates environment variables and provides a detailed report
 */
export const validateEnv = () => {
  const errors = [];
  const warnings = [];

  // 1. Critical Security Variables
  if (!process.env.INTERNAL_API_KEY) {
    errors.push({ 
      var: 'INTERNAL_API_KEY', 
      msg: 'Missing internal API key for request authentication.',
      fix: 'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    });
  } else if (process.env.INTERNAL_API_KEY.length < 32) {
    errors.push({ 
      var: 'INTERNAL_API_KEY', 
      msg: 'Key is too short (min 32 chars).',
      fix: 'Generate a longer secure key for better security.'
    });
  }

  // 2. Email Configuration
  // Default to false (production) if not specified
  const isTestMode = process.env.EMAIL_TEST_MODE === 'true';
  
  if (!isTestMode) {
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_email@gmail.com') {
      errors.push({ var: 'EMAIL_USER', msg: 'Real SMTP email is required when TEST_MODE is disabled.' });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(process.env.EMAIL_USER)) {
      warnings.push({ var: 'EMAIL_USER', msg: 'Value does not look like a valid email address.' });
    }
    
    if (!process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your_gmail_app_password') {
      errors.push({ var: 'EMAIL_PASS', msg: 'SMTP password or App Password is required.' });
    }
  }

  // 3. Database Configuration (Optional)
  const dbVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER'];
  const missingDb = dbVars.filter(v => !process.env[v]);
  const isDbConfigured = missingDb.length === 0;

  // 4. Report Results
  const showAudit = errors.length > 0 || warnings.length > 0 || !isTestMode;

  if (showAudit) {
    console.log('\n' + pc.white(pc.bgBlue(pc.bold(' [ AUDIT ] Environment Configuration '))) + '\n');
    
    if (errors.length === 0 && warnings.length === 0 && !isTestMode) {
      console.log(pc.green(pc.bold('  - Core production settings are valid.')));
    }

    if (errors.length > 0) {
      console.log(pc.red(pc.bold('CRITICAL ERRORS:')));
      errors.forEach(err => {
        console.log(`${pc.red('  !')} ${pc.bold(err.var || 'General')}: ${err.msg}`);
        if (err.fix) console.log(`    ${pc.gray('> Fix:')} ${pc.italic(err.fix)}`);
      });
      console.log('');
    }

    if (warnings.length > 0) {
      console.log(pc.yellow(pc.bold('WARNINGS:')));
      warnings.forEach(warn => {
        console.log(`${pc.yellow('  *')} ${pc.bold(warn.var || 'General')}: ${warn.msg}`);
        if (warn.fix) console.log(`    ${pc.gray('> Note:')} ${pc.italic(warn.fix)}`);
      });
      console.log('');
    }

    // Database status Notice
    if (isDbConfigured) {
      console.log(pc.cyan(`${pc.bold('INFO [DATABASE]:')} Configured (Logs will be persisted).`));
    } else {
      console.log(pc.gray(`${pc.bold('INFO [DATABASE]:')} Not fully configured (${missingDb.join(', ')}).`));
      console.log(pc.gray(`   Running in "Service-Only" mode. Logs will be ephemeral.`));
    }
    console.log('');
  }

  // Fail if critical errors exist
  if (errors.length > 0) {
    const errorMsg = 'Startup failed due to missing critical configuration. Check the audit report above.';
    logger.error(pc.red(pc.bold(errorMsg)));
    throw new Error(errorMsg);
  }

  if (isTestMode) {
    logger.info(pc.magenta('[EMAIL] Running in TEST MODE (Ethereal). Real emails will NOT be sent.'));
  } else {
    logger.info(pc.green('[EMAIL] Running in PRODUCTION MODE. Ready to send real emails.'));
  }
};
