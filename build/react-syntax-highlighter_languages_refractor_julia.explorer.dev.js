"use strict";
(this["webpackChunk_zesty_io_explorer"] = this["webpackChunk_zesty_io_explorer"] || []).push([["react-syntax-highlighter_languages_refractor_julia"],{

/***/ "./node_modules/refractor/lang/julia.js":
/*!**********************************************!*\
  !*** ./node_modules/refractor/lang/julia.js ***!
  \**********************************************/
/***/ ((module) => {



module.exports = julia
julia.displayName = 'julia'
julia.aliases = []
function julia(Prism) {
  Prism.languages.julia = {
    comment: {
      pattern: /(^|[^\\])#.*/,
      lookbehind: true
    },
    string: /("""|''')[\s\S]+?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2/,
    keyword: /\b(?:abstract|baremodule|begin|bitstype|break|catch|ccall|const|continue|do|else|elseif|end|export|finally|for|function|global|if|immutable|import|importall|in|let|local|macro|module|print|println|quote|return|struct|try|type|typealias|using|while)\b/,
    boolean: /\b(?:true|false)\b/,
    number: /(?:\b(?=\d)|\B(?=\.))(?:0[box])?(?:[\da-f]+\.?\d*|\.\d+)(?:[efp][+-]?\d+)?j?/i,
    operator: /[-+*^%÷&$\\]=?|\/[\/=]?|!=?=?|\|[=>]?|<(?:<=?|[=:])?|>(?:=|>>?=?)?|==?=?|[~≠≤≥]/,
    punctuation: /[{}[\];(),.:]/,
    constant: /\b(?:(?:NaN|Inf)(?:16|32|64)?)\b/
  }
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyX2xhbmd1YWdlc19yZWZyYWN0b3JfanVsaWEuZXhwbG9yZXIuZGV2LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFZOztBQUVaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixJQUFJO0FBQ3pCO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0B6ZXN0eS1pby9leHBsb3Jlci8uL25vZGVfbW9kdWxlcy9yZWZyYWN0b3IvbGFuZy9qdWxpYS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSBqdWxpYVxuanVsaWEuZGlzcGxheU5hbWUgPSAnanVsaWEnXG5qdWxpYS5hbGlhc2VzID0gW11cbmZ1bmN0aW9uIGp1bGlhKFByaXNtKSB7XG4gIFByaXNtLmxhbmd1YWdlcy5qdWxpYSA9IHtcbiAgICBjb21tZW50OiB7XG4gICAgICBwYXR0ZXJuOiAvKF58W15cXFxcXSkjLiovLFxuICAgICAgbG9va2JlaGluZDogdHJ1ZVxuICAgIH0sXG4gICAgc3RyaW5nOiAvKFwiXCJcInwnJycpW1xcc1xcU10rP1xcMXwoXCJ8JykoPzpcXFxcLnwoPyFcXDIpW15cXFxcXFxyXFxuXSkqXFwyLyxcbiAgICBrZXl3b3JkOiAvXFxiKD86YWJzdHJhY3R8YmFyZW1vZHVsZXxiZWdpbnxiaXRzdHlwZXxicmVha3xjYXRjaHxjY2FsbHxjb25zdHxjb250aW51ZXxkb3xlbHNlfGVsc2VpZnxlbmR8ZXhwb3J0fGZpbmFsbHl8Zm9yfGZ1bmN0aW9ufGdsb2JhbHxpZnxpbW11dGFibGV8aW1wb3J0fGltcG9ydGFsbHxpbnxsZXR8bG9jYWx8bWFjcm98bW9kdWxlfHByaW50fHByaW50bG58cXVvdGV8cmV0dXJufHN0cnVjdHx0cnl8dHlwZXx0eXBlYWxpYXN8dXNpbmd8d2hpbGUpXFxiLyxcbiAgICBib29sZWFuOiAvXFxiKD86dHJ1ZXxmYWxzZSlcXGIvLFxuICAgIG51bWJlcjogLyg/OlxcYig/PVxcZCl8XFxCKD89XFwuKSkoPzowW2JveF0pPyg/OltcXGRhLWZdK1xcLj9cXGQqfFxcLlxcZCspKD86W2VmcF1bKy1dP1xcZCspP2o/L2ksXG4gICAgb3BlcmF0b3I6IC9bLSsqXiXDtyYkXFxcXF09P3xcXC9bXFwvPV0/fCE9Pz0/fFxcfFs9Pl0/fDwoPzo8PT98Wz06XSk/fD4oPzo9fD4+Pz0/KT98PT0/PT98W37iiaDiiaTiiaVdLyxcbiAgICBwdW5jdHVhdGlvbjogL1t7fVtcXF07KCksLjpdLyxcbiAgICBjb25zdGFudDogL1xcYig/Oig/Ok5hTnxJbmYpKD86MTZ8MzJ8NjQpPylcXGIvXG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==