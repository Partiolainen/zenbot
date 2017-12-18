module.exports = {
    _ns: 'zenbot',
  
    'strategies.sentiment': require('./strategy'),
    'strategies.list[]': '#strategies.sentiment'
  }