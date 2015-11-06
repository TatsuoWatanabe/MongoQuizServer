import express  = require('express');
import session  = require('express-session');
import mongoose = require('mongoose');
import Admin    = require('../models/Admin');

class LoginController {
  public static paths = {
    index : '/login',
    logout: '/logout'
  }

  public static needLogin(req: express.Request, res: express.Response, next) {
    LoginController.saveAfterLoginPath(req);

    if (LoginController.isLoggedin(req)) { next(); }
    else                                 { res.redirect(LoginController.paths.index); }
  }

  public static index(req: express.Request, res: express.Response) {
    res.render('login/index', {
      params: {
        title     : 'Login',
        name      : 'login',
        isLoggedin: LoginController.isLoggedin(req)
      }
    });
  }

  public static login(req: express.Request, res: express.Response) {
      var email          = req.body.email;
      var password       = req.body.password;
      var cond           = { "email": email, "password": password };
      var afterLoginPath = LoginController.loadAfterLoginPath(req) || LoginController.paths.index;

      Admin.model.find(cond).exec().onResolve((err, result) => {
        var loggedin = !!result;

        if (loggedin) {
          LoginController.saveAdminEmail(req, email);
          res.redirect(afterLoginPath);
        } else {
          LoginController.index(req, res);
        }
      }).onReject((err) => { res.send('rejected.'); });
  }

  public static logout(req: express.Request, res: express.Response) {
    req.session.destroy((err) => console.log(err));
    console.log('deleted sesstion');
    res.redirect(LoginController.paths.index);
  }

  private static sessionKeys = {
    adminEmail    : 'adminEmail',
    afterLoginPath: 'afterLoginPath'
  };
  private static isLoggedin = (req: express.Request) => !!req.session[LoginController.sessionKeys.adminEmail];
  private static saveAdminEmail(req: express.Request, email: string) { req.session[LoginController.sessionKeys.adminEmail] = email; }
  private static saveAfterLoginPath(req: express.Request) { req.session[LoginController.sessionKeys.afterLoginPath] = req.route.path; }
  private static loadAfterLoginPath(req: express.Request): string { return req.session[LoginController.sessionKeys.afterLoginPath] || ''; }

}

export = LoginController;
