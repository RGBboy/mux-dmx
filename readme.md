# MUX DMX

Multiple Duplex Streams across a single Duplex Stream.

[![Browser Support](https://ci.testling.com/rgbboy/mux-dmx.png)
](https://ci.testling.com/RGBboy/mux-dmx)

[![Build Status](https://secure.travis-ci.org/RGBboy/mux-dmx.png)](http://travis-ci.org/RGBboy/mux-dmx)

# API

``` javascript

  var client1 = MuxDmx(),
      client2 = MuxDmx(),
      stream1A = client1.stream(new Buffer([0])),
      stream2A = client2.stream(new Buffer([0])),

  client1.pipe(client2).pipe(client1);

  stream2A.on('data', function (data) {
    console.log(data.toString('utf-8')); // Beep
  });

  stream2B.on('data', function (data) {
    console.log(data.toString('utf-8')); // Boop
  });

  stream1A.write(new Buffer('Beep'));
  stream2A.write(new Buffer('Boop'));

```

## MuxDmx()

* Return `Duplex` MuxDmx Stream

## instance.stream(id)

* id `Buffer`
* Return `Duplex` Multiplexed Duplex Stream

The id is sent down the wire to distinguish the stream on the other side. The smaller the id, the smaller the framing sent.