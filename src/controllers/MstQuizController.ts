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
  };

  /**
   * render the page.
   */
  public static index(req: express.Request, res: express.Response) {
    const paginateDefaults = { page: 1, limit: 5 };
    const paginateOption: mongoose.PaginateOption = {
      page       : Number(req.query.page)  || paginateDefaults.page,
      limit      : Number(req.query.limit) || paginateDefaults.limit,
      searchWords: req.query.search_words  || '',
      sortBy     : { active: 1 }
    };
    const query = Quiz.createSearchQuery(paginateOption.searchWords);

    Quiz.model.paginate(query, paginateOption, (err, results, pageCount, itemCount) => {
      Quiz.model.populate(results, { path: 'categories' }, (err, popDocs) => {
        const pager = new Pager(popDocs, pageCount, itemCount, paginateOption, paginateDefaults);
        res.render('mstQuiz/index', {
          params: {
            title      : 'Quiz Master',
            name       : 'quiz',
            pager      : pager,
            searchWords: paginateOption.searchWords,
            newDocument: Quiz.createDocument()
          }
        });
      });
    });
  }

  /**
   * render for edit form.
   */
  public static formRow(req: express.Request, res: express.Response) {
    Quiz.model.findById(req.params._id || null).populate('categories').exec().onResolve((err, result) => {
      const doc = result || Quiz.createDocument();
      MstQuizController.renderFormRow(doc, res);
    }).onReject((err) => { res.send('rejected.'); });
  }

  /**
   * execute the received edited data.
   */
  public static execRow(req: express.Request, res: express.Response) {
    Quiz.model.findById(req.body._id || null).populate('categories').exec().onResolve((err: any, result: typeof Quiz.modelInterface) => {
      const valueObject = req.body;
      delete valueObject._id;
      valueObject.active = valueObject.active || false;

      const doc = result || Quiz.createDocument();
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
   * delete a quiz data.
   */
  public static deleteRow(req: express.Request, res: express.Response) {
    Quiz.model.findById(req.params._id).exec().onResolve((err: any, result: typeof Quiz.modelInterface) => {
      result.remove((err: any) => {
        res.send('OK');
      });
    }).onReject((err: any) => {
      res.send('NG');
    });
  }

  /**
   * cancel editing. response a row for view.
   */
  public static cancelRow(req: express.Request, res: express.Response) {
    MstQuizController.renderRow(req.params._id, res);
  }

  /**
   * render a row.
   */
  private static renderRow(_id: string, res: express.Response) {
    Quiz.model.findById(_id || null).populate({ path: 'categories' }).exec().onResolve((err, result) => {
      const doc = result || Quiz.createDocument();
      res.render('mstQuiz/renderRow', {
        params: {
          'doc': doc
        }
      });
    }).onReject((err) => { res.send('rejected.'); });
  }

  /**
   * render a row for edit form.
   */
  private static renderFormRow(doc: typeof Quiz.modelInterface, res: express.Response) {
    Category.model.find({}).exec((err: any, categories: typeof Category.modelInterface[]) => {
      const checkedIds = doc.categories.map((c: any) => c.id);

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
