define(["require", "exports"], function (require, exports) {
    var Trace = (function () {
        function Trace() {
        }
        Trace.log = function (message, title) {
            if (title === void 0) { title = 'Trace.log'; }
            var separator = ' --- ' + title + ' --- ';
            console.log(separator);
            console.log(message);
            console.log(Array(separator.length).join('-'));
        };
        return Trace;
    })();
    return Trace;
});
//# sourceMappingURL=Trace.js.map