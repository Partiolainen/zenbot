var talib = require('talib')

module.exports = function container (get, set, clear) {
  return function ta_ema (s, key, length, source_key) {
    //create object for talib. only close is used for now but rest might come in handy
    if (!s.marketData) {
      s.marketData = { open: [], close: [], high: [], low: [], volume: [] };
    }
    if (s.lookback.length > s.marketData.close.length) {
      for (var i = (s.lookback.length - s.marketData.close.length) - 1; i >= 0; i--) {
        //console.log('add data')
        s.marketData.close.push(s.lookback[i].close);
      }
    }
    if (s.lookback.length > s.marketData.high.length) {
      for (var i = (s.lookback.length - s.marketData.high.length) - 1; i >= 0; i--) {
        //console.log('add data')
        s.marketData.high.push(s.lookback[i].high);
      }
    }
    if (s.lookback.length > s.marketData.low.length) {
      for (var i = (s.lookback.length - s.marketData.low.length) - 1; i >= 0; i--) {
        //console.log('add data')
        s.marketData.low.push(s.lookback[i].low);
      }
    }
    //dont calculate until we have enough data
    if (s.marketData.close.length >= length) {
      //fillup marketData for talib.
      //this might need improvment for performance.
      //for (var i = 0; i < length; i++) {
      //  s.marketData.close.push(s.lookback[i].close);
      //}
      //fillup marketData for talib.
      var mclose = JSON.parse(JSON.stringify(s.marketData.close));
      //add current period
      mclose.push(s.period.close)

      var mhigh = JSON.parse(JSON.stringify(s.marketData.high));
      //add current period
      mhigh.push(s.period.high)

      var mlow = JSON.parse(JSON.stringify(s.marketData.low));
      //add current period
      mlow.push(s.period.low)

      //doublecheck length.
      if (mclose.length >= length) {
        talib.execute({
          name: "WILLR",
          startIdx: 0,
          endIdx: mclose.length -1,
          close: mclose,
          high: mhigh,
          low: mlow,
          optInTimePeriod: length
        }, function (err, result) {
          if (err) {
            console.log(err);
            return;
          }
          //Result format: (note: outReal can have multiple items in the array)
          // {
          //   begIndex: 8,
          //   nbElement: 1,
          //   result: { outReal: [ 1820.8621111111108 ] }
          // }
          var rslt = result.result.outReal[(result.nbElement - 1)];
          /*if(rslt>-80 && s.period[key]<=-80) {
            s.period[key+'_cross_bottom']=1;
          }else{
            s.period[key+'_cross_bottom']=0;
          }*/
          s.period[key+'prev']=result.result.outReal[(result.nbElement - 2)]
          s.period[key] = result.result.outReal[(result.nbElement - 1)];
        });
      }
    }
  }
}
