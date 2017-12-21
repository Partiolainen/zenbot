module.exports = {
    _ns: 'zenbot',
  
    'strategies.sentiment2': require('./strategy'),
    'strategies.list[]': '#strategies.sentiment2'
  }