const assert = require('assert'),
      { ImageGenerator } = require('./../index'),
      fs = require('fs');

const _ = describe('ImageGenerator', function() {
    it('should generate an image', async () => {
        const imageGenerator = new ImageGenerator({debug: false});
        const { exportSettings } = await imageGenerator.generateImage();
        assert.ok(fs.existsSync(exportSettings.path), 'Export image should exist');
        fs.unlink(exportSettings.path, (err) => { if (err) throw err });
    });
});