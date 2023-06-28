const fs = require('fs');
const Twitter = require("twitter");

module.exports = class AltAlertBot {
  constructor(screenName, consumerKey, consumerSecret, accessTokenKey, accessTokenSecret, infoUrl, journoURL) {

    // Set up the Twitter client
    this.client = new Twitter({
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
      access_token_key: accessTokenKey,
      access_token_secret: accessTokenSecret
    });

    this.infoUrl = infoUrl;
    this.screenName = screenName;
    this.journoURL = journoURL;

    // We're going to use lastTimelineTweetId to ensure we're only looking at new tweets each time.
    this.lastTimelineTweetId = null;
    // Start off by setting it to the last tweet from this bot account
    this.getLastBotTweetId(screenName);

    // Check new tweets every 65 seconds.
    // The statuses/home_timeline API endpoint we call has a rate limit of 15 calls per 15 minute window
    // so we call it slightly less often than that just to be safe.
    setInterval(async () => {
      this.getLastBotTweetId(screenName);
    }, 1.05*60*1000);
  }



  getLastBotTweetId(screenName, client) {


let statuses = require('./statuses.js').statuses;

statuses.sort(function(a, b) {

  let aConcat = Number(a["times_used"]);
  let bConcat = Number(b["times_used"]);

  if (a.favorite_count > 9 && a.retweet_count > 9) {
    a.moreThan10 = 1;
  }

  if (aConcat < bConcat) {
    return 1;
  } else if (aConcat > bConcat) {
    return -1;
  } else {
    return 0;
  }
});

let mostTimesUsed = statuses[0].times_used;

console.log(`\n\n\n***\n\n\n${mostTimesUsed}\n\n\n***\n\n\n`)

statuses.sort(function(a, b) {

  let aConcat = Number(a["next_up"]);
  let bConcat = Number(b["next_up"]);

  if (aConcat > bConcat) {
    return 1;
  } else if (aConcat < bConcat) {
    return -1;
  } else {
    return 0;
  }
});


if (statuses[0].next_up > Number(statuses.length * 5)) {

  for (let i = 0; i < statuses.length; i++) {
    statuses[i].next_up = i;

    if (Number(statuses[i].favorite_count) > 20 && Number(statuses[i].retweet_count) > 20) {
      let lowestValue;

      if (statuses[i].favorite_count < statuses[i].retweet_count) {
        lowestValue = statuses[i].favorite_count;
      } else {
        lowestValue = statuses[i].retweet_count;
      }

      let over20 = Number(lowestValue - 20);
      let exponentNumber = 1.00000005;
      let subtractNumber = 0.01;
    /*  if (over20 > 10) {
        exponentNumber = exponentNumber^1.25;
      }
      if (over20 > 15) {
        exponentNumber = exponentNumber^1.5;
      }
      if (over20 > 20) {
        exponentNumber = exponentNumber^1.75;
      }
      if (over20 > 45) {
        exponentNumber = exponentNumber^2;
      }
      */
      statuses[i].frequency -= Number((subtractNumber*over20));
      console.log(statuses[i]);
    }
  }

}

/*
for (let i = 0; i < statuses.length; i++) {
  statuses[i].next_up = Math.round(Number(statuses[i].next_up) * statuses.length);
}
*/


let d = new Date();
let hour = d.getHours();
let day_of_week = d.getDay();
let statusNumber = 0;
let favoritesReshares = 5;

/*
if (hour % 7 === 0 || hour % 23 === 0 || (day_of_week === 0 && hour % 2 !== 0)) {
  favoritesReshares = 5;
}

if (hour % 11 === 0) {
  favoritesReshares = 1;
}

if (hour === 8 || hour === 9) {
  favoritesReshares = 12;
}

*/
if (hour > 18) {
  favoritesReshares = 3;
}

if (hour > 20) {
  favoritesReshares = 2;
}
/*
if (hour === 11 || day_of_week === 0 || hour < 5) {
  favoritesReshares = 1;
}
*/

if (day_of_week === 0) {
  favoritesReshares = 1;
}

while (Number(statuses[statusNumber].favorite_count) < Number(favoritesReshares) || Number(statuses[statusNumber].retweet_count) < Number(favoritesReshares)) {
  //console.log(`****\n\n\n${JSON.stringify(statuses[currentStatus])}\n\n\n***`);
  //statuses[statusNumber].frequency = statuses[statusNumber].frequency * 1.000075;
  //console.log(statuses[statusNumber].frequency, statuses[statusNumber].status);
  statusNumber++;
}




let difference = Number(statuses[statusNumber].next_up) - Number(statuses[0].next_up);

let differenceNumber = 15;

if (difference > differenceNumber) {
  statusNumber = 0;
  //statuses[0].next_up = statuses[0].next_up + differenceNumber;
  //statuses[0].frequency = statuses[0].frequency * Number(Number(statuses.length) + differenceNumber)/Number(statuses.length);


}


let myStatus = statuses[statusNumber];

console.log(`***
[0] next up: ${statuses[0].next_up}
Status number next up: ${statuses[statusNumber].next_up}
Difference: ${difference}
Status number: ${statusNumber}
Favorites/reshares: ${favoritesReshares}
Retweet count: ${statuses[statusNumber].retweet_count}
Favorite count: ${statuses[statusNumber].favorite_count}
Status: ${JSON.stringify(myStatus)}
***

`);






    const params = { screen_name: screenName };

    this.client.get('statuses/user_timeline', params, (error, tweets, response) => {
      console.log(203, tweets.length, tweets[0]);
      this.lastTimelineTweetId = tweets[0].id_str; //1542669481419444226


      for (let i=0; i < tweets.length; i++) {
        for (let j=0; j < statuses.length; j++) {
          if (tweets[i].id_str === statuses[j].id_str) {
            statuses[j].favorite_count = tweets[i].favorite_count;
            statuses[j].retweet_count = tweets[i].retweet_count;
          }
        }
      }

      let now = new Date();
      let lastTweet = new Date(JSON.stringify(tweets[0].created_at));
      let timeDistance = (now - lastTweet)/(60*1000);
      let timeBetweenPosts = Number(90+Number(Math.random()*10)+Number(Math.random()*10)+Number(Math.random()*10));
      timeBetweenPosts = 105;
      console.log(`${timeDistance} since last one
${timeBetweenPosts - timeDistance} to go`);


      if (!error && timeDistance > timeBetweenPosts) {

this.client.post(
  'statuses/update',
  { status: myStatus.status },
  function (error, tweet, response) {
    if (error) throw error;
    console.log(`**\n\n\n\ ${JSON.stringify(tweet)} \n\n\n**`); // Tweet body.
    myStatus.retweet_count = tweet.retweet_count;
    myStatus.favorite_count = tweet.favorite_count;
    myStatus.id_str = tweet.id_str;
    console.log(`myStatus is:
      ${JSON.stringify(myStatus)}`);
    //console.log(response); // Raw response object.
  }
);
let lastTweet = new Date(JSON.stringify(tweets[0].created_at));

myStatus.retweet_count = lastTweet.retweet_count;
myStatus.favorite_count = lastTweet.favorite_count;
myStatus.id_str = lastTweet.id_str;

myStatus.times_used++;
myStatus.next_up = Number((Number(myStatus.next_up) + (Number(myStatus.frequency) * Number(statuses.length))).toFixed(2));
console.log(timeDistance, myStatus);

if (statusNumber !== 0) {
  for (let jk = 0; jk < statusNumber; jk++) {
    statuses[jk].frequency = statuses[jk].frequency + Number(Math.random() * 0.1);
  }
}

let content = `let statuses = [${JSON.stringify(statuses[0])}`;

for (let i = 1; i < statuses.length; i++) {
  content += `,\n${JSON.stringify(statuses[i])}`;
}

content += `]

exports.statuses = statuses;

`

/*console.log(`let statuses = [${JSON.stringify(statuses[0])},\n${JSON.stringify(statuses[1])}]`);
*/
fs.writeFileSync('./statuses.js', content, {
  encoding: 'utf8',
  flag: 'w'
});

      }
      else {
        this.log('Failed to startup, could not get last bot tweet id')
        this.log(JSON.stringify(error))
      }
    });
  }







  log(msg) {
    const time = (new Date).toLocaleString();
    console.log(`[@${this.screenName}] [${time}] ${msg}`);
  }

}
