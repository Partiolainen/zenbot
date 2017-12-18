//
//https://github.com/FunFR/zenbot/tree/funfr/extensions/strategies/harami_engulfing
//
var z = require('zero-fill')
, n = require('numbro')
var a = 0
module.exports = function container (get, set, clear) {
return {
  name: 'harami_engulfing',
  description: 'Buy when Bullish Engulfing or Harami and sell when Bearish Engulfing or Harami. Optional buy on low RSI.',

  getOptions: function () {
    this.option('period', 'period length', String, '1h')
    this.option('min_periods', 'min. number of history periods', Number, 52)
    this.option('length_sma', 'length periods for SMA', Number, 50)
    this.option('length_ema', 'length periods for EMA', Number, 15)
    this.option('oversold_rsi_periods', 'number of periods for oversold RSI', Number, 14)
    this.option('oversold_rsi', 'buy when RSI reaches this value', Number, 25)
  },

  calculate: function (s) {
    get('lib.sma')(s, 'trend', s.options.length_sma)
    get('lib.ema')(s, 'petd', s.options.length_ema)
    if (s.options.oversold_rsi) {
      // sync RSI display with oversold RSI periods
      s.options.rsi_periods = s.options.oversold_rsi_periods
      get('lib.rsi')(s, 'oversold_rsi', s.options.oversold_rsi_periods)
      if (!s.in_preroll && s.period.oversold_rsi <= s.options.oversold_rsi && !s.oversold && !s.cancel_down) {
        s.oversold = true
        if (s.options.mode !== 'sim' || s.options.verbose) console.log(('\noversold at ' + s.period.oversold_rsi + ' RSI, preparing to buy\n').cyan)
      }
    }
    if (typeof s.period.trend === 'number' && typeof s.period.petd === 'number') {
      s.period.trendup = s.period.close > s.period.trend ? true : false
      s.period.trenddn = s.period.close < s.period.trend ? true : false
      s.period.petdup = s.period.close > s.period.petd ? true : false
      s.period.petddn = s.period.close < s.period.petd ? true : false

      // Bullish Engulfing
      s.period.bue = s.period.trendup === true && s.period.petdup === true ? (s.period.close > s.period.open) && (s.lookback[0].close <= s.lookback[0].open) && (s.period.close >= s.lookback[0].open) && (s.period.open <= s.lookback[0].close) && (Math.abs(s.period.close - s.period.open) > Math.abs(s.lookback[0].open - s.lookback[0].close)) : false
      // Bearish Engulfing
      s.period.bre = s.period.trenddn === true  && s.period.petddn === true ? (s.period.close < s.period.open) && (s.lookback[0].close >= s.lookback[0].open) && (s.period.close <= s.lookback[0].open) && (s.period.open >= s.lookback[0].close) && (Math.abs(s.period.close - s.period.open) > Math.abs(s.lookback[0].open - s.lookback[0].close)) : false
      // Bullish Harami
      s.period.buh =  s.period.trendup === true  && s.period.petdup === true ? (s.period.close > s.period.open) && (s.lookback[0].close <= s.lookback[0].open) && (s.period.close <= s.lookback[0].open) && (s.period.open >= s.lookback[0].close) && (Math.abs(s.period.close - s.period.open) < Math.abs(s.lookback[0].open - s.lookback[0].close)) : false
      // Bearish Harami
      s.period.brh =  s.period.trenddn === true  && s.period.petddn === true ? (s.period.close < s.period.open) && (s.lookback[0].close >= s.lookback[0].open) && (s.period.close >= s.lookback[0].open) && (s.period.open <= s.lookback[0].close) && (Math.abs(s.period.close - s.period.open) < Math.abs(s.lookback[0].open - s.lookback[0].close)) : false
    }
  },

  onPeriod: function (s, cb) {
    if (!s.in_preroll && typeof s.period.oversold_rsi === 'number' && s.oversold) {
      s.oversold = false
      s.trend = 'oversold'
      s.signal = 'buy'
      s.cancel_down = true
      return cb()
    }
    if (typeof s.period.trend === 'number' && typeof s.period.petd === 'number') {
      if (s.period.bue || s.period.buh) {
        if (s.trend !== 'up') {
          s.acted_on_trend = false
        }
        s.trend = 'up'
        s.signal = !s.acted_on_trend ? 'buy' : null
        s.cancel_down = false
      }
      else if (!s.cancel_down && (s.period.bre || s.period.buh)) {
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
    if (typeof s.period.trend === 'number' && typeof s.period.petd === 'number') {
      if (s.period.bue) {
        cols.push(z(6, 'BUE', ' ').green)
      } else if (s.period.buh) {
        cols.push(z(6, 'BUH', ' ').green)
      } else if (s.period.bre) {
        cols.push(z(6, 'BRE', ' ').red)
      } else if (s.period.brh) {
        cols.push(z(6, 'BRH', ' ').red)
      } else {
        cols.push('       ')
      }
    } else {
      cols.push('       ')
    }
    return cols
  }
}
}