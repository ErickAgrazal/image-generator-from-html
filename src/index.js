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
        this.intialTime = new Date();
        this.templateFile = {
            name: templateConfig.filename || 'index.html',
            path: path.resolve(__dirname, templateConfig.folder || 'templates', templateConfig.filename || 'index.html')
        };
        this.exportFile = {
            name: `${exportFileConfig.filename}.${exportFileConfig.format}` || 'index.jpg',
            path: path.resolve(__dirname, exportFileConfig.folder || 'templates', `${exportFileConfig.filename}.${exportFileConfig.format}` || 'index.jpg'),
            format: exportFileConfig.format || 'jpg'
        };

        // Utilities
        this.converter = new wkhtmltox();
        this.spinner = ora('Generating images based on given template').start();
    }

    /**
     * Renders the template to later be used by `generateImage`
     * @function {_renderTemplate}
     **/
    async _renderTemplate(){
        // TODO
    }

    /**
     * Generates an image based on the configuration from the construction process
     * @function {generateImage}
     **/
    async generateImage() {
        await this._renderTemplate();  // Wait until the HTML is generated
        this.converter.image(fs.createReadStream(this.templateFile.path), { format: this.exportFile.format })
            .pipe(fs.createWriteStream(this.exportFile.path))
            .on("finish", () => this._printReport());
    }

    /**
     * Prints the final report after the `generateImage` is called
     * @function {_printReport}
     **/
    _printReport() {
        this.spinner.text = "";
        this.spinner.stop();
        this.finalTime = new Date();
        console.log(`\n-------------------------------------`);
        console.log(`Process completed in ${(this.finalTime.getTime() - this.intialTime.getTime())/1000} seconds`);
        console.log(`------------------------------------- \n`);
        console.log(`Extra information:`);
        console.log(`Template used: ${this.templateFile.name.green}`);
        console.log(`Export file name: ${this.exportFile.name.green}`);
        console.log(`Export file format: ${this.exportFile.format.green}`);
        console.log(`Export file location: ${this.exportFile.path.green} \n`);
        this._exitProcess();
    }

    /**
     * Exit the execution after the report is called
     * @function {_exitProcess}
     **/
    _exitProcess() {
        // TODO: Don't know why, but it seems that wkhtmltox keeps the process alive,
        //       even after the it finishes it task. Even though, it's a nice idea to
        //       have this "kind of" desctructor to delete anything needed.
        process.exit();
    }
}

if (typeof require !== 'undefined' && require.main===module) {
    const imageGenerator = new ImageGenerator();
    imageGenerator.generateImage();
}
