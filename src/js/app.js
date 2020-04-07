var app = new Vue({
  el: "#app",
  data: {
    sheetUrl:
      "https://docs.google.com/spreadsheets/d/1pVp5uwv405TRNBnBXhZPJzstx614fV8KQ3TZvaLzNAc/pubhtml",
    data: {},
    loading: true,
    enableLog: true,
    useGoogleForms: true,
    showTos: false,
    i18n: true,
  },
  methods: {
    showtos: function (event) {
      this.showTos = true;
    },
    hidetos: function (event) {
      this.showTos = false;
    },
    loadSheetData: function () {
      var sheetReader = new SheetReader({
        sheetUrl: this.sheetUrl,
        enableLog: this.enableLog,
      });
      var runPromise = sheetReader.getSpreadsheetData();
      selfVue = this;
      runPromise
        .then(function (tabletop) {
          selfVue.data = sheetReader.processSheetData(tabletop);
          if (selfVue.enableLog) console.log(selfVue.data);

          selfVue.loading = false;
        })
        .catch(function (promise_err) {
          console.log(promise_err);
        });
    },
  },
  created: function () {
    if (this.enableLog) console.log("Languages", navigator.languages);
    this.loadSheetData();
    if (!this.data) throw new Error("No data");

    const docLang = document.querySelector("html");
    docLang.lang = new BrowserLanguageParser().GetBrowserFirstLang();
  },
});
