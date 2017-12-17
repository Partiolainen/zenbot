module.exports = {
  _ns: 'zenbot',

  'strategies.crossed_ema': require('./strategy'),
  'strategies.list[]': '#strategies.crossed_ema'
}
