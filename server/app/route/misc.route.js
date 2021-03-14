module.exports = function(app){

    const misc = require('../controller/misc.controller.js')

    // check to see if a value exists
    app.get('/api/misc/check/:table/:column/:value', misc.check)
}