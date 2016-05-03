var express = require('express');
var session = require('express-session');
var mongoose = require('mongoose');
var moment = require('moment');
var Routes = require('./src/Routes');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(session);
var app = express();
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
// --- connect to Database ------------------------
(function () {
    var connectString = process.env.MONGOLAB_URI || process.env.MONGO_LOCAL_URI;
    mongoose.connect(connectString, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('connected to database ' + connectString + '.');
        }
    });
})();
// ------------------------------------------------
// --- express session ----------------------------
(function () {
    app.use(session({
        secret: "hegehoge",
        saveUninitialized: true,
        resave: true,
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
        cookie: {
            httpOnly: false,
            expires: moment().add(1, 'days').toDate()
        }
    }));
})();
// ------------------------------------------------
//--- start server --------------------------------
(function () {
    Routes.init(app);
    app.use(express.static('public'));
    app.set('port', (process.env.PORT || 5000));
    app.set('view engine', 'jade');
    app.set('views', __dirname + '/src/views');
    app.listen(app.get('port'), function () {
        console.log("Node app is running at localhost:" + app.get('port'));
    });
})();
//--------------------------------------------------
//# sourceMappingURL=app.js.map