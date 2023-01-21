import { format } from 'date-fns';
import styles from './styles';


const background = {
    birthday: `background-image: url(https://www.pngkey.com/png/full/947-9471251_background-for-birthday-banner-png.png);background-repeat: no-repeat; background-size: 100% ;`,
    debut: `background-image: url(https://www.pngkey.com/png/full/947-9471251_background-for-birthday-banner-png.png);background-repeat: no-repeat; background-size: 100% ;`,
    wedding: `background-image: url(https://media.istockphoto.com/photos/styled-stock-photo-feminine-wedding-desktop-with-babys-breath-on-picture-id931476308?b=1&k=20&m=931476308&s=170667a&w=0&h=V4bbUvz1v46QdnQIYCIRj7mWoGBi3P-2xdlTsToMSrQ=);background-repeat: no-repeat; background-size: 100% 100%;`,
    baptismal: `background-image: url(https://cutewallpaper.org/24/baptism-borders-cliparts/1908627430.jpg);background-repeat: no-repeat; background-size: 100% 100%;`,
    seminar: `background-image: url(https://img.freepik.com/free-vector/blue-gradient-blank-background-business_53876-120508.jpg);background-repeat: no-repeat; background-size: 100% 100%;`,
    company_party: `background-image: url(https://img.freepik.com/free-vector/blue-gradient-blank-background-business_53876-120508.jpg);background-repeat: no-repeat; background-size: 100% 100%;`,
    school_event: `background-image: url(https://img.freepik.com/free-photo/colorful-school-accessories-corner-white-background_23-2148050642.jpg);background-repeat: no-repeat; background-size: 100% 100%;`,
}

