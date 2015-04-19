---
title: Music My Love, Music Macro Language
author: colin
date: 2015-04-18 21:00
template: article.jade
---

[MML][1] is a descriptive syntax for sequencing music. It can be played in the browser with WebAudio libraries (like the incredible [timbre.js][2]) making it attractive for writing chiptune-esque scores for unreleased indie games. However, writing and reading MML is an irksome, error prone task, especially when trying to work in tandem with another programming language.

## Is it really so bad?

Let's take a look at one of the examples from [timbre.js][6]. It is [a beautiful digital rendition][3] of Erik Satie's [*Gymnopédie No. 1*][4] from [*Gymopédies*][5].

```javascript
var mml0, mml1;
var env   = T("adsr", {d:3000, s:0, r:600});
var synth = T("SynthDef", {mul:0.45, poly:8});

synth.def = function(opts) {
  var op1 = T("sin", {freq:opts.freq*6, fb:0.25, mul:0.4});
  var op2 = T("sin", {freq:opts.freq, phase:op1, mul:opts.velocity/128});
  return env.clone().append(op2).on("ended", opts.doneAction).bang();
};

var master = synth;
var mod    = T("sin", {freq:2, add:3200, mul:800, kr:1});
master = T("eq", {params:{lf:[800, 0.5, -2], mf:[6400, 0.5, 4]}}, master);
master = T("phaser", {freq:mod, Q:2, steps:4}, master);
master = T("delay", {time:"BPM60 L16", fb:0.65, mix:0.25}, master);

mml0 = "t60 l4 v6 q2 o3";
mml0 += "[ [g < b0<d0f+2>> d <a0<c+0f+2>>]8 ";
mml0 += "f+ <a0<c+0f+2>>> b<<b0<d0f+2>> e<g0b2> e<b0<d0g2>> d<f0a0<d2>>";
mml0 += ">a<<a0<c0e2>> d<g0b0<e2>> d<d0g0b0<e2>> d<c0e0a0<d2>> d<c0f+0a0<d2>>";
mml0 += "d<a0<c0f2>> d<a0<c0e2>> d<d0g0b0<e2>> d<c0e0a0<d2>> d<c0f+0a0<d2>>";
mml0 += "| e<b0<e0g2>> f+<a0<c+0f+2>>> b<<b0<d0f+2>> e<<c+0e0a2>> e<a0<c+0f+0a2>>";
mml0 += "eb0<a0<d>e0b0<d0g>> a0<g2.> d0a0<d2.> ]";
mml0 += "e<b0<e0g2>> e<a0<d0f0a2>> e<a0<c0f2>> e<<c0e0a2>> e<a0<c0f0a2>>";
mml0 += "eb0<a0<d>e0b0<d0g>> a0<g2.> d0a0<d2.>";

mml1 = "t60 v14 l4 o6";
mml1 += "[ r2. r2. r2. r2.";
mml1 += "rf+a gf+c+ >b<c+d >a2. f+2.& f+2.& f+2.& f+2.< rf+a gf+c+ >b<c+d >a2.<";
mml1 += "c+2. f+2. >e2.&e2.&e2.";
mml1 += "ab<c ed>b< dc>b< d2.& d2d";
mml1 += "efg acd ed>b <d2.& d2d";
mml1 += "| g2. f+2.> bab< c+de c+de>";
mml1 += "f+2. c0e0a0<c2.> d0f+0a0<d2. ]";
mml1 += "g2. f2.> b<cf edc edc>";
mml1 += "f2. c0e0a0<c2.> d0f0a0<d2.";

T("mml", {mml:[mml0, mml1]}, synth).on("ended", function() {
  this.stop();
}).set({buddies:master}).start();
```

The musical output is sublime, but what is going on here? If we squint things start to look like [Brainfuck][7]. I'll be the first to admit that the deck is stacked. This is a loaded example as it leverages many of the fancy features from [timbre.js][6] that have nothing to do with MML. Let's make things a bit more fair, and focus on the the most important bit: the music.

```javascript
mml0 = "t60 l4 v6 q2 o3";
mml0 += "[ [g < b0<d0f+2>> d <a0<c+0f+2>>]8 ";
mml0 += "f+ <a0<c+0f+2>>> b<<b0<d0f+2>> e<g0b2> e<b0<d0g2>> d<f0a0<d2>>";
mml0 += ">a<<a0<c0e2>> d<g0b0<e2>> d<d0g0b0<e2>> d<c0e0a0<d2>> d<c0f+0a0<d2>>";
mml0 += "d<a0<c0f2>> d<a0<c0e2>> d<d0g0b0<e2>> d<c0e0a0<d2>> d<c0f+0a0<d2>>";
mml0 += "| e<b0<e0g2>> f+<a0<c+0f+2>>> b<<b0<d0f+2>> e<<c+0e0a2>> e<a0<c+0f+0a2>>";
mml0 += "eb0<a0<d>e0b0<d0g>> a0<g2.> d0a0<d2.> ]";
mml0 += "e<b0<e0g2>> e<a0<d0f0a2>> e<a0<c0f2>> e<<c0e0a2>> e<a0<c0f0a2>>";
mml0 += "eb0<a0<d>e0b0<d0g>> a0<g2.> d0a0<d2.>";

mml1 = "t60 v14 l4 o6";
mml1 += "[ r2. r2. r2. r2.";
mml1 += "rf+a gf+c+ >b<c+d >a2. f+2.& f+2.& f+2.& f+2.< rf+a gf+c+ >b<c+d >a2.<";
mml1 += "c+2. f+2. >e2.&e2.&e2.";
mml1 += "ab<c ed>b< dc>b< d2.& d2d";
mml1 += "efg acd ed>b <d2.& d2d";
mml1 += "| g2. f+2.> bab< c+de c+de>";
mml1 += "f+2. c0e0a0<c2.> d0f+0a0<d2. ]";
mml1 += "g2. f2.> b<cf edc edc>";
mml1 += "f2. c0e0a0<c2.> d0f0a0<d2.";
```

