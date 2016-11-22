'use strict';

var OAuth = require('oauth').OAuth;
var express = require('express');
var Emitter = require('events').EventEmitter;
var keys = require('../auth.js').keys();
var app = express();
var ee = new Emitter();

//parameters
var oauth = new OAuth(
	'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token' ,
    keys.consumer_key,
    keys.consumer_secret,
    '1.0A',
    null,
    'HMAC-SHA1'
);


function getUserData(userInfo,callback){
	oauth.get(
	'https://api.twitter.com/1.1/account/verify_credentials.json',
	keys.access_token_key,
	keys.access_token_secret,
	function(error,data,response){
		if(error){
			console.error('User info failed to load.\n');
			callback();
		}else{
			
			data = JSON.parse(data);
			
				userInfo.id = data.id;
				userInfo.realName=data.name;
				userInfo.screenName=data.screen_name;
				userInfo.avatar= data.profile_image_url_https.replace('_normal','');
			
			callback();
		}
	});
}

function getFriends(friends,callback){
	//make request for friends
	oauth.get(
	'https://api.twitter.com/1.1/friends/list.json?count=5',
	keys.access_token_key,
	keys.access_token_secret,
	function(error,data,response){
		if(error){
			console.error('Friends failed to load.\n');
			callback();
		}else{
			
			data = JSON.parse(data);
			
			for(var i = 0; i < data.users.length; i++){
				var friend = {};
				friend.screenName = data.users[i].screen_name;
				friend.realName = data.users[i].name;
				friend.avatar = data.users[i].profile_image_url_https.replace('_normal','');
				friends.push(friend);
			}
			callback();
		}
	});
}

function getMessages(messages,callback){
	oauth.get(
	'https://api.twitter.com/1.1/direct_messages.json?count=5',
	keys.access_token_key,
	keys.access_token_secret,
	function(error,data,response){
		if(error){
			console.error(error);
			callback();
		}else{
			
			data = JSON.parse(data);
			
			for(var i = 0; i < data.length; i++){
				var message = {};
				message.sender = {
					id : data[i].sender.id,
					realName:data[i].sender.name,
					avatar: data[i].sender.profile_image_url_https.replace('_normal','')
				}
				message.recipient = {
					id : data[i].recipient.id,
					name:data[i].recipient.name,
					avatar: data[i].recipient.profile_image_url_https.replace('_normal','')
				}
				message.text = data[i].text;
				message.timestamp = data[i].created_at;
				console.log(message);
				messages.push(message);
			}
			callback();
		}
	});
}
function getStatuses(tweets,callback){
	oauth.get(
	'https://api.twitter.com/1.1/statuses/home_timeline.json?count=5',
	keys.access_token_key,
	keys.access_token_secret,
	function(error,data,response){
		if(error){
			console.error('Tweets failed to load.\n');
			callback();
		}else{
			
			data = JSON.parse(data);
			
			for(var i = 0; i < data.length; i++){
				var status = {};
				status.text = data[i].text;
				status.user={
					realName:data[i].user.name,
					screenName:data[i].user.screen_name,
					avatar:data[i].user.profile_image_url_https.replace('_normal','')
				};
				status.timestamp = data[i].created_at;
				tweets.push(status);
			}
			callback();
		}
	});
}

function init(){
	var userInfo = {};
	var friends = [];
	var messages= [];
	var tweets = [];

	getUserData(userInfo,function(){
		getFriends(friends,function(){
			getStatuses(tweets,function(){
				getMessages(messages,function(){
							//create server to serve static files
							app.use(express.static(__dirname + '/public'));

							app.set('view engine','jade');
							app.set('views', __dirname + '/templates');

							app.get('/',function(req,res){
								res.render('index',{
													user:userInfo,
													friends:friends,
													messages:messages,
													tweets:tweets
													});
							});
							app.get('*',function(req,res){
								res.status(404);
								res.send('404 file not found');
							});
							app.listen(80, function() {
								console.log("The frontend server is running on port 80!");
							});
				});
			});
		});
	});
}

init();
