var BrowserLanguageParser = function (options) {
  if (options === undefined) throw new Error("options cannot be empty");
  /**
   * Flag to enable console logs
   */
  this.enableLog = options.enableLog | false;
  /**
   * The default language
   */
  this.DEFAULT_LANG = "en";
};

BrowserLanguageParser.prototype = {
  /**
   * Read first language from navigator.languages when available
   * to load the site in the prefered user language.
   *
   * @returns {string} navigator.languages[0] | DEFAULT_LANG
   */
  GetBrowserFirstLang: function () {
    if (!navigator.languages) {
      if (this.enableLog)
        console.log(
          "navigator.languages not supported... Using default language " +
            this.DEFAULT_LANG
        );
      return this.DEFAULT_LANG;
    }

    if (navigator.languages === null) {
      if (this.enableLog)
        this.messenger(
          "navigator.languages is empty... Using default language " +
            this.DEFAULT_LANG
        ).AddConsoleWarn();
      return this.DEFAULT_LANG;
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
