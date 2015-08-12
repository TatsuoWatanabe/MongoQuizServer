define(["require", "exports", 'AppView', 'Router'], function (require, exports, AppView, Router) {
    var appView = new AppView();
    var router = new Router();
    Router.filter.setAppView(appView);
    Backbone.history.start();
});
//# sourceMappingURL=app.js.map