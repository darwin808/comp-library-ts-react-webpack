"use strict";
(this["webpackChunk_zesty_io_explorer"] = this["webpackChunk_zesty_io_explorer"] || []).push([["react-syntax-highlighter_languages_refractor_hsts"],{

/***/ "./node_modules/refractor/lang/hsts.js":
/*!*********************************************!*\
  !*** ./node_modules/refractor/lang/hsts.js ***!
  \*********************************************/
/***/ ((module) => {



module.exports = hsts
hsts.displayName = 'hsts'
hsts.aliases = []
function hsts(Prism) {
  /**
   * Original by Scott Helme.
   *
   * Reference: https://scotthelme.co.uk/hsts-cheat-sheet/
   */
  Prism.languages.hsts = {
    directive: {
      pattern: /\b(?:max-age=|includeSubDomains|preload)/,
      alias: 'keyword'
    },
    safe: {
      pattern: /\d{8,}/,
      alias: 'selector'
    },
    unsafe: {
      pattern: /\d{1,7}/,
      alias: 'function'
    }
  }
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyX2xhbmd1YWdlc19yZWZyYWN0b3JfaHN0cy5leHBsb3Jlci5kZXYuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQVk7O0FBRVo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxtQkFBbUIsR0FBRztBQUN0QjtBQUNBLEtBQUs7QUFDTDtBQUNBLG1CQUFtQixJQUFJO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQHplc3R5LWlvL2V4cGxvcmVyLy4vbm9kZV9tb2R1bGVzL3JlZnJhY3Rvci9sYW5nL2hzdHMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gaHN0c1xuaHN0cy5kaXNwbGF5TmFtZSA9ICdoc3RzJ1xuaHN0cy5hbGlhc2VzID0gW11cbmZ1bmN0aW9uIGhzdHMoUHJpc20pIHtcbiAgLyoqXG4gICAqIE9yaWdpbmFsIGJ5IFNjb3R0IEhlbG1lLlxuICAgKlxuICAgKiBSZWZlcmVuY2U6IGh0dHBzOi8vc2NvdHRoZWxtZS5jby51ay9oc3RzLWNoZWF0LXNoZWV0L1xuICAgKi9cbiAgUHJpc20ubGFuZ3VhZ2VzLmhzdHMgPSB7XG4gICAgZGlyZWN0aXZlOiB7XG4gICAgICBwYXR0ZXJuOiAvXFxiKD86bWF4LWFnZT18aW5jbHVkZVN1YkRvbWFpbnN8cHJlbG9hZCkvLFxuICAgICAgYWxpYXM6ICdrZXl3b3JkJ1xuICAgIH0sXG4gICAgc2FmZToge1xuICAgICAgcGF0dGVybjogL1xcZHs4LH0vLFxuICAgICAgYWxpYXM6ICdzZWxlY3RvcidcbiAgICB9LFxuICAgIHVuc2FmZToge1xuICAgICAgcGF0dGVybjogL1xcZHsxLDd9LyxcbiAgICAgIGFsaWFzOiAnZnVuY3Rpb24nXG4gICAgfVxuICB9XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=