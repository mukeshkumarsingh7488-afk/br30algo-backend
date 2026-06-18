export const getOtpEmailTemplate = (otp, userEmail) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Password Reset Verification</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 40px 0; -webkit-font-smoothing: antialiased;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:520px;background:transparent;border:none;box-shadow:none;border-radius:24px;overflow:hidden;">
              <!-- TOP BRAND BAR -->
              <tr>
                <td style="background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%); padding: 35px 40px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase;">Sudha Dairy</h1>
                  <p style="color: #bfdbfe; margin: 6px 0 0 0; font-size: 11px; font-weight: 700; tracking-spacing: 0.5px; text-transform: uppercase;">Distribution Network Hub</p>
                </td>
              </tr>
              <!-- CONTENT BODY -->
              <tr>
                <td style="padding: 40px 40px 35px 40px;">
                  <h2 style="color: #0f172a; margin: 0 0 16px 0; font-size: 18px; font-weight: 800;">Verification Security Code</h2>
                  <p style="color: #475569; font-size: 13px; line-height: 1.6; margin: 0 0 25px 0; font-weight: 500;">
                    Hello Account Operator,<br><br>
                    A password recovery request was initiated for your registered dealer identity <strong style="color: #1e293b; font-weight: 700;">${userEmail}</strong>. Use the secure digital verification code below to authorize this session:
                  </p>
                  
                  <!-- BLOCK OTP ACCENT BOX -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" style="background-color: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 16px; padding: 20px; text-align: center;">
                        <span style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 900; letter-spacing: 6px; color: #1e40af; display: block; line-height: 1;">${otp}</span>
                      </td>
                    </tr>
                  </table>

                  <p style="color: #94a3b8; font-size: 11px; line-height: 1.5; margin: 25px 0 0 0; font-weight: 600; text-align: center; background-color: #fff7ed; color: #c2410c; padding: 8px 12px; border-radius: 8px; border: 1px solid #ffedd5;">
                    ⚠️ Confidential security code. Valid for exactly 5 minutes only.
                  </p>
                </td>
              </tr>
              <!-- FOOTER DISCLOSURE -->
              <tr>
                <td style="background-color: #f8fafc; padding: 24px 40px; text-align: center; border-t: 1px solid #e2e8f0;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" style="color: #64748b; font-size: 11px; font-weight: 600; line-height: 1.4;">
                        🔒 This is an automated secure protocol communication.<br>
                        Distributed via SSL Secured Core Node Engine Server.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export const getRegisterOtpEmailTemplate = (otp, userEmail) => {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:Arial,sans-serif;margin:0;padding:40px 0;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #eef2f6;">
              <tr>
                <td style="background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%); padding: 35px 40px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase;">Sudha Dairy</h1>
                  <p style="color: #bfdbfe; margin: 6px 0 0 0; font-size: 11px; font-weight: 700; tracking-spacing: 0.5px; text-transform: uppercase;">Distribution Network Hub</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px 40px 35px 40px;">
                  <h2 style="color: #0f172a; margin: 0 0 16px 0; font-size: 18px; font-weight: 800;">Account Registration Code</h2>
                  <p style="color: #475569; font-size: 13px; line-height: 1.6; margin: 0 0 25px 0; font-weight: 500;">
                    Welcome to the Network!<br><br>
                    An onboarding verification request was initiated to create a new system account for <strong style="color: #1e293b; font-weight: 700;">${userEmail}</strong>. Please use the verification security code below to complete the registration form:
                  </p>
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" style="background-color: #f0fdf4; border: 1.5px dashed #4ade80; border-radius: 16px; padding: 20px; text-align: center;">
                        <span style="font-family: monospace; font-size: 34px; font-weight: 900; letter-spacing: 6px; color: #16a34a; display: block; line-height: 1;">${otp}</span>
                      </td>
                    </tr>
                  </table>
                  <p style="color: #15803d; font-size: 11px; line-height: 1.5; margin: 25px 0 0 0; font-weight: 600; text-align: center; background-color: #f0fdf4; padding: 8px 12px; border-radius: 8px; border: 1px solid #dcfce7;">
                    🛡️ Secure verification code. Valid for exactly 5 minutes only.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f8fafc; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 11px; font-weight: 600; line-height: 1.4;">
                  🔒 This is an automated secure protocol communication.<br>Distributed via SSL Secured Core Node Engine Server.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};
