
module.exports = function container (get, set, clear) {
  return function sigcoll (s, key, url) {
    s.period[key] = { buyprice: null, stoploss: null, target: null }
    var request = require('request')
    try {
      request(url, function (error, response, body) {
      try {
          results = JSON.parse(body);
        } catch (error) {
          console.log(error);
          results = []
        }
      })  
    
    //var found = 0
    if(typeof results != 'undefined')
    for (var result in results) {
      if (s.asset === results[result].AssetSymbol) {      
        s.period[key] = { 
          buyprice: results[result].BuyPrice,
          stoploss: results[result].StopLoss,
          target: results[result].Target1
         }
        //found = 1
        break
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
