const db = require('../config/db.config.js');
const CurrentAsset = db.assets;

// Post a CurrentAsset
exports.create = (req, res) => {	
	// Save to PostgreSQL database
	CurrentAsset.create({
				"symbol"		:req.body.symbol,
				"shares"		:req.body.shares,
				"avgprice"		:req.body.avgprice,
				"sharesSold"	:req.body.sharesSold,
				"avgpriceSold"	:req.body.avgpriceSold,
				"originalMoney"	:req.body.originalMoney,
				"totalMoneyIn"	:req.body.totalMoneyIn,
				"totalMoneyOut"	:req.body.totalMoneyOut,
				"realProfit"	:req.body.realProfit,
				"realMargin"	:req.body.realMargin,
				"unRealProfit"	:req.body.unRealProfit,
				"unRealMargin"	:req.body.unRealMargin,
				"price"			:req.body.price,
				"currentTotal"	:req.body.currentTotal,
				"ownerid"		:req.body.ownerid,
				"country"		:req.body.country,
			}).then(CurrentAsset => {		
			console.log("Creating Asset ");	
			// Send created CurrentAsset to client
			res.json(CurrentAsset);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

// FETCH All Transactions
exports.findAll = (req, res) => {
	CurrentAsset.findAll().then(Asset => {
			// Send All CurrentAssets to Client
			res.json(Asset.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

// FETCH All Transactions by a specific type ie "existing or archived"
exports.findAllByType = (req, res) => {
	const type=req.params.type;
	db.sequelize
		.query('select * from assets where assettype=\''+type+'\';')
		.then(Asset => {
			// Send All CurrentAssets to Client
			res.json(Asset[0].sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

// ALL ASSETS BY OWBER
exports.findAllByOwner = (req, res) => {
	const id=req.params.owner;
	db.sequelize
		.query('select * from assets where ownerid ='+id+';')
		.then(Asset => {
			// Send All CurrentAssets to Client
			res.json(Asset[0].sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


//ALL ASSETS BY OWNER AND TYPE
exports.findAllByOwnerAndType = (req, res) => {
	const type=req.params.type;
	const id=req.params.owner;
	db.sequelize
		.query('select * from assets where ownerid ='+id+' and assettype=\''+type+'\';')
		.then(Asset => {
			// Send All CurrentAssets to Client
			res.json(Asset[0].sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

// FETCH All TransactionObjects
exports.findAsset = (req, res) => {	
	const stockId = req.params.id;
	CurrentAsset.findOne({where: {id: stockId} })
					.then(Asset => {
		// Send All CurrentAssets to Client
		res.json(Asset);
	}).catch(err => {
		console.log(err);
		res.status(500).json({msg: "error could not find asset", details: err});
	});
	};
 
// Update an Asset
exports.update = (req, res) => {
	const id = req.body.id;
	CurrentAsset.update( req.body, 
			{ where: {id: id} }).then(() => {
				res.status(200).json( { mgs: "Updated Successfully -> CurrentAsset id = " + id } );
			}).catch(err => {
				console.log(err);
				res.status(500).json({msg: "error", details: err});
			});
};

// Delete a CurrentAsset by symbol
exports.delete = (req, res) => {
	const id = req.params.id;
	CurrentAsset.destroy({
			where: { id: id }
		}).then(() => {
			res.status(200).json( { msg: 'Deleted Successfully -> Asset id = ' + id } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

/*************** ARCHIVE ASSETS *******************************/

// transfer a CurrentAsset by ID to archived status saved in type
exports.transferAsset = (req, res) => {
	const id = req.params.id;
	const status = req.params.status;
	db.sequelize
		.query('update assets set assettype=\''+status+'\' where id='+id+';')
		.then(() => {
			res.status(200).json( { msg: 'Transferred Successfully -> Asset id  ' + id + ' to ' + status } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

exports.checkIfExists = (req, res) => {	
	const mySymbol = req.params.symbol;
	const id 	   = req.params.id;
	CurrentAsset.findOne({where: { 
									symbol: mySymbol,
									ownerid: id,
									assettype: "existing"
								}   
		}).then(Asset => {
			// Send All CurrentAssets to Client
			res.json(Asset);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error could not find asset", details: err});
		})
	};

	/******************
		LIST OF COMPANY NAMES TO REFERENCE FOR GETTING NEW DATA FROM API
	******************/
	exports.insertNewName = (req, res) => {
		const symbol = req.params.symbol;
		db.sequelize.query('insert into company_names (symbol) values (\''  + symbol + '\') ')
					.then( asset => 
								 res.status(200).json( {msg: "successfully added company: " + symbol })
							) 
					.catch( err  => res.status(500).json(err))
	};

	exports.deleteAssetName = (req, res) => {
		const symbol = req.params.symbol;
		console.log("live")
		db.sequelize.query(  'delete from company_names where symbol=\'' + symbol + '\';  ')
					.then( 
						res => res.status(200).json( {msg: "successfully deleted company " + symbol})
					)
					.catch(
						err => res.status(500).json(err)
					)
	};