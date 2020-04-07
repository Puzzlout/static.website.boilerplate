var RowParser = function (options) {
  if (options === undefined) throw new Error("options must contains sheetUrl");
  if (options.rawRow === undefined)
    console.error(new Error("options must contains a tabletop row value"));

  /**
   * Flag to enable console logs
   */
  this.enableLog = options.enableLog | false;
  this.Language = new BrowserLanguageParser(
    this.enableLog
  ).GetBrowserFirstLang();
  this.RawRow = options.rawRow;
  /**
   * The Configuration
   */
  this.Config = options.config | {};
};

RowParser.prototype = {
  BuildExpectedI8nColumnName: function () {
    return `Value_${this.Language}`;
  },
  GetDefaultColumnValueName: function () {
    return "Value";
  },
  GetColumnName: function (columnName) {
    const rowKeys = Object.keys(this.RawRow);
    if (this.enableLog) console.log("Row keys", rowKeys);
    let rowKeysFiltered = [];
    rowKeys.reduce((newArray, key) => {
      return key.toLowerCase().indexOf(columnName.toLowerCase()) != -1
        ? rowKeysFiltered.push(key)
        : rowKeysFiltered;
    });
    if (this.enableLog) console.log("rowKeysFiltered", rowKeysFiltered);
    let columnExists = rowKeysFiltered.length > 0;

    if (!columnExists) {
      console.log(
        `The sheet doesn't contain any column matching the column '${columnName}'`
      );
      return false;
    }
    return rowKeysFiltered[0];
  },
  GetI8nColumnExistsForUserLanguage: function () {
    const I8nColumnName = this.BuildExpectedI8nColumnName();
    return this.GetColumnName(I8nColumnName);
  },
  ReadI8nValue: function () {
    const columnName = this.GetI8nColumnExistsForUserLanguage();
    if (columnName) {
      const value = this.RawRow[columnName];
      if (this.enableLog) console.log("i8n value", value);
      return value;
    }

    const DefaultColumnName = this.GetDefaultColumnValueName();
    this.GetColumnName(DefaultColumnName);
    return this.RawRow.Value;
  },
};
