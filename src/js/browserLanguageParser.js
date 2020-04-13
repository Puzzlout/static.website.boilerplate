var BrowserLanguageParser = function (options) {
  /**
   * Flag to enable console logs
   */
  this.enableLog = false;
  if (options !== undefined) {
    this.enableLog = options.enableLog | false;
  }
  /**
   * The default language
   */
  this.DEFAULT_LANG = "en";
};

BrowserLanguageParser.prototype = {
  /**
   * Returns the default language since navigator.languages isn't supported.
   * @returns {string} The default language
   */
  ReturnDefaultIfNavigatorLangsUnsupported: function () {
    if (this.enableLog) {
      console.log(
        "navigator.languages not supported... Using default language " +
          this.DEFAULT_LANG
      );
    }
    return this.DEFAULT_LANG;
  },
  /**
   * Returns the default language since navigator.languages is undefined or null.
   * @returns {string} The default language
   */
  ReturnDefaultIfNavigatorLangsUndefinedOrNull: function () {
    if (this.enableLog) {
      console.log(
        "navigator.languages is undefined or null... Using default language " +
          this.DEFAULT_LANG
      );
    }
    return this.DEFAULT_LANG;
  },
  /**
   * Returns the default language since navigator.languages is empty.
   * @returns {string} The default language
   */
  ReturnDefaultIfNavigatorLangsEmpty: function () {
    if (this.enableLog) {
      console.log(
        "navigator.languages is empty... Using default language " +
          this.DEFAULT_LANG
      );
    }
    return this.DEFAULT_LANG;
  },
  /**
   * Read first language from navigator.languages when available
   * to load the site in the prefered user language.
   * @returns {string} navigator.languages[0] | DEFAULT_LANG
   */
  GetBrowserFirstLang: function () {
    if (!navigator.languages) {
      return this.ReturnDefaultIfNavigatorLangsUnsupported();
    }

    if (navigator.languages === undefined || navigator.languages === null) {
      return this.ReturnDefaultIfNavigatorLangsUndefinedOrNull();
    }

    if (navigator.languages.length === 0) {
      return this.ReturnDefaultIfNavigatorLangsEmpty();
    }

    return navigator.languages[0];
  },
};

if (typeof module !== "undefined" && module.exports) {
  //don't just use inNodeJS, we may be in Browserify
  module.exports = BrowserLanguageParser;
} else if (typeof define === "function" && define.amd) {
  define(function () {
    return BrowserLanguageParser;
  });
} else {
  window.BrowserLanguageParser = BrowserLanguageParser;
}
