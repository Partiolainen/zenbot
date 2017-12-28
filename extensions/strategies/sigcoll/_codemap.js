module.exports = {
  _ns: 'zenbot',

  'strategies.sigcoll': require('./strategy'),
  'strategies.list[]': '#strategies.sigcoll'
}
