"use strict";
(this["webpackChunk_zesty_io_explorer"] = this["webpackChunk_zesty_io_explorer"] || []).push([["react-syntax-highlighter_languages_refractor_matlab"],{

/***/ "./node_modules/refractor/lang/matlab.js":
/*!***********************************************!*\
  !*** ./node_modules/refractor/lang/matlab.js ***!
  \***********************************************/
/***/ ((module) => {



module.exports = matlab
matlab.displayName = 'matlab'
matlab.aliases = []
function matlab(Prism) {
  Prism.languages.matlab = {
    comment: [/%\{[\s\S]*?\}%/, /%.+/],
    string: {
      pattern: /\B'(?:''|[^'\r\n])*'/,
      greedy: true
    },
    // FIXME We could handle imaginary numbers as a whole
    number: /(?:\b\d+\.?\d*|\B\.\d+)(?:[eE][+-]?\d+)?(?:[ij])?|\b[ij]\b/,
    keyword: /\b(?:break|case|catch|continue|else|elseif|end|for|function|if|inf|NaN|otherwise|parfor|pause|pi|return|switch|try|while)\b/,
    function: /(?!\d)\w+(?=\s*\()/,
    operator: /\.?[*^\/\\']|[+\-:@]|[<>=~]=?|&&?|\|\|?/,
    punctuation: /\.{3}|[.,;\[\](){}!]/
  }
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyX2xhbmd1YWdlc19yZWZyYWN0b3JfbWF0bGFiLmV4cGxvcmVyLmRldi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLFVBQVU7QUFDNUI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsRUFBRSxLQUFLLFFBQVE7QUFDcEM7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0B6ZXN0eS1pby9leHBsb3Jlci8uL25vZGVfbW9kdWxlcy9yZWZyYWN0b3IvbGFuZy9tYXRsYWIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gbWF0bGFiXG5tYXRsYWIuZGlzcGxheU5hbWUgPSAnbWF0bGFiJ1xubWF0bGFiLmFsaWFzZXMgPSBbXVxuZnVuY3Rpb24gbWF0bGFiKFByaXNtKSB7XG4gIFByaXNtLmxhbmd1YWdlcy5tYXRsYWIgPSB7XG4gICAgY29tbWVudDogWy8lXFx7W1xcc1xcU10qP1xcfSUvLCAvJS4rL10sXG4gICAgc3RyaW5nOiB7XG4gICAgICBwYXR0ZXJuOiAvXFxCJyg/OicnfFteJ1xcclxcbl0pKicvLFxuICAgICAgZ3JlZWR5OiB0cnVlXG4gICAgfSxcbiAgICAvLyBGSVhNRSBXZSBjb3VsZCBoYW5kbGUgaW1hZ2luYXJ5IG51bWJlcnMgYXMgYSB3aG9sZVxuICAgIG51bWJlcjogLyg/OlxcYlxcZCtcXC4/XFxkKnxcXEJcXC5cXGQrKSg/OltlRV1bKy1dP1xcZCspPyg/Oltpal0pP3xcXGJbaWpdXFxiLyxcbiAgICBrZXl3b3JkOiAvXFxiKD86YnJlYWt8Y2FzZXxjYXRjaHxjb250aW51ZXxlbHNlfGVsc2VpZnxlbmR8Zm9yfGZ1bmN0aW9ufGlmfGluZnxOYU58b3RoZXJ3aXNlfHBhcmZvcnxwYXVzZXxwaXxyZXR1cm58c3dpdGNofHRyeXx3aGlsZSlcXGIvLFxuICAgIGZ1bmN0aW9uOiAvKD8hXFxkKVxcdysoPz1cXHMqXFwoKS8sXG4gICAgb3BlcmF0b3I6IC9cXC4/WypeXFwvXFxcXCddfFsrXFwtOkBdfFs8Pj1+XT0/fCYmP3xcXHxcXHw/LyxcbiAgICBwdW5jdHVhdGlvbjogL1xcLnszfXxbLiw7XFxbXFxdKCl7fSFdL1xuICB9XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=