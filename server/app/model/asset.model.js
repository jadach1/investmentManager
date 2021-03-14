module.exports = (sequelize, Sequelize) => {
	const asset = sequelize.define('asset', {
		symbol: {
			type: Sequelize.STRING(6)
 		 },
	  	shares: { // total shares bought 
				type: Sequelize.INTEGER,
				defaultValue: 0,
				validate: {
					min: 0,
					isInt: true
				}
		},
		avgprice: { // originalMoney / shares
				type: Sequelize.DECIMAL(12,2),
				defaultValue: 0,
				validate:{
					isDecimal: true,
					min: 0
				}
		},
		sharesSold: { // total shares sold 
				type: Sequelize.INTEGER,
				defaultValue: 0,
				validate: {
					min: 0,
					isInt: true
				}
		},
		avgpriceSold: { // total money out / shares sold
				type: Sequelize.DECIMAL(12,2),
				defaultValue: 0,
				validate:{
					isDecimal: true,
					min: 0
				}
		},
	  	originalMoney : { // total in - total out
			type: Sequelize.DECIMAL(12,2),
			defaultValue: 0,
			validate: {
				isDecimal: true,
				min: 0
			}
		},
		totalMoneyIn : { // total amount of money invested into this asset
			type: Sequelize.DECIMAL(13,2),
			defaultValue: 0,
			validate: {
				isDecimal: true,
			}
		},
		totalMoneyOut : { // total amount of money pulled out of this investment
			type: Sequelize.DECIMAL(13,2),
			defaultValue: 0,
			validate: {
				isDecimal: true,
			}
		},
		price : { // Derived from API call
			type: Sequelize.DECIMAL(12,2),
			defaultValue: 0,
			validate: {
				isDecimal: true,
			}
		},
		currentTotal : { // price * shares
			type: Sequelize.DECIMAL(13,2),
			defaultValue: 0,
			validate: {
				isDecimal: true,
			}
		},
		realProfit : { // totMoneyOut - TotalMoneyIn
			type: Sequelize.DECIMAL(13,2),
			defaultValue: 0,
			validate: {
				isDecimal: true,
			}
		},
		realMargin : { // RealProfit / totalMoneyIn * 100
			type: Sequelize.DECIMAL(12,2),
			defaultValue: 0,
			validate: {
				isDecimal: true,
			}
		},
		unRealProfit : { // currentTotal + totMoneyOut - TotalMoneyIn
			type: Sequelize.DECIMAL(13,2),
			defaultValue: 0,
			validate: {
				isDecimal: true,
			}
		},
		unRealMargin : { // UnRealProfit / totalMoneyIn * 100
			type: Sequelize.DECIMAL(12,2),
			defaultValue: 0,
			validate: {
				isDecimal: true,
			}
		},
		assettype : {
			type: Sequelize.STRING(10),
			defaultValue: 'existing',
		},
		ownerid: {
			type: Sequelize.INTEGER
 		 },
	});
	
	return asset;
}