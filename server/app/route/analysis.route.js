module.exports = function(app) {
    const analysis = require('../controller/analysis.controller.js');
 
    // Create a new CurrentAsset
    app.post('/api/uploadFinancialInfo/', analysis.postFinancials);

    // Get Financial Info 
    app.get('/api/financialInfo/:symbol/:period/:statement', analysis.getFinancials)

    //Get all Company names
    app.get('/api/financialCompanyNames', analysis.getCompanyNames)

    // Get list of all Asset ames
    app.get('/api/assetSymbols/', analysis.getAssetNames);

    //GET categories
    app.get('/api/getCategories', analysis.getCategories)

    //GET categories
    app.get('/api/singleCompanyCategories/:categories/:company/:period', analysis.getSingleCompanyData)

    //GET All Years regarding Financial Statements
    app.get('/api/getAllYears', analysis.getAllYears)
}