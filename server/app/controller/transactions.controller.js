const db = require('../config/db.config.js');
const TransactionObject = db.transactions;
const archivedTrans = db.archivedtransactions;

// Post a TransactionObject
exports.create = (req, res) => {	
	// Save to PostgreSQL database
	TransactionObject.create({
				"symbol": 			req.body.symbol, 
				"shares": 			req.body.shares,
				"price": 			req.body.price,
        		"buydate": 			req.body.buydate,
				"transaction": 	    req.body.transaction,
				"total": 			req.body.total,
				"ownerid":			req.body.ownerid
			}).then(TransactionObject => {		
			console.log("Creating Transaction");	
			// Send created TransactionObject to client
			res.json(TransactionObject);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error creating transaction", details: err});
		});
};
 
// FETCH All Transactions
exports.findAll = (req, res) => {
	TransactionObject.findAll().then(TransactionObjects => {
			// Send All TransactionObjects to Client
			res.json(TransactionObjects.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

// FETCH All Transactions by symbol
exports.findAllTransactionsByAsset = (req, res) => {
	const symbol = 	req.params.symbol;
	TransactionObject.findAll({ where: {symbol : symbol} })
		.then(TransactionObjects => {
			// Send All TransactionObjects to Client
			res.json(TransactionObjects.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

// FETCH All Transactions by transaction type and symbol
exports.findAllTransactionsByAssetAndType = (req, res) => {
	const symbol = 	req.params.symbol;
	const typeOfTransaction = req.params.transaction;
	TransactionObject.findAll({ where: {symbol : symbol, transaction: typeOfTransaction} })
		.then(TransactionObjects => {
			// Send All TransactionObjects to Client
			res.json(TransactionObjects.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

// FETCH All TransactionObjects
exports.findDistinct = (req, res) => {
	db.sequelize
		.query('select symbol, sum(shares) as \"shares\", sum(total) / sum(shares) as \"price\", sum(total) as \"total\"' + 
		        'from transactions where transaction = true group by symbol;', { 
		  model: TransactionObject,
		  mapToModel: true // pass true here if you have any mapped fields
		}).then(TransactionObjects => {
			// Send All TransactionObjects to Client
			res.json(TransactionObjects);
			console.log("trasnaction is " + TransactionObjects);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

// Find a TransactionObject by Id
exports.findById = (req, res) => {	
	TransactionObject.findById(req.params.id).then(TransactionObject => {
			res.json(TransactionObject);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};
 
// Update a TransactionObject
exports.update = (req, res) => {
	const id = req.body.id;
	TransactionObject.update( req.body, 
			{ where: {id: id} }).then(() => {
				res.status(200).json( { mgs: "Updated Successfully -> TransactionObject Id = " + id } );
			}).catch(err => {
				console.log(err);
				res.status(500).json({msg: "error", details: err});
			});
};

// Delete a TransactionObject by Id
exports.delete = (req, res) => {
	const id = req.params.id;
	TransactionObject.destroy({
			where: { id: id }
		}).then(() => {
			res.status(200).json( { msg: 'Deleted Successfully -> TransactionObject Id = ' + id } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

/****************** ARCHIVED TRANSACTIONS  ***************************/

// Find All transactions from the transactions table which are NOT in the archivedtransactions table BASED on transaction Symbol
exports.findFreeTransactions = (req, res) => {
	const symbol = req.params.symbol;
	var arrayOfId = [];

	db.sequelize
		.query('select * from transactions where symbol=\''+symbol+'\' ' 
				+ 'and id not in (select transactionid from archivedtransactions);',{ 
		}).then(TransactionObjects => {
			// parse through the data and only send the ID's from the transactions table
				TransactionObjects[0].forEach(element => {
					arrayOfId.push(element.id);
				});
				res.json(arrayOfId);
				console.log("trasnaction is " + arrayOfId);
		}).catch(err => {
				console.log(err);
				res.status(500).json({msg: "error", details: err});
		});
}

// save transactions to archived transactions
exports.newArchivedTransaction = (req,res) => {
	// Save to PostgreSQL database
	archivedTrans.create({
		"archivedsymbolid": req.body.archiveSymbolD,
		"transactionid": req.body.transactionID
	}).then(result => {		
	console.log("Creating Transaction");	
	// Send created TransactionObject to client
	res.json(result);
}).catch(err => {
	console.log(err);
	res.status(500).json({msg: "error", details: err});
});
}


