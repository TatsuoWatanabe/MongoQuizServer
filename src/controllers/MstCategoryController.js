var Category = require('../models/Category');
var Pager = require('../lib/Pager');
var MstCategoryController = (function () {
    function MstCategoryController() {
    }
    /**
     * render the page.
     */
    MstCategoryController.index = function (req, res) {
        var paginateDefaults = { page: 1, limit: 10 };
        var paginateOption = {
            page: Number(req.query.page) || paginateDefaults.page,
            limit: Number(req.query.limit) || paginateDefaults.limit,
            searchWords: req.query.search_words || '',
        };
        var query = Category.createSearchQuery(paginateOption.searchWords);
        Category.model.paginate(query, paginateOption, function (err, results, pageCount, itemCount) {
            var pager = new Pager(results, pageCount, itemCount, paginateOption, paginateDefaults);
            res.render('mstCategory/index', {
                params: {
                    title: 'Category Master',
                    name: 'category',
                    pager: pager,
                    searchWords: paginateOption.searchWords,
                    newDocument: Category.createDocument()
                }
            });
        });
    };
    /**
     * 編集用フォームのレンダリング
     */
    MstCategoryController.formRow = function (req, res) {
        Category.model.findById(req.params._id || null).exec().onResolve(function (err, result) {
            var doc = result || Category.createDocument();
            MstCategoryController.renderFormRow(doc, res);
        }).onReject(function (err) {
            res.send('rejected.');
        });
    };
    /**
     * 確定ボタン押下時処理
     */
    MstCategoryController.execRow = function (req, res) {
        Category.model.findById(req.body._id || null).exec().onResolve(function (err, result) {
            var valueObject = req.body;
            delete valueObject._id;
            var doc = result || Category.createDocument();
            doc.set(valueObject);
            doc.save(function (validationErr, savedResult) {
                if (validationErr) {
                    MstCategoryController.renderFormRow(doc, res);
                }
                else {
                    MstCategoryController.renderRow(savedResult._id, res);
                }
            });
        }).onReject(function (err) {
            res.send('rejected.');
        });
    };
    /**
     * 削除ボタン押下時処理
     */
    MstCategoryController.deleteRow = function (req, res) {
        Category.model.findById(req.params._id).exec().onResolve(function (err, result) {
            result.remove(function (err) {
                res.send('OK');
            });
        }).onReject(function (err) {
            res.send('NG');
        });
    };
    /**
     * 取消ボタン押下時処理
     */
    MstCategoryController.cancelRow = function (req, res) {
        MstCategoryController.renderRow(req.params._id, res);
    };
    /**
     * １行のレンダリング
     */
    MstCategoryController.renderRow = function (_id, res) {
        Category.model.findById(_id || null).exec().onResolve(function (err, result) {
            var doc = result || Category.createDocument();
            res.render('mstCategory/renderRow', {
                params: {
                    'doc': doc
                }
            });
        }).onReject(function (err) {
            res.send('rejected.');
        });
    };
    /**
     * １行の編集用レンダリング
     */
    MstCategoryController.renderFormRow = function (doc, res) {
        res.render('mstCategory/rowEdit', {
            'params': {
                'doc': doc
            }
        });
    };
    MstCategoryController.paths = {
        index: '/mst/category',
        editRow: function (_id) { return '/mst/category/editRow/' + _id; },
        cancelRow: function (_id) { return '/mst/category/cancelRow/' + _id; },
        deleteRow: function (_id) { return '/mst/category/deleteRow/' + _id; },
        insertRow: '/mst/category/insertRow',
        execRow: '/mst/category/execRow'
    };
    return MstCategoryController;
})();
module.exports = MstCategoryController;
//# sourceMappingURL=MstCategoryController.js.map