import express               = require('express');
import ApiController         = require('./controllers/ApiController');
import MstQuizController     = require('./controllers/MstQuizController');
import MstCategoryController = require('./controllers/MstCategoryController');
import LoginController       = require('./controllers/LoginController');


class Routes {
  public static get paths() {
    return {
      wake       : '/wake',
      api        : ApiController.paths,
      mstCategory: MstCategoryController.paths,
      mstQuiz    : MstQuizController.paths,
      login      : LoginController.paths
    };
  }

  public static init(app: express.Express) {
    var needLogin = LoginController.needLogin;

    // --- api --------------------------------
    app.get(Routes.paths.api.index, ApiController.index);
    // ----------------------------------------

    // --- wake -------------------------------
    app.get(Routes.paths.wake, function(req, res) { res.send("All right, I'm okay."); });
    // ----------------------------------------

    // --- login ------------------------------
    app.get (Routes.paths.login.index , LoginController.index);
    app.post(Routes.paths.login.index , LoginController.login);
    app.get (Routes.paths.login.logout, LoginController.logout);
    // ----------------------------------------
    
    // --- mst quiz -----------------------
    app.get(Routes.paths.mstQuiz.index            , needLogin, MstQuizController.index);
    app.get(Routes.paths.mstQuiz.editRow(':_id')  , needLogin, MstQuizController.formRow);
    app.get(Routes.paths.mstQuiz.insertRow        , needLogin, MstQuizController.formRow);
    app.get(Routes.paths.mstQuiz.cancelRow(':_id'), needLogin, MstQuizController.cancelRow);
    app.get(Routes.paths.mstQuiz.cancelRow('')    , needLogin, MstQuizController.cancelRow);
    app.get(Routes.paths.mstQuiz.deleteRow(':_id'), needLogin, MstQuizController.deleteRow);
    app.post(Routes.paths.mstQuiz.execRow         , needLogin, MstQuizController.execRow);
    // ----------------------------------------

    // --- mst category -----------------------
    app.get(Routes.paths.mstCategory.index            , needLogin, MstCategoryController.index);
    app.get(Routes.paths.mstCategory.editRow(':_id')  , needLogin, MstCategoryController.formRow);
    app.get(Routes.paths.mstCategory.insertRow        , needLogin, MstCategoryController.formRow);
    app.get(Routes.paths.mstCategory.cancelRow(':_id'), needLogin, MstCategoryController.cancelRow);
    app.get(Routes.paths.mstCategory.cancelRow('')    , needLogin, MstCategoryController.cancelRow);
    app.get(Routes.paths.mstCategory.deleteRow(':_id'), needLogin, MstCategoryController.deleteRow);
    app.post(Routes.paths.mstCategory.execRow         , needLogin, MstCategoryController.execRow);
    // ----------------------------------------
    
    // --- main -------------------------------
    app.get('/',  function(req, res) { res.send('It works.'); });
    // ----------------------------------------
    
  }
}

export = Routes;