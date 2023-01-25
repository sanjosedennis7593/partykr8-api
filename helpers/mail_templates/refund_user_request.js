import { format } from 'date-fns';
import styles from './styles';

const REFUND_USER_REQUEST_MESSAGE = () => {


    // PAYOUT EMAIL: ${user.email}<br>
    // ${user.firstname} ${user.lastname}<br>
    //  ${`${talent.bank_account_name && talent.bank_account_no ? `Registered account number: ${talent.bank_account_name} - ${talent.bank_account_no} <br>` : ''}`}
    // Registered gcash number: ${talent.gcash_no || ''}<br>

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
                <div class="body-text" style="font-family:Helvetica, Arial, sans-serif;font-size:14px;line-height:20px;text-align:left;color:#333333;text-align:justify;">   
                Dear valued PartyKr8 user,<br/><br/>

                Your refund request has been received! We're currently reviewing it and we'll make sure to credit your account within 3-5 business days once it's approved. You'll be notified via the app as soon as the process is completed. Thank you for your patience.
                </div>
  
            </td>
          </tr>
          <tr>
            <td class="container-padding footer-text" align="left" style="font-family:Helvetica, Arial, sans-serif;font-size:12px;line-height:16px;color:#aaaaaa;padding-left:24px;padding-right:24px">
              <br><br>
              Sincerely,
              PartyKr8 Team.
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

export default REFUND_USER_REQUEST_MESSAGE;

