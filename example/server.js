const vod = require('ub-vod');

const http = require("http");

const vod_app = vod.app();

vod_app.router(function (r) {

    r.get('/', function (req, res) {

        res.writeHead(200, {"Content-Type": "text/html"});
        res.end('<video src="http://localhost:9100/video/small.mp4" controls></video><br><br><video src="http://localhost:9100/video/video.mp4" controls></video>');

    });

    r.get('video/{id}', function (req, res) {

        res.stream('videos/' + req.routeParams.id);

    });

});

http.createServer(vod_app.serve).listen(9100);


/*

 // With Express

 const express = require('express'),
 app = express();

 app.use(vod_app.init);

 app.get('/', function (req, res) {
 res.writeHead(200, { "Content-Type": "text/html" });
 res.end('<video src="http://localhost:9100/video/1.mp4" controls></video>');
 })

 app.get('/video/:id', function (req, res) {
 res.stream('videos/' + req.params.id);
 })


 http.createServer(app).listen(9100, function () {
 console.log('Express server listening.')
 })

 */