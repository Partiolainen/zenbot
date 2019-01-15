module.exports = function container (get, set, clear) {
  return function aroon (s, length) {

    if (s.lookback.length >= length) {
      //console.log(s.lookback.length, last_close);

      var aroon_up, high_close = 0, since_high = 0;
      var aroon_down, low_close = 0, since_low = 0;

      var last_period;

      s.lookback.slice(0, length).forEach(function (period, i) {

          //Calculate high point within lookback period
          if(high_close < period.high) {
            high_close = Math.max(period.high, s.period.high);       
            since_high = i;
          }

          if(s.period.high > high_close) {
            //console.log("new high");
            since_high = 0;
          }

          if(low_close > period.low) {
            low_close = period.low;
            since_low = i;
            //console.log(period.low);
          }

        })

        if(s.period.low < low_close) {
            //console.log("new low");
            //low_close = s.period.low;
          }

        aroon_up = ((length - since_high) / length) * 100;
        aroon_down = ((length - since_low) / length) * 100;

        //console.log(" ", aroon_up, aroon_down);
        s.period.aroon_up = aroon_up;
        s.period.aroon_down = aroon_down;

        s.period.since_high = since_high;
        s.period.since_low = since_low;
        //console.log(high_close, since_high, low_close, since_low);
    }
  }
}
