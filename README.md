# image-generator-from-html

Sofware that receives an HTML template, a text, and an image and use them to generate an image based on the template.

## Build Docker Image
To build the docker image you should use:
`docker build -t image-generator-js .`

*image-generator-js* is variable, you can use whichever name you like. Bear in mind that it will be used later on though.

## Run the Docker Image
To run the software, use the following:

`docker run image-generator-js`

This command will work after you've build using the `docker build` command.