var Quiz = require('../models/Quiz');
var ApiController = (function () {
    function ApiController() {
    }
    ApiController.index = function (req, res) {
        var limit = Number(req.query.limit) || 10;
        var query = Quiz.model.find({}).limit(limit).populate({ path: 'categories' });
        query.exec(function (err, results) {
            res.send(results);
        });
    };
    ApiController.paths = {
        index: '/api'
    };
    return ApiController;
})();
module.exports = ApiController;
//# sourceMappingURL=ApiController.js.map