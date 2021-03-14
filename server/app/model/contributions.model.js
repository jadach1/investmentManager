module.exports = (sequelize, Sequelize) => {
	const contributions = sequelize.define('contributions', {
	  ownerid: {
		    type: Sequelize.INTEGER
	  },
	  amount: {
		  type: Sequelize.DECIMAL(12,2)
      },
      transaction: {
          type: Sequelize.BOOLEAN
	  },
      date: {
        type: Sequelize.DATEONLY
      }
    });
	
	return contributions;
}