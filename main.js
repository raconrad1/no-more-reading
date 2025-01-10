// imports http module, specified that I wanted node:http
const http = require("node:http");
// store http's creatServer method into a variable
const createServer = http.createServer;

// Can also do this in one line, see below.. this will only extract the "createServer" function from the http module
// const { createServer } = require("node:http");

// this hostname/port I think is typically used for local development, might have to change later?
const hostname = "127.0.0.1";
const port = 3000;

// Basically creating the server in a callback function.
const server = createServer((request, response) => {
    // statusCode 200 is the http way of saying "success"
    response.statusCode = 200;

    // this setHeader is used to set the content type, but it seems like it can be used for lots of file types
    response.setHeader('Content-Type', 'text/plain');

    // response.end is required, this is where we can display the string, or else if it's a different file type this is where the file name/path goes
    response.end('Hello World');
})

// this listens for the server function to be successfully executed, then server.listen will log to the console
server.listen(port, hostname, () => {
    console.log(`Server successfully running at http://${hostname}:${port}/`);
});