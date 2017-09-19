#!/usr/local/bin/node

var colors = require('colors');

var now = new Date();

function color_console(diff_in_days) {
  if (diff_in_days <= 10) return 'red';
  if (diff_in_days <= 30) return 'yellow';
  if (diff_in_days <= 60) return 'blue';
  return 'green';
}

function validate(host, expect_valid) {
    var https = require('https');

    var options = {
      host: host,
      port: 443,
      path: '/',
      method: 'GET',
      rejectUnauthorized: true
    };

    var req = https.request(options, function(res) {
      var cert = res.connection.getPeerCertificate();
      var diff_in_days = Math.floor((new Date(cert.valid_to) - now) / 86400000);
      var color = color_console(diff_in_days);
      console.log(colors[color]("host:       ", host));
      console.log(colors[color]("issuer:     ", cert.issuer.CN));
      console.log(colors[color]("expires:    ", cert.valid_to));
      console.log(colors[color]("expires in: ", diff_in_days + ' days'));
      console.log(colors[color]('------------------------------------------'));
    });
    req.end();

    req.on('error', function(e) {
      var color = expect_valid ? 'red' : 'white';
      console.log(colors[color]("host:       ", host));
      console.log(colors[color]("code:       ", e.code));
      console.log(colors[color]('------------------------------------------'));
    });

}

if (process.argv[1].match(/\bsslcheck\b/)) {
  for (var i=2; i<process.argv.length; i++) {
    validate(process.argv[i]);
  }
}

module.exports = validate;
