const SHEET_DATATYPE = "Sheet_DataType";
var app = new Vue({
  el: "#app",
  data: {
    sheetUrl:
      "https://docs.google.com/spreadsheets/d/1pVp5uwv405TRNBnBXhZPJzstx614fV8KQ3TZvaLzNAc/pubhtml",
    data: {},
    loading: true,
    enableLog: true,
    useGoogleForms: true,
    showTos: false
  },
  methods: {
    showtos: function(event) {
      this.showTos = true;
    },
    hidetos: function(event) {
      this.showTos = false;
    },
    getSpreadsheetData: function() {
      self = this;
      return new Promise(function(resolve, reject) {
        var options = {
          key: self.sheetUrl,
          callback: onLoad,
          simpleSheet: true
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
    processSheetData: function(tabletop) {
      self = this;
      if (this.enableLog) console.log(tabletop);
      //since forEach doesn't use arrow function, "this" in the forEach is not Vue instance!
      if (tabletop.models[SHEET_DATATYPE] === undefined) {
        const invalidGoogleSheetMsg =
          "Please create a sheet 'Sheet_DataType' to define how should be transformed each sheet data";
        alert(invalidGoogleSheetMsg);
        throw new Error(invalidGoogleSheetMsg);
      }
      var sheetDataType = this.transformDataToObject(
        tabletop.models[SHEET_DATATYPE]
      );
      tabletop.modelNames.forEach(function(sheetName) {
        var sheet = tabletop.models[sheetName];
        //if (self.enableLog) console.log("Sheet " + sheetName, sheet.elements);
        if (sheetDataType[sheetName] === undefined) {
          const sheetNotDeclaredInSheetDataType =
            "Please add " +
            sheetName +
            " in sheet 'Sheet_DataType' to define how it should be transformed from the Google Sheet document";
          alert(sheetNotDeclaredInSheetDataType);
          throw new Error(sheetNotDeclaredInSheetDataType);
        }

        var transformedData = self.transformSheetData(
          sheet,
          sheetDataType[sheetName]
        );
        if (transformedData) {
          Object.defineProperty(self.data, sheetName, {
            value: transformedData
          });
        }
      });
      if (this.enableLog) console.log("Formatted data", this.data);
      this.loading = false;
    },
    transformSheetData: function(sheet, dataType) {
      if (dataType === "ignore") return false;
      if (dataType === "array") return this.transformDataToArray(sheet);
      if (dataType === "object") return this.transformDataToObject(sheet);
      if (dataType === "nestedObject")
        return this.transformDataToNestedObject(sheet);

      console.warn("Type " + dataType + " is not implemented at the moment. ");
      console.warn("Sheet '" + sheet.name + "' will be ignored.");
    },
    transformDataToNestedObject: function(sheetData) {
      self = this;
      var arrObjs = [];
      sheetData.elements.forEach(function(row) {
        var sectionName = row.Section;
        if (!arrObjs[sectionName]) {
          Object.defineProperty(arrObjs, sectionName, {
            value: {}
          });
        }
        Object.defineProperty(arrObjs[sectionName], row.Key, {
          value: row.Value
        });
      });
      return arrObjs;
    },
    transformDataToArray: function(sheetData) {
      self = this;
      var labels = [];
      sheetData.elements.forEach(function(row) {
        labels.push({
          key: row.Key,
          value: row.Value,
          href: row.Href,
          order: row.Order,
          isActive:
            row.IsActive !== undefined && row.IsActive.toLowerCase() === "true"
              ? true
              : false,
          openNewTab:
            row.OpenNewTab !== undefined &&
            row.OpenNewTab.toLowerCase() === "true"
              ? true
              : false
        });
      });
      return labels;
    },
    transformDataToObject: function(sheetData) {
      var newObject = {};
      sheetData.elements.forEach(function(row) {
        Object.defineProperty(newObject, row.Key, {
          value: row.Value
        });
      });
      return newObject;
    },
    loadSheetData: function() {
      var runPromise = this.getSpreadsheetData();
      self = this;
      runPromise
        .then(function(tabletop) {
          self.processSheetData(tabletop);
        })
        .catch(function(promise_err) {
          console.log(promise_err);
        });
    }
  },
  created: function() {
    this.loadSheetData();
  }
});
