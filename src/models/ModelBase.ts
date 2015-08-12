import mongoose = require('mongoose');
import Routes   = require('../Routes');

class ModelBase {
  /** virtual field "editUrl" */
  public editUrl: string;
  /** virtual field "cancelUrl" */
  public cancelUrl: string;
  /** virtual field "deleteUrl" */
  public deleteUrl: string;
  /** virtual field "execUrl" */
  public execUrl: string;
  /** virtual field "insertUrl" */
  public insertUrl: string;

  /** resister url properties as virtual field of mongoose model. */
  public static resisterUrls(schema: mongoose.Schema, paths: () => typeof Routes.paths.mstCategory) {
    var names = {
      editUrl  : 'editUrl'  ,
      cancelUrl: 'cancelUrl',
      deleteUrl: 'deleteUrl',
      execUrl  : 'execUrl'  ,
      insertUrl: 'insertUrl'
    };

    Object.keys(names).forEach((key) => {
      schema.virtual(key).get(function() {
        var url = (key === names.editUrl)   ? paths().editRow(this._id)  :
                  (key === names.cancelUrl) ? paths().cancelRow(this._id):
                  (key === names.deleteUrl) ? paths().deleteRow(this._id):
                  (key === names.execUrl)   ? paths().execRow            :
                  (key === names.insertUrl) ? paths().insertRow          : '';
        return url;
      });
    });
  }

}

export = ModelBase;