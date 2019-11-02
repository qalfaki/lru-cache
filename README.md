## distributed lur caching

#### Supported Feaures

1. distributed cache
2. real-time read/write
4. cache expires

![Geo-distributed-lru-cache-1.png](https://i.postimg.cc/X7sn8nmw/Geo-distributed-lru-cache-1.png)
### Project Status

##### beta!
* PRs and Ideas are highly welcomed!

#### usage

```
const Cache = require('disributed-lru-cache');

//distributed lru cache uses rabbitmq for sync cache across  different instances

let cache = new Cache(brokerURL); // cache instance

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

cache.peek('a') //returns 1 but doesnt resets the order

/*
[ { key: 'c', value: 3 },
  { key: 'a', value: 1 },
  { key: 'b', value: 2 } ]
*/

//Initialize Cache that expires in 3 hours

let cache = new Cache(brokerURL, 3);
```
### API
##### cache(brokerURL, expireIn[hours])

`brokerURL`

Type: 'string'

rabbitmq broker url

`expireIn`

Type: `number`

default: `Infinity`