Even with blinders attached the world didn't get any less terrifying. It is hard to imagine that even an expert could understand what is being described here without serious concentration. Part of the problem is how much noise JavaScript is making (with string concatenation, and general syntax). It is important to recognize that there is absolutely nothing wrong with this code, or its author; however, we need to keep in mind that to the novice, even one familiar with music and common music notation, it is enough to make the eyes glaze over.

## We can do better

What if we could write these concepts (tempo, volume, instrument octave, notes, pitch, duration, and more) in code that will serialize to the appropriate MML representation? With the help of ClojureScript, and [this handy library][8], we can.

This portion of the hand written melody MML...

```mml
rf+a gf+c+ >b<c+d >a2.
```

...can be represented with our ClojureScript library as...

```clojure
(ns gymnopédie.core
  (:require mml.core :as mml))

(def melody
  (mml/mml
    (mml/tempo 60) (mml/volume 14) (mml/octave 6)
    (mml/measure (mml/rest) (mml/sharp :f) :a)
    (mml/measure :g (mml/sharp :f) (mml/sharp :c))
    (mml/measure (mml/desc :b) (mml/asc (mml/sharp :c)) :d)
    (mml/measure (mml/duration 3 (mml/desc :a)))))
```

**NOTE**: It is important to understand that the `measure` function is for convenience and semantics. The following definition is equivalent to the previous.

```clojure
(def melody
  (mml/mml
    (mml/tempo 60) (mml/volume 14) (mml/octave 6)
    (mml/rest) (mml/sharp :f) :a
    :g (mml/sharp :f) (mml/sharp :c)
    (mml/desc :b) (mml/asc (mml/sharp :c)) :d
    (mml/duration 3 (mml/desc :a))))
```

...which would serialize as...

```clojure
(println melody) ; t60 v14 o6 r f+ a g f+ c+ >b <c+ d >a3
```

The inevitable question after seeing a 22 character string of MML turned into a variable definition spanning seven lines of ClojureScript is likely: what was the point of this exercise? What did we gain? How did this library help **me**?

Well, we've successfully hidden the symbols behind more human friendly equivalents, and though we may have to write more characters we can focus on music concepts rather than additional syntax. But perhaps the most compelling reason to use this abstraction is the ability to share, and compose blocks of MML. What does this mean, exactly?

If you were looking closely at the MML, or are familiar with [the sheet music][9], you know that our melody repeats. We can do some very slight refactoring to leverage our new found power bestowed upon us by the alien technology.

We can turn this big long thing (with duplicate phrasing mind you)...

```mml
rf+a gf+c+ >b<c+d >a2. f+2.& f+2.& f+2.& f+2.< rf+a gf+c+ >b<c+d >a2.
```

..into this refactored ClojureScript...

```clojure
(ns gymnopédie.core
  (:require mml.core :as mml))

(def melody
  (mml/mml
    (mml/measure (mml/rest) (mml/sharp :f) :a)
    (mml/measure :g (mml/sharp :f) (mml/sharp :c))
    (mml/measure (mml/desc :b) (mml/asc (mml/sharp :c)) :d)
    (mml/measure (mml/duration 3 (mml/desc :a)))))

(def gymnopédie
  (mml/mml
    (mml/tempo 60) (mml/volume 14) (mml/octave 6)
    melody
    (apply mml/mml
      (for [m (range 4)]
        (mml/measure (mml/duration 3 (mml/sharp :f)))))
    (mml/asc melody)))
```

...which now serializes as...

```clojure
(println gymnopédie)
; NOTE: line breaks added for clarity
; t60 v14 o6
; r f+ a g f+ c+ >b <c+ d >a3
; f+3 f+3 f+3 f+3
; <r f+ a g f+ c+ >b <c+ d >a3
```

Maybe it is not the greatest example, but hopefully you get the picture! [Download the library from Clojars][10] to start making music of your own in ClojureScript.

[1]: http://en.wikipedia.org/wiki/Music_Macro_Language
[2]: http://mohayonao.github.io/timbre.js/mml.html
[3]: http://mohayonao.github.io/timbre.js/satie.html
[4]: https://www.youtube.com/watch?v=S-Xm7s9eGxU
[5]: http://en.wikipedia.org/wiki/Gymnop%C3%A9dies
[6]: http://mohayonao.github.io/timbre.js
[7]: http://en.wikipedia.org/wiki/Brainfuck
[8]: https://github.com/birdduck/mml
[9]: http://www.music-scores.com/graphics/sa_gy_1_pi.gif
[10]: https://clojars.org/com.birdduck/mml

[air]: https://c2.staticflickr.com/2/1356/5105216574_2c42ef0488.jpg
