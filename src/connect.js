const AMQP = require('amqplib/callback_api');
const QUEUE = 'lur-cache';
const BROKER_URL = process.env.BROKER_URL;

const connect = (URL=BROKER_URL, cb) => {
  return new Promise((resolve, reject) => {
    AMQP.connect(URL, function(error0, connection) {
      if (error0) {
        reject(error0)
        throw error0;
      }
      connection.createChannel(function(error1, channel) {
        if (error1) {
          reject(error1)
          throw error1;
        }
        channel.assertQueue(QUEUE, {
          durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", QUEUE);

        channel.consume(QUEUE, function(msg) {
          console.log(" [x] Received %s", msg.content.toString());
          // consume queue
          cb(msg)
        }, {
          noAck: true,
        });
        // CacheManger will use this to send messages
        resolve({channel, QUEUE})
      });
    });
  }).catch(err=>console.log(err));
};

module.exports = connect
