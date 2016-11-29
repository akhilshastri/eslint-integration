var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.config');
var staticFileMap = require('./resource-map.json');
var path = require('path');
let http = require('http');
var httpProxy = require('http-proxy');
var express = require('express');
var app = new (express)();
var port = 3000;

const UI_SERVER_PORT = 3000, PROXY_SERVER = 5050 ;
const      API_SERVER = 'http://127.0.0.1:3000' ;
//const      API_SERVER = 'http://192.168.1.49:8080' ;

var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: config.output.publicPath}));
app.use(webpackHotMiddleware(compiler));

app.use(function mapStaticResource(req, res, next) {
  var url = req.url.split('?')[0];
  console.log(req.url);
  if (staticFileMap[url]) {
    setTimeout(()=>{
        res.sendFile(path.join(__dirname, staticFileMap[url]));
    },1000);
  }
  else {
    next();
  }
});

app.use('/public', express.static('public'));

app.listen(UI_SERVER_PORT, function (error) {
  if (error) {
    console.error(error)
  } else {
    console.info("--> UI Server Listening on port %s", UI_SERVER_PORT) ;
  }
});


const proxy = httpProxy.createProxyServer({});
const serverp = http.createServer((req, res) => {
  // You can define here your custom logic to handle the request
  // and then proxy the request.
  if (req.url.indexOf('/api') == 0) {
    proxy.web(req, res, { target: API_SERVER });
  } else {
    proxy.web(req, res, { target: 'http://127.0.0.1:' +UI_SERVER_PORT });
  }
});

serverp.listen(PROXY_SERVER, (err) => {
  if(err){
    console.error(err);
    return;
  }
  console.log('==> PROXY Running on port %s, Open http://localhost:%s in your browser.',PROXY_SERVER,PROXY_SERVER);
});
