module.exports = {
    _ns: 'zenbot',
  
    'strategies.two_sma_with_rsi': require('./strategy'),
    'strategies.list[]': '#strategies.two_sma_with_rsi'
  }