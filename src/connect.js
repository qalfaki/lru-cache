const AMQP = require('amqplib/callback_api');
const BROKER_URL = "amqp://quest:quest@localhost//5672"
const QUEUE = 'lur-cache';

const connect = (cb) => {
  return new Promise((resolve, reject) => {
    AMQP.connect(process.env.BROKER_URL, function(error0, connection) {
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
          noAck: true
        });
        // publisher class will use this to send messages
        resolve({channel, QUEUE})
      });
    });
  }).catch(err=>console.log(err));
};

module.exports = connect
