const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub();

const topicId = 'send_to_jobs_manager';
const topic = pubsub.topic(topicId);

/**
 * Send a message to the jobs manager
 * @param message - message to send to pubsub
 * @param {Object} attributes - Attributes of the message
 * @param {String} attributes.jobName - Job to launch
 */
const sendToJobsManager = async (message, attributes) => {
  if (!message || !attributes) throw new Error('Missing message or attributes');
  const buff = Buffer.from(JSON.stringify(message));
  return topic.publish(buff, attributes);
};
module.exports = { sendToJobsManager };
