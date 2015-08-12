var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'Trace'], function (require, exports, Trace) {
    var Filter = (function () {
        function Filter() {
        }
        Object.defineProperty(Filter, "lang", {
            get: function () {
                var language = Filter._state;
                return (!language || language === 'ja') ? 'ja' : 'en';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Filter, "langObj", {
            get: function () {
                return {
                    'ja': Filter.lang === 'ja',
                    'en': Filter.lang === 'en'
                };
            },
            enumerable: true,
            configurable: true
        });
        /** set the View class of app */
        Filter.setAppView = function (v) {
            Filter.appView = v;
        };
        /** set the filter words to app and apply it.*/
        Filter.setState = function (value) {
            Trace.log(value, 'Filter: setState');
            Filter._state = value;
            Filter.appView.applyStateAndShow();
        };
        /** filter difinition of app.*/
        Filter.states = {
            ja: 'ja',
            en: 'en'
        };
        /** filter state of app. */
        Filter._state = '';
        return Filter;
    })();
    var Router = (function (_super) {
        __extends(Router, _super);
        function Router() {
            _super.apply(this, arguments);
        }
        Router.prototype.routes = function () {
            return { '*filter': Filter.setState };
        };
        Router.filter = Filter;
        return Router;
    })(Backbone.Router);
    return Router;
});
//# sourceMappingURL=Router.js.map