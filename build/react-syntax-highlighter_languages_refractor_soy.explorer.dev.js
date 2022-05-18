"use strict";
(this["webpackChunk_zesty_io_explorer"] = this["webpackChunk_zesty_io_explorer"] || []).push([["react-syntax-highlighter_languages_refractor_soy"],{

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


/***/ }),

/***/ "./node_modules/refractor/lang/soy.js":
/*!********************************************!*\
  !*** ./node_modules/refractor/lang/soy.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var refractorMarkupTemplating = __webpack_require__(/*! ./markup-templating.js */ "./node_modules/refractor/lang/markup-templating.js")
module.exports = soy
soy.displayName = 'soy'
soy.aliases = []
function soy(Prism) {
  Prism.register(refractorMarkupTemplating)
  ;(function(Prism) {
    var stringPattern = /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/
    var numberPattern = /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b|\b0x[\dA-F]+\b/
    Prism.languages.soy = {
      comment: [
        /\/\*[\s\S]*?\*\//,
        {
          pattern: /(\s)\/\/.*/,
          lookbehind: true,
          greedy: true
        }
      ],
      'command-arg': {
        pattern: /({+\/?\s*(?:alias|call|delcall|delpackage|deltemplate|namespace|template)\s+)\.?[\w.]+/,
        lookbehind: true,
        alias: 'string',
        inside: {
          punctuation: /\./
        }
      },
      parameter: {
        pattern: /({+\/?\s*@?param\??\s+)\.?[\w.]+/,
        lookbehind: true,
        alias: 'variable'
      },
      keyword: [
        {
          pattern: /({+\/?[^\S\r\n]*)(?:\\[nrt]|alias|call|case|css|default|delcall|delpackage|deltemplate|else(?:if)?|fallbackmsg|for(?:each)?|if(?:empty)?|lb|let|literal|msg|namespace|nil|@?param\??|rb|sp|switch|template|xid)/,
          lookbehind: true
        },
        /\b(?:any|as|attributes|bool|css|float|in|int|js|html|list|map|null|number|string|uri)\b/
      ],
      delimiter: {
        pattern: /^{+\/?|\/?}+$/,
        alias: 'punctuation'
      },
      property: /\w+(?==)/,
      variable: {
        pattern: /\$[^\W\d]\w*(?:\??(?:\.\w+|\[[^\]]+]))*/,
        inside: {
          string: {
            pattern: stringPattern,
            greedy: true
          },
          number: numberPattern,
          punctuation: /[\[\].?]/
        }
      },
      string: {
        pattern: stringPattern,
        greedy: true
      },
      function: [
        /\w+(?=\()/,
        {
          pattern: /(\|[^\S\r\n]*)\w+/,
          lookbehind: true
        }
      ],
      boolean: /\b(?:true|false)\b/,
      number: numberPattern,
      operator: /\?:?|<=?|>=?|==?|!=|[+*/%-]|\b(?:and|not|or)\b/,
      punctuation: /[{}()\[\]|.,:]/
    } // Tokenize all inline Soy expressions
    Prism.hooks.add('before-tokenize', function(env) {
      var soyPattern = /{{.+?}}|{.+?}|\s\/\/.*|\/\*[\s\S]*?\*\//g
      var soyLitteralStart = '{literal}'
      var soyLitteralEnd = '{/literal}'
      var soyLitteralMode = false
      Prism.languages['markup-templating'].buildPlaceholders(
        env,
        'soy',
        soyPattern,
        function(match) {
          // Soy tags inside {literal} block are ignored
          if (match === soyLitteralEnd) {
            soyLitteralMode = false
          }
          if (!soyLitteralMode) {
            if (match === soyLitteralStart) {
              soyLitteralMode = true
            }
            return true
          }
          return false
        }
      )
    }) // Re-insert the tokens after tokenizing
    Prism.hooks.add('after-tokenize', function(env) {
      Prism.languages['markup-templating'].tokenizePlaceholders(env, 'soy')
    })
  })(Prism)
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyX2xhbmd1YWdlc19yZWZyYWN0b3Jfc295LmV4cGxvcmVyLmRldi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkIsZUFBZSxlQUFlO0FBQzlCLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNFQUFzRTtBQUN0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixRQUFRO0FBQzNCLG1CQUFtQixRQUFRO0FBQzNCLG1CQUFtQixRQUFRO0FBQzNCLG1CQUFtQiw0QkFBNEI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixRQUFRO0FBQzNCLG1CQUFtQixRQUFRO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLG1CQUFtQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7Ozs7Ozs7Ozs7O0FDeEhZO0FBQ1osZ0NBQWdDLG1CQUFPLENBQUMsa0ZBQXdCO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixTQUFTO0FBQzdCO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkIsTUFBTTtBQUNOO0FBQ0EsMEJBQTBCLEtBQUssRUFBRSxJQUFJO0FBQ3JDLCtCQUErQixRQUFRO0FBQ3ZDLDZCQUE2QixTQUFTO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixTQUFTO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSCIsInNvdXJjZXMiOlsid2VicGFjazovL0B6ZXN0eS1pby9leHBsb3Jlci8uL25vZGVfbW9kdWxlcy9yZWZyYWN0b3IvbGFuZy9tYXJrdXAtdGVtcGxhdGluZy5qcyIsIndlYnBhY2s6Ly9AemVzdHktaW8vZXhwbG9yZXIvLi9ub2RlX21vZHVsZXMvcmVmcmFjdG9yL2xhbmcvc295LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcmt1cFRlbXBsYXRpbmdcbm1hcmt1cFRlbXBsYXRpbmcuZGlzcGxheU5hbWUgPSAnbWFya3VwVGVtcGxhdGluZydcbm1hcmt1cFRlbXBsYXRpbmcuYWxpYXNlcyA9IFtdXG5mdW5jdGlvbiBtYXJrdXBUZW1wbGF0aW5nKFByaXNtKSB7XG4gIDsoZnVuY3Rpb24oUHJpc20pIHtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBwbGFjZWhvbGRlciBmb3IgdGhlIGdpdmVuIGxhbmd1YWdlIGlkIGFuZCBpbmRleC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsYW5ndWFnZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcn0gaW5kZXhcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFBsYWNlaG9sZGVyKGxhbmd1YWdlLCBpbmRleCkge1xuICAgICAgcmV0dXJuICdfX18nICsgbGFuZ3VhZ2UudG9VcHBlckNhc2UoKSArIGluZGV4ICsgJ19fXydcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoKFByaXNtLmxhbmd1YWdlc1snbWFya3VwLXRlbXBsYXRpbmcnXSA9IHt9KSwge1xuICAgICAgYnVpbGRQbGFjZWhvbGRlcnM6IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRva2VuaXplIGFsbCBpbmxpbmUgdGVtcGxhdGluZyBleHByZXNzaW9ucyBtYXRjaGluZyBgcGxhY2Vob2xkZXJQYXR0ZXJuYC5cbiAgICAgICAgICpcbiAgICAgICAgICogSWYgYHJlcGxhY2VGaWx0ZXJgIGlzIHByb3ZpZGVkLCBvbmx5IG1hdGNoZXMgb2YgYHBsYWNlaG9sZGVyUGF0dGVybmAgZm9yIHdoaWNoIGByZXBsYWNlRmlsdGVyYCByZXR1cm5zXG4gICAgICAgICAqIGB0cnVlYCB3aWxsIGJlIHJlcGxhY2VkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZW52IFRoZSBlbnZpcm9ubWVudCBvZiB0aGUgYGJlZm9yZS10b2tlbml6ZWAgaG9vay5cbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGxhbmd1YWdlIFRoZSBsYW5ndWFnZSBpZC5cbiAgICAgICAgICogQHBhcmFtIHtSZWdFeHB9IHBsYWNlaG9sZGVyUGF0dGVybiBUaGUgbWF0Y2hlcyBvZiB0aGlzIHBhdHRlcm4gd2lsbCBiZSByZXBsYWNlZCBieSBwbGFjZWhvbGRlcnMuXG4gICAgICAgICAqIEBwYXJhbSB7KG1hdGNoOiBzdHJpbmcpID0+IGJvb2xlYW59IFtyZXBsYWNlRmlsdGVyXVxuICAgICAgICAgKi9cbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKGVudiwgbGFuZ3VhZ2UsIHBsYWNlaG9sZGVyUGF0dGVybiwgcmVwbGFjZUZpbHRlcikge1xuICAgICAgICAgIGlmIChlbnYubGFuZ3VhZ2UgIT09IGxhbmd1YWdlKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHRva2VuU3RhY2sgPSAoZW52LnRva2VuU3RhY2sgPSBbXSlcbiAgICAgICAgICBlbnYuY29kZSA9IGVudi5jb2RlLnJlcGxhY2UocGxhY2Vob2xkZXJQYXR0ZXJuLCBmdW5jdGlvbihtYXRjaCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiByZXBsYWNlRmlsdGVyID09PSAnZnVuY3Rpb24nICYmICFyZXBsYWNlRmlsdGVyKG1hdGNoKSkge1xuICAgICAgICAgICAgICByZXR1cm4gbWF0Y2hcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBpID0gdG9rZW5TdGFjay5sZW5ndGhcbiAgICAgICAgICAgIHZhciBwbGFjZWhvbGRlciAvLyBDaGVjayBmb3IgZXhpc3Rpbmcgc3RyaW5nc1xuICAgICAgICAgICAgd2hpbGUgKFxuICAgICAgICAgICAgICBlbnYuY29kZS5pbmRleE9mKChwbGFjZWhvbGRlciA9IGdldFBsYWNlaG9sZGVyKGxhbmd1YWdlLCBpKSkpICE9PVxuICAgICAgICAgICAgICAtMVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgICArK2kgLy8gQ3JlYXRlIGEgc3BhcnNlIGFycmF5XG4gICAgICAgICAgICB0b2tlblN0YWNrW2ldID0gbWF0Y2hcbiAgICAgICAgICAgIHJldHVybiBwbGFjZWhvbGRlclxuICAgICAgICAgIH0pIC8vIFN3aXRjaCB0aGUgZ3JhbW1hciB0byBtYXJrdXBcbiAgICAgICAgICBlbnYuZ3JhbW1hciA9IFByaXNtLmxhbmd1YWdlcy5tYXJrdXBcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHRva2VuaXplUGxhY2Vob2xkZXJzOiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXBsYWNlIHBsYWNlaG9sZGVycyB3aXRoIHByb3BlciB0b2tlbnMgYWZ0ZXIgdG9rZW5pemluZy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGVudiBUaGUgZW52aXJvbm1lbnQgb2YgdGhlIGBhZnRlci10b2tlbml6ZWAgaG9vay5cbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGxhbmd1YWdlIFRoZSBsYW5ndWFnZSBpZC5cbiAgICAgICAgICovXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihlbnYsIGxhbmd1YWdlKSB7XG4gICAgICAgICAgaWYgKGVudi5sYW5ndWFnZSAhPT0gbGFuZ3VhZ2UgfHwgIWVudi50b2tlblN0YWNrKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9IC8vIFN3aXRjaCB0aGUgZ3JhbW1hciBiYWNrXG4gICAgICAgICAgZW52LmdyYW1tYXIgPSBQcmlzbS5sYW5ndWFnZXNbbGFuZ3VhZ2VdXG4gICAgICAgICAgdmFyIGogPSAwXG4gICAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhlbnYudG9rZW5TdGFjaylcbiAgICAgICAgICBmdW5jdGlvbiB3YWxrVG9rZW5zKHRva2Vucykge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgLy8gYWxsIHBsYWNlaG9sZGVycyBhcmUgcmVwbGFjZWQgYWxyZWFkeVxuICAgICAgICAgICAgICBpZiAoaiA+PSBrZXlzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdmFyIHRva2VuID0gdG9rZW5zW2ldXG4gICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0eXBlb2YgdG9rZW4gPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICAgICAgICAgKHRva2VuLmNvbnRlbnQgJiYgdHlwZW9mIHRva2VuLmNvbnRlbnQgPT09ICdzdHJpbmcnKVxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB2YXIgayA9IGtleXNbal1cbiAgICAgICAgICAgICAgICB2YXIgdCA9IGVudi50b2tlblN0YWNrW2tdXG4gICAgICAgICAgICAgICAgdmFyIHMgPSB0eXBlb2YgdG9rZW4gPT09ICdzdHJpbmcnID8gdG9rZW4gOiB0b2tlbi5jb250ZW50XG4gICAgICAgICAgICAgICAgdmFyIHBsYWNlaG9sZGVyID0gZ2V0UGxhY2Vob2xkZXIobGFuZ3VhZ2UsIGspXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gcy5pbmRleE9mKHBsYWNlaG9sZGVyKVxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICArK2pcbiAgICAgICAgICAgICAgICAgIHZhciBiZWZvcmUgPSBzLnN1YnN0cmluZygwLCBpbmRleClcbiAgICAgICAgICAgICAgICAgIHZhciBtaWRkbGUgPSBuZXcgUHJpc20uVG9rZW4oXG4gICAgICAgICAgICAgICAgICAgIGxhbmd1YWdlLFxuICAgICAgICAgICAgICAgICAgICBQcmlzbS50b2tlbml6ZSh0LCBlbnYuZ3JhbW1hciksXG4gICAgICAgICAgICAgICAgICAgICdsYW5ndWFnZS0nICsgbGFuZ3VhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHRcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgIHZhciBhZnRlciA9IHMuc3Vic3RyaW5nKGluZGV4ICsgcGxhY2Vob2xkZXIubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgdmFyIHJlcGxhY2VtZW50ID0gW11cbiAgICAgICAgICAgICAgICAgIGlmIChiZWZvcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZW1lbnQucHVzaC5hcHBseShyZXBsYWNlbWVudCwgd2Fsa1Rva2VucyhbYmVmb3JlXSkpXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICByZXBsYWNlbWVudC5wdXNoKG1pZGRsZSlcbiAgICAgICAgICAgICAgICAgIGlmIChhZnRlcikge1xuICAgICAgICAgICAgICAgICAgICByZXBsYWNlbWVudC5wdXNoLmFwcGx5KHJlcGxhY2VtZW50LCB3YWxrVG9rZW5zKFthZnRlcl0pKVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0b2tlbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5zLnNwbGljZS5hcHBseSh0b2tlbnMsIFtpLCAxXS5jb25jYXQocmVwbGFjZW1lbnQpKVxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4uY29udGVudCA9IHJlcGxhY2VtZW50XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgIHRva2VuLmNvbnRlbnRcbiAgICAgICAgICAgICAgICAvKiAmJiB0eXBlb2YgdG9rZW4uY29udGVudCAhPT0gJ3N0cmluZycgKi9cbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgd2Fsa1Rva2Vucyh0b2tlbi5jb250ZW50KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdG9rZW5zXG4gICAgICAgICAgfVxuICAgICAgICAgIHdhbGtUb2tlbnMoZW52LnRva2VucylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH0pKFByaXNtKVxufVxuIiwiJ3VzZSBzdHJpY3QnXG52YXIgcmVmcmFjdG9yTWFya3VwVGVtcGxhdGluZyA9IHJlcXVpcmUoJy4vbWFya3VwLXRlbXBsYXRpbmcuanMnKVxubW9kdWxlLmV4cG9ydHMgPSBzb3lcbnNveS5kaXNwbGF5TmFtZSA9ICdzb3knXG5zb3kuYWxpYXNlcyA9IFtdXG5mdW5jdGlvbiBzb3koUHJpc20pIHtcbiAgUHJpc20ucmVnaXN0ZXIocmVmcmFjdG9yTWFya3VwVGVtcGxhdGluZylcbiAgOyhmdW5jdGlvbihQcmlzbSkge1xuICAgIHZhciBzdHJpbmdQYXR0ZXJuID0gLyhbXCInXSkoPzpcXFxcKD86XFxyXFxufFtcXHNcXFNdKXwoPyFcXDEpW15cXFxcXFxyXFxuXSkqXFwxL1xuICAgIHZhciBudW1iZXJQYXR0ZXJuID0gL1xcYlxcZCsoPzpcXC5cXGQrKT8oPzpbZUVdWystXT9cXGQrKT9cXGJ8XFxiMHhbXFxkQS1GXStcXGIvXG4gICAgUHJpc20ubGFuZ3VhZ2VzLnNveSA9IHtcbiAgICAgIGNvbW1lbnQ6IFtcbiAgICAgICAgL1xcL1xcKltcXHNcXFNdKj9cXCpcXC8vLFxuICAgICAgICB7XG4gICAgICAgICAgcGF0dGVybjogLyhcXHMpXFwvXFwvLiovLFxuICAgICAgICAgIGxvb2tiZWhpbmQ6IHRydWUsXG4gICAgICAgICAgZ3JlZWR5OiB0cnVlXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICAnY29tbWFuZC1hcmcnOiB7XG4gICAgICAgIHBhdHRlcm46IC8oeytcXC8/XFxzKig/OmFsaWFzfGNhbGx8ZGVsY2FsbHxkZWxwYWNrYWdlfGRlbHRlbXBsYXRlfG5hbWVzcGFjZXx0ZW1wbGF0ZSlcXHMrKVxcLj9bXFx3Ll0rLyxcbiAgICAgICAgbG9va2JlaGluZDogdHJ1ZSxcbiAgICAgICAgYWxpYXM6ICdzdHJpbmcnLFxuICAgICAgICBpbnNpZGU6IHtcbiAgICAgICAgICBwdW5jdHVhdGlvbjogL1xcLi9cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHBhcmFtZXRlcjoge1xuICAgICAgICBwYXR0ZXJuOiAvKHsrXFwvP1xccypAP3BhcmFtXFw/P1xccyspXFwuP1tcXHcuXSsvLFxuICAgICAgICBsb29rYmVoaW5kOiB0cnVlLFxuICAgICAgICBhbGlhczogJ3ZhcmlhYmxlJ1xuICAgICAgfSxcbiAgICAgIGtleXdvcmQ6IFtcbiAgICAgICAge1xuICAgICAgICAgIHBhdHRlcm46IC8oeytcXC8/W15cXFNcXHJcXG5dKikoPzpcXFxcW25ydF18YWxpYXN8Y2FsbHxjYXNlfGNzc3xkZWZhdWx0fGRlbGNhbGx8ZGVscGFja2FnZXxkZWx0ZW1wbGF0ZXxlbHNlKD86aWYpP3xmYWxsYmFja21zZ3xmb3IoPzplYWNoKT98aWYoPzplbXB0eSk/fGxifGxldHxsaXRlcmFsfG1zZ3xuYW1lc3BhY2V8bmlsfEA/cGFyYW1cXD8/fHJifHNwfHN3aXRjaHx0ZW1wbGF0ZXx4aWQpLyxcbiAgICAgICAgICBsb29rYmVoaW5kOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIC9cXGIoPzphbnl8YXN8YXR0cmlidXRlc3xib29sfGNzc3xmbG9hdHxpbnxpbnR8anN8aHRtbHxsaXN0fG1hcHxudWxsfG51bWJlcnxzdHJpbmd8dXJpKVxcYi9cbiAgICAgIF0sXG4gICAgICBkZWxpbWl0ZXI6IHtcbiAgICAgICAgcGF0dGVybjogL157K1xcLz98XFwvP30rJC8sXG4gICAgICAgIGFsaWFzOiAncHVuY3R1YXRpb24nXG4gICAgICB9LFxuICAgICAgcHJvcGVydHk6IC9cXHcrKD89PSkvLFxuICAgICAgdmFyaWFibGU6IHtcbiAgICAgICAgcGF0dGVybjogL1xcJFteXFxXXFxkXVxcdyooPzpcXD8/KD86XFwuXFx3K3xcXFtbXlxcXV0rXSkpKi8sXG4gICAgICAgIGluc2lkZToge1xuICAgICAgICAgIHN0cmluZzoge1xuICAgICAgICAgICAgcGF0dGVybjogc3RyaW5nUGF0dGVybixcbiAgICAgICAgICAgIGdyZWVkeTogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgbnVtYmVyOiBudW1iZXJQYXR0ZXJuLFxuICAgICAgICAgIHB1bmN0dWF0aW9uOiAvW1xcW1xcXS4/XS9cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHN0cmluZzoge1xuICAgICAgICBwYXR0ZXJuOiBzdHJpbmdQYXR0ZXJuLFxuICAgICAgICBncmVlZHk6IHRydWVcbiAgICAgIH0sXG4gICAgICBmdW5jdGlvbjogW1xuICAgICAgICAvXFx3Kyg/PVxcKCkvLFxuICAgICAgICB7XG4gICAgICAgICAgcGF0dGVybjogLyhcXHxbXlxcU1xcclxcbl0qKVxcdysvLFxuICAgICAgICAgIGxvb2tiZWhpbmQ6IHRydWVcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIGJvb2xlYW46IC9cXGIoPzp0cnVlfGZhbHNlKVxcYi8sXG4gICAgICBudW1iZXI6IG51bWJlclBhdHRlcm4sXG4gICAgICBvcGVyYXRvcjogL1xcPzo/fDw9P3w+PT98PT0/fCE9fFsrKi8lLV18XFxiKD86YW5kfG5vdHxvcilcXGIvLFxuICAgICAgcHVuY3R1YXRpb246IC9be30oKVxcW1xcXXwuLDpdL1xuICAgIH0gLy8gVG9rZW5pemUgYWxsIGlubGluZSBTb3kgZXhwcmVzc2lvbnNcbiAgICBQcmlzbS5ob29rcy5hZGQoJ2JlZm9yZS10b2tlbml6ZScsIGZ1bmN0aW9uKGVudikge1xuICAgICAgdmFyIHNveVBhdHRlcm4gPSAve3suKz99fXx7Lis/fXxcXHNcXC9cXC8uKnxcXC9cXCpbXFxzXFxTXSo/XFwqXFwvL2dcbiAgICAgIHZhciBzb3lMaXR0ZXJhbFN0YXJ0ID0gJ3tsaXRlcmFsfSdcbiAgICAgIHZhciBzb3lMaXR0ZXJhbEVuZCA9ICd7L2xpdGVyYWx9J1xuICAgICAgdmFyIHNveUxpdHRlcmFsTW9kZSA9IGZhbHNlXG4gICAgICBQcmlzbS5sYW5ndWFnZXNbJ21hcmt1cC10ZW1wbGF0aW5nJ10uYnVpbGRQbGFjZWhvbGRlcnMoXG4gICAgICAgIGVudixcbiAgICAgICAgJ3NveScsXG4gICAgICAgIHNveVBhdHRlcm4sXG4gICAgICAgIGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgICAgICAgLy8gU295IHRhZ3MgaW5zaWRlIHtsaXRlcmFsfSBibG9jayBhcmUgaWdub3JlZFxuICAgICAgICAgIGlmIChtYXRjaCA9PT0gc295TGl0dGVyYWxFbmQpIHtcbiAgICAgICAgICAgIHNveUxpdHRlcmFsTW9kZSA9IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghc295TGl0dGVyYWxNb2RlKSB7XG4gICAgICAgICAgICBpZiAobWF0Y2ggPT09IHNveUxpdHRlcmFsU3RhcnQpIHtcbiAgICAgICAgICAgICAgc295TGl0dGVyYWxNb2RlID0gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9KSAvLyBSZS1pbnNlcnQgdGhlIHRva2VucyBhZnRlciB0b2tlbml6aW5nXG4gICAgUHJpc20uaG9va3MuYWRkKCdhZnRlci10b2tlbml6ZScsIGZ1bmN0aW9uKGVudikge1xuICAgICAgUHJpc20ubGFuZ3VhZ2VzWydtYXJrdXAtdGVtcGxhdGluZyddLnRva2VuaXplUGxhY2Vob2xkZXJzKGVudiwgJ3NveScpXG4gICAgfSlcbiAgfSkoUHJpc20pXG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=