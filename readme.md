# MUX DMX

Multiple Duplex Streams across a single Duplex Stream.

[![Browser Support](https://ci.testling.com/rgbboy/mux-dmx.png)
](https://ci.testling.com/RGBboy/mux-dmx)

[![Build Status](https://secure.travis-ci.org/RGBboy/mux-dmx.png)](http://travis-ci.org/RGBboy/mux-dmx)

# API

``` javascript

  var client1 = MuxDmx(),
      client2 = MuxDmx(),
      stream1 = client1.createDuplexStream(new Buffer([0])),
      stream2 = client2.createDuplexStream(new Buffer([0])),

  client1.pipe(client2).pipe(client1);

  stream1.on('data', function (data) {
    console.log(data.toString('utf8')); // Pong
  });

  stream2.on('data', function (data) {
    console.log(data.toString('utf8')); // Ping
  });

  stream1.write(new Buffer('Ping'));
  stream2.write(new Buffer('Pong'));

```

## MuxDmx()

* Return `Duplex` MuxDmx Stream

## instance.createReadStream(id)

* id `Buffer`
* Return `Readable Stream` Multiplexed Read Stream

The id is received by the instance to distinguish the stream to push data to. The smaller the id, the smaller the framing sent.

## instance.createWriteStream(id)

* id `Buffer`
* Return `Writable Stream` Multiplexed Writable Stream

The id is sent down the wire to distinguish the stream on the other side. The smaller the id, the smaller the framing sent.

## instance.createDuplexStream(id)

* id `Buffer`
* Return `Duplex` Multiplexed Duplex Stream

# Errors

`instance` will emit errors when it receives data that either has no defined stream or the stream with the id is only writable. This can be used as a security measure to close connections that are receiving unwanted data.

# License 

(The MIT License)

Copyright (c) 2014 RGBboy &lt;l-_-l@rgbboy.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.