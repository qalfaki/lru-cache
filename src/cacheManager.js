/*
 helper class that will manage cache state
   - commuincation between nodes when a cache changes
   - listen to change events and delegate to Cache class to update in-memory cache
*/
let c = 1;
const connect = require('./connect.js');

class CacheManger {

  constructor(url) {
      this.url = url;
      this.startConnection(url, this.recieve.bind(this))
  }
  startConnection(url, cb) {
    console.log('connecting...')
    return new Promise((resolve, reject)=>{
      connect(url, cb).then(data=>{
        this.channel = data.channel;
        this.queue = data.QUEUE;
        resolve({c: this.channel, q:this.QUEUE})
      });
    })
  }
  publish(msg) {
    // send message to queue
    msg = JSON.stringify(msg);
    try {
      this.channel.sendToQueue(this.queue, Buffer.from(msg));
    }
    catch (err) {
      this.startConnection(this.url, this.recieve.bind(this)).then(d=>{
        d.c.sendToQueue(d.q, Buffer.from(msg));
        console.log(" [x] Sent %s", msg);
      });
    }
  }
  recieve(msg) {
    console.log('this. channel ', this.channel);
    msg = JSON.parse(msg.content.toString())
    let action = msg.action;
    let data = msg.data;
    console.log('the counter ', c)
    if (c !== 4) {
      c ++
      this[action](data.key, data.value, data.maxAge);
    }
  }
}

module.exports = CacheManger
