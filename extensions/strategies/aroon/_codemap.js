module.exports = {
  _ns: 'zenbot',

  'strategies.aroon': require('./strategy'),
  'strategies.list[]': '#strategies.aroon'
}
