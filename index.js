var moment = require('moment');
var a = {
	"msec": null,
	"time_iso8601": null,
	"remote_addr": "192.168.80.131",
	"query_string": null,
	"http_x_forwarded_for": null,
	"http_user_agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36",
	"http_referer": "http://dev.bozhong.com/examples/index.html",
	"time_local": "10/Apr/2015:10:31:05 +0800",
	"request": "GET /x.gif?e=hello&i=uuid%3D3bf2d0dc-9a11-443a-8a83-6a4b7b8dd046&d=name%3Dhello%26data%3Dworld%26c%3D1428629546642%26u%3Dhttp%253A%252F%252Fdev.bozhong.com%252Fexamples%252Findex.html&t=1428633023826&b=r%3D1920x1200&f=2168824839 HTTP/1.1",
	"status": "204",
	"request_time": null,
	"request_length": null,
	"pipe": null,
	"connection": null,
	"bytes_sent": null,
	"body_bytes_sent": "0",
	"date": null,
	"timestamp": null,
	"ip": 3232256131,
	"ip_str": "192.168.80.131",
	"remote_user": null
};
var Q = require('querystring');
var data = {};
var url = Q.parse(a.request.replace('GET /x.gif?', '').replace(' HTTP/1.1', ''));

var details = Q.parse(url.d);

data.data = details;

console.log(url);
console.log(details);
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

console.log(data);