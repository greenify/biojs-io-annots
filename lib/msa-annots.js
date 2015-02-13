/*
 * msa-annots
 * https://github.com/greenify/msa-annots
 *
 * Copyright (c) 2014 greenify
 * Licensed under the Apache 2 license.
 */

var toHex = require('colornames');
var hexrgb = require('hexrgb');
var request = require('nets');

/**
  @class biojsioannots
  */

/*
 * Public Methods
 */

var validAnnots = ["BAR_GRAPH", "LINE_GRAPH", "NO_GRAPH"];

var toHexColor = function(color){
  color = color.toLowerCase();
  if( toHex(color) !== undefined){
    color = toHex(color);
  }else if( isNaN(color)){
    color = hexrgb.rgb2hex("rgb(" + color + ")");
  } else{
    color = "#" + color;
  }
  return color;
}

/**
 * Method responsible to parse the annotation URL (call parse with the URL object)
 *
 * @method parse 
 * @param {String} file URL to annotation file
 * @return {String} Returns JSON representation
 */
module.exports.read = function(url, callback) {
  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(parse(body));
    }else{
      console.warn(response, error, body);
    }
  })
}


/**
 * Method to parse Jalview annotation files 
 * http://www.jalview.org/builds/latest/help/html/features/annotationsFormat.html
 *
 * @example
 *
 *     biojsioannots.hello('biojs');
 *
 * @method hello
 * @param {String} file Annotation file as String
 * @return {String} Returns representation in JSON
 */

module.exports.parse = parse = function (file) {
  var lines = file.split("\n");

  // transmit
  var annots = [];
  var groups = {};
  var graph = {colors: {}, combine: {}, lines: {}};

  // temporary
  var sequenceRef = null;
  var groupRef = null;

  for(var i=0; i < lines.length; i++){
    // ignore header
    if(lines[i].match(/JALVIEW_ANNOTATION/) !== null ) continue;
    // ignore comments or empty lines
    if(lines[i].length == 0 || lines[i].charAt(0) === "#") continue

      var columns = lines[i].split("\t");

    // sequence_ref
    if(columns[0] === "SEQUENCE_REF"){
      if( columns[1] === "ALIGNMENT" ){
        sequenceRef = null;
      }else {
        sequenceRef = {};
        sequenceRef.id = columns[1];
        sequenceRef.start = columns[2];
      }
      continue;
    }

    // group_ref
    if(columns[0] === "GROUP_REF"){
      if( columns[1] === "ALIGNMENT"){
        groupRef = null;
      }else {
        groupRef = {};
        groupRef.id = columns[1];
      }
      continue;
    }

    if(columns[0] === "PROPERTIES" ){
      var groupName = columns[1];
      var props = columns.slice(2);
      var propObj = {};
      for(var j=0; j < props.length; j++){
        var value = props[j].split("=");
        propObj[value[0]] = value[1];
      }
      if( groups[groupName] === undefined){
        console.log("Unknown group", groupName); continue;
      }
      groups[groupName].props = propObj;
      continue;
    }

    if(columns[0] === "SEQUENCE_GROUP" ){
      var groupName = columns[1];
      var groupObj = {};
      groupObj.start = columns[2];
      groupObj.end = columns[3];
      var seqs = columns[4];

      // alignment indices are not known
      if(seqs === "-1"){
        groupObj.numeric = false;
        groupObj.seqs = columns.slice(5);
      } else {
        groupObj.numeric = true;

        // TODO: handle star
        if(seqs === "*"){
          groupObj.seqs = "*";
        }else{
          seqs = seqs.split(",");
          seqsNum = [];
          for(var j=0;j<seqs.length;j++){
            if(seqs[j].indexOf("-") >= 0 ){
              // range
              var range = seqs[j].split("-");
              // TODO: not very efficient
              for(var k=range[0];k<range[1];k++){
                seqsNum.push(k);
              }
            }else{
              // normal index
              seqsNum.push(seqs[j]);
            }
          }
          groupObj.seqs = seqsNum;
        }
      }
      groups[groupName] = groupObj;
      continue;
    }

    // line graph grouping
    if(columns[0] === "COLOUR"){
      var col = columns[2];
      graph.colors[columns[1]] = toHexColor(col);
      continue;
    }
    if(columns[0] === "COMBINE"){
      graph.combine[columns[1]] = columns[2];
      continue;
    }
    if(columns[0] === "GRAPHLINE"){
      var lineObj = {};
      lineObj.value =  columns[2];
      lineObj.label =  columns[3];
      lineObj.color =  toHexColor(columns[4]);
      graph.lines[columns[1]] = lineObj;
      continue;
    }

    // add annot
    if(validAnnots.indexOf(columns[0]) >= 0 ){
      var tAnnot = {};
      tAnnot.graphType = columns[0];
      tAnnot.label = columns[1];

      // desc is optional
      if( columns[3] !== undefined ) {
        tAnnot.desc = columns[2];
        tAnnot.values = columns[3].split("|");
      } else{
        tAnnot.values = columns[2].split("|");
      }

      if(sequenceRef !== null){
        tAnnot.seqid = sequenceRef.id;
        tAnnot.start = sequenceRef.start;
      }
      if(groupRef !== null){
        tAnnot.group = groupRef.id;
      }
      annots.push(tAnnot);
    }
  }
  var transmit = {annot: annots, graph: graph, groups: groups};
  return transmit;
};
