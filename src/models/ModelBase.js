"use strict";
var ModelBase = (function () {
    function ModelBase() {
    }
    /** resister url properties as virtual field of mongoose model. */
    ModelBase.resisterUrls = function (schema, paths) {
        var names = {
            editUrl: 'editUrl',
            cancelUrl: 'cancelUrl',
            deleteUrl: 'deleteUrl',
            execUrl: 'execUrl',
            insertUrl: 'insertUrl'
        };
        Object.keys(names).forEach(function (key) {
            schema.virtual(key).get(function () {
                var url = (key === names.editUrl) ? paths().editRow(this._id) :
                    (key === names.cancelUrl) ? paths().cancelRow(this._id) :
                        (key === names.deleteUrl) ? paths().deleteRow(this._id) :
                            (key === names.execUrl) ? paths().execRow :
                                (key === names.insertUrl) ? paths().insertRow : '';
                return url;
            });
        });
    };
    return ModelBase;
}());
module.exports = ModelBase;
//# sourceMappingURL=ModelBase.js.map