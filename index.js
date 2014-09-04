'use strict';
/*!
 * Mux Dmx
 */

/**
 * Module Dependencies
 */

var MuxDmx,
    Through2 = require('through2'),
    multibuffer = require('multibuffer');

/**
 * MuxDmx
 *
 * @return {Stream}
 * @api public
 */
MuxDmx = function () {

  var self,
      streams = {},
      decode,
      chunks;

  decode = function (chunk, encoding, next) {
    // decode and direct chunk
    if (chunks) {
      chunk = Buffer.concat([chunks, chunk]);
    };
    var partialId = multibuffer.readPartial(chunk),
        partialData,
        base64Id;

    if (partialId && partialId[0] && partialId[1]) {
      base64Id = partialId[0].toString('base64');
      partialData = multibuffer.readPartial(partialId[1]);
    };

    if (partialData && partialData[0] && streams[base64Id]) {
      streams[base64Id].push(partialData[0]);
      chunks = null;
      if (partialData[1]) {
        decode(partialData[1], encoding, next);
        return;
      } else {
        next();
        return;
      };
    };

    chunks = chunk;
    next();

  };

  self = Through2(decode);

  /**
   * .createDuplexStream
   *
   * creates and returns a stream
   *
   * @param {Buffer} id
   * @return {Stream}
   * @api public
   */
  self.createDuplexStream = function (id) {
    var base64Id = id.toString('base64'),
        encode;
    if (!streams[base64Id]) {
      encode = function (chunk, encoding, next) {
        // push encoded chunk to mux demux
        self.push(multibuffer.pack([id, chunk]));
        next();
      };
      streams[base64Id] = new Through2(encode);
    };
    return streams[base64Id];
  };

  /**
   * .hasStream
   *
   * @param {Buffer} id
   * @return {Boolean}
   * @api public
   */
  self.hasStream = function (id) {
    return (!!streams[id.toString('base64')]);
  };

  return self;

};

/**
 * Module Exports
 */
exports = module.exports = MuxDmx;