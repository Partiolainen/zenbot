var z = require('zero-fill')
  , n = require('numbro')

module.exports = function container (get, set, clear) {
return {
  name: 'sigcoll',
  description: 'Buy on signal from file',

  getOptions: function () {
    this.option('url', 'signal url', String, 'http://localhost/signals.json')
    this.option('period', 'period length', String, '1m')
    this.option('min_periods', 'min. number of history periods', Number, 52)
    this.option('rsi_periods', 'number of RSI periods', 14)
    this.option('oversold_rsi', 'buy when RSI reaches or drops below this value', Number, 45)
    this.option('overbought_rsi', 'sell when RSI reaches or goes above this value', Number, 82)
    this.option('rsi_recover', 'allow RSI to recover this many points before buying', Number, 3)
    this.option('rsi_drop', 'allow RSI to fall this many points before selling', Number, 0)
    this.option('rsi_divisor', 'sell when RSI reaches high-water reading divided by this value', Number, 2)
  },

  calculate: function (s) {
    //get('lib.rsi')(s, 'rsi', s.options.rsi_periods)
    get('lib.sigcoll')(s, 'sigcoll', s.options.url)
  },

  onPeriod: function (s, cb) {
    if (s.in_preroll) return cb()
    /*if (typeof s.period.rsi === 'number') {
      if (s.trend !== 'oversold' && s.trend !== 'long' && s.period.rsi <= s.options.oversold_rsi) {
        s.rsi_low = s.period.rsi
        s.trend = 'oversold'
      }
      if (s.trend === 'oversold') {
        s.rsi_low = Math.min(s.rsi_low, s.period.rsi)
        if (s.period.sigcoll && s.period.rsi >= s.rsi_low + s.options.rsi_recover
           && s.period.close<=s.period.sigcoll.buyprice) {
          s.trend = 'long'
          s.signal = 'buy'
          s.rsi_high = s.period.rsi
        }
      }
      if (s.trend === 'long') {
        s.rsi_high = Math.max(s.rsi_high, s.period.rsi)
        if (s.period.rsi <= s.rsi_high / s.options.rsi_divisor &&
          (s.period.close>=s.period.sigcoll.target || s.period.close<=s.period.sigcoll.stoploss)) {
          s.trend = 'short'
          s.signal = 'sell'
        }
      }
      if (s.trend === 'long' && s.period.rsi >= s.options.overbought_rsi) {
        s.rsi_high = s.period.rsi
        s.trend = 'overbought'
      }
      if (s.trend === 'overbought') {
        s.rsi_high = Math.max(s.rsi_high, s.period.rsi)
        if (s.period.sigcoll && s.period.rsi <= s.rsi_high - s.options.rsi_drop &&
        (s.period.close>=s.period.sigcoll.target || s.period.close<=s.period.sigcoll.stoploss)) {
          s.trend = 'short'
          s.signal = 'sell'
        }
      }
    }*/

    //simple buy/sell for test
    if(s.period.close!=null && s.period.sigcoll.buyprice!=null
       && ((s.period.close <= s.period.sigcoll.buyprice
       && s.period.rsi <= s.options.oversold_rsi) || s.period.sigcoll.buynow == 1)){
      s.signal = 'buy'
    }
    else if(s.period.close!=null && ((s.period.sigcoll.target != null &&
      (s.period.close >= s.period.sigcoll.target || s.period.close <= s.period.sigcoll.stoploss)))
        || (s.period.sigcoll.sellnow == 1)){
      s.signal = 'sell'
    } else s.signal = 'hold'
    cb()
  },

  onReport: function (s) {
    var cols = []
    
    if (s.period.sigcoll){
      if (typeof s.period.sigcoll.buynow == 1) {
        cols.push('buy now'['red'])
      }
      if (typeof s.period.sigcoll.sellnow == 1) {
        cols.push('sell now'['green'])
      }
      if (typeof s.period.sigcoll.buyprice === 'number') {
        cols.push(z(11, n(s.period.sigcoll.buyprice).format('0.00000000'), ' ')['cyan'])
      }
      if (typeof s.period.sigcoll.target === 'number') {
        cols.push(z(11, n(s.period.sigcoll.target).format('0.00000000'), ' ')['green'])
      }
      if (typeof s.period.sigcoll.stoploss === 'number') {
        cols.push(z(11, n(s.period.sigcoll.stoploss).format('0.00000000'), ' ')['red'])
      }

      /*if (typeof s.period.close === 'number') {
        cols.push(z(11, n(s.period.close).format('0.00000000'), ' ')['yellow'])
      }*/
    }
    return cols
  }
}
}