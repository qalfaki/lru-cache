## distributed lur caching

#### supports
1. distributed cache
2. real-time read/write
4. cache expires

#### usage

```
const Cache = require('disributed-lru-cache');

let cache = new Cache(); // cache instance

//sets a value in cache with 'a' as key and 1 as value
cache.set('a', 1);
cache.set('b', 2);
cache.set('c', 3);

/*
  [ { key: 'a', value: 1 },
    { key: 'b', value: 2 },
    { key: 'c', value: 3 } ]
*/

cache.get('c') //returns 3 and makes it most recently used
/*
[ { key: 'c', value: 3 },
[ { key: 'a', value: 1 },
  { key: 'b', value: 2 } ]
*/

cache.peek('a') //returns 10 but doesnt resets the order

/*
[ { key: 'c', value: 3 },
  { key: 'a', value: 1 },
  { key: 'b', value: 2 } ]
*/

let cache = new Cache(10);
//Initialize Cache with that expires in 10ms
const sleep = ms => new Promise(r=> setTimeout(r, ms));
cache.set('a', 7); //valid for 10ms
cache.get('a'); //returns 7 and resets 10ms counter
await sleep(15);
cache.get('a'); //null
cache.set('b', 5, 30);
//overwrites cache's default
expiry of 10ms and uses 30ms
await sleep(15);
cache.get('b'); //returns 5 and
resets the expiry of b back to 30ms
await sleep(35);
cache.get('b'); //null
```
