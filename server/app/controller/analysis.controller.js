const db = require('../config/db.config.js');

exports.postFinancials = ( req, res ) => {
    const data = req.body;
    console.log(data)
   // db.sequelize.query()
   data.forEach(element => {
       console.log(element)
       db.sequelize.query(element).then(
           res => res.status(200).json("Updated " + element)
       ).catch(
           err => res.status(500).json("Error: " + err) 
       )
   });
}

/*
    RETURNS ALL DATA FROM TABLE FINANCIALS
    UNPARSED
*/
exports.getFinancials = ( req, res ) => {
    const symbol = req.params.symbol;
    const period = req.params.period;
    const statem = req.params.statement;
    console.log("length " + symbol.length)
    let   query = "";
    if(statem == "all") {
        query = 'select * from financials where substring(symbol_date_value for '+ symbol.length +')=\'' + symbol + '\';'
    } else {
        query = 'select * from financials where period=\'' + period + '\' and statement=\'' + statem + '\' and substring(symbol_date_value for ' + symbol.length + ')=\'' + symbol + '\';'
    }
    db.sequelize.query(query).then(
        Fin => res.json(Fin)
    ).catch(
        err => res.status(500).json("No Data Found.  Either symbol, statement of period of time does not exist: " + err)
    ).finally(
        console.log("done")
    )

}

exports.getCompanyNames = (req, res) => {
    const delimeter = '\',\''; //transaltes too ','
    db.sequelize.query('select DISTINCT split_part(symbol_date_value,' + delimeter + ',1) as Company from Financials;')
                .then(
                    Fin => res.json(Fin)
                ).catch(
                    err =>  res.status(500).json("Couldnt get company names: " + err)
                ).finally(
                    console.log("done getCompanyNames")
                )
}

exports.getCategories = (req, res) => {
    db.sequelize.query('select DISTINCT category,statement from financials;')
                 .then(
                     Cat => res.json(Cat) 
                 ).catch(
                     err => res.status(500).json("Error getting Categories: " + err)
                 )
}

exports.getSingleCompanyData = (req, res) => {
    const categories = req.params.categories;
    const symbol     = req.params.company;
    const period     = req.params.period;

    const query = 'select * from financials where category in ('+categories+') and period=\''+period+'\' and substring(symbol_date_value for '+symbol.length+')=\''+symbol+'\';'
    db.sequelize.query(query)
                .then(
                    DATA => res.json(DATA[0])
                ).catch(
                    err => console.log("Failed to get Single Company Data " + err)
                )
}

/* GET ALL ASSET NAMES */

exports.getAssetNames = (req, res) => {	
    const owner = req.params.owner;
    db.sequelize.query('select * from company_names')
                .then(
                        asset => res.json(asset)
                ).catch(
                        err => console.log(err)
                )
	};