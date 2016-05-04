"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var mongoose = require('mongoose');
var ModelBase = require('./ModelBase');
var mongoosePaginate = require('mongoose-paginate');
var routes = function () { return require('../Routes'); };
var paths = function () { return routes().paths.mstQuiz; };
var Choice = (function () {
    function Choice() {
    }
    Choice.def = {
        objectId: mongoose.Schema.Types.ObjectId,
        body_ja: { type: String, 'default': '' },
        body_en: { type: String, 'default': '' },
        point: { type: Number, 'default': 0 }
    };
    Choice.schema = new mongoose.Schema(Choice.def);
    Choice.model = mongoose.model('Choice', Choice.schema);
    Choice.modelInterface = {};
    return Choice;
}());
var _def = {
    objectId: mongoose.Schema.Types.ObjectId,
    body_ja: { type: String, required: '{PATH} is required!' },
    body_en: { type: String, 'default': '' },
    choices: { type: [Choice.schema], 'default': [] },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true }],
    explanation_ja: { type: String, 'default': '' },
    explanation_en: { type: String, 'default': '' },
    active: { type: Boolean, 'default': false },
    random: { type: [Number], 'default': function () { return [Math.random(), Math.random()]; }, index: '2d' },
    created: { type: Date, 'default': Date.now },
    modified: { type: Date, 'default': Date.now }
};
var _schema = new mongoose.Schema(_def).pre('save', function (next) {
    this.modified = Date.now();
    next();
}).plugin(mongoosePaginate);
(function () {
    ModelBase.resisterUrls(_schema, paths);
})();
var _model = mongoose.model('Quiz', _schema);
/**
 * @see http://chords.hatenablog.com/entry/2014/12/21/クラスをインタフェースとして使う。mongooseのモデル
 */
var Quiz = (function (_super) {
    __extends(Quiz, _super);
    function Quiz() {
        _super.apply(this, arguments);
    }
    /**
     * factory method
     */
    Quiz.createDocument = function (doc) {
        if (doc === void 0) { doc = {}; }
        return new Quiz.model(doc);
    };
    Quiz.createChoiceDocument = function (doc) {
        if (doc === void 0) { doc = {}; }
        return new Choice.model(doc);
    };
    /**
     * create search query from search words.
     */
    Quiz.createSearchQuery = function (searchWords) {
        if (searchWords === void 0) { searchWords = ''; }
        if (!searchWords) {
            return {};
        }
        var pattern = searchWords.replace(/(\S+)\s*/g, '(?=.*$1)'); // And search pattern
        var regExp = RegExp(pattern, 'i');
        var query = {
            '$or': [
                { body_ja: regExp },
                { body_en: regExp }
            ]
        };
        return query;
    };
    Quiz.modelInterface = {};
    Quiz.model = _model;
    Quiz.schema = _schema;
    return Quiz;
}(ModelBase));
module.exports = Quiz;
//# sourceMappingURL=Quiz.js.map