const EVENT_INVITE_MESSAGE = ({
    title = '',
    type = '',
    custom_message = '',
    day = 'Monday',
    location = '',
    full_event_address = '',
    date = '',
    start_time = '',
    end_time = '',
    user
}) => {
    console.log('full_event_addresszzzzzzzzzzzzz', full_event_address)
    return `
    <!doctype html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
        xmlns:o="urn:schemas-microsoft-com:office:office">
    
    <head>
        <title>
    
        </title>
        <!--[if !mso]><!-- -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <!--<![endif]-->
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
            #outlook a {
                padding: 0;
            }
    
            .ReadMsgBody {
                width: 100%;
            }
    
            .ExternalClass {
                width: 100%;
            }
    
            .ExternalClass * {
                line-height: 100%;
            }
    
            body {
                margin: 0;
                padding: 0;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }
    
            table,
            td {
                border-collapse: collapse;
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
            }
    
            img {
                border: 0;
                height: auto;
                line-height: 100%;
                outline: none;
                text-decoration: none;
                -ms-interpolation-mode: bicubic;
            }
    
            p {
                display: block;
                margin: 13px 0;
            }
        </style>
        <!--[if !mso]><!-->
        <style type="text/css">
            @media only screen and (max-width:480px) {
                @-ms-viewport {
                    width: 320px;
                }
    
                @viewport {
                    width: 320px;
                }
            }
        </style>
    
    
        <style type="text/css">
            @media only screen and (min-width:480px) {
                .mj-column-per-100 {
                    width: 100% !important;
                }
            }
        </style>
    
    
        <style type="text/css">
        </style>
    
    </head>
    
    <body style="background-color:#f9f9f9;">
    
    
        <div style="${background[type]}">
    
    
    
            <div style="background:#f9f9f9;background-color:#f9f9f9;Margin:0px auto;max-width:600px;">
    
                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="background:#f9f9f9;background-color:#f9f9f9;width:100%;">
                    <tbody>
                        <tr>
                            <td
                                style="border-bottom:#333957 solid 5px;direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
    
                            </td>
                        </tr>
                    </tbody>
                </table>
    
            </div>
    
    
            <div style="background:#fff;background-color:#fff;Margin:0px auto;max-width:600px;">
    
                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="background:#fff;background-color:#fff;width:100%;">
                    <tbody>
                        <tr>
                            <td
                                style="border:#dddddd solid 1px;border-top:0px;direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
    
    
                                <div class="mj-column-per-100 outlook-group-fix"
                                    style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;height:100%;">
                                    ${type === 'wedding' ? `<table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                    style="vertical-align:bottom;" width="100%">

                                    <tr>
                                        <td align="center"
                                            style="font-size:0px;padding:10px 25px;padding-bottom:40px;word-break:break-word;">


                                            <div
                                                style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:20px;line-height:1;text-align:center;color:#555;">

                                                Together with their families
                                            </div>
                                            <div
                                                style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:28px;font-weight:bold;line-height:1;text-align:center;color:#555;">

                                                <h1>${title}</h1>
                                            </div>

                                            <div
                                                style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:20px;line-height:1;text-align:center;color:#555;">
                                                Request the pleasure of your <br />
                                                company at their marriage
                                            </div>
                                            <div
                                                style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:20px;line-height:1;text-align:center;color:#555;">
                                                ${start_time}
                                            </div>
                                            <div
                                                style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:20px;font-weight:bold;line-height:1;text-align:center;color:#555;">

                                                <h4>${format(new Date(date), 'EEEE, MMMM dd, yyyy')}</h4>
                                            </div>


                                            <div
                                                style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:20px;font-weight:bold;line-height:1;text-align:center;color:#555;">

                                                <h4>${location}</h4>
                                                <h4>${full_event_address}</h4>
                                            </div>



                                        </td>
                                    </tr>

                                    <tr>
                                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">


                                            <div
                                                style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:20px;line-height:22px;text-align:left;color:black; padding: 5px">
                                                We’re inviting you as we celebrate ${title}. Please come and join
                                                us!
                                            </div>

                                            <br /><br /><br />
                                   
                                            <div
                                            style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:20px;line-height:22px;text-align:left;color:black; padding: 5px">
                                                ${custom_message}
                                             </div>
                                            <br /><br />

                                            <div
                                                style="margin-top:24px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:22px;text-align:left;color:black; padding: 5px">
                                                We have booked this event through PARTYKR8 App available in Appstore and
                                                Play store for
                                                download. Please click this link to view our booking - LINK If you like
                                                to experience hassle free
                                                party experience use PARTKR8. Download the app now and register! Several
                                                Party service
                                                providers such as lights and sounds provider, DJs, singers, hosts,
                                                magicians, bands and many
                                                more to choose from to make your event memorable and lively.
                                            </div>
                                

                                        </td>
                                    </tr>

                                    <tr>
                                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">

                                            <div
                                                style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:20px;text-align:left;color:#525252;">
                                    
                                            </div>

                                        </td>
                                    </tr>

                                    <tr>
                                        <td class="container-padding footer-text" align="left"
                                            style="font-family:Helvetica, Arial, sans-serif;font-size:12px;line-height:16px;padding-left:24px;padding-right:24px">
                                            <br><br>
                                            You are receiving this email because ${user.firstname} ${user.lastname} invited you to the event.
                                            <br><br>
                                            PartyKr8.
                                            <br><br>
                                        </td>
                                    </tr>

                                </table>` : `<table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                style="vertical-align:bottom;" width="100%">

                                <tr>
                                    <td align="center"
                                        style="font-size:0px;padding:10px 25px;padding-bottom:40px;word-break:break-word;">


                                        <div
                                            style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:28px;font-weight:bold;line-height:1;text-align:center;color:#555;">

                                            <h1>YOU ARE INVITED!</h1>
                                        </div>
                                        <div
                                            style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:20px;font-weight:bold;line-height:1;text-align:center;color:#555;">

                                            <h4>${format(new Date(date), 'EEEE, MMMM dd, yyyy')}</h4>
                                        </div>

                                        <div
                                            style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:20px;font-weight:bold;line-height:1;text-align:center;color:#555;">

                                            <h4>${start_time} to ${end_time}</h4>
                                        </div>
                                        <div
                                            style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:20px;font-weight:bold;line-height:1;text-align:center;color:#555;">

                                            <h4>${location}</h4>
                                           
                                        </div>



                                    </td>
                                </tr>

                                <tr>
                                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">


                                        <div
                                            style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:20px;line-height:22px;text-align:left;color:black; padding: 5px">
                                            We’re inviting you as we celebrate ${title}. Please come and join
                                            us!
                                        </div>

                                        <br /><br />
                                        <div
                                        style="margin-top:24px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:20px;line-height:22px;text-align:left;color:black; padding: 5px">
                                            ${custom_message || ''}
                                         </div>
                                        <br /><br />
                                        <div
                                            style="margin-top:24px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:22px;text-align:left;color:black; padding: 5px">
                                            We have booked this event through PARTYKR8 App available in Appstore and
                                            Play store for
                                            download. Please click this link to view our booking - LINK If you like
                                            to experience hassle free
                                            party experience use PartyKr8. Download the app now and register! Several
                                            Party service
                                            providers such as lights and sounds provider, DJs, singers, hosts,
                                            magicians, bands and many
                                            more to choose from to make your event memorable and lively.
                                        </div>
                                       

                                    </td>
                                </tr>

                                <tr>
                                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">

                                        <div
                                            style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:20px;text-align:left;color:#525252;">
                                            <!-- Best regards,<br><br> Csaba Kissi<br>Elerion ltd., CEO and Founder<br> -->
                                            <!-- <a href="https://www.htmlemailtemplates.net" style="color:#2F67F6">htmlemailtemplates.net</a> -->
                                        </div>

                                    </td>
                                </tr>

                                <tr>
                                    <td class="container-padding footer-text" align="left"
                                        style="font-family:Helvetica, Arial, sans-serif;font-size:12px;line-height:16px;padding-left:24px;padding-right:24px">
                                        <br><br>
                                        You are receiving this email because ${user.firstname} ${user.lastname} invited you to the event.
                                        <br><br>

                                        PartyKr8, Inc.
                                        <br><br>
                                    </td>
                                </tr>

                            </table>
`}
                                    
                                </div>
    
                            </td>
                        </tr>
                    </tbody>
                </table>
    
            </div>
    
            <div style="Margin:0px auto;max-width:600px;">
    
                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                    <tbody>
                        <tr>
                            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
    
                                <div class="mj-column-per-100 outlook-group-fix"
                                    style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">
    
    
    
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
    
            </div>
    
    
    
        </div>
    
    </body>
    
    </html>
    `;
};

export default EVENT_INVITE_MESSAGE;