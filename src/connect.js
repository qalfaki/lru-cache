const AMQP = require('amqplib/callback_api');
const QUEUE = 'lur-cache';
const BROKER_URL = process.env.BROKER_URL;

const connect = (URL=BROKER_URL, cb) => {
  return new Promise((resolve, reject) => {
    AMQP.connect(URL, function(err, connection) {
      if (err)
        return reject(err);

      connection.createChannel(function(err, channel) {
        if (err) {
          return reject(err)
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
  });
};

module.exports = connect
