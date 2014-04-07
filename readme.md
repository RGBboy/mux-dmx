# MUX DMX

Multiple Duplex Streams across a single Duplex Stream.

[![Browser Support](https://ci.testling.com/rgbboy/mux-dmx.png)
](https://ci.testling.com/RGBboy/mux-dmx)

[![Build Status](https://secure.travis-ci.org/RGBboy/mux-dmx.png)](http://travis-ci.org/RGBboy/mux-dmx)

# API

``` javascript

  var client1 = MuxDmx(),
      client2 = MuxDmx(),
      stream1 = client1.stream(new Buffer([0])),
      stream2 = client2.stream(new Buffer([0])),

  client1.pipe(client2).pipe(client1);

  stream1.on('data', function (data) {
    console.log(data.toString('utf-8')); // Boop
  });

  stream2.on('data', function (data) {
    console.log(data.toString('utf-8')); // Beep
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