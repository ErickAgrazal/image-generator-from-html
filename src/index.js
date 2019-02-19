// include the node module
const wkhtmltox = require("wkhtmltox"),
      path = require('path'),
      config = require('config'),
      fs = require('fs'),
      ora = require('ora');

// Initializing spinner
const spinner = ora('Generating images based on given template').start();

// instantiate a new converter.
const converter = new wkhtmltox();

// // Convert to image.
// // Function takes (inputStream, optionsObject), returns outputStream.
const templateConfig = config.get('Settings.templateConfig'),
      exportFileConfig = config.get('Settings.exportFileConfig');

const templatePath = path.resolve(__dirname,
                                  templateConfig.folder || 'templates',
                                  templateConfig.filename || 'index.html');
const exportImagePath = path.resolve(__dirname,
                                     exportFileConfig.folder || 'templates',
                                     `${exportFileConfig.filename}.${exportFileConfig.format}` || 'index.jpg')

converter.image(fs.createReadStream(templatePath), { format: "jpg" })
    .pipe(fs.createWriteStream(exportImagePath))
    .on("finish", () => {
        spinner.text = "Images generated.";
        spinner.stop();
    });