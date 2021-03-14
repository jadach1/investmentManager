const db = require('../config/db.config.js');
const CurrentAsset = db.assets;
const owners       = db.owners;

// FETCH All Transactions
exports.check = (req, res) => {
    const table  = req.params.table;
    const column = req.params.column;
    const value  = req.params.value;
	db.sequelize
		.query('select count(*) from ' + table + ' where ' + column + '=\''+value+'\';')
		.then(Asset => {
            console.log("hello")
            console.log(Asset)
			// Send All CurrentAssets to Client
            res.json(Asset[0]);
            
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};