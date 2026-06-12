const resetPasswordTemplate = (userName, resetLink) => {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f9; padding: 40px 20px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

        <div style="background: #2563eb; padding: 25px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0;">Password Reset</h1>
        </div>

        <div style="padding: 30px;">
          <h2 style="color: #333;">Hello ${userName},</h2>

          <p style="color: #555; line-height: 1.6;">
            We received a request to reset your account password.
            Click the button below to create a new password.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a
              href="${resetLink}"
              style="
                background: #2563eb;
                color: #ffffff;
                text-decoration: none;
                padding: 14px 30px;
                border-radius: 8px;
                display: inline-block;
                font-weight: bold;
                font-size: 16px;
              "
            >
              Reset Password
            </a>
          </div>

          <div style="
            background: #f8fafc;
            border-left: 4px solid #2563eb;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
          ">
            <p style="margin: 0; color: #555;">
              ⏳ This link will expire in <strong>15 minutes</strong>.
            </p>
          </div>

          <p style="color: #555; line-height: 1.6;">
            If you didn't request a password reset, you can safely ignore this email.
            Your password will remain unchanged.
          </p>
        </div>

        <div style="
          background: #f8fafc;
          padding: 20px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        ">
          <p style="margin: 0; color: #888; font-size: 14px;">
            © ${new Date().getFullYear()} Your Application. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  `;
};

export default resetPasswordTemplate;
