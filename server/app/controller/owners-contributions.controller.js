const db = require('../config/db.config.js');
const ownersObject = db.owners;
const contrObject  = db.contributions;

//post an owner
exports.create = (req, res) => {	
	// Save to PostgreSQL database
	ownersObject.create({
				"owner": 			req.body.owner
			}).then(ownersObject => {		
			console.log("Creating Owner");	
			// Send created contribution to client
			res.json(ownersObject);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error creating Owner", details: err});
		});
};

// FETCH All owners
exports.findAll = (req, res) => {
	ownersObject.findAll().then(ownersObject => {
			// Send All owners to Client
			res.json(ownersObject);
			//res.json(ownersObject.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

/******************************************************************** */
/********************* CONTRIBUTIONS *********************************/
/******************************************************************** */

// Post a contribution
exports.createContribution = (req, res) => {	
	// Save to PostgreSQL database
	contrObject.create({
				"ownerid": 			req.body.ownerid, 
				"amount": 			req.body.amount,
				"transaction": 		req.body.transaction,
        		"date": 			req.body.date,
			}).then(contrObject => {		
			console.log("Creating Contribution");	
			// Send created contribution to client
			res.json(contrObject);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error creating contribution", details: err});
		});
};

// FETCH All contributions
exports.findAllContributions = (req, res) => {
	contrObject.findAll().then(contrObject => {
			// Send All contributions to Client
			res.json(contrObject.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

// FETCH All contributions per Owner Name
exports.findAllContributionsPerOwner = (req, res) => {
	const id = req.params.ownerid;
	contrObject.findAll({where: {ownerid : id}})
		.then(contrObject => {
			// Send All contributions to Client
			res.json(contrObject.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};
