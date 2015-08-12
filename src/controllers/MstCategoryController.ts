import express  = require('express');
import mongoose = require('mongoose');
import Category = require('../models/Category');
import Pager    = require('../lib/Pager');

class MstCategoryController {
  public static paths = {
    index    : '/mst/category',
    editRow  : (_id: string) => '/mst/category/editRow/'   + _id,
    cancelRow: (_id: string) => '/mst/category/cancelRow/' + _id,
    deleteRow: (_id: string) => '/mst/category/deleteRow/' + _id,
    insertRow: '/mst/category/insertRow',
    execRow  : '/mst/category/execRow'
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
    
    Category.model.paginate({}, paginateOption, (err, results, pageCount, itemCount) => {
      var pager = new Pager(results, pageCount, itemCount, paginateOption, paginateDefaults);

      res.render('mstCategory/index', {
        params: {
          title      : 'Category master',
          pager      : pager,
          newDocument: Category.createDocument()
        }
      });
    });
  }
    
  /**
   * 編集用フォームのレンダリング
   */
  public static formRow(req: express.Request, res: express.Response) {
    Category.model.findById(req.params._id || null).exec().onResolve((err, result) => {
      var doc = result || Category.createDocument();
      MstCategoryController.renderFormRow(doc, res);
    }).onReject((err) => { res.send('rejected.'); });
  }

  /**
   * 確定ボタン押下時処理
   */
  public static execRow(req: express.Request, res: express.Response) {
    Category.model.findById(req.body._id || null).exec().onResolve((err: any, result: typeof Category.modelInterface) => {
      var valueObject = req.body;
      delete valueObject._id;

      var doc = result || Category.createDocument();
      doc.set(valueObject);
      doc.save((validationErr: any, savedResult: typeof Category.modelInterface) => { 
        if (validationErr) {
          MstCategoryController.renderFormRow(doc, res);
        } else {
          MstCategoryController.renderRow(savedResult._id, res);
        }
      });
    }).onReject((err) => { res.send('rejected.'); });
    
  }

  /**
   * 削除ボタン押下時処理
   */
  public static deleteRow(req: express.Request, res: express.Response) {
    Category.model.findById(req.params._id).exec().onResolve((err: any, result: typeof Category.modelInterface) => {
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
    MstCategoryController.renderRow(req.params._id, res);
  }

  /**
   * １行のレンダリング
   */
  private static renderRow(_id: string, res: express.Response) {
    Category.model.findById(_id || null).exec().onResolve((err, result) => {
      var doc = result || Category.createDocument();
      res.render('mstCategory/renderRow', { 
        params: {
          'doc': doc
        }
      });
    }).onReject((err) => { res.send('rejected.'); });
  }

  /**
   * １行の編集用レンダリング
   */
  private static renderFormRow(doc: typeof Category.modelInterface, res: express.Response) {
    res.render('mstCategory/rowEdit', {
      'params': {
        'doc' : doc
      }
    });
  }
}

export = MstCategoryController;
