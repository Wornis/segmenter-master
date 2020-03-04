const mysql = require('mysql');

module.exports = {
  init: async () => {
    const mysqlConfig = require('./constants').config.mysql[process.env.NODE_ENV];
    const self = module.exports;
    self.poolCluster = mysql.createPoolCluster({ restoreNodeTimeout: 10 });
    await Promise.all(
      Object.entries(mysqlConfig).map(([instance, data]) => new Promise(
        (resolve, reject) => {
          const conf = {
            connectionLimit: 10,
            user: data.username,
            password: data.password,
            database: data.database,
          };
          if (data.host) conf.host = data.host;
          else conf.socketPath = data.socketPath;
          self.poolCluster.add(instance, conf);
          self.poolCluster.getConnection(instance, (err) => (err ? reject(err) : resolve()));
        },
      )),
    );

    /**
     * MySQL query promisified.
     *
     * @param {object || string} params - If params is a string, it's only the MySQL query.
     * @param {string} [params.instance] - MySQL instance name. Default is "mtb"
     * @param {string} params.sql - MySQL query.
     * @param {string || array} [params.args] - MySQL query arguments escaped.
     */
    self.pQuery = (params) => new Promise((resolve, reject) => {
      const instance = (params.instance) ? params.instance : 'mtb';
      const sql = (params.sql) ? params.sql : params;
      const args = ((Array.isArray(params.args) && params.args.length > 0) || params.args)
        ? params.args
        : null;
      self.poolCluster.getConnection(instance, (err, connection) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        return connection.query(sql, args, (error, data) => {
          connection.release();
          if (error) return reject(error);
          return resolve(data);
        });
      });
    });

    /**
     * MySQL update query.
     *
     * @param {string} params.table - MySQL table name.
     * @param {object} params.argsObj - MySQL query arguments escaped.
     * @param {object} params.whereObj - MySQL query condition arguments escaped.
     * @param {string} params.instance - MySQL instance name.
     */
    self.update = ({
      table, argsObj, whereObj, instance,
    }) => new Promise((resolve, reject) => {
      let sql = `update ${table} set `;
      const argsKeys = Object.keys(argsObj);
      const args = argsKeys.map((key) => {
        sql += ` ${key} = ?,`;
        return argsObj[key];
      });

      sql = sql.slice(0, -1);
      sql += ' where ';
      const whereKeys = Object.keys(whereObj);
      const where = whereKeys.map((key) => {
        sql += ` ${key} = ?,`;
        return whereObj[key];
      });
      sql = sql.slice(0, -1);

      const finalArgs = [].concat(args).concat(where);

      const connInstance = instance || 'master-bia';
      self.poolCluster.getConnection(connInstance, (err, connection) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        return connection.query(sql, finalArgs, (error, data) => {
          connection.release();
          if (err) return reject(err);
          return resolve(data);
        });
      });
    });
  },

};
