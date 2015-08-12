import AppView = require('AppView');
import Router  = require('Router');

var appView = new AppView();
var router  = new Router();
Router.filter.setAppView(appView);
Backbone.history.start();
