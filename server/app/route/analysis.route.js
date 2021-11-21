module.exports = function(app) {
    const analysis = require('../controller/analysis.controller.js');
 
    // Create a new CurrentAsset
    app.post('/api/uploadFinancialInfo/', analysis.postFinancials);

    // Get Financial Info 
    app.get('/api/financialInfo/:symbol/:period/:statement', analysis.getFinancials)

   //Get all Company names
    app.get('/api/financialCompanyNames', analysis.getCompanyNames)

    //GET categories
    app.get('/api/getCategories', analysis.getCategories)

    //GET categories
    app.get('/api/singleCompanyCategories/:categories/:company/:period', analysis.getSingleCompanyData)

}