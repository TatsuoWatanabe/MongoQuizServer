import Router = require('Router');

/** 
 * @see http://twitter.github.io/hogan.js/
 */
declare var Hogan;

class AppView extends Backbone.View<Backbone.Model> {
  public  $el           = $('#quizapp');
  private $quizApp      = $('#quizapp');
  private $quizDisplay  = $('#quiz-display');
  private $pointDisplay = $('#point-display');
  private $choicesList  = $('#choices-list');
  private $btnStart     = $('#btn-start');
  private mainApiPath   = 'http://mongoquizserver.herokuapp.com/api';
  private apiPaths = {
    'tatsuowatanabe.github.io': this.mainApiPath,
    'localhost'               : '/api'
  };
  private quizzes       = [];
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
    var url = this.apiPaths[location.hostname] || this.mainApiPath;
    this.$btnStart.hide();
    this.resetResults();
    $.ajax(url, {
      data: { limit: 10 }
    }).done((data) => {
      this.quizzes = data;
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
    var index     = $(ev.target).data('index');
    var choice    = this.currentQuiz.choices[index];
    var point     = this.takePoint(choice);
    var isCorrect = (point > 0);
    this.results.total += point;
    if (isCorrect) {
      this.$quizApp.tempAddClass('correct', 800);
    } else {
      this.$quizApp.tempAddClass('incorrect', 800);
      this.results.incorrects.push(this.currentQuiz);
    }
    this.showPoints();
    this.nextQuiz();
  }

  private takePoint(choice: { point_min: number; point_max: number }) {
    var max = choice.point_max;
    var min = choice.point_min;
    return Math.floor(Math.random() * (max - min) + min);
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
    this.$choicesList.html(choicesHtml).toggle(!!choices.length);
  }

}

export = AppView;