import mongoose      = require('mongoose');
import _             = require('underscore');
import Routes        = require('../Routes');
import ModelBase     = require('./ModelBase');
import Category      = require('./Category');
var mongoosePaginate = require('mongoose-paginate');
var routes: () => typeof Routes = () => require('../Routes');
var paths = () => routes().paths.mstQuiz;

interface IChoice extends mongoose.Document, Choice { }

class Choice {
  public static def = {
    objectId : mongoose.Schema.Types.ObjectId,
    body_ja  : { type: String, 'default': ''},
    body_en  : { type: String, 'default': ''},
    point_max: { type: Number, 'default': 0 },
    point_min: { type: Number, 'default': 0 },
  };
  public static schema         = new mongoose.Schema(Choice.def);
  public static model          = mongoose.model<IChoice>('Choice', Choice.schema);
  public static modelInterface = <IChoice>{};

  public objectId : typeof Choice.def.objectId;
  public body_ja  : typeof Choice.def.body_ja.type.prototype;
  public body_en  : typeof Choice.def.body_en.type.prototype;
  public point_max: typeof Choice.def.point_max.type.prototype;
  public point_min: typeof Choice.def.point_min.type.prototype;
}

var _def = {
  objectId      : mongoose.Schema.Types.ObjectId,
  body_ja       : { type: String            , required: '{PATH} is required!'},
  body_en       : { type: String            , 'default': '' },
  choices       : { type: [Choice.schema]   , 'default': [] },
  categories    : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true }],
  explanation_ja: { type: String            , 'default': '' },
  explanation_en: { type: String            , 'default': '' },
  active        : { type: Boolean           , 'default': true },
  random        : { type: [Number]          , 'default': () => { return [Math.random(), Math.random()]}, index: '2d'},
  created       : { type: Date              , 'default': Date.now },
  modified      : { type: Date              , 'default': Date.now }
};

var _schema = new mongoose.Schema(
  _def
).pre('save', function (next) {
  this.modified = Date.now();
  next();
}).plugin(mongoosePaginate);

(() => {
  ModelBase.resisterUrls(_schema, paths);
})();

interface IQuiz extends mongoose.Document, Quiz { }
var _model = mongoose.model<IQuiz>('Quiz', _schema);

/**
 * @see http://chords.hatenablog.com/entry/2014/12/21/クラスをインタフェースとして使う。mongooseのモデル
 */
class Quiz extends ModelBase {
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

  public static modelInterface = <IQuiz>{};
  public static model          = _model;
  public static schema         = _schema;

  /**
   * ファクトリメソッド
   */
  public static createDocument(doc: Object = {}) {
    return new Quiz.model(doc);
  }

  public static createChoiceDocument(doc: Object = {}) {
    return new Choice.model(doc);
  }

}

export = Quiz;