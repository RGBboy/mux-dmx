'use strict';
/*!
 * Mux Dmx
 */

/**
 * Module Dependencies
 */

var MuxDmx,
    Transform = require('readable-stream').Transform,
    Duplex = require('readable-stream').Duplex,
    multibuffer = require('multibuffer');

/**
 * MuxDmx
 *
 * @return {Stream}
 * @api public
 */
MuxDmx = function () {

  var self = Duplex(),
      streams = {};

  /**
   * ._read
   *
   * @param {Number} size
   * @return {undefined}
   * @api private
   */
  self._read = function (size) {

  };

  /**
   * ._write
   *
   * @param {Buffer|null} chunk
   * @param {String} encoding
   * @param {Function} next
   * @return {undefined}
   * @api private
   */
  self._write = function (chunk, encoding, next) {
    // decode and direct chunk
    var unpacked = multibuffer.unpack(chunk),
        base64Id = unpacked[0].toString('base64');
    if (streams[base64Id]) {
      streams[base64Id].push(unpacked[1]);
    };
    next();
  };

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
    var base64Id = id.toString('base64');
    if (!streams[base64Id]) {
      streams[base64Id] = new Duplex();
      streams[base64Id]._read = function (size) {
      };
      streams[base64Id]._write = function (chunk, encoding, next) {
        // push encoded chunk to mux demux
        self.push(multibuffer.pack([id, chunk]));
        next();
      };
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