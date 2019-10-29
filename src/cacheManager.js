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
        resolve()
      });
    })
  }
  publish(msg) {
    // send message to queue
    msg = JSON.stringify(msg);
    if (!this.channel) {
      return startConnection(this.url).then(()=>{
        this.channel.sendToQueue(this.queue, Buffer.from(msg));
        console.log(" [x] Sent %s", msg);
      });
    }
    this.channel.sendToQueue(this.queue, Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
  }
  recieve(data) {
    console.log('the data ', data.content.toString())
  }
}

module.exports = CacheManger
