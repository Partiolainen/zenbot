//https://github.com/robinpapa/zenbot/tree/sentiment/extensions/strategies/sentiment

var z = require('zero-fill')
, n = require('numbro'), 
async = require('async'),
newsReader = require('./modules/readnews'),
newsTester = require('./modules/testnews'),
readThenNotify = function (coin, tick, cb) {
	async.waterfall([
		async.constant(coin),
		//console.log('read'),
		newsReader,
		//console.log('test'),
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

module.exports = function container (get, set, clear) {
return {
  name: 'sentiment',
  description: 'Attempts to buy low and sell high by tracking RSI high-water readings.',

  getOptions: function () {
	this.option('period', 'period length', String, '2m')
	this.option('min_periods', 'min. number of history periods', Number, 52)
  },

  calculate: function (s) {
	
  },

  onPeriod: function (s, cb) {
	if (s.in_preroll) return cb()
	readThenNotify(s.asset, s, cb)
	cb()
  },

  onReport: function (s) {
	var cols = []
	if (typeof s.sentimentm10positive === 'number') {
	 cols.push(z(3, n(s.sentimentm10positive).format('0'), ' ')['green'])
	} else cols.push(z(2, n(0).format('0'), ' ')['grey'])
	if (typeof s.sentimentm60positive === 'number') {
		cols.push(z(3, n(s.sentimentm60positive).format('0'), ' ')['green'])
	} else cols.push(z(2, n(0).format('0'), ' ')['grey'])
	if (typeof s.sentimentm10negative === 'number') {
		cols.push(z(3, n(s.sentimentm10negative).format('0'), ' ')['red'])
	} else cols.push(z(2, n(0).format('0'), ' ')['grey'])
	if (typeof s.sentimentm60negative === 'number') {
		cols.push(z(3, n(s.sentimentm60negative).format('0'), ' ')['red'])
	} else cols.push(z(2, n(0).format('0'), ' ')['grey'])
	
	return cols
  }
}
}