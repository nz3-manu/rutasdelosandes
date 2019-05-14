const nodemailer = require('nodemailer'),
  pdfMakePrinter = require('pdfmake/src/printer'),
  inLineCss = require('nodemailer-juice'),
  inlineBase64 = require('nodemailer-plugin-inline-base64');
  import something from './pdf-recibo';
  import images from './data64Icons';

 
 /* Html body Email*/
var html = (userInfo) => `<div class="container">
<table style="width:100%">
        <tr>
            <th colspan="1"> 
            <img src="${images.logo}" 
            alt="logo" width="70" style="display:block"/> 
            </th>
            <th colspan="5"> <h2 class="slogan"> Gracias por tu compra <br> Rutero</h2></th>
        </tr>
        <tr>
            <th colspan="6"> <h2> Que Tal, ${userInfo.name}</h2> </th>
        </tr>
        <tr>
            <th colspan="6"> <p> Te enviamos el recibo de compra de tus productos. <br> Recuerda que el producto se tardara en llegar entre 3 a 7 días hábiles contados a partir del día hábil siguiente de la fecha de compra. 
                                <br><br>Saludos, <br>
                                Rutas De Los Andes </p></th>
        </tr>
        <tr>
            <th colspan="6">  <br> </th>
        </tr>
        <tr>
            <th colspan="6">  <hr> </th>
        </tr>
        <tr class="information__footer" >
            <th>
                <p class="footer">Para mayor informacio comunicarse al: <br>
                   3113403572</p> 
                    <a href="https://rutasdelosandes.com/"> <p class="footer">rutasdelosandes.com</p></a>
            </th>
            <th>
                <a href="https://api.whatsapp.com/send?phone=573113403572&text=Hola%20ruteros%20como%20estan%20estan" target="_blank"><img src="data:image/png;base64,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" width="40" alt="whatssapp" style="display:block"/> </a>  
             </th>
            <th>
               <a href="https://www.instagram.com/rutasdelosandes/" target="_blank"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfhCBgQGRFZh3ysAAADmUlEQVRo3s2ZzUtUURjGfzMOJgwMaAhh4saNiJUgCSpkDYNtSlxEi2khqBuX7lpIixZZIP4Fuqt00WKYhZGKSn4sJhXDlQsNIzWQLArxA5zb4t47XqdzZu453un6nMUM933P+zz3PZ/3nACqCBOlmopMgZ1M2WCaA+WIrlFOF0kOMXKUQ5J0Ue41dTG9zHGak9pZTvlIL8XekAeIs+ma2lk2iRO4KH0bK1rkdlmhTZ+8kskLkdtlkkod+iZ2PaE3MNilSZW+kyPP6A0Mjuh0T17EoKfkdhmkyB19oiD0BgYJNxIK8/ZnWcjb9oWkNzBy94Umj7ueuDueGxHOmaqST1yTivvKT4VRVEqV1Pad23wTGWTTzgwxyhTITZQRY0YScVJUoU3oekzfBebzAH0cC+O2/esqnvP7tMlt9AnjrmS/VlyS/AuvZgQkDRF3OhVLFtyYMt2tc/VNxISxN537hV5JZ1HvejcFAsok0XvPqs0JHbY0El4nEABbwvhzAEGgnGZhMJVxb8MQPhVHaqbcFNBOUINKRYAYQdpNAR2e0UNaybsDQoQ1+rocX6gnjYFB2kU2YoRDRCmRmPMHiNACLPA78+SYzwpyS4gGqZaac09CrSyxzzjj7LPEHc2MVQep0KoYZ4IGa39TRAMTPNaKUxFyIeApd61/KZ4B8JDXWfm5whh/eA/Acxqtp7O89EJAPfetf2b7BnkhaJ4Ar/hAGriS8f+VPwNqTbAEQC11QusNah1e7qAloEZqr9ERoAIz8SdS+4nDyyWC7Ch4m51rWWpfdni5w46OgG3WhdZ1tv+PAOgRzPlperK8CiCgxVo35unPkpCmn3kAYrQUTgCMEAFggFZHQ6zTygAAEUaU4u2E2JAaRYtRFUNWquep4ToNwLLV9gBDOT5IRNiAsPTca9VyGst6PmxlIRsRhrM8xyzLqoThkHCQA6aUNEM3a4I9RIw1uhUjTXEQAhI8UKxYxSQLpEiRAhpppFGp69lIQAhIktbYFbZoUTqRJmnuCfdYFDqUWr8/tCnsmqVC6yJ7WG/+VuhQZX2YzGgLMGuWSUaGgzXfp9mo1lHEqFU756eZvXLFeSPQOEvUmg0ecY+rSsmf4R0mw3RmR+XEk/N59/3z3PcDCvDpiOZSHVL5ckyXjc6CC8h7aO3zUe0lOKz2/bje7gs+XljYI8LXKxvw/dLKhK/XdiZ8vrg04evV7RkKcnmtniKPr+//Ar//as9wxMzSAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTA4LTI0VDE2OjI1OjE3KzAyOjAwNqca/wAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0wOC0yNFQxNjoyNToxNyswMjowMEf6okMAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC" width="40" alt="instagram" style="display:block"/> </a>  
            </th>
            <th>
                <a href="https://www.facebook.com/rutasdelosandes0/" target="_blank"> <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfhBhQWBDbyitiwAAACyElEQVRo3u2Zv2tTURTHP+811EgQAqWDJSClYpfOYnCRWrsJpWOWSDP1LzBD3ZxKFzf/AhFcYtaUKhW6CFkE0SGZQjIU6aChaTW5Ds+XvPx+576bXhG/Z3nvJed8zz3v3PvuPcdBigTrrLDUFah3pcIRTbHF0FhkhyLnqAlyTpEdFk1Tz7PLB9oTqYPS5phd5s2QO2SohqYOSpUMTlT6Tcpa5L6U2dQnT1GKRO5LiZQOfZqGEXqFokFaSp+lZYxeoWiRDU8+x4FRcl8OmAtHX5gJvUJRCOPCbEbfi8LUdz9LeoWanAtpw6k3Oh3HzoiUwYk3SRrBdSG4VJbYkM5W4Bef+MgZLg4uDne5P1XnkEfDDzc1xvKWNPEBO/lQmkMLtKOx5j8f+akJ50B5UDcjpn82JrzhHFBkgkrz4g/uGTciOlD19gsuADmWhan3ku8aCRvEMrmeAxmx+vuhJwmSJEkOJeV4dFkXBZstX24PGHtDR2yj7e8dcxoT8Hof/R0NCwpFznsFWxpvUPXdLWnmwRa4JLTWPzPYIOGyLkibcRHQRZz1GCsilRKfAWj3Pa3xonu9xkOBvRXYF6XNk6kmn4rs7bvaCTQOMntL/6ADN207II6AacgigMMXVgX//8YPAFa5CDy9x+vu9S0R/9cYdZEDCyz8cTyIuJC2h7pLXVPVDP47UHepaCma+RhBxeWIloZi5NoPAC2OXJocGhqNHIc0XaBgzYGCtyUr0rFC36HoOXDKiRUHTjj1zwWvrDgQYJUfzfr3kQ80tuR9R7NL9q58/HtcBm+lx/OoEegez/39gCJ/pePPj1pLJZXhaBEojfZKUqSK4kBfkSoWMFNjm3dcCxXCx/wM3K0Jgn/BNrXxP2c1z7nhZWrR2nKp9i8oVlsv1/u5YLFh4cFyywasN608WG3bebDcuPRgtXXbw0ya1/IQGW7f/wYArNx3bj/4hAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0wNi0yMFQyMjowNDo1NCswMjowMMg/yTsAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMDYtMjBUMjI6MDQ6NTQrMDI6MDC5YnGHAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg==" width="40" alt="facebook" style="display:block"/> </a> 
            </th>
            <th>
                <a href="https://www.youtube.com/channel/UC2n-KkSMxnUtb_UQrXM_9XA" target="_blank"> <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfhDA0UGzHFkZdXAAACN0lEQVRo3u2YO2gUQRjHfztZQx53eT9EsBEsNAcRSZUipLM6UqRJkyJBLIwgPkAUsbBJGgs7G8ORIk26NCkSCKQJab3kxCRixGAeR0ThbjkP3bU4T+5kj2N2JjvN/r9ud7/5/+ab1+5CpEiRIhmW5Xu1h+t000qMGK001Xiqvjx+4pDHwSFLhuN6ANeY4iYJ+s+pu9/IsMVb3vvdTLKOF1JscOt/+5ehmZfC5Vml/ZuQ7Uvxqmw/YsTe4zc3SgBbhgA81sEiQfqc5nx9eVwUDBuzB4tRswAwIrhsFKBP0GIUICZoNgoQD1KBAmt81lUB+CK5dvMMAhYTfNCwE+zBmWTK8j/6BqY4UAQ4AkcyJVVVwkZm+KoAkANXCQCgmcdkAwK4SKekfCdTnBd8D4SgCQCgi1nyJgEA+nlNUaY9oWk9l3XCfcZkEnQDAKxwaBagQ+atWj/AAKtcMAVwhQXeMSSTYmszv8Rzbsv0XSdAN0+4F+xgt3EVhyHOAx7RFjDbszmjVyqlEreJuzylRwHfgbTkTrj7d9hs7nCocA6W4hjWpJOWSTLDvrK5h8dHmxPpsiVJKhS9WjnBqbbGgigrAlRAp3ZMA6QFm2YBALa1zOcgcUqjAJaM9T9FEaCTIyP9d7laJhk3AjBbWYy50O1Xaagej2m5t1nFWPQ7PxPMUwjB/BOTtedlLw9ZUv7k9I8iGeYZrf49bNUEGaCTdtpop0XhZ3WBHDny/GCPfX6Ftb4jRYoUSUJ/ABHE0eDZH44WAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTEyLTEzVDIwOjI3OjQ5KzAxOjAwUq1p0AAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0xMi0xM1QyMDoyNzo0OSswMTowMCPw0WwAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC" width="40" alt="youtube" style="display:block"/> </a> 
            </th>
            <th>
                <a href="https://twitter.com/rutasandes" target="_blank"> <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfhBhQWBAw0hgECAAADhklEQVRo3s2ZTUhUURSAv+fPJLiwMinHSehnFy2CkGwROKFG4TZiLATFhdlCi4qCoNYZLdwIFbWxgihF20kTpGRUCOXGzATL1AippBo1x9ties5T37v3vvHZ85zVm3fe+c69c3/OPdfArWQTZgfBBYWxBf1AlF+uPWpLHtV0EENINEYH1eR5jQ5QRzdxKdqqcZ5RR8AbuEGEYW20VYeJYKwUX0ZfSnBT+yhLHR6ia0VwU7sIpYIvZtwTvEAwTrFbfBXTnuEFgmmq9OHpNHkKN7WJdD18+6rgBYJ2nRBWp/XJXlD+96uJFwj5WCj2eOjZD0fHGRHycOLJdNxpXfBm2dHRLjt82X/DC8TyBdpY4ZrvVvvMbcqclxHq9VcqW5ngKa28ZJZc1ll+F7Y7Yj6D9CcfA5IN96dGeyaJWJync5E/CAQjXOGcwzfD1nyhTuI8zEMFvocty1pYxG3KSSOTIcfv6pLm3Y5G74BM2iT4HxQ6/i0GzQhmHb7sNs3yJMlWGwCZPHK0qHXEZ3KBq5Q7fhs3c8caSftuLrSllu8272cUmZ/BLYn3moRRp8TkjcVZ0GaffKWYG83S0dMJkC1NtOfZuMhhmPvMWN63SPGXFMM3RnYaYbKkXXhg0XOUYwQ5TS9TAGRIAyhS9E8WYWhQRNnPBofPQ5RySAp4rvAtaMggKHXxkUIeU8pvm3ejjCpaGEQlwTSFUZRczrNH6chODPLVAah6YDdz9KSEh0KNw5myB3bZLLO6clDDJghTimFyJ+UA7imHoGBKHcA8R1LCG3zVC2BAaTTHyRQCqNDACwYgqmXYzXHpgrVcerX8RjMY03BWTx+fmXWBL2Gflt1YmlYAlbzgE/PaeIPLmpaaAeznrIvWw5klO4gkAN3BImjULrfsdcyBlmuFaju26msOk63Er5dkgTbbMcgTkqX6jaNSfJ6r80Vn4qMaTfMZrpMrxW/VWFWsWmNGraoAfuEJ19im6PwiRlzh48mCplNa/pZGSrTqnpu4wbwrvCUtlx1MYrSwUwHP4RSTLuGCRQeTgLQWGucBZYRspmEOJ+hIsajx72hmOo3QquzmGEMM8p4JNlNAAQVsX0E9uJK71kffjudJ8blAAb6XaNZAkcr3Mh34XqgE30u1a6BY7Xu53hwLPl5YmDPC1ysb8P3SKiG+XtslxOeLy4T4enWblFW5vHbfRR5f3/8F/CCe259ASF0AAAAldEVYdGRhdGU6Y3JlYXRlADIwMTctMDYtMjBUMjI6MDQ6MTIrMDI6MDAvpfL7AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE3LTA2LTIwVDIyOjA0OjEyKzAyOjAwXvhKRwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII="  width="40" alt="twitter" style="display:block"/> </a>
            </th>
        </tr>
</div>`

