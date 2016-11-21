'use strict';

var express = require('express');

var app = express();
//create server to serve static files
app.use(express.static(__dirname + '/public'));

app.set('view engine','jade');
app.set('views', __dirname + '/templates');

app.get('/',function(req,res){
	res.render('index');
});
app.get('*',function(req,res){
	res.status(404);
	res.send('404 file not found');
});
app.listen(80, function() {
	console.log("The frontend server is running on port 80!");
});