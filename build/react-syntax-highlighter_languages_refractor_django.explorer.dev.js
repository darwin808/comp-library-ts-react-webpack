"use strict";
(this["webpackChunk_zesty_io_explorer"] = this["webpackChunk_zesty_io_explorer"] || []).push([["react-syntax-highlighter_languages_refractor_django"],{

/***/ "./node_modules/refractor/lang/django.js":
/*!***********************************************!*\
  !*** ./node_modules/refractor/lang/django.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var refractorMarkupTemplating = __webpack_require__(/*! ./markup-templating.js */ "./node_modules/refractor/lang/markup-templating.js")
module.exports = django
django.displayName = 'django'
django.aliases = ['jinja2']
function django(Prism) {
  Prism.register(refractorMarkupTemplating)
  // Django/Jinja2 syntax definition for Prism.js <http://prismjs.com> syntax highlighter.
  // Mostly it works OK but can paint code incorrectly on complex html/template tag combinations.
  ;(function(Prism) {
    Prism.languages.django = {
      comment: /^{#[\s\S]*?#}$/,
      tag: {
        pattern: /(^{%[+-]?\s*)\w+/,
        lookbehind: true,
        alias: 'keyword'
      },
      delimiter: {
        pattern: /^{[{%][+-]?|[+-]?[}%]}$/,
        alias: 'punctuation'
      },
      string: {
        pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
        greedy: true
      },
      filter: {
        pattern: /(\|)\w+/,
        lookbehind: true,
        alias: 'function'
      },
      test: {
        pattern: /(\bis\s+(?:not\s+)?)(?!not\b)\w+/,
        lookbehind: true,
        alias: 'function'
      },
      function: /\b[a-z_]\w+(?=\s*\()/i,
      keyword: /\b(?:and|as|by|else|for|if|import|in|is|loop|not|or|recursive|with|without)\b/,
      operator: /[-+*/%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
      number: /\b\d+(?:\.\d+)?\b/,
      boolean: /[Tt]rue|[Ff]alse|[Nn]one/,
      variable: /\b\w+?\b/,
      punctuation: /[{}[\](),.:;]/
    }
    var pattern = /{{[\s\S]*?}}|{%[\s\S]*?%}|{#[\s\S]*?#}/g
    var markupTemplating = Prism.languages['markup-templating']
    Prism.hooks.add('before-tokenize', function(env) {
      markupTemplating.buildPlaceholders(env, 'django', pattern)
    })
    Prism.hooks.add('after-tokenize', function(env) {
      markupTemplating.tokenizePlaceholders(env, 'django')
    }) // Add an Jinja2 alias
    Prism.languages.jinja2 = Prism.languages.django
    Prism.hooks.add('before-tokenize', function(env) {
      markupTemplating.buildPlaceholders(env, 'jinja2', pattern)
    })
    Prism.hooks.add('after-tokenize', function(env) {
      markupTemplating.tokenizePlaceholders(env, 'jinja2')
    })
  })(Prism)
}


/***/ }),

/***/ "./node_modules/refractor/lang/markup-templating.js":
/*!**********************************************************!*\
  !*** ./node_modules/refractor/lang/markup-templating.js ***!
  \**********************************************************/
/***/ ((module) => {



module.exports = markupTemplating
markupTemplating.displayName = 'markupTemplating'
markupTemplating.aliases = []
function markupTemplating(Prism) {
  ;(function(Prism) {
    /**
     * Returns the placeholder for the given language id and index.
     *
     * @param {string} language
     * @param {string|number} index
     * @returns {string}
     */
    function getPlaceholder(language, index) {
      return '___' + language.toUpperCase() + index + '___'
    }
    Object.defineProperties((Prism.languages['markup-templating'] = {}), {
      buildPlaceholders: {
        /**
         * Tokenize all inline templating expressions matching `placeholderPattern`.
         *
         * If `replaceFilter` is provided, only matches of `placeholderPattern` for which `replaceFilter` returns
         * `true` will be replaced.
         *
         * @param {object} env The environment of the `before-tokenize` hook.
         * @param {string} language The language id.
         * @param {RegExp} placeholderPattern The matches of this pattern will be replaced by placeholders.
         * @param {(match: string) => boolean} [replaceFilter]
         */
        value: function(env, language, placeholderPattern, replaceFilter) {
          if (env.language !== language) {
            return
          }
          var tokenStack = (env.tokenStack = [])
          env.code = env.code.replace(placeholderPattern, function(match) {
            if (typeof replaceFilter === 'function' && !replaceFilter(match)) {
              return match
            }
            var i = tokenStack.length
            var placeholder // Check for existing strings
            while (
              env.code.indexOf((placeholder = getPlaceholder(language, i))) !==
              -1
            )
              ++i // Create a sparse array
            tokenStack[i] = match
            return placeholder
          }) // Switch the grammar to markup
          env.grammar = Prism.languages.markup
        }
      },
      tokenizePlaceholders: {
        /**
         * Replace placeholders with proper tokens after tokenizing.
         *
         * @param {object} env The environment of the `after-tokenize` hook.
         * @param {string} language The language id.
         */
        value: function(env, language) {
          if (env.language !== language || !env.tokenStack) {
            return
          } // Switch the grammar back
          env.grammar = Prism.languages[language]
          var j = 0
          var keys = Object.keys(env.tokenStack)
          function walkTokens(tokens) {
            for (var i = 0; i < tokens.length; i++) {
              // all placeholders are replaced already
              if (j >= keys.length) {
                break
              }
              var token = tokens[i]
              if (
                typeof token === 'string' ||
                (token.content && typeof token.content === 'string')
              ) {
                var k = keys[j]
                var t = env.tokenStack[k]
                var s = typeof token === 'string' ? token : token.content
                var placeholder = getPlaceholder(language, k)
                var index = s.indexOf(placeholder)
                if (index > -1) {
                  ++j
                  var before = s.substring(0, index)
                  var middle = new Prism.Token(
                    language,
                    Prism.tokenize(t, env.grammar),
                    'language-' + language,
                    t
                  )
                  var after = s.substring(index + placeholder.length)
                  var replacement = []
                  if (before) {
                    replacement.push.apply(replacement, walkTokens([before]))
                  }
                  replacement.push(middle)
                  if (after) {
                    replacement.push.apply(replacement, walkTokens([after]))
                  }
                  if (typeof token === 'string') {
                    tokens.splice.apply(tokens, [i, 1].concat(replacement))
                  } else {
                    token.content = replacement
                  }
                }
              } else if (
                token.content
                /* && typeof token.content !== 'string' */
              ) {
                walkTokens(token.content)
              }
            }
            return tokens
          }
          walkTokens(env.tokens)
        }
      }
    })
  })(Prism)
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyX2xhbmd1YWdlc19yZWZyYWN0b3JfZGphbmdvLmV4cGxvcmVyLmRldi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBWTtBQUNaLGdDQUFnQyxtQkFBTyxDQUFDLGtGQUF3QjtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLGtCQUFrQixXQUFXO0FBQzdCO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxvQkFBb0IsRUFBRSxlQUFlLEdBQUc7QUFDeEM7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixTQUFTO0FBQ2hDO0FBQ0EscUJBQXFCLFVBQVUsRUFBRSxXQUFXLEVBQUUsV0FBVztBQUN6RDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7Ozs7Ozs7Ozs7O0FDM0RZOztBQUVaO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QixlQUFlLGVBQWU7QUFDOUIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0VBQXNFO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFFBQVE7QUFDM0IsbUJBQW1CLFFBQVE7QUFDM0IsbUJBQW1CLFFBQVE7QUFDM0IsbUJBQW1CLDRCQUE0QjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFFBQVE7QUFDM0IsbUJBQW1CLFFBQVE7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsbUJBQW1CO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSCIsInNvdXJjZXMiOlsid2VicGFjazovL0B6ZXN0eS1pby9leHBsb3Jlci8uL25vZGVfbW9kdWxlcy9yZWZyYWN0b3IvbGFuZy9kamFuZ28uanMiLCJ3ZWJwYWNrOi8vQHplc3R5LWlvL2V4cGxvcmVyLy4vbm9kZV9tb2R1bGVzL3JlZnJhY3Rvci9sYW5nL21hcmt1cC10ZW1wbGF0aW5nLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xudmFyIHJlZnJhY3Rvck1hcmt1cFRlbXBsYXRpbmcgPSByZXF1aXJlKCcuL21hcmt1cC10ZW1wbGF0aW5nLmpzJylcbm1vZHVsZS5leHBvcnRzID0gZGphbmdvXG5kamFuZ28uZGlzcGxheU5hbWUgPSAnZGphbmdvJ1xuZGphbmdvLmFsaWFzZXMgPSBbJ2ppbmphMiddXG5mdW5jdGlvbiBkamFuZ28oUHJpc20pIHtcbiAgUHJpc20ucmVnaXN0ZXIocmVmcmFjdG9yTWFya3VwVGVtcGxhdGluZylcbiAgLy8gRGphbmdvL0ppbmphMiBzeW50YXggZGVmaW5pdGlvbiBmb3IgUHJpc20uanMgPGh0dHA6Ly9wcmlzbWpzLmNvbT4gc3ludGF4IGhpZ2hsaWdodGVyLlxuICAvLyBNb3N0bHkgaXQgd29ya3MgT0sgYnV0IGNhbiBwYWludCBjb2RlIGluY29ycmVjdGx5IG9uIGNvbXBsZXggaHRtbC90ZW1wbGF0ZSB0YWcgY29tYmluYXRpb25zLlxuICA7KGZ1bmN0aW9uKFByaXNtKSB7XG4gICAgUHJpc20ubGFuZ3VhZ2VzLmRqYW5nbyA9IHtcbiAgICAgIGNvbW1lbnQ6IC9eeyNbXFxzXFxTXSo/I30kLyxcbiAgICAgIHRhZzoge1xuICAgICAgICBwYXR0ZXJuOiAvKF57JVsrLV0/XFxzKilcXHcrLyxcbiAgICAgICAgbG9va2JlaGluZDogdHJ1ZSxcbiAgICAgICAgYWxpYXM6ICdrZXl3b3JkJ1xuICAgICAgfSxcbiAgICAgIGRlbGltaXRlcjoge1xuICAgICAgICBwYXR0ZXJuOiAvXntbeyVdWystXT98WystXT9bfSVdfSQvLFxuICAgICAgICBhbGlhczogJ3B1bmN0dWF0aW9uJ1xuICAgICAgfSxcbiAgICAgIHN0cmluZzoge1xuICAgICAgICBwYXR0ZXJuOiAvKFwifCcpKD86XFxcXC58KD8hXFwxKVteXFxcXFxcclxcbl0pKlxcMS8sXG4gICAgICAgIGdyZWVkeTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGZpbHRlcjoge1xuICAgICAgICBwYXR0ZXJuOiAvKFxcfClcXHcrLyxcbiAgICAgICAgbG9va2JlaGluZDogdHJ1ZSxcbiAgICAgICAgYWxpYXM6ICdmdW5jdGlvbidcbiAgICAgIH0sXG4gICAgICB0ZXN0OiB7XG4gICAgICAgIHBhdHRlcm46IC8oXFxiaXNcXHMrKD86bm90XFxzKyk/KSg/IW5vdFxcYilcXHcrLyxcbiAgICAgICAgbG9va2JlaGluZDogdHJ1ZSxcbiAgICAgICAgYWxpYXM6ICdmdW5jdGlvbidcbiAgICAgIH0sXG4gICAgICBmdW5jdGlvbjogL1xcYlthLXpfXVxcdysoPz1cXHMqXFwoKS9pLFxuICAgICAga2V5d29yZDogL1xcYig/OmFuZHxhc3xieXxlbHNlfGZvcnxpZnxpbXBvcnR8aW58aXN8bG9vcHxub3R8b3J8cmVjdXJzaXZlfHdpdGh8d2l0aG91dClcXGIvLFxuICAgICAgb3BlcmF0b3I6IC9bLSsqLyU9XT0/fCE9fFxcKlxcKj89P3xcXC9cXC8/PT98PFs8PT5dP3w+Wz0+XT98WyZ8Xn5dLyxcbiAgICAgIG51bWJlcjogL1xcYlxcZCsoPzpcXC5cXGQrKT9cXGIvLFxuICAgICAgYm9vbGVhbjogL1tUdF1ydWV8W0ZmXWFsc2V8W05uXW9uZS8sXG4gICAgICB2YXJpYWJsZTogL1xcYlxcdys/XFxiLyxcbiAgICAgIHB1bmN0dWF0aW9uOiAvW3t9W1xcXSgpLC46O10vXG4gICAgfVxuICAgIHZhciBwYXR0ZXJuID0gL3t7W1xcc1xcU10qP319fHslW1xcc1xcU10qPyV9fHsjW1xcc1xcU10qPyN9L2dcbiAgICB2YXIgbWFya3VwVGVtcGxhdGluZyA9IFByaXNtLmxhbmd1YWdlc1snbWFya3VwLXRlbXBsYXRpbmcnXVxuICAgIFByaXNtLmhvb2tzLmFkZCgnYmVmb3JlLXRva2VuaXplJywgZnVuY3Rpb24oZW52KSB7XG4gICAgICBtYXJrdXBUZW1wbGF0aW5nLmJ1aWxkUGxhY2Vob2xkZXJzKGVudiwgJ2RqYW5nbycsIHBhdHRlcm4pXG4gICAgfSlcbiAgICBQcmlzbS5ob29rcy5hZGQoJ2FmdGVyLXRva2VuaXplJywgZnVuY3Rpb24oZW52KSB7XG4gICAgICBtYXJrdXBUZW1wbGF0aW5nLnRva2VuaXplUGxhY2Vob2xkZXJzKGVudiwgJ2RqYW5nbycpXG4gICAgfSkgLy8gQWRkIGFuIEppbmphMiBhbGlhc1xuICAgIFByaXNtLmxhbmd1YWdlcy5qaW5qYTIgPSBQcmlzbS5sYW5ndWFnZXMuZGphbmdvXG4gICAgUHJpc20uaG9va3MuYWRkKCdiZWZvcmUtdG9rZW5pemUnLCBmdW5jdGlvbihlbnYpIHtcbiAgICAgIG1hcmt1cFRlbXBsYXRpbmcuYnVpbGRQbGFjZWhvbGRlcnMoZW52LCAnamluamEyJywgcGF0dGVybilcbiAgICB9KVxuICAgIFByaXNtLmhvb2tzLmFkZCgnYWZ0ZXItdG9rZW5pemUnLCBmdW5jdGlvbihlbnYpIHtcbiAgICAgIG1hcmt1cFRlbXBsYXRpbmcudG9rZW5pemVQbGFjZWhvbGRlcnMoZW52LCAnamluamEyJylcbiAgICB9KVxuICB9KShQcmlzbSlcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcmt1cFRlbXBsYXRpbmdcbm1hcmt1cFRlbXBsYXRpbmcuZGlzcGxheU5hbWUgPSAnbWFya3VwVGVtcGxhdGluZydcbm1hcmt1cFRlbXBsYXRpbmcuYWxpYXNlcyA9IFtdXG5mdW5jdGlvbiBtYXJrdXBUZW1wbGF0aW5nKFByaXNtKSB7XG4gIDsoZnVuY3Rpb24oUHJpc20pIHtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBwbGFjZWhvbGRlciBmb3IgdGhlIGdpdmVuIGxhbmd1YWdlIGlkIGFuZCBpbmRleC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsYW5ndWFnZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcn0gaW5kZXhcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFBsYWNlaG9sZGVyKGxhbmd1YWdlLCBpbmRleCkge1xuICAgICAgcmV0dXJuICdfX18nICsgbGFuZ3VhZ2UudG9VcHBlckNhc2UoKSArIGluZGV4ICsgJ19fXydcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoKFByaXNtLmxhbmd1YWdlc1snbWFya3VwLXRlbXBsYXRpbmcnXSA9IHt9KSwge1xuICAgICAgYnVpbGRQbGFjZWhvbGRlcnM6IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRva2VuaXplIGFsbCBpbmxpbmUgdGVtcGxhdGluZyBleHByZXNzaW9ucyBtYXRjaGluZyBgcGxhY2Vob2xkZXJQYXR0ZXJuYC5cbiAgICAgICAgICpcbiAgICAgICAgICogSWYgYHJlcGxhY2VGaWx0ZXJgIGlzIHByb3ZpZGVkLCBvbmx5IG1hdGNoZXMgb2YgYHBsYWNlaG9sZGVyUGF0dGVybmAgZm9yIHdoaWNoIGByZXBsYWNlRmlsdGVyYCByZXR1cm5zXG4gICAgICAgICAqIGB0cnVlYCB3aWxsIGJlIHJlcGxhY2VkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZW52IFRoZSBlbnZpcm9ubWVudCBvZiB0aGUgYGJlZm9yZS10b2tlbml6ZWAgaG9vay5cbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGxhbmd1YWdlIFRoZSBsYW5ndWFnZSBpZC5cbiAgICAgICAgICogQHBhcmFtIHtSZWdFeHB9IHBsYWNlaG9sZGVyUGF0dGVybiBUaGUgbWF0Y2hlcyBvZiB0aGlzIHBhdHRlcm4gd2lsbCBiZSByZXBsYWNlZCBieSBwbGFjZWhvbGRlcnMuXG4gICAgICAgICAqIEBwYXJhbSB7KG1hdGNoOiBzdHJpbmcpID0+IGJvb2xlYW59IFtyZXBsYWNlRmlsdGVyXVxuICAgICAgICAgKi9cbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKGVudiwgbGFuZ3VhZ2UsIHBsYWNlaG9sZGVyUGF0dGVybiwgcmVwbGFjZUZpbHRlcikge1xuICAgICAgICAgIGlmIChlbnYubGFuZ3VhZ2UgIT09IGxhbmd1YWdlKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHRva2VuU3RhY2sgPSAoZW52LnRva2VuU3RhY2sgPSBbXSlcbiAgICAgICAgICBlbnYuY29kZSA9IGVudi5jb2RlLnJlcGxhY2UocGxhY2Vob2xkZXJQYXR0ZXJuLCBmdW5jdGlvbihtYXRjaCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiByZXBsYWNlRmlsdGVyID09PSAnZnVuY3Rpb24nICYmICFyZXBsYWNlRmlsdGVyKG1hdGNoKSkge1xuICAgICAgICAgICAgICByZXR1cm4gbWF0Y2hcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBpID0gdG9rZW5TdGFjay5sZW5ndGhcbiAgICAgICAgICAgIHZhciBwbGFjZWhvbGRlciAvLyBDaGVjayBmb3IgZXhpc3Rpbmcgc3RyaW5nc1xuICAgICAgICAgICAgd2hpbGUgKFxuICAgICAgICAgICAgICBlbnYuY29kZS5pbmRleE9mKChwbGFjZWhvbGRlciA9IGdldFBsYWNlaG9sZGVyKGxhbmd1YWdlLCBpKSkpICE9PVxuICAgICAgICAgICAgICAtMVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgICArK2kgLy8gQ3JlYXRlIGEgc3BhcnNlIGFycmF5XG4gICAgICAgICAgICB0b2tlblN0YWNrW2ldID0gbWF0Y2hcbiAgICAgICAgICAgIHJldHVybiBwbGFjZWhvbGRlclxuICAgICAgICAgIH0pIC8vIFN3aXRjaCB0aGUgZ3JhbW1hciB0byBtYXJrdXBcbiAgICAgICAgICBlbnYuZ3JhbW1hciA9IFByaXNtLmxhbmd1YWdlcy5tYXJrdXBcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHRva2VuaXplUGxhY2Vob2xkZXJzOiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXBsYWNlIHBsYWNlaG9sZGVycyB3aXRoIHByb3BlciB0b2tlbnMgYWZ0ZXIgdG9rZW5pemluZy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGVudiBUaGUgZW52aXJvbm1lbnQgb2YgdGhlIGBhZnRlci10b2tlbml6ZWAgaG9vay5cbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGxhbmd1YWdlIFRoZSBsYW5ndWFnZSBpZC5cbiAgICAgICAgICovXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihlbnYsIGxhbmd1YWdlKSB7XG4gICAgICAgICAgaWYgKGVudi5sYW5ndWFnZSAhPT0gbGFuZ3VhZ2UgfHwgIWVudi50b2tlblN0YWNrKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9IC8vIFN3aXRjaCB0aGUgZ3JhbW1hciBiYWNrXG4gICAgICAgICAgZW52LmdyYW1tYXIgPSBQcmlzbS5sYW5ndWFnZXNbbGFuZ3VhZ2VdXG4gICAgICAgICAgdmFyIGogPSAwXG4gICAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhlbnYudG9rZW5TdGFjaylcbiAgICAgICAgICBmdW5jdGlvbiB3YWxrVG9rZW5zKHRva2Vucykge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgLy8gYWxsIHBsYWNlaG9sZGVycyBhcmUgcmVwbGFjZWQgYWxyZWFkeVxuICAgICAgICAgICAgICBpZiAoaiA+PSBrZXlzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdmFyIHRva2VuID0gdG9rZW5zW2ldXG4gICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0eXBlb2YgdG9rZW4gPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICAgICAgICAgKHRva2VuLmNvbnRlbnQgJiYgdHlwZW9mIHRva2VuLmNvbnRlbnQgPT09ICdzdHJpbmcnKVxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB2YXIgayA9IGtleXNbal1cbiAgICAgICAgICAgICAgICB2YXIgdCA9IGVudi50b2tlblN0YWNrW2tdXG4gICAgICAgICAgICAgICAgdmFyIHMgPSB0eXBlb2YgdG9rZW4gPT09ICdzdHJpbmcnID8gdG9rZW4gOiB0b2tlbi5jb250ZW50XG4gICAgICAgICAgICAgICAgdmFyIHBsYWNlaG9sZGVyID0gZ2V0UGxhY2Vob2xkZXIobGFuZ3VhZ2UsIGspXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gcy5pbmRleE9mKHBsYWNlaG9sZGVyKVxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICArK2pcbiAgICAgICAgICAgICAgICAgIHZhciBiZWZvcmUgPSBzLnN1YnN0cmluZygwLCBpbmRleClcbiAgICAgICAgICAgICAgICAgIHZhciBtaWRkbGUgPSBuZXcgUHJpc20uVG9rZW4oXG4gICAgICAgICAgICAgICAgICAgIGxhbmd1YWdlLFxuICAgICAgICAgICAgICAgICAgICBQcmlzbS50b2tlbml6ZSh0LCBlbnYuZ3JhbW1hciksXG4gICAgICAgICAgICAgICAgICAgICdsYW5ndWFnZS0nICsgbGFuZ3VhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHRcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgIHZhciBhZnRlciA9IHMuc3Vic3RyaW5nKGluZGV4ICsgcGxhY2Vob2xkZXIubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgdmFyIHJlcGxhY2VtZW50ID0gW11cbiAgICAgICAgICAgICAgICAgIGlmIChiZWZvcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZW1lbnQucHVzaC5hcHBseShyZXBsYWNlbWVudCwgd2Fsa1Rva2VucyhbYmVmb3JlXSkpXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICByZXBsYWNlbWVudC5wdXNoKG1pZGRsZSlcbiAgICAgICAgICAgICAgICAgIGlmIChhZnRlcikge1xuICAgICAgICAgICAgICAgICAgICByZXBsYWNlbWVudC5wdXNoLmFwcGx5KHJlcGxhY2VtZW50LCB3YWxrVG9rZW5zKFthZnRlcl0pKVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0b2tlbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5zLnNwbGljZS5hcHBseSh0b2tlbnMsIFtpLCAxXS5jb25jYXQocmVwbGFjZW1lbnQpKVxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4uY29udGVudCA9IHJlcGxhY2VtZW50XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgIHRva2VuLmNvbnRlbnRcbiAgICAgICAgICAgICAgICAvKiAmJiB0eXBlb2YgdG9rZW4uY29udGVudCAhPT0gJ3N0cmluZycgKi9cbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgd2Fsa1Rva2Vucyh0b2tlbi5jb250ZW50KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdG9rZW5zXG4gICAgICAgICAgfVxuICAgICAgICAgIHdhbGtUb2tlbnMoZW52LnRva2VucylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH0pKFByaXNtKVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9