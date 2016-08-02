import mongoose      = require('mongoose');
import Routes        = require('../Routes');
import ModelBase     = require('./ModelBase');
const mongoosePaginate = require('mongoose-paginate');
const routes: () => typeof Routes = () => require('../Routes');
const paths = () => routes().paths.mstQuiz;

interface IChoice extends mongoose.Document, Choice { }

class Choice {
  public static def = {
    objectId : mongoose.Schema.Types.ObjectId,
    body_ja  : { type: String, 'default': ''},
    body_en  : { type: String, 'default': ''},
    point    : { type: Number, 'default': 0 }
  };
  public static schema         = new mongoose.Schema(Choice.def);
  public static model          = mongoose.model<IChoice>('Choice', Choice.schema);
  public static modelInterface = <IChoice>{};

  public objectId : typeof Choice.def.objectId;
  public body_ja  : typeof Choice.def.body_ja.type.prototype;
  public body_en  : typeof Choice.def.body_en.type.prototype;
  public point    : typeof Choice.def.point.type.prototype;
}

const _def = {
  objectId      : mongoose.Schema.Types.ObjectId,
  body_ja       : { type: String            , required: '{PATH} is required!'},
  body_en       : { type: String            , 'default': '' },
  choices       : { type: [Choice.schema]   , 'default': [] },
  categories    : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true }],
  explanation_ja: { type: String            , 'default': '' },
  explanation_en: { type: String            , 'default': '' },
  active        : { type: Boolean           , 'default': false },
  random        : { type: [Number]          , 'default': () => { return [Math.random(), Math.random()]; }, index: '2d'},
  created       : { type: Date              , 'default': Date.now },
  modified      : { type: Date              , 'default': Date.now }
};

const _schema = new mongoose.Schema(
  _def
).pre('save', function (next) {
  this.modified = Date.now();
  next();
}).plugin(mongoosePaginate);

(() => {
  ModelBase.resisterUrls(_schema, paths);
})();

interface IQuiz extends mongoose.Document, Quiz { }
const _model = mongoose.model<IQuiz>('Quiz', _schema);

/**
 * @see http://chords.hatenablog.com/entry/2014/12/21/クラスをインタフェースとして使う。mongooseのモデル
 */
class Quiz extends ModelBase {
  public static modelInterface = <IQuiz>{};
  public static model          = _model;
  public static schema         = _schema;

  public  objectId      : typeof _def.objectId;
  public  body_ja       : typeof _def.body_ja.type.prototype;
  public  body_en       : typeof _def.body_en.type.prototype;
  public  choices       : typeof _def.choices.type;
  public  categories    : typeof _def.categories;
  public  explanation_ja: typeof _def.explanation_ja.type;
  public  explanation_en: typeof _def.explanation_en.type;
  public  active        : typeof _def.active;
  private created       : typeof _def.created.type.prototype;
  private modified      : typeof _def.modified.type.prototype;

  /**
   * factory method
   */
  public static createDocument(doc: Object = {}) {
    return new Quiz.model(doc);
  }

  public static createChoiceDocument(doc: Object = {}) {
    return new Choice.model(doc);
  }

  /**
   * create search query from search words.
   */
  public static createSearchQuery(searchWords = '') {
    if (!searchWords) { return {}; }
    const pattern = searchWords.replace(/(\S+)\s*/g, '(?=.*$1)'); // And search pattern
    const regExp  = RegExp(pattern, 'i');
    const query   = {
      $or: [
        { body_ja: regExp },
        { body_en: regExp },
        { explanation_ja: regExp },
        { explanation_en: regExp },
        { choices: {
            $elemMatch: {
              $or: [
                { body_ja: regExp },
                { body_en: regExp }
              ]
            }
          }
        }
      ]
    };
    return query;
  }

}

export = Quiz;