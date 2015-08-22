var Quiz = require('../models/Quiz');
var Category = require('../models/Category');
var Pager = require('../lib/Pager');
var MstQuizController = (function () {
    function MstQuizController() {
    }
    /**
     * メインページのレンダリング
     */
    MstQuizController.index = function (req, res) {
        var paginateDefaults = { page: 1, limit: 10 };
        var paginateOption = {
            page: Number(req.query.page) || paginateDefaults.page,
            limit: Number(req.query.limit) || paginateDefaults.limit
        };
        Quiz.model.paginate({}, paginateOption, function (err, results, pageCount, itemCount) {
            Quiz.model.populate(results, { path: 'categories' }, function (err, popDocs) {
                var pager = new Pager(popDocs, pageCount, itemCount, paginateOption, paginateDefaults);
                res.render('mstQuiz/index', {
                    params: {
                        title: 'Quiz master',
                        name: 'quiz',
                        pager: pager,
                        newDocument: Quiz.createDocument()
                    }
                });
            });
        });
    };
    /**
     * 編集用フォームのレンダリング
     */
    MstQuizController.formRow = function (req, res) {
        Quiz.model.findById(req.params._id || null).populate('categories').exec().onResolve(function (err, result) {
            var doc = result || Quiz.createDocument();
            MstQuizController.renderFormRow(doc, res);
        }).onReject(function (err) {
            res.send('rejected.');
        });
    };
    /**
     * 確定ボタン押下時処理
     */
    MstQuizController.execRow = function (req, res) {
        Quiz.model.findById(req.body._id || null).populate('categories').exec().onResolve(function (err, result) {
            var valueObject = req.body;
            delete valueObject._id;
            var doc = result || Quiz.createDocument();
            doc.set(valueObject);
            doc.save(function (validationErr, savedResult) {
                if (validationErr) {
                    MstQuizController.renderFormRow(doc, res);
                }
                else {
                    MstQuizController.renderRow(savedResult._id, res);
                }
            });
        }).onReject(function (err) {
            res.send('rejected.');
        });
    };
    /**
     * 削除ボタン押下時処理
     */
    MstQuizController.deleteRow = function (req, res) {
        Quiz.model.findById(req.params._id).exec().onResolve(function (err, result) {
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
    MstQuizController.cancelRow = function (req, res) {
        MstQuizController.renderRow(req.params._id, res);
    };
    /**
     * １行のレンダリング
     */
    MstQuizController.renderRow = function (_id, res) {
        Quiz.model.findById(_id || null).populate({ path: 'categories' }).exec().onResolve(function (err, result) {
            var doc = result || Quiz.createDocument();
            res.render('mstQuiz/renderRow', {
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
    MstQuizController.renderFormRow = function (doc, res) {
        Category.model.find({}).exec(function (err, categories) {
            var checkedIds = doc.categories.map(function (c) { return c.id; });
            res.render('mstQuiz/rowEdit', {
                'params': {
                    'doc': doc,
                    'newChoiceDoc': Quiz.createChoiceDocument(),
                    'categories': categories,
                    'checkedIds': checkedIds
                }
            });
        });
    };
    MstQuizController.paths = {
        index: '/mst/quiz',
        editRow: function (_id) { return '/mst/quiz/editRow/' + _id; },
        cancelRow: function (_id) { return '/mst/quiz/cancelRow/' + _id; },
        deleteRow: function (_id) { return '/mst/quiz/deleteRow/' + _id; },
        insertRow: '/mst/quiz/insertRow',
        execRow: '/mst/quiz/execRow'
    };
    return MstQuizController;
})();
module.exports = MstQuizController;
//# sourceMappingURL=MstQuizController.js.map