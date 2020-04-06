var SheetConfigReader = function (options) {
  if (options === undefined) throw new Error("options must contains sheetUrl");
  if (options.sourceData === undefined)
    console.error(
      new Error("options must contains raw data of the configuration sheet")
    );

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
   * Check the format of value of the variable configured.
   * It must be VariableName::VariableValue
   *
   * @param {string} variableStr The string value of the variable configured
   */
  ChecksVariableFormat: function (variableStr) {
    if (variableStr.indexOf("::") === -1) {
      console.error(
        new Error(
          "The variable must be formatted 'VariableName::VariableValue'"
        )
      );
    }
  },
  /**
   * Checks the array is made of 2 elements and neither is empty
   * @param {array} variableArray The variable name and value in an array
   */
  ChecksVariableArray: function (variableArray) {
    if (variableArray.length !== 2) {
      console.error(new Error("Is the variable missing its value or name?"));
    }
    const VariableName = variableArray[0];
    if (VariableName === "") {
      console.error(new Error("The variable name is missing."));
    }
    const VariableValue = variableArray[1];
    if (VariableValue === "") {
      console.error(new Error("The variable value is missing."));
    }
  },
  /**
   * Parse the data into an object.
   * @returns {object}
   */
  GetConfig: function () {
    if (this.enableLog) console.log(this.SourceData);
    const VariableCol = this.SourceData.columnNames[0];
    const DocsCol = this.SourceData.columnNames[1];
    if (!this.SomeVariablesExist(this.SourceData.elements)) return {};

    let config = {};
    this.SourceData.elements.forEach((variableRaw) => {
      this.ParseVariable(config, variableRaw, VariableCol);
    });
    if (this.enableLog) console.log("Config", config);
    return config;
  },
  /**
   * Parse the variable into the config object.
   * @param {object} config The config object filled from the parsed data.
   * @param {object} variableRaw A tabletop row element.
   * @param {string} VariableCol The name of column to read the variable from.
   */
  ParseVariable: function (config, variableRaw, VariableCol) {
    let variableStr = variableRaw[VariableCol];
    this.ChecksVariableFormat(variableStr);
    const variableArray = variableStr.split("::");
    this.ChecksVariableArray(variableArray);
    Object.defineProperty(config, variableArray[0], {
      value: variableArray[1],
    });
  },
};
