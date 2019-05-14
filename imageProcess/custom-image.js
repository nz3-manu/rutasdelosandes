import Jimp from 'jimp';

const maxWidth = 700;
const maxHeight = 80;
const x = 120;
const y = 160;

function main(req,response) {
  Promise.all([Jimp.loadFont('./imageProcess/font.fnt'), Jimp.read('./imageProcess/thanks.jpg')]).then((res) => { 
    let font = res[0]
    let image = res[1]
    image.print(
      font,
      x,
      y,
      {
        text: decodeURI(req.params.name).toUpperCase(),
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      },
      maxWidth,
      maxHeight
    ).getBuffer(Jimp.MIME_JPEG, (err, buffer) => { 
      response.contentType('image/jpeg');
      response.send(buffer);
    })
  })
}

export default  main;