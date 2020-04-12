var SheetConfigReader = function (options) {
  if (options === undefined)
    new SheetMessenger("options must contains sheetUrl").ThrowError();
  if (options.sourceData === undefined)
    new SheetMessenger(
      "options must contains raw data of the configuration sheet"
    ).ThrowError();

  /**
   * The source data
   */
  this.SourceData = options.sourceData;

  /**
   * Flag to enable console logs
   */
  this.enableLog = options.enableLog | false;
};

SheetConfigReader.prototype = {
  /**
   * Look up the length of the array.
   * @param {array} elements The tabletop elements representing the rows of the
   * Configuration sheet.
   * @returns {bool}
   */
  SomeVariablesExist: function (elements) {
    if (elements === undefined) return false;

    return elements.length > 0;
  },
  /**
   * Check the column name
   * @param {string} columnName The string value of the column to ckeck
   * @param {bool} isKey indicate if the string to check is the key or the value.
   */
  CheckColumnFormat: function (columnName, isKey) {
    const inputSource = `${isKey ? "Key" : "Value"}`;
    const undefinedMessage = `The ${inputSource} colum must be named. It is undefined.`;
    const emptyMessage = `The ${inputSource} colum must be named. It is empty.`;
    const badNameMessage = `The colum isn't named ${inputSource}. It equals to "${columnName}".`;
    if (columnName === undefined) {
      new SheetMessenger(undefinedMessage).ThrowError();
    }
    if (columnName.trim() === "") {
      new SheetMessenger(emptyMessage).ThrowError();
    }
    if (isKey) {
      if (columnName.trim() !== "Key")
        new SheetMessenger(badNameMessage).ThrowError();
      return;
    }
    if (!isKey) {
      if (columnName.trim() !== "Value")
        new SheetMessenger(badNameMessage).ThrowError();
      return;
    }
  },
  /**
   * Checks the array is made of 2 elements and neither is empty
   * @param {string} stringToCheck The variable name and value in an array
   * @param {int} rowNumber The row in the sheet
   * @param {bool} isKey indicate if the string to check is the key or the value.
   */
  CheckVariable: function (stringToCheck, rowNumber, isKey = true) {
    switch (isKey) {
      case true:
        if (stringToCheck.trim() === "") {
          new SheetMessenger(
            `The key in row ${rowNumber} is missing. The configuration variable will be ignored.`
          ).AddConsoleWarn();
          return false;
        }
        break;

      default:
        if (stringToCheck.trim() === "") {
          new SheetMessenger(
            `The value in row ${rowNumber} is missing. It will be ignored.`
          ).AddConsoleWarn();
          return false;
        }
        break;
    }
    return true;
  },
  /**
   * Parse the data into an object.
   * @returns {object}
   */
  GetConfig: function () {
    if (this.enableLog) console.log(this.SourceData);
    const KeyCol = this.SourceData.columnNames[0];
    this.CheckColumnFormat(KeyCol, true);
    const ValueCol = this.SourceData.columnNames[1];
    this.CheckColumnFormat(ValueCol, false);
    if (!this.SomeVariablesExist(this.SourceData.elements)) return {};

    let config = {};
    let rowNumber = 2;
    this.SourceData.elements.forEach((variableRaw) => {
      this.ParseVariable(config, variableRaw, KeyCol, ValueCol, rowNumber);
      rowNumber += 1;
    });
    new SheetMessenger("Config", config).AddConsoleLog(this.enableLog);
    return config;
  },
  /**
   * Parse the variable into the config object.
   * @param {object} config The config object filled from the parsed data.
   * @param {object} variableRaw A tabletop row element.
   * @param {string} KeyCol The name of column to read the name of the variable from.
   * @param {string} ValueCol The name of column to read the value of the variable from.
   * @param {int} currentRowNum The number of the row being read. It is start at 2 as the row 1 is the headers
   */
  ParseVariable: function (
    config,
    variableRaw,
    keyCol,
    valueCol,
    currentRowNum
  ) {
    let keyStr = variableRaw[keyCol];
    const keyIsOk = this.CheckVariable(keyStr, currentRowNum, true);

    let valueStr = variableRaw[valueCol];
    const valueIsOk = this.CheckVariable(valueStr, currentRowNum, false);

    if (!keyIsOk || !valueIsOk) return;
    Object.defineProperty(config, keyStr, {
      value: valueStr,
    });
  },
};

if (typeof module !== "undefined" && module.exports) {
  //don't just use inNodeJS, we may be in Browserify
  module.exports = SheetConfigReader;
} else if (typeof define === "function" && define.amd) {
  define(function () {
    return SheetConfigReader;
  });
} else {
  window.SheetConfigReader = SheetConfigReader;
}
