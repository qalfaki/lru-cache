## distributed lur caching

#### Supported Feaures

1. distributed cache
2. real-time read/write
4. cache expires

![alt
text](https://lh3.googleusercontent.com/86PIBMg1vBtW5o06hXV3YD4i65Z54x0YxdVJO7cCf0IqJw8sTo60SKv6Jr-Epv7gOqAxkTFCBw8CUPVteiQA-6it7ueCGssgNzNadzEhxGv_2btlV-28omnXEVuAMRBfv4MMgzjpkLvRiHndxYtbENfBqEXDsgHscUJv973CC4gouQBwudjwFl18DkPHBu5nRvxg4Ky3TiQisn1Qz71B-38TDyCLyGj3Bu1CFZnMvvqiZGgjMu-P8nZP0rHlqp0trhiHrefTuUvlzy2sVdgMDDCsJzKzJzzhjq-R9J7kR2mj7MD9uvXwKKJ0pTwtK-cU12u_Q-fomEJU68gTbXVEx-VMbhBxZkSEFmqfR2sJfduhYoAhKuJv26DvIbZbGWUqbDzOU03BTjldkHuuXe29MAk2r6wLo_nMXfBUCvn5FVggmjjDNxl4y76aW6XCnYwp5vIZAcLBbgNYVELYU9YK6JoPlZf0oWAbW7mKQLWLDrdM3c8roNXI8FTXfxYwMXB5dlK1yS5Ra4r5yo2Mok0_QqN31YWYbb6lgIIMnaKSQdPwJPru1vS6b7veGAwU5kmO33GLsLIPOJDTCsUu90FqiCiG9kPxCG1fu4SlDSV_ghwC8r020LRZr3Ydo51EFDqXW18JtcxGLEWdj_ODsF9xzRSkpahlcBIFntPTuvHYTltZvrzWwBKJTg=w957-h801-no)
### Project Status

#### Experimental!
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
