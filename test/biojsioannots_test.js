/*
 * biojs-io-annots
 * https://github.com/greenify/biojs-io-annots
 *
 * Copyright (c) 2014 greenify
 * Licensed under the Apache 2 license.
 */

var chai = require('chai');
var assert = chai.assert;
chai.expect();
chai.should();

var io = require('../lib/biojsioannots.js');
var fs = require('fs');

suite("Annot parser");

test("test with fs", function(done) {
  var expectedResult = JSON.parse(fs.readFileSync(__dirname + '/dummy.json', 'utf8'));
  fs.readFile(__dirname + '/dummy.annot','utf8', function(err,data){
    if (err) {
      return console.log(err);
    }
    var obj = io.parse(data);
    //console.log(JSON.stringify(obj));
    obj = JSON.parse(JSON.stringify(obj));
    obj.should.eql(expectedResult);
    done();
  });

});
