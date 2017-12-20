module.exports = {
  _ns: 'zenbot',

  'strategies.signals': require('./strategy'),
  'strategies.list[]': '#strategies.signals'
}