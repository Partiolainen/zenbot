var z = require('zero-fill')
, n = require('numbro')
var a = 0
module.exports = function container (get, set, clear) {
return {
  name: 'two_sma_with_rsi',
  description: 'Buy when (FIRST_sma > SECOND_sma) and sell when (FIRST_sma < SECOND_sma). Optional buy on low RSI.',

  getOptions: function () {
    this.option('period', 'period length', String, '1h')
    this.option('min_periods', 'min. number of history periods', Number, 52)
    this.option('length_first_sma', 'length for first sma', Number, 3)
    this.option('length_second_sma', 'length periods for second sma', Number, 6)
    this.option('oversold_rsi_periods', 'number of periods for oversold RSI', Number, 9)
    this.option('oversold_rsi', 'buy when RSI reaches this value', Number, 10)
  },

  calculate: function (s) {
    // console.log(JSON.stringify(s))
    get('lib.sma')(s, 'first_trend_sma', s.options.length_first_sma)
    get('lib.sma')(s, 'second_trend_sma', s.options.length_second_sma)
    if (s.options.oversold_rsi) {
      // sync RSI display with oversold RSI periods
      s.options.rsi_periods = s.options.oversold_rsi_periods
      get('lib.rsi')(s, 'oversold_rsi', s.options.oversold_rsi_periods)
      if (!s.in_preroll && s.period.oversold_rsi <= s.options.oversold_rsi && !s.oversold && !s.cancel_down) {
        s.oversold = true
        if (s.options.mode !== 'sim' || s.options.verbose) console.log(('\noversold at ' + s.period.oversold_rsi + ' RSI, preparing to buy\n').cyan)
      }
    }
  },

  onPeriod: function (s, cb) {
    if (!s.in_preroll && typeof s.period.oversold_rsi === 'number') {
      if (s.oversold) {
        s.oversold = false
        s.trend = 'oversold'
        s.signal = 'buy'
        s.cancel_down = true
        return cb()
      }
    }
    // console.log(s.period.oversold_rsi)
    // console.log(s.period.first_trend_sma)
    // console.log(s.period.second_trend_sma)
    // console.log(s)
    if (typeof s.period.first_trend_sma === 'number' && typeof s.period.second_trend_sma === 'number') {
      if (s.period.first_trend_sma > s.period.second_trend_sma) {
        if (s.trend !== 'up') {
          s.acted_on_trend = false
        }
        s.trend = 'up'
        s.signal = !s.acted_on_trend ? 'buy' : null
        s.cancel_down = false
      }
      else if (!s.cancel_down && s.period.first_trend_sma < s.period.second_trend_sma) {
        if (s.trend !== 'down') {
          s.acted_on_trend = false
        }
        s.trend = 'down'
        s.signal = !s.acted_on_trend ? 'sell' : null
      }
    }
    cb()
  },

  onReport: function (s) {
    var cols = []
    if (typeof s.period.first_trend_sma === 'number' && typeof s.period.second_trend_sma === 'number') {
      if (s.period.first_trend_sma > s.period.second_trend_sma) {
        cols.push(z(6, 'UP', ' ').green)
      } else {
        cols.push(z(6, 'DOWN', ' ').red)
      }
    } else {
      cols.push('       ')
    }
    return cols
  }
}
}