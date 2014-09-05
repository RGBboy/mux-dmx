'use strict';
/*!
 * Chunk Stream
 */

/**
 * Module Dependencies
 */

var ChunkStream,
    Through = require('through2');

/**
 * ChunkStream
 *
 * Sends data through in 1 byte chunks
 *
 * @return {Stream}
 * @api public
 */
ChunkStream = function () {

  var self,
      chunks = [],
      sending = false,
      i;
  
  function chunk (chunk, encoding, next) {
    for (i = 0; i < chunk.length; i += 1) {
      chunks.push(chunk.slice(i, i+1));
    };
    if (!sending) {
      sendNextChunk();
    };
    next();
  };

  function sendNextChunk () {
    sending = true;
    self.push(chunks.splice(0,1)[0]);
    if (chunks.length > 0) {
      process.nextTick(sendNextChunk);
    } else {
      sending = false;
    };
  };

  self = new Through(chunk);

  return self;

};

/**
 * Module Exports
 */
exports = module.exports = ChunkStream;