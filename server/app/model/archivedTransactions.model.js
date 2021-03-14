module.exports = (sequelize, Sequelize) => {
	const archivedTransactions = sequelize.define('archivedtransactions', {
	  archivedsymbolid: {
        type: Sequelize.INTEGER
	  },
	  transactionid: {
        type: Sequelize.INTEGER,
        unique: true
      }
    });
	
	return archivedTransactions;
}