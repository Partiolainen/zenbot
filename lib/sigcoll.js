
module.exports = function container (get, set, clear) {
  return function sigcoll (s, key) {
    var fs = require('fs');
    try {
    var results = JSON.parse(fs.readFileSync('./signals.json', 'utf8'));
    //var results = require('./signals.json')
    var found = 0
    for (var result in results) {
      //console.log(s.asset, results[result].AssetSymbol, results[result].BuyPrice)
      if (s.asset === results[result].AssetSymbol) {
        //s.period.buyprice = result.BuyPrice
        s.period[key] = { buyprice: results[result].BuyPrice }
        found = 1
        //console.log(results[result].BuyPrice, s.period[key].buyprice);

      }
    }
    if(found==0) s.period[key] = { buyprice: null }
  }
  catch (e) {
    console.log(e);
  }
  }
}
