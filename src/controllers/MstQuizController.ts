import express  = require('express');
import mongoose = require('mongoose');
import Quiz     = require('../models/Quiz');
import Category = require('../models/Category');
import Pager    = require('../lib/Pager');

class MstQuizController {
  public static paths = {
    index    : '/mst/quiz',
    editRow  : (_id: string) => '/mst/quiz/editRow/'   + _id,
    cancelRow: (_id: string) => '/mst/quiz/cancelRow/' + _id,
    deleteRow: (_id: string) => '/mst/quiz/deleteRow/' + _id,
    insertRow: '/mst/quiz/insertRow'                        ,
    execRow  : '/mst/quiz/execRow'
  }

  /**
   * メインページのレンダリング
   */
  public static index(req: express.Request, res: express.Response) {
    var paginateDefaults = { page: 1, limit: 10 };
    var paginateOption: mongoose.PaginateOption = {
      page : Number(req.query.page)  || paginateDefaults.page,
      limit: Number(req.query.limit) || paginateDefaults.limit
    };
    
    Quiz.model.paginate({}, paginateOption, (err, results, pageCount, itemCount) => {
      Quiz.model.populate(results, { path: 'categories' }, (err, popDocs) => {
        var pager = new Pager(popDocs, pageCount, itemCount, paginateOption, paginateDefaults);
        res.render('mstQuiz/index', {
          params: {
            title      : 'Quiz master',
            name       : 'quiz',
            pager      : pager,
            newDocument: Quiz.createDocument()
          }
        });
      });
    });
  }
    
  /**
   * 編集用フォームのレンダリング
   */
  public static formRow(req: express.Request, res: express.Response) {
    Quiz.model.findById(req.params._id || null).populate('categories').exec().onResolve((err, result) => {
      var doc = result || Quiz.createDocument();
      MstQuizController.renderFormRow(doc, res);
    }).onReject((err) => { res.send('rejected.'); });
  }

  /**
   * 確定ボタン押下時処理
   */
  public static execRow(req: express.Request, res: express.Response) {
    Quiz.model.findById(req.body._id || null).populate('categories').exec().onResolve((err: any, result: typeof Quiz.modelInterface) => {
      var valueObject = req.body;
      delete valueObject._id;

      var doc = result || Quiz.createDocument();
      doc.set(valueObject);
      doc.save((validationErr: any, savedResult: typeof Quiz.modelInterface) => {
        if (validationErr) {
          MstQuizController.renderFormRow(doc, res);
        } else {
          MstQuizController.renderRow(savedResult._id, res);
        }
      });
    }).onReject((err) => { res.send('rejected.'); });
    
  }

  /**
   * 削除ボタン押下時処理
   */
  public static deleteRow(req: express.Request, res: express.Response) {
    Quiz.model.findById(req.params._id).exec().onResolve((err: any, result: typeof Quiz.modelInterface) => {
      result.remove((err) => {
        res.send('OK');
      });
    }).onReject((err: any) => {
      res.send('NG');
    });
  }

  /**
   * 取消ボタン押下時処理
   */
  public static cancelRow(req: express.Request, res: express.Response) {
    MstQuizController.renderRow(req.params._id, res);
  }

  /**
   * １行のレンダリング
   */
  private static renderRow(_id: string, res: express.Response) {
    Quiz.model.findById(_id || null).populate({ path: 'categories' }).exec().onResolve((err, result) => {
      var doc = result || Quiz.createDocument();
      res.render('mstQuiz/renderRow', { 
        params: {
          'doc': doc
        }
      });
    }).onReject((err) => { res.send('rejected.'); });
  }

  /**
   * １行の編集用レンダリング
   */
  private static renderFormRow(doc: typeof Quiz.modelInterface, res: express.Response) {
    Category.model.find({}).exec((err: any, categories: typeof Category.modelInterface[]) => {
      var checkedIds = doc.categories.map((c: any) => c.id);
      
      res.render('mstQuiz/rowEdit', {
        'params': {
          'doc'         : doc,
          'newChoiceDoc': Quiz.createChoiceDocument(),
          'categories'  : categories,
          'checkedIds'  : checkedIds
        }
      });
    });
  }
}

export = MstQuizController;
