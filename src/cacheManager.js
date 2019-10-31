/*
 helper class that will manage cache state
   - commuincation between nodes when a cache changes
   - listen to change events and delegate to Cache class to update in-memory cache
*/
const connect = require('./connect.js');
const uuidv4 = require('uuid/v4');
const PUBID = uuidv4();

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
      }).catch(err=>{
          throw `could not connect to rabbitmq!.\n check broker URL and make sure the server is running \n ${err}`
      });
    })
  }
  publish(msg) {
    // send message to queue
    msg = JSON.stringify(Object.assign(msg, {id: PUBID}));
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
    msg = JSON.parse(msg.content.toString())
    let action = msg.action;
    let data = msg.data;

    // prevent updating cache with own messages
    if (msg.id !== PUBID) {
        this[action](data.key, data.value);
    }
  }
}

module.exports = CacheManger
