'use strict';
/*!
 * Mux Dmx
 */

/**
 * Module Dependencies
 */

var MuxDmx,
    Stream = require('readable-stream'),
    multibuffer = require('multibuffer'),
    noop = function () {};

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
      if (!streams[base64Id]) {
        self.emit('error', new Error('Stream ' + base64Id + ' not found'));
      };
      partialData = multibuffer.readPartial(partialId[1]);
    };

    if (partialData && partialData[0] && streams[base64Id]) {
      // if writable
      if (streams[base64Id] instanceof Stream.Readable) {
        streams[base64Id].push(partialData[0]);
        chunks = null;
      } else {
        self.emit('error', new Error('Stream ' + base64Id + ' is not readable'));
        chunks = null;
      };

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

  self = new Stream.Duplex();
  self._write = decode;
  self._read = noop;

  /**
   * .createReadStream
   *
   * creates and returns a Readable Stream
   *
   * @param {Buffer} id
   * @return {Stream.Readable}
   * @api public
   */
  self.createReadStream = function (id) {
    var base64Id = id.toString('base64');
    if (!streams[base64Id]) {
      streams[base64Id] = Stream.Readable();
      streams[base64Id]._read = noop;
      return streams[base64Id];
    };
  };

  /**
   * .createWriteStream
   *
   * creates and returns a Writable Stream
   *
   * @param {Buffer} id
   * @return {Stream.Writable}
   * @api public
   */
  self.createWriteStream = function (id) {
    var base64Id = id.toString('base64'),
        encode;
    if (!streams[base64Id]) {
      encode = function (chunk, encoding, next) {
        // push encoded chunk to mux demux
        self.push(multibuffer.pack([id, chunk]));
        next();
      };
      streams[base64Id] = new Stream.Writable();
      streams[base64Id]._write = encode;
    };
    return streams[base64Id];
  };

  /**
   * .createDuplexStream
   *
   * creates and returns a Duplex Stream
   *
   * @param {Buffer} id
   * @return {Stream.Duplex}
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
      streams[base64Id] = new Stream.Duplex();
      streams[base64Id]._write = encode;
      streams[base64Id]._read = noop;
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