import { format } from "date-fns";

const EVENT_INVITE_MESSAGE = ({
  title = '',
  // message_to_guest = '',
  day = 'Monday',
  location = '',
  date = '',
  time = '',
  user
}) => {

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" 
 xmlns:v="urn:schemas-microsoft-com:vml"
 xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <!--[if gte mso 9]><xml>
   <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
   </o:OfficeDocumentSettings>
  </xml><![endif]-->
  <!-- fix outlook zooming on 120 DPI windows devices -->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- So that mobile will display zoomed in -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- enable media queries for windows phone 8 -->
  <meta name="format-detection" content="date=no"> <!-- disable auto date linking in iOS 7-9 -->
  <meta name="format-detection" content="telephone=no"> <!-- disable auto telephone linking in iOS 7-9 -->
  <title>Single Column</title>
  
  <style type="text/css">
body {
  margin: 0;
  padding: 0;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
}

table {
  border-spacing: 0;
}

table td {
  border-collapse: collapse;
}

.ExternalClass {
  width: 100%;
}

.ExternalClass,
.ExternalClass p,
.ExternalClass span,
.ExternalClass font,
.ExternalClass td,
.ExternalClass div {
  line-height: 100%;
}

.ReadMsgBody {
  width: 100%;
  background-color: #ebebeb;
}

table {
  mso-table-lspace: 0pt;
  mso-table-rspace: 0pt;
}

img {
  -ms-interpolation-mode: bicubic;
}

.yshortcuts a {
  border-bottom: none !important;
}

@media screen and (max-width: 599px) {
  .force-row,
  .container {
    width: 100% !important;
    max-width: 100% !important;
  }
}
@media screen and (max-width: 400px) {
  .container-padding {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
}
.ios-footer a {
  color: #aaaaaa !important;
  text-decoration: underline;
}
a[href^="x-apple-data-detectors:"],
a[x-apple-data-detectors] {
  color: inherit !important;
  text-decoration: none !important;
  font-size: inherit !important;
  font-family: inherit !important;
  font-weight: inherit !important;
  line-height: inherit !important;
}
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
            PartyKr8 Event
          </td>
        </tr>
        <tr>
          <td class="container-padding content" align="left" style="padding-left:24px;padding-right:24px;padding-top:12px;padding-bottom:12px;background-color:#ffffff">
            <br>

<div class="title" style="font-family:Helvetica, Arial, sans-serif;font-size:18px;font-weight:600;color:#374550">${title}</div>
<br>

<div class="body-text" style="font-family:Helvetica, Arial, sans-serif;font-size:14px;line-height:20px;text-align:left;color:#333333">
    ${/* message_to_guest */``}

    Dear Recipient,
  <br><br>
 
  I would like to invite you to join us for an event/party on ${format(new Date(date),'EEEE, MMMM dd, yyyy')} at ${time} in the evening as we celebrate our ${title}.
  The party will be held at (venue) ${location} .
  <br><br>
  I hope to see you in our simple party with the rest of our friends. We are pretty sure that with your presence, our very special day would be perfect. 
  <br><br>
  On the other hand, this party is also open to people who you want to be with. We are looking forward to meeting you to the party.
  <br><br>
  We have booked this event through PARTYKR8 App available in Appstore and Play store for download. Please click this link to view our booking - LINK
  If you like to experience hassle free party experience use PARTKR8. 
  Download the app now and register! Several Party service providers such as lights and sounds provider, DJs, singers, hosts, magicians, bands and many more to choose from to make your event memorable and lively.
  <br><br><br>
  

  Best Wishes,
  <br><br>
  The Celebrators,
  <br>
  ${`${user.firstname} ${user.lastname}`}
  <br>
  PartyKr8 user
  <br>
</div>

          </td>
        </tr>
        <tr>
          <td class="container-padding footer-text" align="left" style="font-family:Helvetica, Arial, sans-serif;font-size:12px;line-height:16px;color:#aaaaaa;padding-left:24px;padding-right:24px">
            <br><br>
                 2022 PartyKr8.
            <br><br>

            You are receiving this email because a PartyKr8 user invited you to his/her upcoming event..
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

export {
  EVENT_INVITE_MESSAGE
}