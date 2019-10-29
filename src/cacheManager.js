/*
 helper class that will manage cache state
   - commuincation between nodes when a cache changes
   - listen to change events and delegate to Cache class to update in-memory cache
*/

const connect = require('./connect.js');

class CacheManger {

  constructor(url) {
      this.url = url;
      this.startConnection(url, this.recieve)
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
      this.startConnection(this.url, this.recieve).then(d=>{
        d.c.sendToQueue(d.q, Buffer.from(msg));
        console.log(" [x] Sent %s", msg);
      });
    }
    console.log(" [x] Sent %s", msg);
  }
  recieve(data) {
    console.log('the data ', data.content.toString())
  }
}

module.exports = CacheManger
