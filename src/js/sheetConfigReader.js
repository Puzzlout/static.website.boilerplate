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
  SomeVariablesExist: function (elements) {
    if (elements === undefined) return false;

    return elements.length > 0;
  },
  ChecksVariableFormat: function (variableStr) {
    if (variableStr.indexOf("::") === -1) {
      console.error(
        new Error(
          "The variable must be formatted 'VariableName::VariableValye'"
        )
      );
    }
  },
  GetConfig: function () {
    if (this.enableLog) console.log(this.SourceData);
    const VariableCol = this.SourceData.columnNames[0];
    const DocsCol = this.SourceData.columnNames[1];
    if (!this.SomeVariablesExist(this.SourceData.elements)) return {};

    let config = {};
    this.SourceData.elements.forEach((variableRaw) => {
      let variableStr = variableRaw[VariableCol];
      this.ChecksVariableFormat(variableStr);
      const variableArray = variableStr.split("::");
      Object.defineProperty(config, variableArray[0], {
        value: variableArray[1],
      });
    });
    if (this.enableLog) console.log(config);
    return {};
  },
};
