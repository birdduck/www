---
title: Random Avatars, Approximately
author: colin
date: 2014-09-30 11:15
template: article.jade
---

We had a problem while working on [World of Monsters][1]: how can aesthetic
traits be randomized predictably in a fashion that can be easily reproduced?
The long term goal is to use inheritable genes, but to bring monsters
temporarily to life we needed...*something*.

## Eureka, something like noise functions and avatars!

This problem [has been solved before][2], and probably better, but this is what we
ended up with. Sometimes being deficient in mathematics can make the adventure
that is software development more fun, albeit woefully inefficient.

First, we need a deterministic seed. Luckily for us, each monster has a name and
an identifier. We know that each character in the name of a monster can be
[represented with a decimal in ASCII][3]. Perfect.

```javascript
function getMonsterSeed(monster) {
  // default seed to the monster id, giving it
  // some uniqueness
  var seed = monster.id;
  // grab the monster name, as it is more flavor
  var name = monster.name

  // iterate over each character in the name, adding
  // its value to our seed
  for(var i = 0, l = name.length; i < l; i++) {
    seed += name.charCodeAt(i);
  }

  return seed;
}
```

Now that we have a deterministic seed from a monster, we can use this value to
generate psuedo-random numbers, which become useful with the help of this simple
method (which is based on [an implementation here][4]).

```javascript
function getRandomInt(min, max, seed) {
  // if a seed is specified use it, otherwise create one
  seed = seed || Math.random();
  // generate a random integer within the specified range
  return Math.floor(seed * (max - min)) + min;
}
```

Great. So we have our seed, and we have a method to generate random integers
within a range. How can we use this to get monster traits? Well, that's simple.
We need to generate trait seeds from our base seed.
Let's see what that might look like for eye color.


```javascript
function getMonsterEyeColorSeed(monster) {
  // start with the base monster seed (an integer)
  var eyeColorSeed = getMonsterSeed(monster);

  // boil down our seed by some fraction until it is a decimal
  // it is important that all methods generating a sub-seed do
  // so in a fashion that does not collide with others
  while (eyeColorSeed > 1) {
    eyeColorSeed /= 3;
  }

  return eyeColorSeed;
}
```

OK. Now we have an eye color seed that is a decimal, in addition to having a
base seed integer. What are we going to do with our trait seed that will suddenly
turn into something expressive, that we can, like, see? Remember our random range
method, and the optional seed parameter? Well...this might be easier done than said.

```javascript
function getMonsterEyeColor(monster) {
  // here are the available eye colors
  var eyeColors = [
    '334F53',
    'C8C9C9',
    '574840',
    '5F6401',
    'C5DAED'
  ];

  // let's get the eye color seed for this monster
  var eyeColorSeed = getMonsterEyeColorSeed(monster);

  // ah ha! now we use the eye color seed to grab a color
  // out of our array
  var eyeColorIndex = getRandomInt(1, eyeColors.length,
    eyeColorSeed) - 1;

  return '#' + eyeColors[eyeColorIndex];
}
```

With everything we built above, we now have a method for getting a monster's eye
color that is somewhat random. Random enough, anyway. Never mind that our model
breaks down when a monster legally changes their name, or that the distribution
of traits is by no means sound (maybe this is okay, it is a lot closer to how
genes actually work). You'll need to suspend your disbelief with respect to
collisions (they are **totally possible**) between monster seeds. The worst
that can happen is two monsters without a common lineage accidentally share the
exact same genetic material. It's good enough, for now, and maybe it is good
enough for you.

Let's see the entire thing, shall we.

```javascript
function getRandomInt(min, max, seed) {
  // if a seed is specified use it, otherwise create one
  seed = seed || Math.random();
  // generate a random integer within the specified range
  return Math.floor(seed * (max - min)) + min;
}

function getMonsterSeed(monster) {
  // default seed to the monster id, giving it
  // some uniqueness
  var seed = monster.id;
  // grab the monster name, as it is more flavor
  var name = monster.name

  // iterate over each character in the name, adding
  // its value to our seed
  for(var i = 0, l = name.length; i < l; i++) {
    seed += name.charCodeAt(i);
  }

  return seed;
}

function getMonsterEyeColorSeed(monster) {
  // start with the base monster seed (an integer)
  var eyeColorSeed = getMonsterSeed(monster);

  // boil down our seed by some fraction until it is a decimal
  // it is important that all methods generating a sub-seed do
  // so in a fashion that does not collide with others
  while (eyeColorSeed > 1) {
    eyeColorSeed /= 3;
  }

  return eyeColorSeed;
}

function getMonsterEyeColor(monster) {
  // here are the available eye colors
  var eyeColors = [
    '334F53',
    'C8C9C9',
    '574840',
    '5F6401',
    'C5DAED'
  ];

  // let's get the eye color seed for this monster
  var eyeColorSeed = getMonsterEyeColorSeed(monster);

  // ah ha! now we use the eye color seed to grab a color
  // out of our array
  var eyeColorIndex = getRandomInt(1, eyeColors.length,
    eyeColorSeed) - 1;

  // pound it out
  return '#' + eyeColors[eyeColorIndex];
}
```

And how might we use this?

```javascript
// what a vile creature that Kevin is...
var monster = { id: 1, name: 'Kevin' };
var monsterEyeColor = getMonsterEyeColor(monster);
console.log(monsterEyeColor); // #574840
```

Proof that it is psuedo-random, dynamic?

```javascript
// STELLLLLLAAAAAAAAAAAAAAAAAAAAAAAAA...
var monster = { id: 2, name: 'Stella' };
var monsterEyeColor = getMonsterEyeColor(monster);
console.log(monsterEyeColor); // #5F6401
```

This is how [World of Monsters][1] at present generates [random monster renderings][5]
that never differ, and are always the same for each monster. The body, and eye color
are driven by the technique laid out above. We might use this approach to determine
if monsters have horns and how many of them, whether they have hair and what color,
and perhaps even subtle information about appendages (flippers, tentacles,
arms, etc.). Who knows!

[1]: http://monsters.io
[2]: http://blog.gravatar.com/2008/04/22/identicons-monsterids-and-wavatars-oh-my/
[3]: http://www.asciitable.com/
[4]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
[5]: https://dl.dropboxusercontent.com/u/37456399/monster.png
