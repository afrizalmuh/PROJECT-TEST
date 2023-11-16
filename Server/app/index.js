const Hapi = require('@hapi/hapi')
const { db } = require("./configs/database");
const HapiCors = require('hapi-cors')
const productRoute = require('./routers/product_route')

const server = Hapi.server({
  port: 9000,
  host: 'localhost'
});

(async function init() {
  await server.register({
    plugin: HapiCors,
    options: {
      origins: ['http://127.0.0.1:5173'], // Replace with your React app's URL
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the HTTP methods you want to allow credentials: true, // Allow credentials (e.g., cookies) to be sent with requests
    },
  });

  //Register routes
  server.route(productRoute);

  await server.start();
  console.log("Server running on", server.info.uri)
})()

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});