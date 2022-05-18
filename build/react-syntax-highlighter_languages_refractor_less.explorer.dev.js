"use strict";
(this["webpackChunk_zesty_io_explorer"] = this["webpackChunk_zesty_io_explorer"] || []).push([["react-syntax-highlighter_languages_refractor_less"],{

/***/ "./node_modules/refractor/lang/less.js":
/*!*********************************************!*\
  !*** ./node_modules/refractor/lang/less.js ***!
  \*********************************************/
/***/ ((module) => {



module.exports = less
less.displayName = 'less'
less.aliases = []
function less(Prism) {
  /* FIXME :
:extend() is not handled specifically : its highlighting is buggy.
Mixin usage must be inside a ruleset to be highlighted.
At-rules (e.g. import) containing interpolations are buggy.
Detached rulesets are highlighted as at-rules.
A comment before a mixin usage prevents the latter to be properly highlighted.
*/
  Prism.languages.less = Prism.languages.extend('css', {
    comment: [
      /\/\*[\s\S]*?\*\//,
      {
        pattern: /(^|[^\\])\/\/.*/,
        lookbehind: true
      }
    ],
    atrule: {
      pattern: /@[\w-]+?(?:\([^{}]+\)|[^(){};])*?(?=\s*\{)/i,
      inside: {
        punctuation: /[:()]/
      }
    },
    // selectors and mixins are considered the same
    selector: {
      pattern: /(?:@\{[\w-]+\}|[^{};\s@])(?:@\{[\w-]+\}|\([^{}]*\)|[^{};@])*?(?=\s*\{)/,
      inside: {
        // mixin parameters
        variable: /@+[\w-]+/
      }
    },
    property: /(?:@\{[\w-]+\}|[\w-])+(?:\+_?)?(?=\s*:)/i,
    operator: /[+\-*\/]/
  })
  Prism.languages.insertBefore('less', 'property', {
    variable: [
      // Variable declaration (the colon must be consumed!)
      {
        pattern: /@[\w-]+\s*:/,
        inside: {
          punctuation: /:/
        }
      }, // Variable usage
      /@@?[\w-]+/
    ],
    'mixin-usage': {
      pattern: /([{;]\s*)[.#](?!\d)[\w-]+.*?(?=[(;])/,
      lookbehind: true,
      alias: 'function'
    }
  })
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyX2xhbmd1YWdlc19yZWZyYWN0b3JfbGVzcy5leHBsb3Jlci5kZXYuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQVk7O0FBRVo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxZQUFZLFlBQVk7QUFDekQ7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxzQkFBc0IsUUFBUSxNQUFNLFdBQVcsUUFBUSxPQUFPLFVBQVUsYUFBYTtBQUNyRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxxQkFBcUIsUUFBUTtBQUM3QjtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQiw4QkFBOEI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQHplc3R5LWlvL2V4cGxvcmVyLy4vbm9kZV9tb2R1bGVzL3JlZnJhY3Rvci9sYW5nL2xlc3MuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gbGVzc1xubGVzcy5kaXNwbGF5TmFtZSA9ICdsZXNzJ1xubGVzcy5hbGlhc2VzID0gW11cbmZ1bmN0aW9uIGxlc3MoUHJpc20pIHtcbiAgLyogRklYTUUgOlxuOmV4dGVuZCgpIGlzIG5vdCBoYW5kbGVkIHNwZWNpZmljYWxseSA6IGl0cyBoaWdobGlnaHRpbmcgaXMgYnVnZ3kuXG5NaXhpbiB1c2FnZSBtdXN0IGJlIGluc2lkZSBhIHJ1bGVzZXQgdG8gYmUgaGlnaGxpZ2h0ZWQuXG5BdC1ydWxlcyAoZS5nLiBpbXBvcnQpIGNvbnRhaW5pbmcgaW50ZXJwb2xhdGlvbnMgYXJlIGJ1Z2d5LlxuRGV0YWNoZWQgcnVsZXNldHMgYXJlIGhpZ2hsaWdodGVkIGFzIGF0LXJ1bGVzLlxuQSBjb21tZW50IGJlZm9yZSBhIG1peGluIHVzYWdlIHByZXZlbnRzIHRoZSBsYXR0ZXIgdG8gYmUgcHJvcGVybHkgaGlnaGxpZ2h0ZWQuXG4qL1xuICBQcmlzbS5sYW5ndWFnZXMubGVzcyA9IFByaXNtLmxhbmd1YWdlcy5leHRlbmQoJ2NzcycsIHtcbiAgICBjb21tZW50OiBbXG4gICAgICAvXFwvXFwqW1xcc1xcU10qP1xcKlxcLy8sXG4gICAgICB7XG4gICAgICAgIHBhdHRlcm46IC8oXnxbXlxcXFxdKVxcL1xcLy4qLyxcbiAgICAgICAgbG9va2JlaGluZDogdHJ1ZVxuICAgICAgfVxuICAgIF0sXG4gICAgYXRydWxlOiB7XG4gICAgICBwYXR0ZXJuOiAvQFtcXHctXSs/KD86XFwoW157fV0rXFwpfFteKCl7fTtdKSo/KD89XFxzKlxceykvaSxcbiAgICAgIGluc2lkZToge1xuICAgICAgICBwdW5jdHVhdGlvbjogL1s6KCldL1xuICAgICAgfVxuICAgIH0sXG4gICAgLy8gc2VsZWN0b3JzIGFuZCBtaXhpbnMgYXJlIGNvbnNpZGVyZWQgdGhlIHNhbWVcbiAgICBzZWxlY3Rvcjoge1xuICAgICAgcGF0dGVybjogLyg/OkBcXHtbXFx3LV0rXFx9fFtee307XFxzQF0pKD86QFxce1tcXHctXStcXH18XFwoW157fV0qXFwpfFtee307QF0pKj8oPz1cXHMqXFx7KS8sXG4gICAgICBpbnNpZGU6IHtcbiAgICAgICAgLy8gbWl4aW4gcGFyYW1ldGVyc1xuICAgICAgICB2YXJpYWJsZTogL0ArW1xcdy1dKy9cbiAgICAgIH1cbiAgICB9LFxuICAgIHByb3BlcnR5OiAvKD86QFxce1tcXHctXStcXH18W1xcdy1dKSsoPzpcXCtfPyk/KD89XFxzKjopL2ksXG4gICAgb3BlcmF0b3I6IC9bK1xcLSpcXC9dL1xuICB9KVxuICBQcmlzbS5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKCdsZXNzJywgJ3Byb3BlcnR5Jywge1xuICAgIHZhcmlhYmxlOiBbXG4gICAgICAvLyBWYXJpYWJsZSBkZWNsYXJhdGlvbiAodGhlIGNvbG9uIG11c3QgYmUgY29uc3VtZWQhKVxuICAgICAge1xuICAgICAgICBwYXR0ZXJuOiAvQFtcXHctXStcXHMqOi8sXG4gICAgICAgIGluc2lkZToge1xuICAgICAgICAgIHB1bmN0dWF0aW9uOiAvOi9cbiAgICAgICAgfVxuICAgICAgfSwgLy8gVmFyaWFibGUgdXNhZ2VcbiAgICAgIC9AQD9bXFx3LV0rL1xuICAgIF0sXG4gICAgJ21peGluLXVzYWdlJzoge1xuICAgICAgcGF0dGVybjogLyhbeztdXFxzKilbLiNdKD8hXFxkKVtcXHctXSsuKj8oPz1bKDtdKS8sXG4gICAgICBsb29rYmVoaW5kOiB0cnVlLFxuICAgICAgYWxpYXM6ICdmdW5jdGlvbidcbiAgICB9XG4gIH0pXG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=