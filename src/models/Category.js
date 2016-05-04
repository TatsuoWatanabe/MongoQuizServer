"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var mongoose = require('mongoose');
var ModelBase = require('./ModelBase');
var Quiz = require('./Quiz');
var mongoosePaginate = require('mongoose-paginate');
var routes = function () { return require('../Routes'); };
var paths = function () { return routes().paths.mstCategory; };
var _def = {
    objectId: mongoose.Schema.Types.ObjectId,
    name_ja: { type: String, 'default': '', required: '{PATH} is required!' },
    name_en: { type: String, 'default': '' },
    note: { type: String, 'default': '' },
    created: { type: Date, 'default': Date.now },
    modified: { type: Date, 'default': Date.now }
};
var _schema = new mongoose.Schema(_def).pre('save', function (next) {
    this.modified = Date.now();
    next();
}).post('remove', function (doc) {
    Quiz.model.update({ categories: doc._id }, { $pull: { 'categories': doc._id } }, { multi: true }).exec();
}).plugin(mongoosePaginate);
(function () {
    ModelBase.resisterUrls(_schema, paths);
})();
var _model = mongoose.model('Category', _schema);
/**
 * @see http://chords.hatenablog.com/entry/2014/12/21/クラスをインタフェースとして使う。mongooseのモデル
 */
var Category = (function (_super) {
    __extends(Category, _super);
    function Category() {
        _super.apply(this, arguments);
    }
    /**
     * factory method
     */
    Category.createDocument = function (doc) {
        if (doc === void 0) { doc = {}; }
        return new Category.model(doc);
    };
    /**
     * create search query from search words.
     */
    Category.createSearchQuery = function (searchWords) {
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
    Category.modelInterface = {};
    Category.model = _model;
    Category.schema = _schema;
    return Category;
}(ModelBase));
module.exports = Category;
//# sourceMappingURL=Category.js.map