
module.exports = function container (get, set, clear) {
  return function sigcoll (s, key, url) {
    s.period[key] = { buyprice: null, buyoutdate: null, stoploss: null, target: null, /*target1: null,*/ price: null }
    var request = require('request')
    try {
      request(url, function (error, response, body) {
      try {
          results = JSON.parse(body);
        } catch (error) {
          //console.log(error);
          results = []
        }
      })  
    
    //var found = 0
    if(typeof results != 'undefined')
    for (var result in results) {
      var p = 0
      if (s.lookback && s.lookback.length > 0) {
        p = s.lookback[0]['close']
      } else p = null
      if (s.asset === results[result].AssetSymbol) {      
        s.period[key] = { 
          buyprice: results[result].BuyPrice,
          buyoutdate: results[result].BuyOutdate,
          stoploss: results[result].StopLoss,
          target: results[result].Target,
          //target1: results[result].Target1,
          price: p
         }
        //found = 1
        //break
      }   
    } 
    //if(found==0 || typeof s.period.sigcoll==='undefined')
    // s.period[key] = { buyprice: null, stoploss: null, target: null }
  }
  catch (e) {
    console.log(e);
  }
}
}
