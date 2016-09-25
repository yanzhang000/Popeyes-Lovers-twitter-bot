// START HEROKU SETUP
var express = require("express");
var app = express();
app.get('/', function(req, res){ res.send('The RRobot is happily running.'); });
app.listen(process.env.PORT || 5000);
// END HEROKU SETUP


// Listbot config
//
// Config.keys uses environment variables so sensitive info is not in the repo.
var config = {
    me: 'popeyeslovers', // The authorized account with a list to retweet.
    regexFilter: '', // Accept only tweets matching this regex pattern.
    regexReject: '(RT|@)', // AND reject any tweets matching this regex pattern.

    keys: {
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    },
};

// The application itself.
// Use the tuiter node module to get access to twitter.
var tu = require('tuiter')(config.keys);

var randNum = 0;
var limit = 500;
var divider = 200;

run();


// Run the application. The callback in getListMembers ensures we get our list
// of twitter streams before we attempt to listen to them via the twitter API.
function run() {
	searchTweets();
}

function searchTweets(){		
	tu.filter({track: ['popeyes'], language: "en"}, function(stream) {   
		stream.on('tweet', onTweet);
		console.log("listening to stream");
	});
}

function onTweet(tweet) {
	// Note we're using the id_str property since javascript is not accurate
	// for 64bit ints
	
	randNum = Math.floor(Math.random() * limit) + 1;
	console.log("Random Number = " + randNum);
	if(randNum % divider == 0){
		console.log("RT: " + tweet.text);
		tu.retweet({
			id: tweet.id_str
		}, onReTweet);
	}
	
}

// What to do after we retweet something.
function onReTweet(err) {
	if(err) {
        console.error("retweeting failed :(");
        console.error(err);
    }
	
}







