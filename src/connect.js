const AMQP = require('amqplib');
const QUEUE = 'lur-cache';


const connect = (URL, handleMessage) => (new Promise((resolve, reject)=>{
  AMQP.connect(URL).then(function(conn) {
    conn.createChannel().then(c=>{
      c.assertQueue(QUEUE, {
        durable: false
      });
      c.consume(QUEUE, handleMessage, {
        noLocal: true
      })
      // channel & queue needed for publishing changes
      resolve({channel: c, queue: QUEUE});
    }).catch(err=> {
      reject(err)
      throw `could not create channel.\n ${err}`
    });
  }).catch(err=> {
    reject(err);
    throw `could not connect to rabbitmq!.\n check broker URL and make sure the server is running \n ${err}`
  })
}));

module.exports = connect
