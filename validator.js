var express = require('express');
var router = express.Router();
var multer  = require('multer');
var fileName = "";
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'tmp/uploads')
  },
  filename: function (req, file, cb) {
    //cb(null, file.originalname + '-' + Date.now())
    fileName = file.originalname.slice(0, -5); //remove json extension
    //cb(null, 'fileToConvert.json')
    cb(null, fileName + '.json');
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

var profile = ''; // the various QTI profiles are needed to validate properly

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
  fs.readFile('tmp/uploads/' + fileName + '.json', function(err, data) {
          // determine the profile we need to use based on the different
          // default name spaces declared
          var defaultNS, tmp = JSON.parse(data);
      if (tmp.assessmentTest) defaultNS = tmp.assessmentTest.$.xmlns;
      if (tmp.assessmentResult) defaultNS = tmp.assessmentResult.$.xmlns;
      if (tmp.usageData) defaultNS = tmp.usageData.$.xmlns;
      if (defaultNS.indexOf("imsqti_v2p1") != -1) profile = 'QTIv2p1ASI_Base';
      if (defaultNS.indexOf("imsqti_metadata_v2p1") != -1) profile = 'QTIv2p1Metadata_Base';
      if (defaultNS.indexOf("imsqti_result_v2p1") != -1) profile = 'QTIv2p1Results_Base';
      if (defaultNS.indexOf("imsqti_usagedata_v2p1") != -1) profile = 'QTIv2p1UsageData_Base';
       var xml = builder.buildObject(tmp);
          // now build XML from the resulting JSON data
        fs.writeFile('public/temp/' + fileName + '.xml', xml, function (err) {
          if (err) {
            console.log("Got error writing from JSON back to XML: " + err);
          }
            console.log("File saved as " + fileName + '.xml');
          });
        console.log('Now validation should take over');
    });
  //this has multer upload the file and pass it on for further manipulation
  next();
});

router.use('/upload', function(req, res) {
  request
   .get('http://validator.imsglobal.org/validate')
   .query({ source: 'http://lti.learningcomponents.com/temp/' + fileName + '.xml' })
   .query({ xsl: 'http://validator.imsglobal.org/template.xsl'})
   .query({ profile: profile})
   .end(function(err, response){
     if (err) {
       console.log('Got an error trying to validate: ' + err);
     }
     res.send(response.text);
   });
  //http://validator.imsglobal.org/validate?source=http://validator.imsglobal.org/test/cartridge.imscc&xsl=http://validator.imsglobal.org/template.xsl&profile=1.1.0
});

module.exports = router;
