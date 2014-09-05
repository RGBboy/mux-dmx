/*!
 * MuxDmx unit tests
 */

/**
 * Module Dependencies
 */

var test = require('tape'),
    Stream = require('readable-stream'),
    MuxDmx = require('../index'),
    ChunkStream = require('./helpers/chunk-stream'),
    ClumpStream = require('./helpers/clump-stream'),
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

test('MuxDmx should return a Duplex Stream', function (t) {
  t.plan(1);
  t.equal(MuxDmx() instanceof Stream.Duplex, true);
});

/**
 * muxdmx.createReadStream
 */
 
test('muxdmx.createReadStream should be a function', function (t) {
  setup(t);
  t.plan(1);
  t.equal(typeof client1.createReadStream, 'function');
  teardown(t);
});

test('muxdmx.stream should return a ReadStream', function (t) {
  setup(t);
  t.plan(1);
  var stream = client1.createReadStream(new Buffer([0]));
  t.equal(stream instanceof Stream.Readable, true);
  teardown(t);
});

/**
 * muxdmx.createWriteStream
 */
 
test('muxdmx.createWriteStream should be a function', function (t) {
  setup(t);
  t.plan(1);
  t.equal(typeof client1.createWriteStream, 'function');
  teardown(t);
});

test('muxdmx.stream should return a WriteStream', function (t) {
  setup(t);
  t.plan(1);
  var stream = client1.createWriteStream(new Buffer([0]));
  t.equal(stream instanceof Stream.Writable, true);
  teardown(t);
});

/**
 * muxdmx.createDuplexStream
 */
 
test('muxdmx.createDuplexStream should be a function', function (t) {
  setup(t);
  t.plan(1);
  t.equal(typeof client1.createDuplexStream, 'function');
  teardown(t);
});

test('muxdmx.stream should return a DuplexStream', function (t) {
  setup(t);
  t.plan(1);
  var stream = client1.createDuplexStream(new Buffer([0]));
  t.equal(stream instanceof Stream.Duplex, true);
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
  client1.createDuplexStream(new Buffer([0]));
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
 * muxdmx
 */
test('duplex streams with same stream id should connect to each other', function (t) {
  setup(t);
  t.plan(3);

  var stream1A = client1.createDuplexStream(new Buffer([0])),
      stream2A = client2.createDuplexStream(new Buffer([0])),
      stream1B = client1.createDuplexStream(new Buffer([1])),
      stream2B = client2.createDuplexStream(new Buffer([1])),
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

test('writable streams should connect to readable stream with same id', function (t) {
  setup(t);
  t.plan(1);

  var stream1A = client1.createWriteStream(new Buffer([0])),
      stream2A = client2.createReadStream(new Buffer([0])),
      fired = 0;

  client1.pipe(client2).pipe(client1);

  stream2A.on('data', function (data) {
    t.equal(data.toString('utf-8'), 'testA');
  });

  stream1A.write(new Buffer('testA'));
});

test('muxdmx should error when stream is written to that has no end', function (t) {
  setup(t);
  t.plan(1);

  var bufferId = new Buffer([0]),
      base64Id = bufferId.toString('base64'),
      stream1A = client1.createWriteStream(bufferId);

  client1.pipe(client2).pipe(client1);

  client2.on('error', function (err) {
    t.equal(err.message, 'Stream ' + base64Id + ' not found');
  });

  stream1A.write(new Buffer('testA'));
});

test('muxdmx should error when stream is written to that has no readable end', function (t) {
  setup(t);
  t.plan(1);

  var bufferId = new Buffer([0]),
      base64Id = bufferId.toString('base64'),
      stream1A = client1.createWriteStream(bufferId),
      stream2A = client2.createWriteStream(bufferId);

  client1.pipe(client2).pipe(client1);

  client2.on('error', function (err) {
    t.equal(err.message, 'Stream ' + base64Id + ' is not readable');
  });

  stream1A.write(new Buffer('testA'));
});

test('connected streams should work when data is clumped', function (t) {
  setup(t);
  t.plan(3);

  var stream1A = client1.createDuplexStream(new Buffer([0])),
      stream2A = client2.createDuplexStream(new Buffer([0])),
      stream1B = client1.createDuplexStream(new Buffer([1])),
      stream2B = client2.createDuplexStream(new Buffer([1])),
      fired = 0,
      clumpStream = ClumpStream();

  client1.pipe(clumpStream).pipe(client2);

  stream2A.once('data', function (data) {
    fired += 1;
    t.equal(data.toString('utf-8'), 'testA');
  });

  stream2B.once('data', function (data) {
    fired += 1;
    t.equal(data.toString('utf-8'), 'testB');
    t.equal(fired, 2);
    teardown(t);
    t.end();
  });

  stream1A.write(new Buffer('testA'));
  stream1B.write(new Buffer('testB'));

  process.nextTick(function () {
    clumpStream.flush();
  });

});

test('connected streams should work when data is chunked', function (t) {
  setup(t);
  t.plan(3);

  var stream1A = client1.createDuplexStream(new Buffer([0])),
      stream2A = client2.createDuplexStream(new Buffer([0])),
      stream1B = client1.createDuplexStream(new Buffer([1])),
      stream2B = client2.createDuplexStream(new Buffer([1])),
      fired = 0,
      chunkStream = ChunkStream();

  client1.pipe(chunkStream).pipe(client2);

  stream2A.once('data', function (data) {
    fired += 1;
    t.equal(data.toString('utf-8'), 'testA');
  });

  stream2B.once('data', function (data) {
    fired += 1;
    t.equal(data.toString('utf-8'), 'testB');
    t.equal(fired, 2);
    teardown(t);
    t.end();
  });

  stream1A.write(new Buffer('testA'));
  stream1B.write(new Buffer('testB'));

});