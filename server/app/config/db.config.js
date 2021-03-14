const env = require('./env.js');
 
const Sequelize = require('sequelize');
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorsAliases: false,
 
  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  }
});

const db = {};
 
db.Sequelize = Sequelize;
db.sequelize = sequelize;
 
//Models/tables
db.assets                 = require('../model/asset.model.js')(sequelize, Sequelize);
db.transactions           = require('../model/transactions.model.js')(sequelize, Sequelize);
db.archivedtransactions   = require('../model/archivedTransactions.model.js')(sequelize, Sequelize);
db.contributions          = require('../model/contributions.model.js')(sequelize, Sequelize);
db.owners                 = require('../model/owners.model.js')(sequelize, Sequelize);

module.exports = db;


