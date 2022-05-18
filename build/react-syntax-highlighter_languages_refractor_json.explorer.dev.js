"use strict";
(this["webpackChunk_zesty_io_explorer"] = this["webpackChunk_zesty_io_explorer"] || []).push([["react-syntax-highlighter_languages_refractor_json"],{

/***/ "./node_modules/refractor/lang/json.js":
/*!*********************************************!*\
  !*** ./node_modules/refractor/lang/json.js ***!
  \*********************************************/
/***/ ((module) => {



module.exports = json
json.displayName = 'json'
json.aliases = []
function json(Prism) {
  Prism.languages.json = {
    property: {
      pattern: /"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
      greedy: true
    },
    string: {
      pattern: /"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
      greedy: true
    },
    comment: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
    number: /-?\d+\.?\d*(e[+-]?\d+)?/i,
    punctuation: /[{}[\],]/,
    operator: /:/,
    boolean: /\b(?:true|false)\b/,
    null: {
      pattern: /\bnull\b/,
      alias: 'keyword'
    }
  }
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyX2xhbmd1YWdlc19yZWZyYWN0b3JfanNvbi5leHBsb3Jlci5kZXYuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQVk7O0FBRVo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQHplc3R5LWlvL2V4cGxvcmVyLy4vbm9kZV9tb2R1bGVzL3JlZnJhY3Rvci9sYW5nL2pzb24uanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0ganNvblxuanNvbi5kaXNwbGF5TmFtZSA9ICdqc29uJ1xuanNvbi5hbGlhc2VzID0gW11cbmZ1bmN0aW9uIGpzb24oUHJpc20pIHtcbiAgUHJpc20ubGFuZ3VhZ2VzLmpzb24gPSB7XG4gICAgcHJvcGVydHk6IHtcbiAgICAgIHBhdHRlcm46IC9cIig/OlxcXFwufFteXFxcXFwiXFxyXFxuXSkqXCIoPz1cXHMqOikvLFxuICAgICAgZ3JlZWR5OiB0cnVlXG4gICAgfSxcbiAgICBzdHJpbmc6IHtcbiAgICAgIHBhdHRlcm46IC9cIig/OlxcXFwufFteXFxcXFwiXFxyXFxuXSkqXCIoPyFcXHMqOikvLFxuICAgICAgZ3JlZWR5OiB0cnVlXG4gICAgfSxcbiAgICBjb21tZW50OiAvXFwvXFwvLip8XFwvXFwqW1xcc1xcU10qPyg/OlxcKlxcL3wkKS8sXG4gICAgbnVtYmVyOiAvLT9cXGQrXFwuP1xcZCooZVsrLV0/XFxkKyk/L2ksXG4gICAgcHVuY3R1YXRpb246IC9be31bXFxdLF0vLFxuICAgIG9wZXJhdG9yOiAvOi8sXG4gICAgYm9vbGVhbjogL1xcYig/OnRydWV8ZmFsc2UpXFxiLyxcbiAgICBudWxsOiB7XG4gICAgICBwYXR0ZXJuOiAvXFxibnVsbFxcYi8sXG4gICAgICBhbGlhczogJ2tleXdvcmQnXG4gICAgfVxuICB9XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=