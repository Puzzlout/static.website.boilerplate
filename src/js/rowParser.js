var RowParser = function (options) {
  if (options === undefined) throw new Error("options can't be empty");
  if (options.rawRow === undefined)
    throw new Error("options must contains a tabletop row value");
  if (Object.keys(options.rawRow).length === 0) {
    throw new Error(
      "options must contains a tabletop row value with properties"
    );
  }
  /**
   * Flag to enable console logs
   */
  this.enableLog = options.enableLog | false;
  this.Language = "en-US";
  this.RawRow = options.rawRow;
  /**
   * The Configuration
   */
  this.Config = options.config | {};
  this.DEFAULT_COLUMN_NAME = "Value";
};

RowParser.prototype = {
  RetrieveBrowserLang: function () {
    this.Language = new BrowserLanguageParser(
      this.enableLog
    ).GetBrowserFirstLang();
  },
  /**
   * Builds the column name of the value's row to read from the browser language
   * @returns {string}
   */
  BuildExpectedI8nColumnName: function () {
    return `${this.DEFAULT_COLUMN_NAME}_${this.Language}`;
  },
  /**
   * Builds the default column name of the value's row
   * @returns {string}
   */
  GetDefaultColumnValueName: function () {
    return this.DEFAULT_COLUMN_NAME;
  },
  /**
   * Finds the localized colunm name.
   *
   * @returns {string}  The column name found or False
   */
  GetI8nColumnExistsForUserLanguage: function () {
    const I8nColumnName = this.BuildExpectedI8nColumnName();
    return new SheetValidator().GetColumnName(
      Object.keys(this.RawRow),
      I8nColumnName
    );
  },
  /**
   * Reads the value of the resource for the given raw.
   * Returns the localized value if it exists.
   * Otherwise, returns the default value from DEFAULT_COLUMN_NAME.
   * Otherwise, throws an error as the sheet is not valid.
   *
   * @returns {string} The resource.
   */
  ReadI8nValue: function () {
    const i8nResult = this.GetI8nColumnExistsForUserLanguage();
    if (i8nResult.isValid) {
      const value = this.RawRow[i8nResult.columnName];
      if (this.enableLog) console.log("i8n value", value);
      return value;
    }

    if (this.enableLog) console.log("Falling back to default column...");
    const defaultResult = this.GetColumnName(
      Object.keys(this.RawRow),
      this.DEFAULT_COLUMN_NAME,
      true
    );
    if (defaultResult.isValid) return this.RawRow.Value;

    const errorMsg = "The sheet must at least contain a Value column";
    console.error(new Error(errorMsg));
    let errorElement = document.createElement("em");
    errorElement.style = "color: red; font-weight:bold;";
    errorElement.innerHTML = errorMsg;
    document.body.appendChild(errorElement);
  },
};
if (typeof module !== "undefined" && module.exports) {
  //don't just use inNodeJS, we may be in Browserify
  module.exports = RowParser;
} else if (typeof define === "function" && define.amd) {
  define(function () {
    return RowParser;
  });
} else {
  window.RowParser = RowParser;
}
