const request = require('request');

const iftttNotifier = function (input) {
	// Check if input is a dict with Value1, Value2 and Value3.
	request.post({url: 'https://maker.ifttt.com/trigger/cryptonotifier/with/key/cnmxekjaK-F3iQ8q18SDpH', json: input}, (err, httpResponse, body) => {
		if (err) {
			return console.error('upload failed:', err);
		}
		console.log('Upload successful!  Server responded with:', body);
	});
};

module.exports = iftttNotifier;