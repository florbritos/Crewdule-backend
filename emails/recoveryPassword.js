export function generateEmailTemplate(otp){
    return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Crewdule - OTP Email Template</title>
            </head>
            <body>
                <!-- partial:index.partial.html -->
                <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                    <div style="margin:50px auto;width:70%;padding:20px 0">
                        <div style="border-bottom:1px solid #eee">
                            <h1 style="font-size:1.4em;color:#e07a5f;text-decoration:none;font-weight:bold">Crewdule</h1>
                        </div>
                        <p style="font-size:1.1em">Hey,</p>
                        <p>Are you having issues trying to get into your account? Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes</p>
                        <p style="background: #2a303c;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;font-size:1.4em;">${otp}</p>
                        <p style="font-size:0.9em;">Regards,<br /><span style="color:#e07a5f;font-weight:bold;">Crewdule</span>'s team</p>
                        <hr style="border:none;border-top:1px solid #eee" />
                        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                            <p>Crewdule</p>
                            <p>Buenos Aires</p>
                            <p>Argentina</p>
                        </div>
                    </div>
                </div>
                <!-- partial -->
            </body>
        </html>
    `
} 