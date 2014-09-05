'use strict';
/*!
 * Clump Stream
 */

/**
 * Module Dependencies
 */

var ClumpStream,
    Through = require('through2');

/**
 * ClumpStream
 *
 * holds on to data until flush is called
 *
 * @return {Stream}
 * @api public
 */
ClumpStream = function () {

  var self,
      chunks = [];

  function clump (chunk, encoding, next) {
    chunks.push(chunk);
    next();
  };

  self = new Through(clump);

  self.flush = function () {
    self.push(Buffer.concat(chunks));
  };

  return self;

};

/**
 * Module Exports
 */
exports = module.exports = ClumpStream;