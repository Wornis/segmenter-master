const container = require('@google-cloud/container');

const client = new container.v1.ClusterManagerClient({});

const request = {
  projectId: 'ad4screen-us',
  zone: 'europe-west1-c',
  clusterId: 'backinapp',
  nodePoolId: 'high-cpu-pool',
  nodeCount: 0,
};

/**
 * GKE AutoScaler will wait 10 minutes after last task before downscale nodes.
 * Since we are using high resources VMS, we force the downscale after the end of last task.
 */

const resizeNodePool = async () => client
  .setNodePoolSize(request)
  .catch(async (e) => {
    if (e.code === 9) { // Means GKE autoscaler started to down or up scale few nodes
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await resizeNodePool();
    } else throw e;
  });

module.exports = { resizeNodePool };
