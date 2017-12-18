//https://github.com/robinpapa/zenbot/tree/sentiment/extensions/strategies/sentiment

const async = require('async');

const newsReader = require('./modules/readnews');
const newsTester = require('./modules/testnews');
// const newsNotifier = require('./modules/notifynews');

const readThenNotify = function (coin, tick, cb) {
	async.waterfall([
		async.constant(coin),
		newsReader,
		newsTester
	], (err, sentiment) => {
		// Result now equals 'done'
		if (err) {
			console.log(err);
		}
		tick.sentimentm10positive = sentiment.m10.positive;
		tick.sentimentm60positive = sentiment.m60.positive;
		tick.sentimentm10negative = sentiment.m10.negative;
		tick.sentimentm60negative = sentiment.m60.negative;

		if (sentiment.m10.positive / sentiment.m60.positive >= 0.5) {
			tick.signal = 'buy';
		} else if (sentiment.m10.negative / sentiment.m60.negative >= 0.5) {
			tick.signal = 'sell';
		}
	});
};

module.exports = function container(get, set, clear) {
	return {
		name: 'sentiment',
		description: 'Description to be added...',

		getOptions() {
			this.option('period', 'period length', String, '2m');
			this.option('min_periods', 'min. number of history periods', Number, 1);
		},

		calculate(s) {
			// Console.log('work')
		},

		onPeriod(s, cb) {
			readThenNotify(s.asset, s, cb);
			// RVI = (Close – Open) / (High – Low)
		},

		onReport(s) {
			const cols = [];
			cols.push(s.sentimentm10positive.toString());
			cols.push(s.sentimentm60positive.toString());
			cols.push(s.sentimentm10negative.toString());
			cols.push(s.sentimentm60negative.toString());
			return cols;
		}
	};
};