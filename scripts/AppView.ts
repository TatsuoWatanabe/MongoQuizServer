import Router = require('Router');

/** 
 * @see http://twitter.github.io/hogan.js/
 */
declare var Hogan;

class AppView extends Backbone.View<Backbone.Model> {
  public  $el              = $('#quizapp');
  private $quizApp         = $('#quizapp');
  private $quizDisplay     = $('#quiz-display');
  private $pointDisplay    = $('#point-display');
  private $progressDisplay = $('#progress-display');
  private $choicesList     = $('#choices-list');
  private $btnStart        = $('#btn-start');
  private mainApiPath      = 'http://mongoquizserver.herokuapp.com/api';
  private apiPaths = (() => {
    var obj = {};
    obj[location.host]              = location.protocol + '//' + location.host + '/api';
    obj['tatsuowatanabe.github.io'] = this.mainApiPath;
    return obj;
  })();
  private quizzes       = [];
  private allQuizzes    = [];
  private currentQuiz: any;
  private results = {
    total      : 0,
    incorrects : [],
    isEnd      : false,
    explanation: { ja: '', en: '' },
    reset      : () => {
      this.results.total      = 0;
      this.results.isEnd      = false;
      this.results.incorrects = [];
      this.results.explanation.ja  = this.results.explanation.en  = '';
    }
  };

  constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
    super(options);
    $.ajaxSetup({
      beforeSend: () => { $.ajaxLoaderImg.fadeIn();  },
      complete  : () => { $.ajaxLoaderImg.fadeOut(); }
    });

    this.delegateEvents({
      'click #btn-start'          : this.startQuiz,
      'click #choices-list button': this.answer
    });

    this.applyStateAndShow();
  }

  public applyStateAndShow() {
    this.showHeader();
    this.showWelcome();
    this.showPoints();
    this.showLangageSelector();
    if (this.results.isEnd) { this.showResult(); }
    else                    { this.showQuiz();   }
  }

  private showWelcome() {
    var $welcomeDisplay = $('#welcome-display');
    if ($welcomeDisplay.length === 0) { return; }
    var welcomeTemplate = Hogan.compile($('#welcome-template').html());
    var welcomeHtml     = welcomeTemplate.render(Router.filter.langObj);
    $welcomeDisplay.html(welcomeHtml);
  }

  private startQuiz() {
    var url = this.apiPaths[location.host] || this.mainApiPath;
    this.$btnStart.hide();
    this.resetResults();
    $.ajax(url, {
      data: { limit: 10 }
    }).done((data) => {
      this.quizzes    = _.clone(data);
      this.allQuizzes = _.clone(data);
      this.initProgress(this.quizzes);
      this.nextQuiz();
    }).fail(() => {
      this.$btnStart.show();
    });
  }

  private resetResults() {
    this.results.reset();
    this.showPoints();
  }

  private answer(ev:Event) {
    var index          = $(ev.target).data('index');
    var choice         = this.currentQuiz.choices[index];
    var point          = this.takePoint(choice);
    var isCorrect      = (point > 0);
    var quizIndex      = this.allQuizzes.length - this.quizzes.length - 1;
    var answerClass    = isCorrect ? 'correct' : 'incorrect';
    this.results.total += point;
    this.$quizApp.tempAddClass(answerClass, 800);
    if (!isCorrect) { this.results.incorrects.push(this.currentQuiz); }
    this.progress(quizIndex, answerClass);
    this.showPoints();
    this.nextQuiz();
  }

  private initProgress(quizzes) {
    var cellsInRow     = 10;
    var cellsInRestRow = quizzes.length % cellsInRow;
    var rowCount       = Math.ceil(quizzes.length / cellsInRow);
    var $tbody         = this.$progressDisplay.find('table tbody');
    var $trs           = $.arrayInit(rowCount, $('<tr />'));
    var $trTds         = $trs.map(($elem, index) => {
      var isRest = (index + 1) === rowCount && cellsInRestRow !== 0;
      var cells  = isRest ? cellsInRestRow : cellsInRow;
      var $tr    = $elem.clone();
      var $tds   = $.arrayInit(cells, $('<td />'));
      $tds.forEach(($item) => $tr.append($item.clone()));
      if (isRest) { $tr.append($('<td colspan="' + (cellsInRow - cellsInRestRow) + '" />')); }
      return $tr;
    });
    $tbody.empty().append($trTds);
  }

  private progress(index: number, answerClass: string) {
    this.$progressDisplay.find('td').eq(index).addClass(answerClass);
  }

  private takePoint(choice: { point: number; }) {
    var p = choice.point;
    return Math.ceil(p * (1 + Math.random() * 0.5))
  }

  private nextQuiz() {
    this.currentQuiz = this.quizzes.shift();
    if (this.currentQuiz) {
      this.currentQuiz.choices = _.shuffle(this.currentQuiz.choices);
      this.showQuiz();
    } else {
      this.closeResults();
    }
  }

  private showPoints() {
    this.$pointDisplay.html(this.results.total + 'pt');
  }

  private closeResults() {
    var someIncorrect: any = _.sample(this.results.incorrects);
    this.results.isEnd = true;
    this.results.explanation.ja = someIncorrect ? someIncorrect.explanation_ja : '';
    this.results.explanation.en = someIncorrect ? someIncorrect.explanation_en : '';
    this.showResult();
  }

  private showResult() {
    var resultTemplate = Hogan.compile($('#result-template').html());
    var resultHtml = resultTemplate.render(_.extend(Router.filter.langObj, {
      total      : this.results.total,
      isPerfect  : this.results.incorrects.length === 0,
      explanation: Router.filter.langObj.ja ? this.results.explanation.ja  : this.results.explanation.en
    }));
    this.$quizDisplay.html(resultHtml);
    this.$choicesList.hide();
    this.$btnStart.show();
  }

  private showHeader() {
    var headerTemplate = Hogan.compile($('#header-template').html());
    var headerHtml     = headerTemplate.render(Router.filter.langObj);
    $('#main-title').html(headerHtml);
  }

  private showLangageSelector() {
    var langTemplate = Hogan.compile($('#lang-template').html());
    var langHtml     = langTemplate.render(Router.filter.langObj);
    $('#langage-selector').html(langHtml);
  }

  private showQuiz() {
    if (!this.currentQuiz) { return; }
    var q            = this.currentQuiz;
    var lang         = Router.filter.lang;
    var body: string = q['body_' + lang];
    var choices = q.choices.map((c, i) => {
      return {
        index: i,
        body : c['body_' + lang]
      };
    });
    var choicesTemplate = Hogan.compile($('#choices-template').html());
    var choicesHtml     = choicesTemplate.render({ 'choices': choices });
    this.$quizDisplay.html(body + '?');
    // set choices to DOM, and set visible state.
    this.$choicesList.html(choicesHtml).toggle(!!choices.length);
    // change size of the button text.
    this.$choicesList.find('li button').each((i, elem) => {
      var btnTxt = $(elem).text();
      if (btnTxt.length > 25) {
        $(elem).css('font-size', '80%');
      }
    });
  }

}

export = AppView;