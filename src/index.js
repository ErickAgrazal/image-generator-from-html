// include the node module
const wkhtmltox = require("wkhtmltox"),
      path = require('path'),
      config = require('config'),
      fs = require('fs'),
      ora = require('ora'),
      colors = require('colors'),
      template = require("mustache");

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
        
        // Defining context
        const templatesFolderPath = decodeURI(path.resolve(__dirname, templateConfig.folder || 'templates'));
        const context = Object.assign({containerFolder: templatesFolderPath}, templateConfig.context);

        this.templateFile = {
            name: templateConfig.filename || 'index.html',
            path: path.resolve(templatesFolderPath, templateConfig.filename || 'index.html'),
            context
        };
        this.exportFile = {
            name: `${exportFileConfig.filename}.${exportFileConfig.format}` || 'index.jpg',
            path: path.resolve(templatesFolderPath, `${exportFileConfig.filename}.${exportFileConfig.format}` || 'index.jpg'),
            htmlPath: path.resolve(templatesFolderPath, `generated_${exportFileConfig.filename}.html` || 'generated_index.html'),
            format: exportFileConfig.format || 'jpg'
        };

        // Utilities
        this.converter = new wkhtmltox();
        this.spinner = ora('Initializing the generation of images based on given template').start();
    }

    /**
     * Gets the context that will be printed to the template
     * @function {_getContext}
     */
    _getContext(){
        this.spinner.text = 'Getting context to render HTML.';
        return this.templateFile.context;
    }

    /**
     * Renders the template to later be used by `generateImage`
     * @function {_renderTemplate}
     **/
    async _renderTemplate(){
        // TODO
        this.spinner.text = 'Rendering template and storing in memory.';
        let html = template.render(fs.readFileSync(this.templateFile.path, 'utf8'), this._getContext());
        this._writeRenderTemplate(html);
    }

    /**
     * Writes rendered template
     * @function {_writeRenderTemplate}
     */
    _writeRenderTemplate(html){
        this.spinner.text = 'Writting rendered template to disk.';    
        fs.writeFile(this.exportFile.htmlPath, html, (err, data)=>{
            if (err) console.log(`There was an error storing the rendered template. More information: \n${err}`);
        })
    }

    /**
     * Generates an image based on the configuration from the construction process
     * @function {generateImage}
     **/
    async generateImage() {
        await this._renderTemplate();  // Wait until the HTML is generated
        this.spinner.text = 'Generating image based on the rendered HTML.';
        this.converter.image(fs.createReadStream(this.exportFile.htmlPath), { format: this.exportFile.format })
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
        console.log(`\n----------------------------------------`);
        console.log(`Process completed in ${(this.finalTime.getTime() - this.intialTime.getTime())/1000} seconds`);
        console.log(`---------------------------------------- \n`);
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
        fs.unlink(this.exportFile.htmlPath, (err) => {
            if (err) throw err;
            console.log(`Rendered file ${this.exportFile.htmlPath} was ${"deleted".red}`);
            process.exit();
        });
    }
}

if (typeof require !== 'undefined' && require.main===module) {
    const imageGenerator = new ImageGenerator();
    imageGenerator.generateImage();
}
