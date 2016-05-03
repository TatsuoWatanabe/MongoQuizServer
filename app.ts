/// <reference path="src/typings/tsd.d.ts" />
import express    = require('express');
import session    = require('express-session');
import mongoose   = require('mongoose');
import moment     = require('moment');
import Routes     = require('./src/Routes');
import bodyParser = require('body-parser');
var MongoStore    = require('connect-mongo')(session);
var app           = express();

app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                         // parse application/json

// --- connect to Database ------------------------
(() => {
  var connectString: string  = process.env.MONGOLAB_URI
                            || process.env.MONGO_LOCAL_URI;
  mongoose.connect(connectString, (err) => {
    if (err) { console.log(err); }
    else     { console.log('connected to database ' + connectString + '.'); }
  });
})();
// ------------------------------------------------

// --- express session ----------------------------
(() => {
  app.use(session({
    secret           : process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave           : true,
    store            : new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie           : {
      httpOnly: false,
      expires : moment().add(1, 'days').toDate()
    }
  }));
})();
// ------------------------------------------------

//--- start server --------------------------------
(() => {
  Routes.init(app);
  app.use(express.static('public'));
  app.set('port'       , (process.env.PORT || 5000));
  app.set('view engine', 'jade');
  app.set('views'      , __dirname + '/src/views');
  app.listen(app.get('port'), () => {
    console.log("Node app is running at localhost:" + app.get('port'));
  });
})();
//--------------------------------------------------

