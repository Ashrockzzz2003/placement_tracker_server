const TEMPLATE_ACCOUNT_DEACTIVATED = (managerEmail, managerName) => {
    return `<!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Amrita Placement Tracker OTP</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
        </style>
    </head>

    <body>
        <p>Dear ${managerName},</p>
        <br />
        <p>Your account "${managerEmail}" has been deactivated from Amrita Placement Tracker by the admin. If you think this is a mistake, please contact admin.</p>
        <br />

        <br />
        <p>Regards,</p>
        <p>Amrita Placement Tracker</p>
    </body>

    </html>`;
}

module.exports = TEMPLATE_ACCOUNT_DEACTIVATED;