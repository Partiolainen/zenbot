
module.exports = function container (get, set, clear) {
    return function sigcoll (s, key, url) {
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
      var found = 0
      if(typeof results != 'undefined')
      for (var result in results) {
        if (s.asset === results[result].AssetSymbol) {      
          s.period[key] = { buyprice: results[result].BuyPrice }
          found = 1
        }
      }
      if(found==0) s.period[key] = { buyprice: null }
    }
    catch (e) {
      console.log(e);
    }
  }
}
