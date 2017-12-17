module.exports = {
  _ns: 'zenbot',

  'strategies.agg': require('./strategy'),
  'strategies.list[]': '#strategies.agg'
}
