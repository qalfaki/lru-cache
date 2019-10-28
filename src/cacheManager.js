/*
 helper class that will manage cache state
   - commuincation between nodes when a cache changes
   - listen to change events and delegate to Cache class to update in-memory cache
*/

const connect = require('./connect.js');
const QUEUE = 'lur-cache';

class CacheManger {

  constructor(url) {
    connect(url, this.recieve).then(data=>{
      this.channel = data.channel;
    });
  }
  reconnect() {
    console.log('reconnecting...')
    return new Promise((resolve, reject)=>{
      connect().then(data=>{
        this.channel = data.channel;
        resolve()
      });
    })
  }
  publish(msg) {
    // send message to queue
    msg = JSON.stringify(msg);
    if (!this.channel) {
      return reconnect().then(()=>{
        this.channel.sendToQueue(QUEUE, Buffer.from(msg));
        console.log(" [x] Sent %s", msg);
      });
    }
    this.channel.sendToQueue(QUEUE, Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
  }
  recieve(data) {
    console.log('the data ', data.content.toString())
  }
}

module.exports = CacheManger
