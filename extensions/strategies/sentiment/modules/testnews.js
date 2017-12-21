const moment = require('moment');


const testCoinNews = function (coinNews, callback) {
	const sentiment = {
		m10: {positive: 0, negative: 0, important: 0},
		m60: {positive: 0, negative: 0, important: 0},
	}
	// const sentiment60m = {positive: 0, negative: 0, important: 0};

	for (news in coinNews) {

		if (moment(coinNews[news].articleTime).isAfter(moment().subtract(10, 'minutes'))) {
			// console.log('checking...' + results[result])
			sentiment.m10.positive += coinNews[news].articleVotes.positive;
			sentiment.m10.negative += coinNews[news].articleVotes.negative;
			sentiment.m10.important += coinNews[news].articleVotes.important;
		}
		if (moment(coinNews[news].articleTime).isAfter(moment().subtract(60, 'minutes'))) {
			// console.log('checking...' + results[result])
			sentiment.m60.positive += coinNews[news].articleVotes.positive;
			sentiment.m60.negative += coinNews[news].articleVotes.negative;
			sentiment.m60.important += coinNews[news].articleVotes.important;
		}
	}
	callback(null, sentiment)
}

module.exports = testCoinNews;