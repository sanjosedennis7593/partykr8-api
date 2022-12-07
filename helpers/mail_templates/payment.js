import styles from './styles';

import { convertToCurrencyFormat } from '../currency';

const PAYMENT_MESSAGE = ({
    id = '',
    type = '',
    event = {},
    talents = [],
    totalAmount = 0,
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
            <td class="container-padding content" align="left" style="padding-left:24px;padding-right:24px;padding-top:12px;padding-bottom:12px;background-color:#ffffff">
              <br>
              <br>
  
                <div class="body-text" style="font-family:Helvetica, Arial, sans-serif;font-size:14px;line-height:20px;text-align:left;color:#333333">

                  Dear ${user && `${user.firstname} ${user.lastname}`},
                  <br><br>
                  We'd like to inform you that we have verified your payment
                  <br><br>
                  <b>Payment ID:</b> ${id}<br>
                  <b>Payment Method:</b> ${type === 'card' ? 'Debit/Credit Card' : type}<br>
                  <b>Event:</b> ${event && event.title ? event.title : ''}<br/>
                  <b>Talent:</b>
                  ${talents.map(talent => {
                    return `${talent.talent.user.firstname} ${talent.talent.user.lastname} - P${convertToCurrencyFormat(talent.service_rate || talent.amount_paid)} <br/>`
                  })}
        
                  <b>Total Amount:</b> P${convertToCurrencyFormat(totalAmount)}<br/>
               
                  PARTYKR8 TEAM

                  </div>
  
            </td>
          </tr>
          <tr>
            <td class="container-padding footer-text" align="left" style="font-family:Helvetica, Arial, sans-serif;font-size:12px;line-height:16px;color:#aaaaaa;padding-left:24px;padding-right:24px">
              <br><br>
                  PartyKr8, Inc.
            
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

export default PAYMENT_MESSAGE;