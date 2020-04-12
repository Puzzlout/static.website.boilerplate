var SheetMessenger = function (message) {
  this.Message = message;
  this.ModalElement = undefined;
};
SheetMessenger.prototype = {
  /**
   * Create the div element
   */
  BuildBaseElement: function () {
    this.ModalElement = document.createElement("div");
    this.ModalElement.className = "sheet-error";
  },
  /**
   * Send to console the log
   */
  AddConsoleLog: function (enableLog) {
    if (enableLog) console.log(this.Message);
  },
  /**
   * Send to console the information message
   */
  AddConsoleInfo: function () {
    console.info(this.Message);
  },
  /**
   * Send to console the warning
   */
  AddConsoleWarn: function () {
    console.warn(this.Message);
  },
  /**
   * Send to console the error
   */
  AddConsoleError: function () {
    console.error(new Error(this.Message));
  },
  /**
   * Send to console the error
   */
  ThrowError: function () {
    throw new Error(this.Message);
  },
  /**
   * Create a paragraph element with the div
   * @param {string} errorMessage The error message
   */
  FillElement: function (errorMessage) {
    let pErrorMessage = document.createElement("p");
    pErrorMessage.className = "sheet-error-message";
    pErrorMessage.innerHTML = this.Message;
    this.ModalElement.appendChild(pErrorMessage);
  },
  /**
   * Append the div element to the document.
   */
  AppendElementToDoc: function () {
    document.body.appendChild(this.ModalElement);
  },
  /**
   * Shortcut method to add a div containing an error before a console.error.
   */
  SetError: function () {
    this.BuildBaseElement();
    this.FillElement();
    this.AppendElementToDoc();
    this.AddConsoleError();
  },
  /**
   * Shortcut method to add a div containing an error before a final throw.
   */
  ThrowError: function () {
    this.BuildBaseElement();
    this.FillElement();
    this.AppendElementToDoc();
    this.ThrowError();
  },
};

if (typeof module !== "undefined" && module.exports) {
  //don't just use inNodeJS, we may be in Browserify
  module.exports = SheetMessenger;
} else if (typeof define === "function" && define.amd) {
  define(function () {
    return SheetMessenger;
  });
} else {
  window.SheetMessenger = SheetMessenger;
}
