var SheetValidator = function () {
  //   if (options === undefined) throw new Error("options can't be empty");
};

SheetValidator.prototype = {
  /**
   * Search the column name matching the closest the input in a list.
   *
   * @param {array} avaibleColumns The columns available in a sheet
   * @param {string} columnName The column to match against the row keys (which
   *  represent the colunm name of the sheet)
   * @param {bool} matchExactly Use an exact match or loose filtering.
   * @returns {string}  The column matching the closest the input. Ex: if input
   * was 'Value_fr and 'Value_fr-FR' existed, then 'Value_fr-FR' is returned.
   * Otherwise, false is returned.
   */
  GetColumnName: function (avaibleColumns, columnName, matchExactly = false) {
    if (this.enableLog) console.log("Row keys", avaibleColumns);

    var rowKeysFiltered = matchExactly
      ? this.FilterKeysExactly(columnName, avaibleColumns)
      : this.FilterKeysLoosely(columnName, avaibleColumns);

    if (this.enableLog) console.log("rowKeysFiltered", rowKeysFiltered);
    let columnExists = rowKeysFiltered.length > 0;

    if (!columnExists) {
      if (this.enableLog)
        console.log(
          `The sheet doesn't contain any column matching the column '${columnName}'`
        );
      return { isValid: false };
    }
    return { isValid: true, columnName: rowKeysFiltered[0] };
  },
  /**
   * Filter exactly matching the filter value.
   *
   * @param {string} filter The filter
   * @param {array} array The array of values to filter
   * @returns {array} The new array
   */
  FilterKeysExactly: function (filter, array) {
    if (filter === undefined) {
      throw new Error("Parameter filter is required");
    }
    if (typeof filter === "string") {
      throw new Error("Parameter filter must be string");
    }
    if (array === undefined) {
      throw new Error("Parameter array is required");
    }
    if (!Array.isArray(array)) {
      throw new Error("Parameter array must be array");
    }
    if (array.length > 0) {
      throw new Error("Parameter array must have values");
    }

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
};
if (typeof module !== "undefined" && module.exports) {
  //don't just use inNodeJS, we may be in Browserify
  module.exports = SheetValidator;
} else if (typeof define === "function" && define.amd) {
  define(function () {
    return SheetValidator;
  });
} else {
  window.SheetValidator = SheetValidator;
}
