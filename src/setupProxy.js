// const { createProxyMiddleware } = require('http-proxy-middleware');

// const context = [
//     "/api"
// ];

// module.exports = function (app) {
//     const appProxy = createProxyMiddleware(context, {
//         target: 'http://localhost:7044',
//         secure: false
//     });

//     app.use(appProxy);
// }; 

const { createProxyMiddleware } = require('http-proxy-middleware');
const { env } = require('process');

const target = 'http://localhost:7044/';

const context = [
  "/apiAuc/",
  "/apiUser/",
  "/hubs/bids",
];

const onError = (err, req, resp, target) => {
    console.error(`${err.message}`);
}

module.exports = function (app) {
  const appProxy = createProxyMiddleware(context, {
    target: target,
    // Handle errors to prevent the proxy middleware from crashing when
    // the ASP NET Core webserver is unavailable
    onError: onError,
    secure: false,
    ws: true,
    changeOrigin: true,
    // Uncomment this line to add support for proxying websockets
    //ws: true,
  });

  app.use(appProxy);
};
