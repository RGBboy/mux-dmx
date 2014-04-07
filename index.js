'use strict';
/*!
 * Mux Dmx
 */

/**
 * Module Dependencies
 */

var MuxDmx,
    Through2 = require('through2'),
    Duplex = require('readable-stream').Duplex,
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
      decode;

  decode = function (chunk, encoding, next) {
    // decode and direct chunk
    var unpacked = multibuffer.unpack(chunk),
        base64Id = unpacked[0].toString('base64');
    if (streams[base64Id]) {
      streams[base64Id].push(unpacked[1]);
    };
    next();
  };

  self = Through2(decode);

  /**
   * .stream
   *
   * creates and returns a stream
   *
   * @param {Buffer} id
   * @return {Stream}
   * @api public
   */
  self.stream = function (id) {
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