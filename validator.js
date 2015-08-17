var express = require('express');
var router = express.Router();
var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'tmp/uploads')
  },
  filename: function (req, file, cb) {
    //cb(null, file.originalname + '-' + Date.now())
    cb(null, 'fileToConvert.json')
  }
})

var upload = multer({ storage: storage });
var fs = require('fs');
var xml2js = require('xml2js');

var builder = new xml2js.Builder();

var parser = new xml2js.Parser({
    //attrkey : "@",
    //mergeAttrs : true,
    //charkey : "$String",
    //trim : true,
    //normalize : true,
    explicitArray : false
    //explicitRoot : true
});

var request = require('superagent');

// middleware specific to this router
// a middleware with no mount path; gets executed for every request to the app
router.use('/upload', function(req, res, next) {
  // delete existing temporary uploaded file(s)
  console.log('Time: ', Date.now());
  next();
});
// define the home page route
router.get('/', function(req, res) {
  res.send({endpoint: 'Validator home page'});
  console.log('Did not send response, so just go to next');
});
// define the about route
router.get('/about', function(req, res) {
  res.send('About the Validator (came from next call)');
});

router.post('/upload', upload.single('fileToValidate'), function (req, res, next) {
  fs.readFile('tmp/uploads/fileToConvert.json', function(err, data) {
       var xml = builder.buildObject(JSON.parse(data));
          // now build XML from the resulting JSON data
        fs.writeFile('public/fileToValidate.xml', xml, function (err) {
          if (err) {
            console.log("Got error writing from JSON back to XML: " + err);
          }
            console.log("File saved as fileToValidate.xml");
          });
        console.log('Now validation should take over');
    });
  //this has multer upload the file and pass it on for further manipulation
  next();
});

router.use('/upload', function(req, res) {
  request
   .get('http://validator.imsglobal.org/validate')
   .query({ source: 'fileToValidate.xml' })
   .end(function(err, res){
     if (err) {
       res.send('Got an error trying to validate: ' + err);
     }
     res.send('Done with upload operations:');
   });
  //http://validator.imsglobal.org/validate?source=http://validator.imsglobal.org/test/cartridge.imscc&xsl=http://validator.imsglobal.org/template.xsl&profile=1.1.0
});

module.exports = router;
