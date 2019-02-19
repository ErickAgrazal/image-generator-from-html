// // include the node module
// var wkhtmltox = require("wkhtmltox");

// // instantiate a new converter.
// var converter = new wkhtmltox();

// // Locations of the binaries can be specified, but this is
// // only needed if the programs are located outside your PATH
// converter.wkhtmltopdf   = '/opt/local/bin/wkhtmltopdf';
// converter.wkhtmltoimage = '/opt/local/bin/wkhtmltoimage';

// // Convert to pdf.
// // Function takes (inputStream, optionsObject), returns outputStream.
// converter.pdf(fs.createReadStream('foo.html'), { pageSize: "letter" })
//     .pipe(fs.createWriteStream("foo.pdf"))
//     .on("finish", done);

// // Convert to image.
// // Function takes (inputStream, optionsObject), returns outputStream.
// converter.image(fs.createReadStream('foo.html'), { format: "jpg" })
//     .pipe(fs.createWriteStream("foo.jpg"))
//     .on("finish", done);