var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'Router'], function (require, exports, Router) {
    var AppView = (function (_super) {
        __extends(AppView, _super);
        function AppView(options) {
            var _this = this;
            _super.call(this, options);
            this.$el = $('#quizapp');
            this.$quizApp = $('#quizapp');
            this.$quizDisplay = $('#quiz-display');
            this.$pointDisplay = $('#point-display');
            this.$choicesList = $('#choices-list');
            this.$btnStart = $('#btn-start');
            this.mainApiPath = 'http://mongoquizserver.herokuapp.com/api';
            this.apiPaths = (function () {
                var obj = {};
                obj[location.host] = location.protocol + '//' + location.host + '/api';
                obj['tatsuowatanabe.github.io'] = _this.mainApiPath;
                return obj;
            })();
            this.quizzes = [];
            this.results = {
                total: 0,
                incorrects: [],
                isEnd: false,
                explanation: { ja: '', en: '' },
                reset: function () {
                    _this.results.total = 0;
                    _this.results.isEnd = false;
                    _this.results.incorrects = [];
                    _this.results.explanation.ja = _this.results.explanation.en = '';
                }
            };
            $.ajaxSetup({
                beforeSend: function () {
                    $.ajaxLoaderImg.fadeIn();
                },
                complete: function () {
                    $.ajaxLoaderImg.fadeOut();
                }
            });
            this.delegateEvents({
                'click #btn-start': this.startQuiz,
                'click #choices-list button': this.answer
            });
            this.applyStateAndShow();
        }
        AppView.prototype.applyStateAndShow = function () {
            this.showHeader();
            this.showWelcome();
            this.showPoints();
            this.showLangageSelector();
            if (this.results.isEnd) {
                this.showResult();
            }
            else {
                this.showQuiz();
            }
        };
        AppView.prototype.showWelcome = function () {
            var $welcomeDisplay = $('#welcome-display');
            if ($welcomeDisplay.length === 0) {
                return;
            }
            var welcomeTemplate = Hogan.compile($('#welcome-template').html());
            var welcomeHtml = welcomeTemplate.render(Router.filter.langObj);
            $welcomeDisplay.html(welcomeHtml);
        };
        AppView.prototype.startQuiz = function () {
            var _this = this;
            var url = this.apiPaths[location.host] || this.mainApiPath;
            this.$btnStart.hide();
            this.resetResults();
            $.ajax(url, {
                data: { limit: 10 }
            }).done(function (data) {
                _this.quizzes = data;
                _this.nextQuiz();
            }).fail(function () {
                _this.$btnStart.show();
            });
        };
        AppView.prototype.resetResults = function () {
            this.results.reset();
            this.showPoints();
        };
        AppView.prototype.answer = function (ev) {
            var index = $(ev.target).data('index');
            var choice = this.currentQuiz.choices[index];
            var point = this.takePoint(choice);
            var isCorrect = (point > 0);
            this.results.total += point;
            if (isCorrect) {
                this.$quizApp.tempAddClass('correct', 800);
            }
            else {
                this.$quizApp.tempAddClass('incorrect', 800);
                this.results.incorrects.push(this.currentQuiz);
            }
            this.showPoints();
            this.nextQuiz();
        };
        AppView.prototype.takePoint = function (choice) {
            var p = choice.point;
            return Math.ceil(p * (1 + Math.random() * 0.5));
        };
        AppView.prototype.nextQuiz = function () {
            this.currentQuiz = this.quizzes.shift();
            if (this.currentQuiz) {
                this.currentQuiz.choices = _.shuffle(this.currentQuiz.choices);
                this.showQuiz();
            }
            else {
                this.closeResults();
            }
        };
        AppView.prototype.showPoints = function () {
            this.$pointDisplay.html(this.results.total + 'pt');
        };
        AppView.prototype.closeResults = function () {
            var someIncorrect = _.sample(this.results.incorrects);
            this.results.isEnd = true;
            this.results.explanation.ja = someIncorrect ? someIncorrect.explanation_ja : '';
            this.results.explanation.en = someIncorrect ? someIncorrect.explanation_en : '';
            this.showResult();
        };
        AppView.prototype.showResult = function () {
            var resultTemplate = Hogan.compile($('#result-template').html());
            var resultHtml = resultTemplate.render(_.extend(Router.filter.langObj, {
                total: this.results.total,
                isPerfect: this.results.incorrects.length === 0,
                explanation: Router.filter.langObj.ja ? this.results.explanation.ja : this.results.explanation.en
            }));
            this.$quizDisplay.html(resultHtml);
            this.$choicesList.hide();
            this.$btnStart.show();
        };
        AppView.prototype.showHeader = function () {
            var headerTemplate = Hogan.compile($('#header-template').html());
            var headerHtml = headerTemplate.render(Router.filter.langObj);
            $('#main-title').html(headerHtml);
        };
        AppView.prototype.showLangageSelector = function () {
            var langTemplate = Hogan.compile($('#lang-template').html());
            var langHtml = langTemplate.render(Router.filter.langObj);
            $('#langage-selector').html(langHtml);
        };
        AppView.prototype.showQuiz = function () {
            if (!this.currentQuiz) {
                return;
            }
            var q = this.currentQuiz;
            var lang = Router.filter.lang;
            var body = q['body_' + lang];
            var choices = q.choices.map(function (c, i) {
                return {
                    index: i,
                    body: c['body_' + lang]
                };
            });
            var choicesTemplate = Hogan.compile($('#choices-template').html());
            var choicesHtml = choicesTemplate.render({ 'choices': choices });
            this.$quizDisplay.html(body + '?');
            this.$choicesList.html(choicesHtml).toggle(!!choices.length);
        };
        return AppView;
    })(Backbone.View);
    return AppView;
});
//# sourceMappingURL=AppView.js.map