var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
const cors      = require('cors')

app.use(bodyParser.json())
app.use(cors())
 
const db = require('./app/config/db.config.js');
  
// create table if it DOES NOT exist
db.sequelize.sync().then(() => {
  console.log('Sync with table');
});
 
require('./app/route/transactions.route.js')(app);
require('./app/route/asset.route.js')(app);
require('./app/route/owners-contributions.route.js')(app);
require('./app/route/misc.route.js')(app);

// Create a Server
var server = app.listen(8080, function () {
 
  let host = server.address().address
  let port = server.address().port
 
  console.log("App listening at http://%s:%s", host, port);
})
 

