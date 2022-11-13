import styles from './styles';

const TALENT_APPROVED_MESSAGE = ({
    user
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
            <td class="container-padding header" align="left" style="font-family:Helvetica, Arial, sans-serif;font-size:24px;font-weight:bold;padding-bottom:12px;color:#DF4726;padding-left:24px;padding-right:24px">
                APPLICATION APPROVED
            </td>
          </tr>
          <tr>
            <td class="container-padding content" align="left" style="padding-left:24px;padding-right:24px;padding-top:12px;padding-bottom:12px;background-color:#ffffff">
              <br>
  
              <div class="title" style="font-family:Helvetica, Arial, sans-serif;font-size:18px;font-weight:600;color:#374550">Application Approved</div>
  <br>
  
  <div class="body-text" style="font-family:Helvetica, Arial, sans-serif;font-size:14px;line-height:20px;text-align:left;color:#333333">
      ${/* message_to_guest */``}
  
      Dear ${`${user.firstname} ${user.lastname}`},
    <br><br>
    PARTYKR8 is pleased to inform you that you have been APPROVED as PARTYKR8 talent/partner!
    <br><br>
    Thank you for taking time to register with PARTYKR8 as a Talent/Partner. It was a pleasure to learn more about your talent, skills and accomplishments in your field. 
    <br><br>
    You may start to enjoy bookings by PARTYKR8 users on your registered talent and services using the application, update you profile and mange your account. 
    <br><br>
    Do not forget to boost your profile by sharing your PARTYKR8 profile to your social media accounts!
    
    <br><br><br>
    Make memorable events, 
    <br><br>
    PARTYKR8 TEAM
    <br>
    <i>Please be reminded that as a PARTYKR8 talent/partner, you have agreed and understood the terms and conditions that encompasses your agreement to be a service provider to PARTKR8’s users. </i>
    <br>

  </div>
  
            </td>
          </tr>
          <tr>
            <td class="container-padding footer-text" align="left" style="font-family:Helvetica, Arial, sans-serif;font-size:12px;line-height:16px;color:#aaaaaa;padding-left:24px;padding-right:24px">
              <br><br>
                  PartyKr8.
            
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

export default TALENT_APPROVED_MESSAGE;