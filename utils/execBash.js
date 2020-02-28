module.exports = (script) =>
  new Promise((resolve, reject) =>
    require('child_process').exec(script, (error, stdout) => error ? reject(error) : resolve(stdout)));
