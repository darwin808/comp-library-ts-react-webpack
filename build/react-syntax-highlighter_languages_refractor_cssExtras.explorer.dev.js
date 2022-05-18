"use strict";
(this["webpackChunk_zesty_io_explorer"] = this["webpackChunk_zesty_io_explorer"] || []).push([["react-syntax-highlighter_languages_refractor_cssExtras"],{

/***/ "./node_modules/refractor/lang/css-extras.js":
/*!***************************************************!*\
  !*** ./node_modules/refractor/lang/css-extras.js ***!
  \***************************************************/
/***/ ((module) => {



module.exports = cssExtras
cssExtras.displayName = 'cssExtras'
cssExtras.aliases = []
function cssExtras(Prism) {
  Prism.languages.css.selector = {
    pattern: Prism.languages.css.selector,
    inside: {
      'pseudo-element': /:(?:after|before|first-letter|first-line|selection)|::[-\w]+/,
      'pseudo-class': /:[-\w]+/,
      class: /\.[-:.\w]+/,
      id: /#[-:.\w]+/,
      attribute: {
        pattern: /\[(?:[^[\]"']|("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1)*\]/,
        greedy: true,
        inside: {
          punctuation: /^\[|\]$/,
          'case-sensitivity': {
            pattern: /(\s)[si]$/i,
            lookbehind: true,
            alias: 'keyword'
          },
          namespace: {
            pattern: /^(\s*)[-*\w\xA0-\uFFFF]*\|(?!=)/,
            lookbehind: true,
            inside: {
              punctuation: /\|$/
            }
          },
          attribute: {
            pattern: /^(\s*)[-\w\xA0-\uFFFF]+/,
            lookbehind: true
          },
          value: [
            /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
            {
              pattern: /(=\s*)[-\w\xA0-\uFFFF]+(?=\s*$)/,
              lookbehind: true
            }
          ],
          operator: /[|~*^$]?=/
        }
      },
      'n-th': [
        {
          pattern: /(\(\s*)[+-]?\d*[\dn](?:\s*[+-]\s*\d+)?(?=\s*\))/,
          lookbehind: true,
          inside: {
            number: /[\dn]+/,
            operator: /[+-]/
          }
        },
        {
          pattern: /(\(\s*)(?:even|odd)(?=\s*\))/i,
          lookbehind: true
        }
      ],
      punctuation: /[()]/
    }
  }
  Prism.languages.insertBefore('css', 'property', {
    variable: {
      pattern: /(^|[^-\w\xA0-\uFFFF])--[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*/i,
      lookbehind: true
    }
  })
  Prism.languages.insertBefore('css', 'function', {
    operator: {
      pattern: /(\s)[+\-*\/](?=\s)/,
      lookbehind: true
    },
    hexcode: /#[\da-f]{3,8}/i,
    entity: /\\[\da-f]{1,8}/i,
    unit: {
      pattern: /(\d)(?:%|[a-z]+)/,
      lookbehind: true
    },
    number: /-?[\d.]+/
  })
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyX2xhbmd1YWdlc19yZWZyYWN0b3JfY3NzRXh0cmFzLmV4cGxvcmVyLmRldi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsdUJBQXVCLElBQUk7QUFDM0IsdUJBQXVCLElBQUk7QUFDM0I7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsR0FBRztBQUNIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQHplc3R5LWlvL2V4cGxvcmVyLy4vbm9kZV9tb2R1bGVzL3JlZnJhY3Rvci9sYW5nL2Nzcy1leHRyYXMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gY3NzRXh0cmFzXG5jc3NFeHRyYXMuZGlzcGxheU5hbWUgPSAnY3NzRXh0cmFzJ1xuY3NzRXh0cmFzLmFsaWFzZXMgPSBbXVxuZnVuY3Rpb24gY3NzRXh0cmFzKFByaXNtKSB7XG4gIFByaXNtLmxhbmd1YWdlcy5jc3Muc2VsZWN0b3IgPSB7XG4gICAgcGF0dGVybjogUHJpc20ubGFuZ3VhZ2VzLmNzcy5zZWxlY3RvcixcbiAgICBpbnNpZGU6IHtcbiAgICAgICdwc2V1ZG8tZWxlbWVudCc6IC86KD86YWZ0ZXJ8YmVmb3JlfGZpcnN0LWxldHRlcnxmaXJzdC1saW5lfHNlbGVjdGlvbil8OjpbLVxcd10rLyxcbiAgICAgICdwc2V1ZG8tY2xhc3MnOiAvOlstXFx3XSsvLFxuICAgICAgY2xhc3M6IC9cXC5bLTouXFx3XSsvLFxuICAgICAgaWQ6IC8jWy06Llxcd10rLyxcbiAgICAgIGF0dHJpYnV0ZToge1xuICAgICAgICBwYXR0ZXJuOiAvXFxbKD86W15bXFxdXCInXXwoXCJ8JykoPzpcXFxcKD86XFxyXFxufFtcXHNcXFNdKXwoPyFcXDEpW15cXFxcXFxyXFxuXSkqXFwxKSpcXF0vLFxuICAgICAgICBncmVlZHk6IHRydWUsXG4gICAgICAgIGluc2lkZToge1xuICAgICAgICAgIHB1bmN0dWF0aW9uOiAvXlxcW3xcXF0kLyxcbiAgICAgICAgICAnY2FzZS1zZW5zaXRpdml0eSc6IHtcbiAgICAgICAgICAgIHBhdHRlcm46IC8oXFxzKVtzaV0kL2ksXG4gICAgICAgICAgICBsb29rYmVoaW5kOiB0cnVlLFxuICAgICAgICAgICAgYWxpYXM6ICdrZXl3b3JkJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgbmFtZXNwYWNlOiB7XG4gICAgICAgICAgICBwYXR0ZXJuOiAvXihcXHMqKVstKlxcd1xceEEwLVxcdUZGRkZdKlxcfCg/IT0pLyxcbiAgICAgICAgICAgIGxvb2tiZWhpbmQ6IHRydWUsXG4gICAgICAgICAgICBpbnNpZGU6IHtcbiAgICAgICAgICAgICAgcHVuY3R1YXRpb246IC9cXHwkL1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgYXR0cmlidXRlOiB7XG4gICAgICAgICAgICBwYXR0ZXJuOiAvXihcXHMqKVstXFx3XFx4QTAtXFx1RkZGRl0rLyxcbiAgICAgICAgICAgIGxvb2tiZWhpbmQ6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIHZhbHVlOiBbXG4gICAgICAgICAgICAvKFwifCcpKD86XFxcXCg/OlxcclxcbnxbXFxzXFxTXSl8KD8hXFwxKVteXFxcXFxcclxcbl0pKlxcMS8sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHBhdHRlcm46IC8oPVxccyopWy1cXHdcXHhBMC1cXHVGRkZGXSsoPz1cXHMqJCkvLFxuICAgICAgICAgICAgICBsb29rYmVoaW5kOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXSxcbiAgICAgICAgICBvcGVyYXRvcjogL1t8fipeJF0/PS9cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICduLXRoJzogW1xuICAgICAgICB7XG4gICAgICAgICAgcGF0dGVybjogLyhcXChcXHMqKVsrLV0/XFxkKltcXGRuXSg/OlxccypbKy1dXFxzKlxcZCspPyg/PVxccypcXCkpLyxcbiAgICAgICAgICBsb29rYmVoaW5kOiB0cnVlLFxuICAgICAgICAgIGluc2lkZToge1xuICAgICAgICAgICAgbnVtYmVyOiAvW1xcZG5dKy8sXG4gICAgICAgICAgICBvcGVyYXRvcjogL1srLV0vXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcGF0dGVybjogLyhcXChcXHMqKSg/OmV2ZW58b2RkKSg/PVxccypcXCkpL2ksXG4gICAgICAgICAgbG9va2JlaGluZDogdHJ1ZVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgcHVuY3R1YXRpb246IC9bKCldL1xuICAgIH1cbiAgfVxuICBQcmlzbS5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKCdjc3MnLCAncHJvcGVydHknLCB7XG4gICAgdmFyaWFibGU6IHtcbiAgICAgIHBhdHRlcm46IC8oXnxbXi1cXHdcXHhBMC1cXHVGRkZGXSktLVstX2EtelxceEEwLVxcdUZGRkZdWy1cXHdcXHhBMC1cXHVGRkZGXSovaSxcbiAgICAgIGxvb2tiZWhpbmQ6IHRydWVcbiAgICB9XG4gIH0pXG4gIFByaXNtLmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoJ2NzcycsICdmdW5jdGlvbicsIHtcbiAgICBvcGVyYXRvcjoge1xuICAgICAgcGF0dGVybjogLyhcXHMpWytcXC0qXFwvXSg/PVxccykvLFxuICAgICAgbG9va2JlaGluZDogdHJ1ZVxuICAgIH0sXG4gICAgaGV4Y29kZTogLyNbXFxkYS1mXXszLDh9L2ksXG4gICAgZW50aXR5OiAvXFxcXFtcXGRhLWZdezEsOH0vaSxcbiAgICB1bml0OiB7XG4gICAgICBwYXR0ZXJuOiAvKFxcZCkoPzolfFthLXpdKykvLFxuICAgICAgbG9va2JlaGluZDogdHJ1ZVxuICAgIH0sXG4gICAgbnVtYmVyOiAvLT9bXFxkLl0rL1xuICB9KVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9