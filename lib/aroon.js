module.exports = function aroon (s, length) {

  if (s.lookback.length >= length) {
    var aroon_up, high_close = 0, since_high = 0
    var aroon_down, low_close = 1000, since_low = 0

    s.lookback.slice(0, length).forEach(function (period, i) {

      //Calculate high point within lookback period
      if(high_close < period.high) {
        high_close = Math.max(period.high, s.period.high)       
        since_high = i
      }

      if(s.period.high > high_close) {
        since_high = 0
      }
          
      //console.log(low_close, period.low, s.period.low)
      if(low_close < period.low) {
        low_close = period.low //Math.min(period.low, s.period.low);
        since_low = i
      }

    })

    if(s.period.low < low_close) {
      low_close = s.period.low
    }

    aroon_up = ((length - since_high) / length) * 100
    aroon_down = ((length - since_low) / length) * 100

    s.period.aroon_up = aroon_up
    s.period.aroon_down = aroon_down

    s.period.since_high = since_high
    s.period.since_low = since_low
  }  
}
