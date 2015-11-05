import mongoose      = require('mongoose');
import _             = require('underscore');
import Routes        = require('../Routes');
import ModelBase     = require('./ModelBase');
import Quiz          = require('./Quiz');
var mongoosePaginate = require('mongoose-paginate');
var routes: () => typeof Routes = () => require('../Routes');
var paths = () => routes().paths.mstCategory;

var _def = {
  objectId: mongoose.Schema.Types.ObjectId,
  name_ja : { type: String , 'default': '', required: '{PATH} is required!'},
  name_en : { type: String , 'default': '' },
  note    : { type: String , 'default': '' },
  created : { type: Date   , 'default': Date.now },
  modified: { type: Date   , 'default': Date.now }
};
var _schema = new mongoose.Schema(
  _def
).pre('save', function (next) {
  this.modified = Date.now();
  next();
}).post('remove', (doc) => {
  Quiz.model.update(
    { categories: doc._id },
    { $pull: { 'categories': doc._id } },
    { multi: true }
  ).exec();
}).plugin(mongoosePaginate);

(() => {
  ModelBase.resisterUrls(_schema, paths);
})();

interface ICategory extends mongoose.Document, Category { }
var _model = mongoose.model<ICategory>('Category', _schema);

/**
 * @see http://chords.hatenablog.com/entry/2014/12/21/クラスをインタフェースとして使う。mongooseのモデル
 */
class Category extends ModelBase {
  public  objectId: typeof _def.objectId;
  public  name_ja : typeof _def.name_ja.type.prototype;
  public  name_en : typeof _def.name_en.type.prototype;
  public  note    : typeof _def.note.type.prototype;
  private created : typeof _def.created.type.prototype;
  private modified: typeof _def.modified.type.prototype;

  public static modelInterface = <ICategory>{};
  public static model          = _model;
  public static schema         = _schema;

  /**
   * factory method
   */
  public static createDocument(doc: Object = {}) {
    return new Category.model(doc);
  }

  /**
   * create search query from search words.
   */
  public static createSearchQuery(searchWords: string = '') {
    if (!searchWords) { return {}; }
    var pattern = searchWords.replace(/(\S+)\s*/g, '(?=.*$1)'); // And search pattern
    var regExp  = RegExp(pattern, 'i');
    return {
      '$or': [
        { name_ja: regExp },
        { name_en: regExp }
      ]
    };
  }

}

export = Category;