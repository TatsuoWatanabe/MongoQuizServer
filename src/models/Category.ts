import mongoose      = require('mongoose');
import Routes        = require('../Routes');
import ModelBase     = require('./ModelBase');
import Quiz          = require('./Quiz');
const mongoosePaginate = require('mongoose-paginate');
const routes: () => typeof Routes = () => require('../Routes');
const paths = () => routes().paths.mstCategory;

const _def = {
  objectId: mongoose.Schema.Types.ObjectId,
  name_ja : { type: String , 'default': '', required: '{PATH} is required!'},
  name_en : { type: String , 'default': '' },
  note    : { type: String , 'default': '' },
  created : { type: Date   , 'default': Date.now },
  modified: { type: Date   , 'default': Date.now }
};
const _schema = new mongoose.Schema(
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
const _model = mongoose.model<ICategory>('Category', _schema);

/**
 * @see http://chords.hatenablog.com/entry/2014/12/21/クラスをインタフェースとして使う。mongooseのモデル
 */
class Category extends ModelBase {
  public static modelInterface = <ICategory>{};
  public static model          = _model;
  public static schema         = _schema;

  public  objectId: typeof _def.objectId;
  public  name_ja : typeof _def.name_ja.type.prototype;
  public  name_en : typeof _def.name_en.type.prototype;
  public  note    : typeof _def.note.type.prototype;
  private created : typeof _def.created.type.prototype;
  private modified: typeof _def.modified.type.prototype;

  /**
   * factory method
   */
  public static createDocument(doc: Object = {}) {
    return new Category.model(doc);
  }

  /**
   * create search query from search words.
   */
  public static createSearchQuery(searchWords = '') {
    if (!searchWords) { return {}; }
    const pattern = searchWords.replace(/(\S+)\s*/g, '(?=.*$1)'); // And search pattern
    const regExp  = RegExp(pattern, 'i');
    const query   = {
      '$or': [
        { body_ja: regExp },
        { body_en: regExp }
      ]
    };
    return query;
  }

}

export = Category;