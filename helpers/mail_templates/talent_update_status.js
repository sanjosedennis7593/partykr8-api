import { format } from 'date-fns';
import styles from './styles';

import { footer } from './footer';

const TALENT_UPDATE_STATUS = ({
    talent,
    talentName,
    eventTalentInfo,
    user,
    event,
    status
}) => {

    return `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml" 
   xmlns:v="urn:schemas-microsoft-com:vml"
   xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <!-- fix outlook zooming on 120 DPI windows devices -->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- So that mobile will display zoomed in -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- enable media queries for windows phone 8 -->
    <meta name="format-detection" content="date=no"> <!-- disable auto date linking in iOS 7-9 -->
    <meta name="format-detection" content="telephone=no"> <!-- disable auto telephone linking in iOS 7-9 -->
    <title>Single Column</title>
    
    <style type="text/css">
    ${styles}
  </style>
  </head>
  
  <body style="margin:0; padding:0;" bgcolor="#F0F0F0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
  
  
  <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" bgcolor="#F0F0F0">
    <tr>
      <td align="center" valign="top" bgcolor="#F0F0F0" style="background-color: #F0F0F0;">
  
        <br>
  
        <!-- 600px container (white background) -->
        <table border="0" width="600" cellpadding="0" cellspacing="0" class="container" style="width:600px;max-width:600px">
 
          <tr>
            <td class="container-padding content" align="left" style="padding-left:24px;padding-right:24px;padding-top:12px;padding-bottom:12px;background-color:#ffffff">
              <br>

  <br>
  
  <div class="body-text" style="font-family:Helvetica, Arial, sans-serif;font-size:14px;line-height:20px;text-align:justify;color:#333333">

    Dear ${`${user.firstname} ${user.lastname}`},
    <br><br>

    ${status === 'approved' ? `
    ${talentName} has accepted your request to be the service provider for your event.
    <br/> <br/>
    Event Details: <br/>
    Event name:  ${event.title} <br/>
    Location/Venue: ${event.location}, ${event.full_event_address}, ${event.city}, ${event.state}  <br/>
    Date: ${format(new Date(event.date),'PPP')} <br/>
    Time: ${event.start_time} - ${event.end_time} <br/>
    Booked PartyKr8 Partner: ${talentName} <br/>
    Booked Professional Fee: PHP ${eventTalentInfo.amount_paid}<br/> <br/>
    You can now pay through the PartyKr8 application. Once payment is processed, you will have access to the contact details of ${talentName}. It is important to review the terms and conditions and privacy policy before using the app to ensure a smooth and protected experience.

    <br/> <br/>
    Thank you so much for using PartyKr8 Application, have a blast in your event!

    <br/> <br/>
    Enjoy life,
    ` : ``}
    <br><br><br>

    
    PARTYKR8 TEAM

  </div>
  
  </td>
          </tr>
        ${footer}
        </table>
  
      </td>
    </tr>
  </table>
  
  </body>
  </html>`;
};


/*

    Event: ${title}<br>
    Date: ${format(new Date(date), 'EEEE, MMMM dd, yyyy')}:<br>
    Time: ${time} <br>
    Venue: ${location}<br>
    Client name: ${`${user.firstname} ${user.lastname}`}<br>
*/
export default TALENT_UPDATE_STATUS;