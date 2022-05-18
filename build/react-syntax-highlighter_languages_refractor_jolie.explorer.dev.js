"use strict";
(this["webpackChunk_zesty_io_explorer"] = this["webpackChunk_zesty_io_explorer"] || []).push([["react-syntax-highlighter_languages_refractor_jolie"],{

/***/ "./node_modules/refractor/lang/jolie.js":
/*!**********************************************!*\
  !*** ./node_modules/refractor/lang/jolie.js ***!
  \**********************************************/
/***/ ((module) => {



module.exports = jolie
jolie.displayName = 'jolie'
jolie.aliases = []
function jolie(Prism) {
  Prism.languages.jolie = Prism.languages.extend('clike', {
    keyword: /\b(?:include|define|is_defined|undef|main|init|outputPort|inputPort|Location|Protocol|Interfaces|RequestResponse|OneWay|type|interface|extender|throws|cset|csets|forward|Aggregates|Redirects|embedded|courier|execution|sequential|concurrent|single|scope|install|throw|comp|cH|default|global|linkIn|linkOut|synchronized|this|new|for|if|else|while|in|Jolie|Java|Javascript|nullProcess|spawn|constants|with|provide|until|exit|foreach|instanceof|over|service)\b/,
    builtin: /\b(?:undefined|string|int|void|long|Byte|bool|double|float|char|any)\b/,
    number: /(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?l?/i,
    operator: /-[-=>]?|\+[+=]?|<[<=]?|[>=*!]=?|&&|\|\||[:?\/%^]/,
    symbol: /[|;@]/,
    punctuation: /[,.]/,
    string: {
      pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: true
    }
  })
  delete Prism.languages.jolie['class-name']
  Prism.languages.insertBefore('jolie', 'keyword', {
    function: {
      pattern: /((?:\b(?:outputPort|inputPort|in|service|courier)\b|@)\s*)\w+/,
      lookbehind: true
    },
    aggregates: {
      pattern: /(\bAggregates\s*:\s*)(?:\w+(?:\s+with\s+\w+)?\s*,\s*)*\w+(?:\s+with\s+\w+)?/,
      lookbehind: true,
      inside: {
        withExtension: {
          pattern: /\bwith\s+\w+/,
          inside: {
            keyword: /\bwith\b/
          }
        },
        function: {
          pattern: /\w+/
        },
        punctuation: {
          pattern: /,/
        }
      }
    },
    redirects: {
      pattern: /(\bRedirects\s*:\s*)(?:\w+\s*=>\s*\w+\s*,\s*)*(?:\w+\s*=>\s*\w+)/,
      lookbehind: true,
      inside: {
        punctuation: {
          pattern: /,/
        },
        function: {
          pattern: /\w+/
        },
        symbol: {
          pattern: /=>/
        }
      }
    }
  })
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyX2xhbmd1YWdlc19yZWZyYWN0b3Jfam9saWUuZXhwbG9yZXIuZGV2LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFZOztBQUVaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCIsInNvdXJjZXMiOlsid2VicGFjazovL0B6ZXN0eS1pby9leHBsb3Jlci8uL25vZGVfbW9kdWxlcy9yZWZyYWN0b3IvbGFuZy9qb2xpZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSBqb2xpZVxuam9saWUuZGlzcGxheU5hbWUgPSAnam9saWUnXG5qb2xpZS5hbGlhc2VzID0gW11cbmZ1bmN0aW9uIGpvbGllKFByaXNtKSB7XG4gIFByaXNtLmxhbmd1YWdlcy5qb2xpZSA9IFByaXNtLmxhbmd1YWdlcy5leHRlbmQoJ2NsaWtlJywge1xuICAgIGtleXdvcmQ6IC9cXGIoPzppbmNsdWRlfGRlZmluZXxpc19kZWZpbmVkfHVuZGVmfG1haW58aW5pdHxvdXRwdXRQb3J0fGlucHV0UG9ydHxMb2NhdGlvbnxQcm90b2NvbHxJbnRlcmZhY2VzfFJlcXVlc3RSZXNwb25zZXxPbmVXYXl8dHlwZXxpbnRlcmZhY2V8ZXh0ZW5kZXJ8dGhyb3dzfGNzZXR8Y3NldHN8Zm9yd2FyZHxBZ2dyZWdhdGVzfFJlZGlyZWN0c3xlbWJlZGRlZHxjb3VyaWVyfGV4ZWN1dGlvbnxzZXF1ZW50aWFsfGNvbmN1cnJlbnR8c2luZ2xlfHNjb3BlfGluc3RhbGx8dGhyb3d8Y29tcHxjSHxkZWZhdWx0fGdsb2JhbHxsaW5rSW58bGlua091dHxzeW5jaHJvbml6ZWR8dGhpc3xuZXd8Zm9yfGlmfGVsc2V8d2hpbGV8aW58Sm9saWV8SmF2YXxKYXZhc2NyaXB0fG51bGxQcm9jZXNzfHNwYXdufGNvbnN0YW50c3x3aXRofHByb3ZpZGV8dW50aWx8ZXhpdHxmb3JlYWNofGluc3RhbmNlb2Z8b3ZlcnxzZXJ2aWNlKVxcYi8sXG4gICAgYnVpbHRpbjogL1xcYig/OnVuZGVmaW5lZHxzdHJpbmd8aW50fHZvaWR8bG9uZ3xCeXRlfGJvb2x8ZG91YmxlfGZsb2F0fGNoYXJ8YW55KVxcYi8sXG4gICAgbnVtYmVyOiAvKD86XFxiXFxkK1xcLj9cXGQqfFxcQlxcLlxcZCspKD86ZVsrLV0/XFxkKyk/bD8vaSxcbiAgICBvcGVyYXRvcjogLy1bLT0+XT98XFwrWys9XT98PFs8PV0/fFs+PSohXT0/fCYmfFxcfFxcfHxbOj9cXC8lXl0vLFxuICAgIHN5bWJvbDogL1t8O0BdLyxcbiAgICBwdW5jdHVhdGlvbjogL1ssLl0vLFxuICAgIHN0cmluZzoge1xuICAgICAgcGF0dGVybjogLyhbXCInXSkoPzpcXFxcKD86XFxyXFxufFtcXHNcXFNdKXwoPyFcXDEpW15cXFxcXFxyXFxuXSkqXFwxLyxcbiAgICAgIGdyZWVkeTogdHJ1ZVxuICAgIH1cbiAgfSlcbiAgZGVsZXRlIFByaXNtLmxhbmd1YWdlcy5qb2xpZVsnY2xhc3MtbmFtZSddXG4gIFByaXNtLmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoJ2pvbGllJywgJ2tleXdvcmQnLCB7XG4gICAgZnVuY3Rpb246IHtcbiAgICAgIHBhdHRlcm46IC8oKD86XFxiKD86b3V0cHV0UG9ydHxpbnB1dFBvcnR8aW58c2VydmljZXxjb3VyaWVyKVxcYnxAKVxccyopXFx3Ky8sXG4gICAgICBsb29rYmVoaW5kOiB0cnVlXG4gICAgfSxcbiAgICBhZ2dyZWdhdGVzOiB7XG4gICAgICBwYXR0ZXJuOiAvKFxcYkFnZ3JlZ2F0ZXNcXHMqOlxccyopKD86XFx3Kyg/Olxccyt3aXRoXFxzK1xcdyspP1xccyosXFxzKikqXFx3Kyg/Olxccyt3aXRoXFxzK1xcdyspPy8sXG4gICAgICBsb29rYmVoaW5kOiB0cnVlLFxuICAgICAgaW5zaWRlOiB7XG4gICAgICAgIHdpdGhFeHRlbnNpb246IHtcbiAgICAgICAgICBwYXR0ZXJuOiAvXFxid2l0aFxccytcXHcrLyxcbiAgICAgICAgICBpbnNpZGU6IHtcbiAgICAgICAgICAgIGtleXdvcmQ6IC9cXGJ3aXRoXFxiL1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb246IHtcbiAgICAgICAgICBwYXR0ZXJuOiAvXFx3Ky9cbiAgICAgICAgfSxcbiAgICAgICAgcHVuY3R1YXRpb246IHtcbiAgICAgICAgICBwYXR0ZXJuOiAvLC9cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgcmVkaXJlY3RzOiB7XG4gICAgICBwYXR0ZXJuOiAvKFxcYlJlZGlyZWN0c1xccyo6XFxzKikoPzpcXHcrXFxzKj0+XFxzKlxcdytcXHMqLFxccyopKig/OlxcdytcXHMqPT5cXHMqXFx3KykvLFxuICAgICAgbG9va2JlaGluZDogdHJ1ZSxcbiAgICAgIGluc2lkZToge1xuICAgICAgICBwdW5jdHVhdGlvbjoge1xuICAgICAgICAgIHBhdHRlcm46IC8sL1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbjoge1xuICAgICAgICAgIHBhdHRlcm46IC9cXHcrL1xuICAgICAgICB9LFxuICAgICAgICBzeW1ib2w6IHtcbiAgICAgICAgICBwYXR0ZXJuOiAvPT4vXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pXG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=