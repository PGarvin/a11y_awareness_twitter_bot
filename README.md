# alt-alert-twitter-bot
This is a Twitter bot that tweets accessibility tips. This code builds on and borrows from code originally created by Matt Eason to retweet accounts that did not add alt text.

# Getting started

## Register a Twitter account for the bot
Before you do anything else, you'll need to [sign up for a Twitter account](https://twitter.com/i/flow/signup) for your bot.

## Add 'Automated by' label
Once the bot account is registered, you should add an 'Automated by' label to it.

To add this label:

1. Go to your account settings
2. Select "Account information"
3. Select "Your account"
4. Select "Automation" at the bottom
5. Select "Set up account automation"
6. Enter your main Twitter username which runs your bot account
7. Enter the password for your main Twitter account

## Sign up for a developer Twitter account
You need a developer account to use the APIs. I recommend you do this with your main Twitter account rather than the bot account, especially if you're
planning to run multiple bots.

Sign up from the [Twitter Developer Platform homepage](https://developer.twitter.com).

After you've signed up, you'll be asked to create a project, then an app. Go through these steps. 
The app name you choose will be shown on your tweets where you'd usually see 'Twitter for iOS' or 'Twitter for Android'

Once your app has been created, you'll be shown an API Key and an API Key Secret. Copy these now and keep them safe - you'll need them later.

You'll now have access to the v2 API. Unfortunately we need access to v1.1, because the endpoint the bot relies on 
(`statuses/home_timeline`) isn't in v2 yet.

To get access to v1.1, you'll need to apply for 'elevated access'. Select your project from the left-hand menu. You should see the following option:

You'll have to fill in a bunch of boxes about your 'intended use'. Here's some suggested text for each part:

### Describe how you plan to use Twitter data and/or APIs
Describe what you'll do with this bot.

### Are you planning to analyze Twitter data?

Select 'Yes'



### Will your App use Tweet, Retweet, Like, Follow, or Direct Message functionality?

Select 'Yes'

### Do you plan to display Tweets or aggregate data about Twitter content outside Twitter?

Select 'No'

### Will your product, service, or analysis make Twitter content or derived information available to a government entity?

Select 'No'

### And now we wait
After you've submitted your application, you may need to wait a few days for it to be approved.

## Authenticate your bot
You'll need to authorise your app to post on behalf of your bot's Twitter account. 
You'll need a REST client such as [Insomnia](https://insomnia.rest/) or [Postman](https://www.postman.com/)

### Step 1 - Get an OAuth token

Make a POST request to `https://api.twitter.com/oauth/request_token?x_auth_access_type=write`. You'll need to use OAuth 1 authentication. 
The Consumer Key and Consumer Key Secret are the API Key and API Key Secret you got when you were setting up your Twitter app.


In the response, you'll get an `oauth_token` and an `oauth_token_secret`. Copy these somewhere safe.

### Step 2 - Go to the authentication URL

Make sure you're signed into Twitter with your bot account, then go to `https://api.twitter.com/oauth/authenticate?oauth_token=TOKEN`, replacing TOKEN with 
the `oauth_token` from the last step.

You'll see an authorisation screen. Click the blue 'Authorize app' button. You'll see a seven-digit PIN. Copy this somewhere safe.

### Step 3 - Get an access token and access token secret

Go back to your REST client and make a POST request to `https://api.twitter.com/oauth/access_token?oauth_verifier=PIN&oauth_token=TOKEN`,
replacing PIN with the PIN from step 2 and TOKEN with the `oauth_token` from step 1.

In the response, you'll get a different `oauth_token` and `oauth_token_secret` to step 1. 
These are the Access Token and Access Token Secret you'll need for your bot. Copy them somewhere safe.

## Configure the bot
Clone this repo then copy `config.json.sample` to `config.json`. In `config.json`, set the following values:

- `consumerKey`: The API Key from when you set up the app in the Twitter dev dashboard
- `consumerKeySecret`: The API Key Secret from when you set up the app in the Twitter dev dashboard
- `screenName`: Your bot's Twitter username, without the @
- `accessTokenKey`: The Access Token from step 3 above
- `accessTokenSecret`: The Access Token Secret from step 3 above
- `infoUrl`: This is the 'more info' link that will be included in your bot's tweets. The default is the Twitter guidance on adding alt text.
You might want to change this if there's more specific guidance for your intended audience.

If you want to run multiple bots you can add more entries to the `botAccounts` array. You'll need to follow the steps above to register a 
Twitter account and authenticate for each bot.

## Install dependencies
Install [Node.js](https://nodejs.org/en/)

In the project directory (`alt-alert-twitter-bot`) run `npm install`
