module.exports = function(capp) {
    const CurrentAssets = require('../controller/asset.controller.js');
 
    // Create a new CurrentAsset
    capp.post('/api/currentassets', CurrentAssets.create);

     // Retrieve all Assets
    capp.get('/api/currentassets', CurrentAssets.findAll);

    // Find a single asset
     capp.get('/api/currentassets/:id', CurrentAssets.findAsset);

     // Find a single asset that is not existing
     capp.get('/api/currentExistingAssets/:symbol/:id', CurrentAssets.checkIfExists);

    // Update a CurrentAsset with Id
    capp.put('/api/currentassets', CurrentAssets.update);
 
    // Delete a CurrentAsset with Symbol
    capp.delete('/api/currentassets/:id', CurrentAssets.delete);

    // Retrieve all Assets by type
    capp.get('/api/allassets/:type', CurrentAssets.findAllByType);

     // Retrieve all Assets by type and owner
     capp.get('/api/allassets/:type/:owner', CurrentAssets.findAllByOwnerAndType);

     //Retrieve all Assets by Owner
     capp.get('/api/allassetsOwner/:owner', CurrentAssets.findAllByOwner);

     capp.post('/api/insertNewName/:symbol', CurrentAssets.insertNewName)

    /*********************** ARCHVIED ASSETS  ***************************/
    capp.put('/api/transferAsset/:id/:status', CurrentAssets.transferAsset);
}
