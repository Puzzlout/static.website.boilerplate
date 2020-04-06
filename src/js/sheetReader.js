var SheetReader = function (options) {
  if (options === "undefined")
    throw new Error("options must contains sheetUrl");

  /**
   * The url of the Google Sheet to read
   */
  this.sheetUrl = options.sheetUrl;
  /**
   * Flag to enable console logs
   */
  this.enableLog = options.enableLog | false;
  /**
   * The Google Sheet configuration
   */
  (this.config = {}),
    /**
     * The default language
     */
    (this.DEFAULT_LANG = "en");
  /**
   * The sheet defining the other sheet types
   */
  this.SHEET_DATATYPE = "Sheet_DataType";
  /**
   * The sheet defining the other sheet types
   */
  this.SHEET_CONFIGURATION = "Configuration";
};

SheetReader.prototype = {
  /**
   * Read first language from navigator.languages when available
   * to load the site in the prefered user language.
   *
   * @returns {string} navigator.languages[0] | DEFAULT_LANG
   */
  getBrowserFirstLang: function () {
    if (!navigator.languages) {
      if (this.enableLog)
        console.log(
          "navigator.languages not supported... Using default language " +
            DEFAULT_LANG
        );
      return DEFAULT_LANG;
    }

    if (navigator.languages === null) {
      if (this.enableLog)
        console.log(
          "navigator.languages is empty... Using default language " +
            DEFAULT_LANG
        );
      return DEFAULT_LANG;
    }

    return navigator.languages[0];
  },
  /**
   * Check that the source Google Sheets document contains a sheet named after SHEET_DATATYPE constant.
   *
   * @param {tabletop} tabletop instance of Table
   */
  checkSheetTypeExists: function (tabletop) {
    if (tabletop.models[this.SHEET_DATATYPE] === undefined) {
      const invalidGoogleSheetMsg =
        "Please create a sheet 'Sheet_DataType' to define how should be transformed each sheet data";
      alert(invalidGoogleSheetMsg);
      throw new Error(invalidGoogleSheetMsg);
    }
  },
  /**
   * Checks that the sheet is declared in the sheet declaring the DataType of the data
   * contained in the sheet requested.
   *
   * @param {string} sheetDataType The type of data contained in the sheet
   * @param {string} sheetName The sheet name
   */
  checkSheetType: function (sheetDataType, sheetName) {
    if (sheetDataType[sheetName] === undefined) {
      const sheetNotDeclaredInSheetDataType =
        "Please add " +
        sheetName +
        " in sheet 'Sheet_DataType' to define how it should be transformed from the Google Sheet document";
      alert(sheetNotDeclaredInSheetDataType);
      throw new Error(sheetNotDeclaredInSheetDataType);
    }
  },
  /**
   * Loads the configuration sheet data.
   * @param {tabletop} tabletop The instance of TableTop
   */
  loadConfig: function (tabletop) {
    this.config = new SheetConfigReader({
      sourceData: tabletop.models[this.SHEET_CONFIGURATION],
      enableLog: this.enableLog,
    }).GetConfig();
  },
  /**
   * Load the Google sheet data in a promise using gsheet2json
   */
  getSpreadsheetData: function () {
    self = this;
    return new Promise(function (resolve, reject) {
      var options = {
        key: self.sheetUrl,
        callback: onLoad,
        simpleSheet: true,
      };

      function onLoad(data, tabletop) {
        // 'data' is the array for a simple spreadsheet
        // 'tabletop' is the whole object with sheets and more.
        // could resolve(tabletop) too.

        // probably should do an error check here and then:
        // if (err) {reject(err); }

        resolve(tabletop);
        return;
      }

      Tabletop.init(options);
    });
  },

  /**
   * Transform the data read with gsheet2json into the
   * desired structure to use in the application.
   *
   * @param {tabletop} tabletop instance of TableTop
   * @returns {object} the transformed data
   */
  processSheetData: function (tabletop) {
    if (this.enableLog) console.log("Language", this.getBrowserFirstLang());
    if (this.enableLog) console.log(tabletop);
    this.loadConfig(tabletop);
    this.checkSheetTypeExists(tabletop);
    var sheetDataType = new DataTransformer().transformDataToObject(
      tabletop.models[this.SHEET_DATATYPE]
    );
    //since forEach doesn't use arrow function,
    //"this" in the forEach is not Vue instance!
    //so create a copy of this (Vue instance) to use into the forEach.
    const sheetReader = this;
    let transformedFullData = {};
    tabletop.modelNames.forEach(function (sheetName) {
      var sheet = tabletop.models[sheetName];
      //if (self.enableLog) console.log("Sheet " + sheetName, sheet.elements);
      sheetReader.checkSheetType(sheetDataType, sheetName);

      var transformedData = new DataTransformer().transformSheetData(
        sheet,
        sheetDataType[sheetName]
      );
      if (transformedData) {
        Object.defineProperty(transformedFullData, sheetName, {
          value: transformedData,
        });
      }
    });
    if (this.enableLog) console.log("Formatted data", transformedFullData);
    return transformedFullData;
  },
};
