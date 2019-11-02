## distributed lur caching

#### Supported Feaures

1. distributed cache
2. real-time read/write
4. cache expires

![system design diagram](https://lh3.googleusercontent.com/_OGkY8qcCa1lcO6QGz4m8WEEzwHu9FdQEpH1UR3IiiZgJnHJH4Q9W3_Fgt3tIY9Oh3x9BnCwxowNL0BVPKW7DaNRvEg62g8DpOetfYB1SmBm7Ds0d1nH8ndJc6udJBKV6AlxUigXTuO9UHyaeSiviiiu8Va0Aouir4dOg1Pk7Hxdpsa08HLVMyct3JrOl0QyKgKWoTzg7oOJ-P4X0fsvrhuxsraEnPbHcWQWooICK9ELWmSjfRjUiKm8nOe4mG6uwwntAJJ14eGILEbdp8XLJYA-K49JiPCemXfyeyB9x-bqyMNAYawR425021HnNd1pffTkpxlvs2kmaPefBv2WVghQCYddHdYl_pyKI6pDWy6OWh6PhpcNTywz20zi_Q1J1JeLDSYYWCFTsxxOyT2wh9v0kLX7t9b3fmHwPWhsQmcukG27YUzbr4YjJy0gmm_q7z4tS4N-8rWDwF8KLjMj1WPvdKcG1L0je54vaNxd24xQoUGFvRGvwbbHw4RJ5FGqIlCqFbIHks1DmTw2fxtxxvt7HXh-nIWs9AKzI4keegbVZS3mw0BRKuTeJn2QelOEEuojWwzkgC8djoxzzE58KgINPkzZp3zw71G_YGz9mjkV28hWtHYV5PM=s957-w957-h801-no)
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