var styles = `<style>
p {
  padding: 0;
  margin: 0;
  font-weight: 100;
  font-size: 15px;
  font-family: monospace;
  
  }
  h1, h2 {
      font-family: fantasy;
  }
  h2{
      font-weight: bolder;
  }

      th, td {
          padding: 0;
      }
  .slogan {
      text-align: right;
      line-height: 1.2;
      font-size: 20px;
  }
   hr {
      height: 2px;
      background-color: black;
  }
  table, th, td {
      text-align: left;
      border: none;
  }
  .information__footer th {
      padding: 2px;
  }
  .footer, .footer a{
      font-size: 10px;
      line-height: 1.3;
  }
   a {
  text-decoration: none;
  font-family: fantasy;
  font-size: 10px
  }
              </style>`

function toEmail(userInfo,result) {
  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      type: 'OAuth2',
      user: 'rutasdelosandes@gmail.com',
      clientId: '599459963529-9caqpvmcjtbp085vooplqqnomuu406ua.apps.googleusercontent.com',
      clientSecret: 'Ey_QbUBi7wsrmpYCh_-uQZoh',
      refreshToken: '1/nfsye5W-gLZKxzmPywZJ_b1p-SmlVxcLHeCDnfsHa2A',
      expires:3600
    },
    debug: true // include SMTP traffic in the logs
  });

  transporter.use('compile', inLineCss());
  transporter.use('compile', inlineBase64({cidPrefix: 'somePrefix_'}))
  // send an email to the user
  let mailOptions = {
    from: '"Rutas de los Andes 🏕🏔" <rutasdelosandes@gmail.com>', // sender address
    to: userInfo.email, // list of receivers
    subject: 'Recibo de compra 📃📝 ', // Subject line
    text: 'Compra realizada con exito', // plain text body
    html: `${styles}${html(userInfo)}`, // html body
    attachments: [
      {
        // binary buffer as an attachment
        filename: 'Recibo.pdf',
        content: result
      }
    ]
  };
  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("error in console",error);
    }
    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  });
}
function toBase64String(result) {
  response => {
    /*'data:application/pdf;base64,' + result.toString('base64')*/
    res.send(response); // sends a base64 encoded string to client
  };
}

function generatePdf(docDefinition, emailInformation ,callback) {
  try {
    var fonts = {
      Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf'
      }
    };
    const printer = new pdfMakePrinter(fonts);
    const doc = printer.createPdfKitDocument(docDefinition);
    
      // Send recipe
      /*  */
    let chunks = [];

    doc.on('data', chunk => {
      chunks.push(chunk);
    });

    doc.on('end', () => {
      const result = Buffer.concat(chunks);
      callback(emailInformation,result);
    });

    doc.end();
  } catch (err) {
    throw err;
  }
}

export default (order, items) => {
  generatePdf(something.generatePdfObject(order, items), something.emailInformation(order), toEmail);
};
