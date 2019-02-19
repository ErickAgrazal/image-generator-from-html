// include the node module
const wkhtmltox = require("wkhtmltox"),
      path = require('path'),
      config = require('config'),
      fs = require('fs'),
      ora = require('ora'),
      colors = require('colors');

class ImageGenerator {
    /**
     * Class' constructor
     * @function {constructor}
     **/
    constructor(templateConfigName='Settings.templateConfig', exportFileConfigName='Settings.exportFileConfig') {
        const templateConfig = config.get(templateConfigName);
        const exportFileConfig = config.get(exportFileConfigName);

        // Import and export files
        this.templateFile = {
            name: templateConfig.filename || 'index.html',
            path: path.resolve(__dirname, templateConfig.folder || 'templates', templateConfig.filename || 'index.html')
        };
        this.exportFile = {
            name: `${exportFileConfig.filename}.${exportFileConfig.format}` || 'index.jpg',
            path: path.resolve(__dirname, exportFileConfig.folder || 'templates', `${exportFileConfig.filename}.${exportFileConfig.format}` || 'index.jpg'),
            format: exportFileConfig.format || 'jpg'
        };

        this.converter = new wkhtmltox();
        this.spinner = ora('Generating images based on given template').start();
    }

    /**
     * Renders the template to later be used by `generateImage`
     * @function {renderTemplate}
     **/
    renderTemplate(){
        // TODO
    }

    /**
     * Generates an image based on the configuration from the construction process
     * @function {generateImage}
     **/
    generateImage() {
        this.renderTemplate();
        this.converter.image(fs.createReadStream(this.templateFile.path), { format: this.exportFile.format })
            .pipe(fs.createWriteStream(this.exportFile.path))
            .on("finish", () => {
                this.spinner.text = "";
                this.spinner.stop();
                console.log(`Image (${this.exportFile.name}.${this.exportFile.format}) generated and stored here: ${this.exportFile.path}.`.green); // outputs green text

                // Exit node process
                process.exit(22);
            });
    }

    /**
     * Prints the final report after the `generateImage` is called
     * @function {printReport}
     **/
    printReport(templateFileName, exportFileName, exportFileFormat, exportFilePath) {
        // TODO
    }
}

const imageGenerator = new ImageGenerator();
imageGenerator.generateImage();