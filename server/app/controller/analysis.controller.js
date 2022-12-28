const db = require('../config/db.config.js');
const profile = db.profile;

exports.postFinancials = ( req, res ) => {
    const data = req.body;
   data.forEach(element => {
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
        Fin => res(Fin.toJSON())
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

    const categories = req.params.categories;  //Array
    const symbol     = req.params.company;
    const period     = req.params.period;

    const query = 'select * from financials where category in ('+categories+') and period=\''+period+'\' and substring(symbol_date_value for '+symbol.length+')=\''+symbol+'\';'
    db.sequelize.query(query)
                .then(
                    DATA =>  res.json(DATA[0])
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

    /*RETURNS ALL THE YEARS FOR FINANCIAL STATEMENTS */
exports.getAllYears = (req, res) => {
    db.sequelize.query('select distinct split_part(symbol_date_value,\',\',3) as year from financials order by year DESC;')
                .then(
                    years => res.json(years)
                ).catch(
                    err => res.json(err)
                )
}

/*******************************************************************************/ 
// COMPANY PROFILE DATA
/*******************************************************************************/ 

exports.createNewProfile = (req, res) => {
    console.log("new profile")
    // console.log(req.body)
      profile.create({
        "symbol": req.body.symbol,
        "price": req.body.price,
        "mktcap": req.body.mktCap,
        "name": req.body.name,
        "exchange": req.body.exchange,
        "industry": req.body.industry,
        "sector": req.body.sector,
        "description": req.body.description,
        "employees": req.body.employees,
        "image": req.body.image,
        "ipo": req.body.ipo,
    }).then( profile => { console.log("Creating New Company Profile "), console.log(profile)
    }).catch( err => {console.log(err)})
}

exports.getSingleProfile = (req, res) => {
    console.log("Fetching Profile")
    const company = req.params.symbol
    profile.findOne({ where: {symbol: company ?? 'MSFT'}
        }).then( profile => res.json(profile))
          .catch( err => console.log(err))
}

// Returns all profiles the user has requested
exports.getAllSelectedProfiles = (req, res) => {
    console.log("Fetching All Selected Profiles")
    const companies = req.params.symbols ?? undefined;
    console.log(companies)
    profile.findAll({ where: {symbol: [companies] }
        }).then( profile => res.json(profile))
          .catch( err => console.log(err))
}


