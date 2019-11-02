/*
 helper class that will manage cache state
   - commuincation between nodes when a cache changes
   - listen to change events and delegate to Cache class to update in-memory cache
*/
const connect = require('./connect.js');

class CacheManger {

  constructor(URL) {
      this.startConnection(URL, this.recieve.bind(this))
  }
  startConnection(URL, cb) {
    console.log('connecting...')
    return new Promise((resolve, reject)=>{
      connect(URL, cb).then(data=>{
        this.channel = data.channel;
        this.queue = data.QUEUE;
        resolve({c: this.channel, q: this.QUEUE})
      })
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
        d.channel.sendToQueue(d.queue, Buffer.from(msg));
        console.log(" [x] Sent %s", msg);
      });
    }
  }
  recieve(msg) {
    msg = JSON.parse(msg.content.toString())
    let action = msg.action;
    let data = msg.data;
    this[action](data.key, data.value);
  }
}

module.exports = CacheManger
