var z = require('zero-fill')
, n = require('numbro');

module.exports = function container(get, set, clear) {
return {
  name: 'sigcoll',
  description: 'Attempts to buy low and sell high by tracking RSI high-water readings.',

  getOptions: function () {
    this.option('period', 'period length', String, '1m')
    this.option('min_periods', 'min. number of history periods', Number, 52)
    this.option('rsi_periods', 'number of RSI periods', 14)
    this.option('oversold_rsi', 'buy when RSI reaches or drops below this value', Number, 30)
    this.option('overbought_rsi', 'sell when RSI reaches or goes above this value', Number, 75)
  },

  calculate: function (s) {
   /* get('lib.rsi')(s, 'rsi', s.options.rsi_periods)
    get('lib.sigcoll')(s, 'sigcoll')*/
  },

  onPeriod: function (s, cb) {
    if (s.in_preroll) return cb()
    //console.log(s.period.close,s.period.sigcoll.buyprice)
    /*if(s.period && s.period.close<=s.period.sigcoll.buyprice){
      s.signal = 'buy'
    }    */  
    cb()
  },

  onReport: function (s) {
 /*   var cols = []
    //if(s.period && s.period.sigcoll.buyprice!=null)
     //cols.push(z(4, n(s.period.sigcoll.buyprice).format('0.00000000'), ' ')['blue'])

     if (typeof s.period.rsi === 'number') {
      var color = 'grey'
      if (s.period.rsi <= s.options.oversold_rsi) {
        color = 'green'
      }
      cols.push(z(4, n(s.period.rsi).format('0'), ' ')[color])
    }

    return cols**/
  }
}
}
