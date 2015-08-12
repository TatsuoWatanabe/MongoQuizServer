import mongoose  = require('mongoose');
import _         = require('underscore');
import ModelBase = require('./ModelBase');

var _def = {
  objectId: mongoose.Schema.Types.ObjectId,
  email   : { type: String , 'default': '', required: '{PATH} is required!'},
  password: { type: String , 'default': '', required: '{PATH} is required!'},
  created : { type: Date   , 'default': Date.now },
  modified: { type: Date   , 'default': Date.now }
};
var _schema = new mongoose.Schema(
  _def
).pre('save', function (next) {
  this.modified = Date.now();
  next();
})

interface IAdmin extends mongoose.Document, Admin { }
var _model = mongoose.model<IAdmin>('Admin', _schema);

/**
 * @see http://chords.hatenablog.com/entry/2014/12/21/クラスをインタフェースとして使う。mongooseのモデル
 */
class Admin extends ModelBase {
  public  objectId: typeof _def.objectId;
  public  name_ja : typeof _def.email.type.prototype;
  public  name_en : typeof _def.password.type.prototype;

  public static modelInterface = <IAdmin>{};
  public static model          = _model;
  public static schema         = _schema;

  /**
   * ファクトリメソッド
   */
  public static createDocument(doc: Object = {}) {
    return new Admin.model(doc);
  }

}

export = Admin;
