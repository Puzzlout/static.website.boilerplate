var DataTransformer = function (options) {
  if (options === undefined) throw new Error("options must contains sheetUrl");
  if (options.config === undefined)
    console.error(new Error("options must contains a config object"));

  /**
   * The Configuration
   */
  this.Config = options.config;
};

/**
 * Define the prototype of DataTransformer
 */
DataTransformer.prototype = {
  TransformSheetData: function (sheet, dataType) {
    if (dataType === "ignore") return false;
    if (dataType === "array") return this.TransformDataToArray(sheet);
    if (dataType === "object") return this.TransformDataToObject(sheet);
    if (dataType === "nestedObject")
      return this.TransformDataToNestedObject(sheet);

    console.warn("Type " + dataType + " is not implemented at the moment. ");
    console.warn("Sheet '" + sheet.name + "' will be ignored.");
  },

  TransformDataToNestedObject: function (sheetData) {
    const dataTransformer = this;
    var arrObjs = [];
    sheetData.elements.forEach(function (row) {
      var sectionName = row.Section;
      if (!arrObjs[sectionName]) {
        Object.defineProperty(arrObjs, sectionName, {
          value: {},
        });
      }
      Object.defineProperty(arrObjs[sectionName], row.Key, {
        value: dataTransformer.GetValueI8n(row),
      });
    });
    return arrObjs;
  },

  TransformDataToArray: function (sheetData) {
    self = this;
    var labels = [];
    sheetData.elements.forEach(function (row) {
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
            : false,
      });
    });
    return labels;
  },

  TransformDataToObject: function (sheetData) {
    var newObject = {};
    sheetData.elements.forEach(function (row) {
      Object.defineProperty(newObject, row.Key, {
        value: row.Value,
      });
    });
    return newObject;
  },

  GetValueI8n: function (fullRow) {
    return fullRow.Value;
  },
};
