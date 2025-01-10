const http = require("node:http");
const axios = require("axios");


const hostname = "127.0.0.1";
const port = 3000;



// Basically creating the server in a callback function.
const server = http.createServer(async (request, response) => {
    response.setHeader("Content-Type", "application/json");

    try {
        const apiResponse = await axios.get("https://www.fruityvice.com/api/fruit/apple");

        response.statusCode = 200;
        response.end(JSON.stringify(apiResponse.data));
    } catch (error) {
        response.statusCode = 500;
        response.end(JSON.stringify({ error: "Failed to fetch data", message: error.message}));
    }

});

server.listen(port, hostname, () => {
    console.log(`Server successfully running at http://${hostname}:${port}/`);
});


