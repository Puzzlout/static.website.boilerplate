var DataTransformer = function () {};

/**
 * Define the prototype of DataTransformer
 */
DataTransformer.prototype = {
  transformSheetData: function (sheet, dataType) {
    if (dataType === "ignore") return false;
    if (dataType === "array") return this.transformDataToArray(sheet);
    if (dataType === "object") return this.transformDataToObject(sheet);
    if (dataType === "nestedObject")
      return this.transformDataToNestedObject(sheet);

    console.warn("Type " + dataType + " is not implemented at the moment. ");
    console.warn("Sheet '" + sheet.name + "' will be ignored.");
  },

  transformDataToNestedObject: function (sheetData) {
    self = this;
    var arrObjs = [];
    sheetData.elements.forEach(function (row) {
      var sectionName = row.Section;
      if (!arrObjs[sectionName]) {
        Object.defineProperty(arrObjs, sectionName, {
          value: {},
        });
      }
      Object.defineProperty(arrObjs[sectionName], row.Key, {
        value: row.Value,
      });
    });
    return arrObjs;
  },

  transformDataToArray: function (sheetData) {
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

  transformDataToObject: function (sheetData) {
    var newObject = {};
    sheetData.elements.forEach(function (row) {
      Object.defineProperty(newObject, row.Key, {
        value: row.Value,
      });
    });
    return newObject;
  },
};
