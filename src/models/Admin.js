"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var mongoose = require('mongoose');
var ModelBase = require('./ModelBase');
var _def = {
    objectId: mongoose.Schema.Types.ObjectId,
    email: { type: String, 'default': '', required: '{PATH} is required!' },
    password: { type: String, 'default': '', required: '{PATH} is required!' },
    created: { type: Date, 'default': Date.now },
    modified: { type: Date, 'default': Date.now }
};
var _schema = new mongoose.Schema(_def).pre('save', function (next) {
    this.modified = Date.now();
    next();
});
var _model = mongoose.model('Admin', _schema);
/**
 * @see http://chords.hatenablog.com/entry/2014/12/21/クラスをインタフェースとして使う。mongooseのモデル
 */
var Admin = (function (_super) {
    __extends(Admin, _super);
    function Admin() {
        _super.apply(this, arguments);
    }
    /**
     * ファクトリメソッド
     */
    Admin.createDocument = function (doc) {
        if (doc === void 0) { doc = {}; }
        return new Admin.model(doc);
    };
    Admin.modelInterface = {};
    Admin.model = _model;
    Admin.schema = _schema;
    return Admin;
}(ModelBase));
module.exports = Admin;
//# sourceMappingURL=Admin.js.map