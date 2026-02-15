# Password Reset Feature - E-Guardian

## Overview
Complete forgot password functionality using Nodemailer with OTP (One-Time Password) verification system.

## Features Implemented

### 🔐 Password Reset Flow
1. **Forgot Password** - User enters email
2. **OTP Generation** - 6-digit OTP generated and sent via email
3. **Email Delivery** - Professional HTML email with OTP
4. **OTP Verification** - User enters OTP to verify identity
5. **Password Reset** - User creates new password
6. **Confirmation** - Success email sent after reset

### 📧 Email Capabilities
- **OTP Emails** - Password reset verification
- **Confirmation Emails** - Password change notifications
- **Welcome Emails** - New user registration (optional)
- **General Notifications** - Any custom messages to users

## Setup Instructions

### 1. Gmail Configuration (Recommended)

#### Get Gmail App Password:
1. Go to your [Google Account](https://myaccount.google.com/)
2. Select **Security**
3. Under "Signing in to Google," select **2-Step Verification** (set it up if not enabled)
4. At the bottom, select **App passwords**
5. Select **Mail** and **Windows Computer** (or Other)
6. Click **Generate**
7. Copy the 16-character password

#### Update .env file:
```env
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
CLIENT_URL=http://localhost:3000
```

### 2. Other Email Services

For other SMTP providers (Outlook, Yahoo, custom SMTP):

```env
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp.yourprovider.com
EMAIL_PORT=587
EMAIL_USER=your_email@domain.com
EMAIL_PASSWORD=your_password
CLIENT_URL=http://localhost:3000
```

### 3. Restart Server

After configuring email settings:
```bash
cd server
npm run dev
```

## New Files Created

### Backend
- `server/services/emailService.js` - Email sending service
- `server/controllers/authController.js` - Updated with reset endpoints
- `server/routes/authRoutes.js` - Updated with new routes
- `server/models/User.js` - Updated with OTP fields

### Frontend
- `client/src/app/forgot-password/page.js` - Email entry page
- `client/src/app/reset-password/page.js` - OTP and new password page
- `client/src/app/login/page.js` - Updated with forgot password link

## API Endpoints

### POST /api/auth/forgot-password
Request OTP for password reset
```json
{
  "email": "user@example.com"
}
```

### POST /api/auth/reset-password
Reset password with OTP
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

### POST /api/auth/resend-otp
Resend OTP to email
```json
{
  "email": "user@example.com"
}
```

## User Flow

### Forgot Password:
1. User clicks "Forgot Password?" on login page
2. Enters email address
3. Receives OTP via email (valid for 10 minutes)
4. Enters OTP on reset page
5. Creates new password
6. Receives confirmation email
7. Redirected to login

## Email Templates

### OTP Email Features:
- ✅ Professional HTML design
- ✅ 6-digit OTP clearly displayed
- ✅ 10-minute expiration notice
- ✅ Security warnings
- ✅ E-Guardian branding

### Confirmation Email Features:
- ✅ Password change confirmation
- ✅ Security alert if user didn't make change
- ✅ Professional branding

## Security Features

### OTP Security:
- 6-digit random OTP
- 10-minute expiration
- Stored hashed in database
- One-time use only
- Auto-deleted after successful reset

### Password Security:
- Minimum 6 characters required
- Bcrypt hashing
- Password confirmation required
- Cannot reuse OTP after expiration

## Testing

### Test the Flow:
1. **Navigate to Login**: `http://localhost:3000/login`
2. **Click "Forgot Password?"**
3. **Enter email**: Your Gmail address
4. **Check email**: Look for OTP in inbox/spam
5. **Enter OTP**: On reset password page
6. **Create password**: Minimum 6 characters
7. **Confirm**: Check confirmation email
8. **Login**: Use new password

## Usage Examples

### Send Custom Notification:
```javascript
const { sendNotificationEmail } = require('./services/emailService');

await sendNotificationEmail(
    'user@example.com',
    'John Doe',
    'Device Scan Complete',
    '<p>Your device scan is ready! View your results now.</p>',
    'success'
);
```

### Send Welcome Email:
```javascript
const { sendWelcomeEmail } = require('./services/emailService');

await sendWelcomeEmail('newuser@example.com', 'Jane Smith');
```

## Troubleshooting

### Email Not Sending?
1. ✅ Check Gmail App Password is correct
2. ✅ Verify EMAIL_USER is your full email
3. ✅ Enable 2-Step Verification on Google
4. ✅ Check spam folder
5. ✅ Verify server logs for errors

### OTP Not Working?
1. ✅ Check OTP hasn't expired (10 min limit)
2. ✅ Ensure email matches exactly
3. ✅ Try requesting new OTP
4. ✅ Check server database connection

### Common Errors:

**"Invalid credentials"**
- Check Gmail App Password
- Verify EMAIL_USER in .env

**"OTP has expired"**
- Request new OTP
- OTP valid for only 10 minutes

**"Invalid OTP"**
- Copy OTP exactly from email
- Check for extra spaces
- Request new OTP if needed

## Email Service Functions

### Available Functions:
- `generateOTP()` - Generate 6-digit OTP
- `sendOTPEmail(email, name, otp)` - Send OTP email
- `sendPasswordResetConfirmation(email, name)` - Confirmation email
- `sendNotificationEmail(email, name, subject, message, type)` - Custom notifications
- `sendWelcomeEmail(email, name)` - Welcome new users

## Production Considerations

### For Production:
1. Use professional email service (SendGrid, AWS SES, Mailgun)
2. Set up SPF, DKIM, DMARC records
3. Use environment-specific CLIENT_URL
4. Monitor email delivery rates
5. Implement rate limiting on OTP requests
6. Add email templates in database
7. Track email open rates

### Recommended Services:
- **SendGrid** - Free tier: 100 emails/day
- **AWS SES** - $0.10 per 1000 emails
- **Mailgun** - Free tier: 5000 emails/month
- **Postmark** - Free tier: 100 emails/month

## Environment Variables Summary

```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password_here
CLIENT_URL=http://localhost:3000
```

## Next Steps

### Optional Enhancements:
1. Add email verification on signup
2. Implement email change with OTP
3. Add SMS OTP as alternative
4. Email templates from database
5. Email delivery status tracking
6. Multi-language email support
7. Email preferences for users

---

*Stay secure! 🔒*
