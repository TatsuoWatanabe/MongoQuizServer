import AppView = require('AppView');
import Trace   = require('Trace');

class Filter {
  /** filter difinition of app.*/
  private static states = {
    ja: 'ja',
    en: 'en'
  };
  
  /** filter state of app. */
  private static _state  = '';

  public static get lang() {
    var language = Filter._state;
    return (!language || language === 'ja') ? 'ja' : 'en';
  }

  public static get langObj() {
    return {
      'ja': Filter.lang === 'ja',
      'en': Filter.lang === 'en'
    };
  }

  /** main View class of app */
  private static appView: AppView;

  /** set the View class of app */
  public static setAppView(v: AppView) {
    Filter.appView = v;
  }

  /** set the filter words to app and apply it.*/
  public static setState(value: string) {
    Trace.log(value, 'Filter: setState');
    Filter._state = value;
    Filter.appView.applyStateAndShow();
  }

}

class Router extends Backbone.Router {
  public static filter = Filter;

  public routes() {
      return { '*filter': Filter.setState }
  }
}

export = Router;