var z = require('zero-fill')
  , n = require('numbro')
  , rsi = require('../../../lib/rsi')
  , willr = require('../../../lib/ta_willr')
  , Phenotypes = require('../../../lib/phenotype')

module.exports = {
  name: 'ta_willr',
  description: 'Williams R with rsi oversold',

  getOptions: function () {
    this.option('period', 'period length eg 5m', String, '5m')
    this.option('min_periods', 'min. number of history periods', Number, 15)
    
    this.option('willr_periods', 'number of WillR periods', Number, 14)
    this.option('willr_oversold', 'number of WillR periods', Number, -94)
    this.option('willr_overbought', 'number of WillR periods', Number, -30)

    this.option('overbought_rsi_periods', 'number of periods for overbought RSI', Number, 25)
    this.option('overbought_rsi', 'sold when RSI exceeds this value', Number, 75)
  },

  calculate: function (s) {
    if (s.options.overbought_rsi) {
      // sync RSI display with overbought RSI periods
      s.options.rsi_periods = s.options.overbought_rsi_periods
      rsi(s, 'overbought_rsi', s.options.overbought_rsi_periods)
      if (!s.in_preroll && s.period.overbought_rsi >= s.options.overbought_rsi && !s.overbought) {
        s.overbought = true

        if (s.options.mode === 'sim' && s.options.verbose) {
          console.log(('\noverbought at ' + s.period.overbought_rsi + ' RSI, preparing to sold\n').cyan)
        }
      }
    }
  },

  onPeriod: function (s, cb) {
    if (!s.in_preroll && typeof s.period.overbought_rsi === 'number') {
      if (s.overbought) {
        s.overbought = false
        //s.signal = 'sell'
        return cb()
      }
    }

    willr(s, s.options.min_periods, s.options.willr_periods).then(function(signal) {
      s.period['willr'] = signal

      if (typeof s.period.willr === 'number') {
        if(s.period.willr<=s.options.willr_oversold) {
          s.signal = 'buy'
        }        
  
        if(s.period.willr>=s.options.willr_overbought){
          s.signal = 'sell'
        }
      }

      cb()
    }).catch(function(error) {
      console.log(error)
      cb()
    })
  },

  onReport: function (s) {
    var cols = []
    if (typeof s.period.willr === 'number') {
      cols.push(z(4, n(s.period.willr).format('0'), ' ')['yellow'])
    }
    return cols
  },

  phenotypes: {
    period_length: Phenotypes.ListOption(['15m','30m','1h','90m','2h','150m','3h','210m','4h']),
    min_periods: Phenotypes.Range(15, 26),
    markdown_buy_pct: Phenotypes.RangeFloat(-1, 5),
    markup_sell_pct: Phenotypes.RangeFloat(-1, 5),
    //order_type: Phenotypes.ListOption(['maker', 'taker']),
    //sell_stop_pct: Phenotypes.Range0(1, 15),
    //buy_stop_pct: Phenotypes.Range0(1, 50),
    profit_stop_enable_pct: Phenotypes.Range0(1, 20),
    profit_stop_pct: Phenotypes.Range(1,20),

    willr_periods: Phenotypes.Range(7,25),
    willr_overbought: Phenotypes.Range(-50, 0),
    willr_oversold: Phenotypes.Range(-100, -90),
    overbought_rsi_periods: Phenotypes.Range(1, 50),
    overbought_rsi: Phenotypes.Range(20, 100)
  }
}

