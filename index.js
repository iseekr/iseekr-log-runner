var moment = require('moment');

var run = function(a) {
	var Q = require('querystring');
	var data = {};
	var url = Q.parse(a.request.replace('GET /x.gif?', '').replace(' HTTP/1.1', ''));

	var details = Q.parse(url.d);

	data.data = details;
	
	data.type = url.e;
	data.ip = a.remote_addr;

	var detector = require('detector');

	// uuid
	var i = Q.parse(url.i);
	if (i.uuid) {
		data.uuid = i.uuid;
	}

	if (i.uid) {
		data.uid = i.uid;
	}

	// time
	data.time = url.t;
	data.date = moment(new Date(data.time * 1)).format('YYYY-MM-DD');

	// device
	var r = Q.parse(url.b).r.split('x');
	data.device = {};
	data.device.width = r[0];
	data.device.height = r[1];
	data.device.id = url.f;

	// ua parser
	var UA = detector.parse(a.http_user_agent);
	//console.log(UA);
	data.device.browser = UA.browser.name;
	data.device.browser_version = UA.browser.version;
	data.device.os = UA.os.name;
	data.device.os_version = UA.os.version;

	// is mobile
	data.device.is_mobile = (UA.device.name !== 'pc' && UA.device.name !== 'mac');

	// page
	data.page = {};
	data.page.url = a.http_referer;

	return data;

};

exports.run = run;
exports.getFlatten = function(a) {
	// 对象扁平化
	var data = run(a);
	var x = {};

	for (var i in data) {
		if (typeof data[i] === 'string') {
			x[i] = data[i]
		} else if (typeof data[i] === 'object') {
			for (var j in data[i]) {
				x[i + '.' + j] = data[i][j];
			}
		}
	}
	return x;
};