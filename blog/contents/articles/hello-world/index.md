---
title: Hello World
author: colin
date: 2013-07-24 11:15
template: article.jade
---

```clojure
(defn hello-world! [] (print "hello world"))
```

## Wisp is a wonderful, interesting thing

[Wisp][1] is yet another language that transpiles to JavaScript, but with a very
noble goal of providing a native subset of [Clojure][2] and [Clojurescript][3].
Achieving this mission should provide portability between the two 
(and JavaScript when compiled). This is *fantastic*.

In the quest to learn functional programming without the overhead of an invasive
Java installation or worrying about [leiningen][4], Wisp, which you
[really must try][5], was a bright light in an otherwise stark darkness.
During our stay here it would be nice to [help the burgeoning language out][6] too.

Parsing arguments on the command line is not a traditionally fun, rewarding
exercise. Luckily there are several viable open source implementations that can
serve as inspiration. Given the general success of [CoffeeScript][7], an answer
to [Ruby][8], it seems a natural place to start.

Take [this innocuous helper function][9] defined in `optparse.coffee` for instance...

```coffeescript
buildRules = (rules) ->
  for tuple in rules
    tuple.unshift null if tuple.length < 3
    buildRule tuple...
```
The first step to approximating this function is defining its analogue in Wisp.

```clojure
(defn build-rules
  [rules])
```

At first glance you might notice the difference in the names of the functions.
When this Wisp code is transpiled the function will be translated into a
[camel cased][10] version.

```javascript
var buildRules = function buildRules(rules) {
  return void(0);
};
```

This is [one of the many clever features][11] of the Wisp language coming 
to the rescue!

To continue the exercise of approximation a key insight can be gleaned in the
original. Rather than simply iterating over the arrays in `rules` we can instead
use the `map` function with the preexisting function, defined somewhere deep in
the innermost recesses of `optparse.coffee`, called `buildRule`.

```clojure
(defn build-rules
  [rules]
  (map build-rule rules))
```

Simple as that, right? Not quite. Every good translation should maintain fidelity
with the source material, and therefore we have no choice but to incorporate
the conditional prepend of `null` to the rule when the `length` is less than three.
Luckily we can define a function inline just like JavaScript.

```clojure
(defn build-rules
  [rules]
  (map
    (fn
      [rule]
      (build-rule 
        (if (< (count rule) 3)
          (concat nil rule)
          rule)))
    rules))
```

That wasn't so hard, was it? There are a few differences in implementation that
are obvious. Rather than `null` there is `nil`. A key difference between the two
is that in the transpiled code `nil` will actually become `void(0)`, or
`undefined` as it is more commonly known. Rather than use native properties or
functions to retrieve the `length` and prepend an item there is `count` and
`concat`. These functions are imported from the `wisp.sequence` namespace.

```clojure
(ns wisp.optparse
  "Wisp command line parsing"
  (:require [wisp.sequence :refer [count concat map]]))
```
One more thing: this function isn't quite right. The CoffeeScript literate
already know what is missing, but for those learning as we go it comes down to
the ellipsis trailing that woeful `tuple`. A clue lurks in [the definition][12] of
`buildRule`.

```coffeescript
buildRule = (shortFlag, longFlag, description, options = {}) ->
  match     = longFlag.match(OPTIONAL)
  longFlag  = longFlag.match(LONG_FLAG)[1]
  {
    name:         longFlag.substr 2
    shortFlag:    shortFlag
    longFlag:     longFlag
    description:  description
    hasArgument:  !!(match and match[1])
    isList:       !!(match and match[2])
  }
```

Do you see it? That's absolutely right. This function takes several arguments and
not a single array! This means that rather than using `rule` or `tuple` as the
sole argument that the items that comprise them should be used instead. What this
really means is that our [ol' friend][13] `apply` is at it again. Fret not, for
Wisp has an answer.

```clojure
(defn build-rules
  [rules]
  (map
    (fn
      [rule] 
      (apply build-rule 
        (if (< (count rule) 3)
          (concat nil rule) 
          rule)))
    rules))
```

Perfect. Out of curiosity, edification let's compare the results of transpiling
each of these functions from their respective language.

The result of compiling the CoffeeScript version:

```javascript
var buildRules;

buildRules = function(rules) {
  var tuple, _i, _len, _results;
  _results = [];
  for (_i = 0, _len = rules.length; _i < _len; _i++) {
    tuple = rules[_i];
    if (tuple.length < 3) {
      tuple.unshift(null);
    }
    _results.push(buildRule.apply(null, tuple));
  }
  return _results;
};x
```

The result of compiling the Wisp version:

```javascript
var buildRules = function buildRules(rules) {
  return map(function(rule) {
    return buildRule.apply(buildRule, count(rule) < 3 ?
      concat(void(0), rule) :
      rule);
  }, rules);
};
```

Okay, this may not be comparing apples to apples, as the functions `count`, `concat`,
and `map` that were imported from `wisp.sequence` are not included, but it is short
and it is sweet (much like an orange). 

There is much more to learn as we wander deeper into the woods of Wisp...

[1]: https://github.com/Gozala/wisp
[2]: http://clojure.org/
[3]: https://github.com/clojure/clojurescript
[4]: https://github.com/technomancy/leiningen
[5]: http://jeditoolkit.com/try-wisp/
[6]: https://github.com/Gozala/wisp/issues/19
[7]: http://coffeescript.org/
[8]: http://www.ruby-lang.org/
[9]: http://coffeescript.org/documentation/docs/optparse.html#section-10
[10]: http://c2.com/cgi/wiki?CamelCase
[11]: https://github.com/Gozala/wisp#conventions
[12]: http://coffeescript.org/documentation/docs/optparse.html#section-11
[13]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
