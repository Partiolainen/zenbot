var z = require('zero-fill')
  , n = require('numbro')
  , rsi = require('../../../lib/rsi')
  , willr = require('../../../lib/ta_willr')
  , Phenotypes = require('../../../lib/phenotype')

module.exports = {
  name: 'ta_willr',
  description: 'Attempts to buy low and sell high by tracking RSI high-water readings.',

  getOptions: function () {
    this.option('period', 'period length, same as --period_length', String, '2m')
    this.option('period_length', 'period length, same as --period', String, '2m')
    this.option('min_periods', 'min. number of history periods', Number, 52)
    this.option('rsi_periods', 'number of RSI periods', Number, 14)
    this.option('oversold_rsi', 'buy when RSI reaches or drops below this value', Number, 30)
    this.option('overbought_rsi', 'sell when RSI reaches or goes above this value', Number, 82)
    this.option('rsi_recover', 'allow RSI to recover this many points before buying', Number, 3)
    this.option('rsi_drop', 'allow RSI to fall this many points before selling', Number, 0)
    this.option('rsi_divisor', 'sell when RSI reaches high-water reading divided by this value', Number, 2)

    this.option('willr_periods', 'number of WillR periods', Number, 14)
    this.option('willr_oversold', 'number of WillR periods', Number, -94)
    this.option('willr_overbought', 'number of WillR periods', Number, -30)    
  },

  calculate: function (s) {
    rsi(s, 'rsi', s.options.rsi_periods)    
  },

  onPeriod: function (s, cb) {
    if (s.in_preroll) return cb()

    willr(s, s.options.min_periods, s.options.willr_periods).then(function(signal) {
      s.period['willr'] = signal
      //cb()
    }).catch(function(error) {
      console.log(error)
      cb()
    })

    if (typeof s.period.willr === 'number') {
      if(s.period.willr<=s.options.willr_oversold) {
        s.signal = 'buy'
      }        

      if(s.period.willr>=s.options.willr_overbought){
        s.signal = 'sell'
      }
    }
    /*if (typeof s.period.rsi === 'number') {
      if (s.trend === undefined && s.period.rsi <= s.options.oversold_rsi) {
        s.rsi_low = s.period.rsi
        s.trend = 'oversold'
      }
      if (s.trend === 'oversold') {
        s.rsi_low = Math.min(s.rsi_low, s.period.rsi)
        if (s.period.rsi >= s.rsi_low + s.options.rsi_recover && 
            s.period.willr<=s.options.willr_oversold) {
          s.trend = 'long'
          s.signal = 'buy'
          s.rsi_high = s.period.rsi
        }
      }
      if (s.trend !== 'oversold' && s.trend !== 'long' && s.period.rsi >= s.options.overbought_rsi) {
        s.rsi_high = s.period.rsi
        s.trend = 'long'
      }
      if (s.trend === 'long') {
        s.rsi_high = Math.max(s.rsi_high, s.period.rsi)
        if (s.period.rsi <= s.rsi_high / s.options.rsi_divisor) {
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
        if (s.period.rsi <= s.rsi_high - s.options.rsi_drop && 
            s.period.willr>=s.options.willr_overbought) {
          s.trend = 'short'
          s.signal = 'sell'
        }
      }
    }*/
    cb()
  },

  onReport: function (s) {
    var cols = []
    if (typeof s.period.willr === 'number') {
      cols.push(z(4, n(s.period.willr).format('0'), ' ')['yellow'])
    }
    return cols
  },

  phenotypes: {
    // -- common
    period_length: Phenotypes.ListOption(['15m','30m','1h','90m','2h','150m','3h','210m','4h']),
    min_periods: Phenotypes.Range(15, 26),
    markdown_buy_pct: Phenotypes.RangeFloat(-1, 5),
    markup_sell_pct: Phenotypes.RangeFloat(-1, 5),
    //order_type: Phenotypes.ListOption(['maker', 'taker']),
    //sell_stop_pct: Phenotypes.Range0(1, 15),
    //buy_stop_pct: Phenotypes.Range0(1, 50),
    profit_stop_enable_pct: Phenotypes.Range0(1, 20),
    profit_stop_pct: Phenotypes.Range(1,20),

    // -- strategy
    //rsi_periods: Phenotypes.Range(1, 200),
    //oversold_rsi: Phenotypes.Range(1, 100),
    //overbought_rsi: Phenotypes.Range(1, 100),
    //rsi_recover: Phenotypes.Range(1, 100),
    //rsi_drop: Phenotypes.Range(0, 100),
    //rsi_divisor: Phenotypes.Range(1, 10)
    willr_periods: Phenotypes.Range(7,25),
    willr_overbought: Phenotypes.Range(-50, 0),
    willr_oversold: Phenotypes.Range(-100, -90)
  }
}

