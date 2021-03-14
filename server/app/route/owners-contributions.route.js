module.exports = function(capp) {
    const owners = require('../controller/owners-contributions.controller.js');
 
    // Create a new Owner
    capp.post('/api/owners', owners.create);

    // Retrieve all owners 
    capp.get('/api/owners', owners.findAll);


    /**************CONTRIBUTIONS *******************************/

    // Create a new Contribution
    capp.post('/api/contributions', owners.createContribution);
 
    // Retrieve all Contribtions 
    capp.get('/api/contributions', owners.findAllContributions);

    // Retrieve all Contribtions by name
    capp.get('/api/contributions/:ownerid', owners.findAllContributionsPerOwner);

}
