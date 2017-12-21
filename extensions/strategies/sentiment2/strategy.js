module.exports = function container (get, set, clear) {
	return {
	  name: 'sentiment',
	  description: 'Description to be added...',
  
	  getOptions: function () {
		this.option('period', 'period length', String, '1m')
		this.option('buy_threshold', 'threshold where the strategy will buy', Number, 100000000)
		this.option('sell_threshold', 'threshold where the strategy will sell', Number, 0)
	  },
  
	  calculate: function (s) {
	  },
  
	  onPeriod: function (s, cb) {
			  // {'period':timestamp, 'open':open price, 'high':high price, 'low':low price, 'close':close price, 'volume':volume, 'vwap':volume weighted average price}
			  // Gebruik timestamp om moment te bepalen ten opzichte waarvan het nieuws moet worden bekeken.
			  const request = require('request')
			  const moment = require('moment');
  
			  // Eerst alle berichten in een dictionary laden
			  // Dan checken op id en als nieuw, toevoegen aan dictionary
			  // Je kunt nu simuleren op laatste 200 berichten.
  
			  const readNews = function (currency) {
  
				  const getPage = function (pageURL) {
					  request(pageURL, function (error, response, body) {
						  const results = JSON.parse(body).results;
						  return results
					  });
				  }
  
				  const newsURL = 'https://cryptopanic.com/api/posts/?auth_token=360763fc954662b1639402e7961b516f6fb19b1d&currency=' + currency
				  const lastOneHourSentiment = {positive: 0, negative: 0, important: 0};
				  const lastThreeHourSentiment = {positive: 0, negative: 0, important: 0};
				  request(newsURL, function (error, response, body) {
					  const results = JSON.parse(body).results;
					  const lastResultTime = results[results.length - 1].created_at;
					  for (const result in results) {
						  if (results[result].currencies.length === 1) {
							  if (moment(results[result].created_at).isAfter(moment().subtract(60, 'minutes'))) {
								  lastOneHourSentiment.positive += results[result].votes.positive;
								  lastOneHourSentiment.negative += results[result].votes.negative;
								  lastOneHourSentiment.important += results[result].votes.important;
							  }
							  if (moment(results[result].created_at).isAfter(moment().subtract(180, 'minutes'))) {
								  lastThreeHourSentiment.positive += results[result].votes.positive;
								  lastThreeHourSentiment.negative += results[result].votes.negative;
								  lastThreeHourSentiment.important += results[result].votes.important;
							  }
						  }
					  }
					  if (error) {
						  console.log(error);
					  }
					  console.log(lastOneHourSentiment, lastThreeHourSentiment);
				  });
			  };
  
  
		if (!s.in_preroll) {
		  if (s.period.close < s.options.sell_threshold) {
			s.signal = 'sell'
		  } else if (s.period.close > s.options.buy_threshold) {
			s.signal = 'buy'
		  }
		}
		cb()
	  },
  
	  onReport: function (s) {
		var cols = []
			  cols.push('yay')
		return cols
	  }
	}
  }