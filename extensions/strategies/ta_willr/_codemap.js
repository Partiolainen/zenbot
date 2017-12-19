module.exports = {
  _ns: 'zenbot',

  'strategies.ta_willr': require('./strategy'),
  'strategies.list[]': '#strategies.ta_willr'
}
