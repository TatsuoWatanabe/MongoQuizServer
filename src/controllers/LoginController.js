var Admin = require('../models/Admin');
var LoginController = (function () {
    function LoginController() {
    }
    LoginController.needLogin = function (req, res, next) {
        LoginController.saveAfterLoginPath(req);
        if (LoginController.isLoggedin(req)) {
            next();
        }
        else {
            res.redirect(LoginController.paths.index);
        }
    };
    LoginController.index = function (req, res) {
        res.render('login/index', {
            params: {
                title: 'Login',
                name: 'login',
                isLoggedin: LoginController.isLoggedin(req)
            }
        });
    };
    LoginController.login = function (req, res) {
        var email = req.body.email;
        var password = req.body.password;
        var cond = { "email": email, "password": password };
        var afterLoginPath = LoginController.loadAfterLoginPath(req) || LoginController.paths.index;
        Admin.model.find(cond).exec().onResolve(function (err, result) {
            var loggedin = !!result;
            if (loggedin) {
                LoginController.saveAdminEmail(req, email);
                res.redirect(afterLoginPath);
            }
            else {
                LoginController.index(req, res);
            }
        }).onReject(function (err) {
            res.send('rejected.');
        });
    };
    LoginController.logout = function (req, res) {
        req.session.destroy(function (err) { return console.log(err); });
        console.log('deleted sesstion');
        res.redirect(LoginController.paths.index);
    };
    LoginController.saveAdminEmail = function (req, email) {
        req.session[LoginController.sessionKeys.adminEmail] = email;
    };
    LoginController.saveAfterLoginPath = function (req) {
        req.session[LoginController.sessionKeys.afterLoginPath] = req.route.path;
    };
    LoginController.loadAfterLoginPath = function (req) {
        return req.session[LoginController.sessionKeys.afterLoginPath] || '';
    };
    LoginController.paths = {
        index: '/login',
        logout: '/logout'
    };
    LoginController.sessionKeys = {
        adminEmail: 'adminEmail',
        afterLoginPath: 'afterLoginPath'
    };
    LoginController.isLoggedin = function (req) { return !!req.session[LoginController.sessionKeys.adminEmail]; };
    return LoginController;
})();
module.exports = LoginController;
//# sourceMappingURL=LoginController.js.map