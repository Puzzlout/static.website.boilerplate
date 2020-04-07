var BrowserLanguageParser = function (enableLog) {
  /**
   * Flag to enable console logs
   */
  this.enableLog = enableLog | false;
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
        console.warn(
          "navigator.languages is empty... Using default language " +
            this.DEFAULT_LANG
        );
      return this.DEFAULT_LANG;
    }

    return navigator.languages[0];
  },
};