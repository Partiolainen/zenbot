module.exports = {
  _ns: 'zenbot',

  'strategies.mte': require('./strategy'),
  'strategies.list[]': '#strategies.mte'
}
