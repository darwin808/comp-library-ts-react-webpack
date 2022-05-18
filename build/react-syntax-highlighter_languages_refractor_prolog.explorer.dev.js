"use strict";
(this["webpackChunk_zesty_io_explorer"] = this["webpackChunk_zesty_io_explorer"] || []).push([["react-syntax-highlighter_languages_refractor_prolog"],{

/***/ "./node_modules/refractor/lang/prolog.js":
/*!***********************************************!*\
  !*** ./node_modules/refractor/lang/prolog.js ***!
  \***********************************************/
/***/ ((module) => {



module.exports = prolog
prolog.displayName = 'prolog'
prolog.aliases = []
function prolog(Prism) {
  Prism.languages.prolog = {
    // Syntax depends on the implementation
    comment: [/%.+/, /\/\*[\s\S]*?\*\//],
    // Depending on the implementation, strings may allow escaped newlines and quote-escape
    string: {
      pattern: /(["'])(?:\1\1|\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: true
    },
    builtin: /\b(?:fx|fy|xf[xy]?|yfx?)\b/,
    variable: /\b[A-Z_]\w*/,
    // FIXME: Should we list all null-ary predicates (not followed by a parenthesis) like halt, trace, etc.?
    function: /\b[a-z]\w*(?:(?=\()|\/\d+)/,
    number: /\b\d+\.?\d*/,
    // Custom operators are allowed
    operator: /[:\\=><\-?*@\/;+^|!$.]+|\b(?:is|mod|not|xor)\b/,
    punctuation: /[(){}\[\],]/
  }
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyX2xhbmd1YWdlc19yZWZyYWN0b3JfcHJvbG9nLmV4cGxvcmVyLmRldi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QjtBQUM5Qix1QkFBdUI7QUFDdkI7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0B6ZXN0eS1pby9leHBsb3Jlci8uL25vZGVfbW9kdWxlcy9yZWZyYWN0b3IvbGFuZy9wcm9sb2cuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gcHJvbG9nXG5wcm9sb2cuZGlzcGxheU5hbWUgPSAncHJvbG9nJ1xucHJvbG9nLmFsaWFzZXMgPSBbXVxuZnVuY3Rpb24gcHJvbG9nKFByaXNtKSB7XG4gIFByaXNtLmxhbmd1YWdlcy5wcm9sb2cgPSB7XG4gICAgLy8gU3ludGF4IGRlcGVuZHMgb24gdGhlIGltcGxlbWVudGF0aW9uXG4gICAgY29tbWVudDogWy8lLisvLCAvXFwvXFwqW1xcc1xcU10qP1xcKlxcLy9dLFxuICAgIC8vIERlcGVuZGluZyBvbiB0aGUgaW1wbGVtZW50YXRpb24sIHN0cmluZ3MgbWF5IGFsbG93IGVzY2FwZWQgbmV3bGluZXMgYW5kIHF1b3RlLWVzY2FwZVxuICAgIHN0cmluZzoge1xuICAgICAgcGF0dGVybjogLyhbXCInXSkoPzpcXDFcXDF8XFxcXCg/OlxcclxcbnxbXFxzXFxTXSl8KD8hXFwxKVteXFxcXFxcclxcbl0pKlxcMS8sXG4gICAgICBncmVlZHk6IHRydWVcbiAgICB9LFxuICAgIGJ1aWx0aW46IC9cXGIoPzpmeHxmeXx4Zlt4eV0/fHlmeD8pXFxiLyxcbiAgICB2YXJpYWJsZTogL1xcYltBLVpfXVxcdyovLFxuICAgIC8vIEZJWE1FOiBTaG91bGQgd2UgbGlzdCBhbGwgbnVsbC1hcnkgcHJlZGljYXRlcyAobm90IGZvbGxvd2VkIGJ5IGEgcGFyZW50aGVzaXMpIGxpa2UgaGFsdCwgdHJhY2UsIGV0Yy4/XG4gICAgZnVuY3Rpb246IC9cXGJbYS16XVxcdyooPzooPz1cXCgpfFxcL1xcZCspLyxcbiAgICBudW1iZXI6IC9cXGJcXGQrXFwuP1xcZCovLFxuICAgIC8vIEN1c3RvbSBvcGVyYXRvcnMgYXJlIGFsbG93ZWRcbiAgICBvcGVyYXRvcjogL1s6XFxcXD0+PFxcLT8qQFxcLzsrXnwhJC5dK3xcXGIoPzppc3xtb2R8bm90fHhvcilcXGIvLFxuICAgIHB1bmN0dWF0aW9uOiAvWygpe31cXFtcXF0sXS9cbiAgfVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9