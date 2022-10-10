import { format } from 'date-fns';
import styles from './styles';

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
  
  <div class="body-text" style="font-family:Helvetica, Arial, sans-serif;font-size:14px;line-height:20px;text-align:left;color:#333333">

    Dear ${`${user.firstname} ${user.lastname}`},
    <br><br>

    ${status === 'approved' ? `
    Your booked PartyKr8 talent/partner has accepted your request to be your guest performer/supplier in the event/party that you created in PartyKr8 Application. 
    <br/> <br/>
    Event Details: <br/>
    Event name:  ${event.title} <br/>
    Location/venue: ${event.location}  <br/>
    Date: ${format(new Date(event.date),'PPP')} <br/>
    Time: ${event.start_time} - ${event.end_time} <br/>
    Booked PartyKr8 Partener: ${talentName} <br/>
    Booked Prefessional Fee: PHP ${eventTalentInfo.amount_paid}<br/> <br/>
    You may now coordinate the details directly to partene/talent name using the PartyKr8 Application messaging service inside the app to discuss in details your requirement based on the booking rate you made. <br/> 
    Please be reminded that your direct interaction with PartyKr8 professional partners are governed by the terms and conditions that  you have agreed upon downloading and  by using the application. You are also protected under the privacy policy stamement of PartyKr8 Application. <br/> <br/>
    Thanks you so much for using PartyKr8 Application, have a blast in your event!

    <br/> <br/>
    Enjoy life,<br/>

    <br/> <br/>
    PartyKr8 Team
    
    ` : ``}
    <br><br>

    
    PARTYKR8 TEAM

  </div>
  
            </td>
          </tr>
          <tr>
            <td class="container-padding footer-text" align="left" style="font-family:Helvetica, Arial, sans-serif;font-size:12px;line-height:16px;color:#aaaaaa;padding-left:24px;padding-right:24px">
              <br><br>
                   2022 PartyKr8.
            
              <br><br>
            </td>
          </tr>
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