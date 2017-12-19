var z = require('zero-fill')
  , n = require('numbro');

module.exports = function container(get, set, clear) {
  return {
    name: 'ta_willr',
    description: 'Attempts to buy low and sell high by tracking RSI high-water readings.',

    getOptions: function () {
      this.option('period', 'period length', String, '1h')
      this.option('min_periods', 'min. number of history periods', Number, 52)
      this.option('rsi_periods', 'number of RSI periods', 14)
      this.option('willr_period', 'lookback cutoff for williams r periods', Number, 14)
      this.option('buy_willr', 'buy when williams r surges below this level', Number, -80)
      this.option('sell_willr', 'sell when williams r surges above this level', Number, -20)
      this.option('oversold_rsi', 'buy when RSI reaches or drops below this value', Number, 35)
      this.option('overbought_rsi', 'sell when RSI reaches or goes above this value', Number, 75)
    },

    calculate: function (s) {
      get('lib.rsi')(s, 'rsi', s.options.rsi_periods)
      get('lib.ta_willr')(s, 'willr', s.options.willr_period)
    },

    onPeriod: function (s, cb) {
      if (s.in_preroll) return cb()
        
      if((s.period.willr<s.options.buy_willr || s.period.willrprev<s.options.buy_willr)
           && s.period.willrprev<s.period.willr && s.period.rsi <= s.options.oversold_rsi) {        
        s.signal='buy'
      }
      if((s.period.willr>s.options.sell_willr || s.period.willrprev>s.options.sell_willr)
           && s.period.willrprev>=s.period.willr) {        
        s.signal='sell'
      }
      cb()
    },

    onReport: function (s) {
      var cols = []
      if (typeof s.period.rsi === 'number') {
        cols.push(z(4, n(s.period.willrprev).format('0'), ' ')['grey'])
        cols.push(z(4, n(s.period.willr).format('0'), ' ')['blue'])
      }
      return cols
    }
  }
}
