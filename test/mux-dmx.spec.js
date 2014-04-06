/*!
 * MuxDmx unit tests
 */

/**
 * Module Dependencies
 */

var test = require('tape'),
    DuplexStream = require('readable-stream').Duplex,
    MuxDmx = require('../index'),
    client1,
    client2;

/**
 * Setup
 */

var setup = function (t) {
  client1 = MuxDmx();
  client2 = MuxDmx();
};

/**
 * Teardown
 */

var teardown = function (t) {
};

/**
 * MuxDmx Class
 */

test('MuxDmx', function (t) {
  t.plan(1);
  t.ok(MuxDmx, 'class should exist');
});

/**
 * muxdmx.stream
 */
 
test('muxdmx.stream should be a function', function (t) {
  setup(t);
  t.plan(1);
  t.equal(typeof client1.stream, 'function');
  teardown(t);
});

test('muxdmx.stream should return a DuplexStream', function (t) {
  setup(t);
  t.plan(1);
  var stream = client1.stream(new Buffer([0]));
  t.equal(stream instanceof DuplexStream, true);
  teardown(t);
});

/**
 * muxdmx.hasStream
 */
 
test('muxdmx.hasStream should be a function', function (t) {
  setup(t);
  t.plan(1);
  t.equal(typeof client1.hasStream, 'function');
  teardown(t);
});

test('muxdmx.hasStream should return true if stream exists', function (t) {
  setup(t);
  t.plan(1);
  client1.stream(new Buffer([0]));
  t.equal(client1.hasStream(new Buffer([0])), true);
  teardown(t);
});

test('muxdmx.hasStream should return false if stream does not exist', function (t) {
  setup(t);
  t.plan(1);
  t.equal(client1.hasStream(new Buffer([0])), false);
  teardown(t);
});

/**
 * muxdmx.stream()
 */
test('piped muxdmx clients with same stream id should connect to each other', function (t) {
  setup(t);
  t.plan(3);

  var stream1A = client1.stream(new Buffer([0])),
      stream2A = client2.stream(new Buffer([0])),
      stream1B = client1.stream(new Buffer([1])),
      stream2B = client2.stream(new Buffer([1])),
      fired = 0;

  client1.pipe(client2).pipe(client1);

  stream2A.on('data', function (data) {
    fired += 1;
    t.equal(data.toString('utf-8'), 'testA');
  });

  stream1A.write(new Buffer('testA'));

  stream2B.on('data', function (data) {
    fired += 1;
    t.equal(data.toString('utf-8'), 'testB');
    t.equal(fired, 2)
    teardown(t);
    t.end();
  });

  stream1B.write(new Buffer('testB'));
});