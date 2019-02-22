const { ImageGenerator } = require('./image-generator');

if (typeof require !== 'undefined' && require.main===module) {
    const imageGenerator = new ImageGenerator();
    imageGenerator.generateImage();
}