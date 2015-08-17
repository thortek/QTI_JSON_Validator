var express = require('express');
var app = express();
var validator = require('./validator');

app.use(express.static('public'));
app.use('/validator', validator);

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://', host, port);
});

//http://validator.imsglobal.org/validate?source=http://validator.imsglobal.org/test/cartridge.imscc&xsl=http://validator.imsglobal.org/template.xsl&profile=1.1.0
