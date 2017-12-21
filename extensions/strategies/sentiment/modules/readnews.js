const request = require('request')
const moment = require('moment');

const existingNewsBucket = {};

const readCoinNews = function (coin, callback) {
	const currency = coin
	const newsURL = 'https://cryptopanic.com/api/posts/?auth_token=42aaf8b2e9bdab3f1b6f04d7054cf8f8a1ea6c32&currency=' + currency
	//console.log(currency)
	// add a 'while' to check whether article is older than amount of time,
	// while false, keep on following the next URL.
	request(newsURL, function (error, response, body) {

		// retrieve
		try {
			results = JSON.parse(body).results;
		} catch (error) {
			console.log(error);
			results = []
		}

		// Published at: when the article became available on the internet
		// Created at: when the article became available on cryptopanic
		const coinNews = [];
		// const lastResultTime = results[results.length - 1].created_at;
		for (const result in results) {
			// Check if this news article is only about our coin
			if (results[result].currencies && results[result].currencies.length === 1) {
				let articleTime = results[result].created_at
				let articleTitle = results[result].title
				let articleURL = results[result].url
				let articleVotes = results[result].votes

				coinNews.push({
					articleTime,
					articleTitle,
					articleURL,
					articleVotes
				})
			}
		}
		if (error) {
			console.log('Error retrieving news from: ' + newsUrl);
			console.log('Error given is: ' + error);
		}

		callback(null, coinNews)
	});
};

module.exports = readCoinNews;