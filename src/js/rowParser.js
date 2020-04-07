var RowParser = function (options) {
  if (options === undefined) throw new Error("options can't be empty");
  if (options.rawRow === undefined)
    console.error(new Error("options must contains a tabletop row value"));
  if (Object.keys(options.rawRow).length > 0) {
    console.error(
      new Error("options must contains a tabletop row value with properties")
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
   * Filter exactly matching the filter value.
   *
   * @param {string} filter The filter
   * @param {array} array The array of values to filter
   * @returns {array} The new array
   */
  FilterKeysExactly: function (filter, array) {
    let arrayFiltered = [];
    const regex = new RegExp("^" + filter.toLowerCase() + "$", "g");
    array.reduce((accumulator, key) => {
      return key.toLowerCase().match(regex)
        ? arrayFiltered.push(key)
        : arrayFiltered;
    });
    return arrayFiltered;
  },
  /**
   * Filter loosely matching the filter value.
   *
   * @param {string} filter The filter
   * @param {array} array The array of values to filter
   * @returns {array} The new array
   */
  FilterKeysLoosely: function (filter, array) {
    let arrayFiltered = [];
    array.reduce((accumulator, key) => {
      return key.toLowerCase().indexOf(filter.toLowerCase()) != -1
        ? arrayFiltered.push(key)
        : arrayFiltered;
    });
    return arrayFiltered;
  },
  /**
   * Find the column name matching the closest the input
   *
   * @param {string} columnName The column to match against the row keys (which
   *  represent the colunm name of the sheet)
   * @param {bool} matchExactly Use an exact match or loose filtering.
   * @returns {string}  The column matching the closest the input. Ex: if input
   * was 'Value_fr and 'Value_fr-FR' existed, then 'Value_fr-FR' is returned.
   * Otherwise, false is returned.
   */
  GetColumnName: function (columnName, matchExactly = false) {
    const rowKeys = Object.keys(this.RawRow);
    if (this.enableLog) console.log("Row keys", rowKeys);

    var rowKeysFiltered = matchExactly
      ? this.FilterKeysExactly(columnName, rowKeys)
      : this.FilterKeysLoosely(columnName, rowKeys);

    if (this.enableLog) console.log("rowKeysFiltered", rowKeysFiltered);
    let columnExists = rowKeysFiltered.length > 0;

    if (!columnExists) {
      if (this.enableLog)
        console.log(
          `The sheet doesn't contain any column matching the column '${columnName}'`
        );
      return false;
    }
    return rowKeysFiltered[0];
  },
  /**
   * Finds the localized colunm name.
   *
   * @returns {string}  The column name found or False
   */
  GetI8nColumnExistsForUserLanguage: function () {
    const I8nColumnName = this.BuildExpectedI8nColumnName();
    return this.GetColumnName(I8nColumnName);
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
    const columnName = this.GetI8nColumnExistsForUserLanguage();
    if (columnName) {
      const value = this.RawRow[columnName];
      if (this.enableLog) console.log("i8n value", value);
      return value;
    }

    if (this.enableLog) console.log("Falling back to default column...");
    const defaultColumName = this.GetColumnName(this.DEFAULT_COLUMN_NAME, true);
    if (defaultColumName) return this.RawRow.Value;

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
