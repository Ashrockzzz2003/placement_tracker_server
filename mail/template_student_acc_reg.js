const TEMPLATE_STUDENT_CREATED = (studentEmail, studentName, studentPassword) => {
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
        <p>Dear ${studentName},</p>
        <br />
        <p>Greetings from Amrita Placement Tracker App. Welcome!</p>
        <p>You have been registered to the app. Here is your credentials. Head to the login page to continue to login.</p>
        <br />
        <p>EmailID: ${studentEmail}</p>
        <p>Password: ${studentPassword}</p>
        <br />
        <p>Regards,</p>
        <p>Amrita Placement Tracker</p>
    </body>

    </html>`;
}

module.exports = TEMPLATE_STUDENT_CREATED;