"use strict";
(this["webpackChunk_zesty_io_explorer"] = this["webpackChunk_zesty_io_explorer"] || []).push([["react-syntax-highlighter_languages_refractor_ini"],{

/***/ "./node_modules/refractor/lang/ini.js":
/*!********************************************!*\
  !*** ./node_modules/refractor/lang/ini.js ***!
  \********************************************/
/***/ ((module) => {



module.exports = ini
ini.displayName = 'ini'
ini.aliases = []
function ini(Prism) {
  Prism.languages.ini = {
    comment: /^[ \t]*[;#].*$/m,
    selector: /^[ \t]*\[.*?\]/m,
    constant: /^[ \t]*[^\s=]+?(?=[ \t]*=)/m,
    'attr-value': {
      pattern: /=.*/,
      inside: {
        punctuation: /^[=]/
      }
    }
  }
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyX2xhbmd1YWdlc19yZWZyYWN0b3JfaW5pLmV4cGxvcmVyLmRldi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQHplc3R5LWlvL2V4cGxvcmVyLy4vbm9kZV9tb2R1bGVzL3JlZnJhY3Rvci9sYW5nL2luaS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSBpbmlcbmluaS5kaXNwbGF5TmFtZSA9ICdpbmknXG5pbmkuYWxpYXNlcyA9IFtdXG5mdW5jdGlvbiBpbmkoUHJpc20pIHtcbiAgUHJpc20ubGFuZ3VhZ2VzLmluaSA9IHtcbiAgICBjb21tZW50OiAvXlsgXFx0XSpbOyNdLiokL20sXG4gICAgc2VsZWN0b3I6IC9eWyBcXHRdKlxcWy4qP1xcXS9tLFxuICAgIGNvbnN0YW50OiAvXlsgXFx0XSpbXlxccz1dKz8oPz1bIFxcdF0qPSkvbSxcbiAgICAnYXR0ci12YWx1ZSc6IHtcbiAgICAgIHBhdHRlcm46IC89LiovLFxuICAgICAgaW5zaWRlOiB7XG4gICAgICAgIHB1bmN0dWF0aW9uOiAvXls9XS9cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==