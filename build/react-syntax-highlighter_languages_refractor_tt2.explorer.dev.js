"use strict";
(this["webpackChunk_zesty_io_explorer"] = this["webpackChunk_zesty_io_explorer"] || []).push([["react-syntax-highlighter_languages_refractor_tt2"],{

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

/***/ "./node_modules/refractor/lang/tt2.js":
/*!********************************************!*\
  !*** ./node_modules/refractor/lang/tt2.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var refractorMarkupTemplating = __webpack_require__(/*! ./markup-templating.js */ "./node_modules/refractor/lang/markup-templating.js")
module.exports = tt2
tt2.displayName = 'tt2'
tt2.aliases = []
function tt2(Prism) {
  Prism.register(refractorMarkupTemplating)
  ;(function(Prism) {
    Prism.languages.tt2 = Prism.languages.extend('clike', {
      comment: /#.*|\[%#[\s\S]*?%\]/,
      keyword: /\b(?:BLOCK|CALL|CASE|CATCH|CLEAR|DEBUG|DEFAULT|ELSE|ELSIF|END|FILTER|FINAL|FOREACH|GET|IF|IN|INCLUDE|INSERT|LAST|MACRO|META|NEXT|PERL|PROCESS|RAWPERL|RETURN|SET|STOP|TAGS|THROW|TRY|SWITCH|UNLESS|USE|WHILE|WRAPPER)\b/,
      punctuation: /[[\]{},()]/
    })
    Prism.languages.insertBefore('tt2', 'number', {
      operator: /=[>=]?|!=?|<=?|>=?|&&|\|\|?|\b(?:and|or|not)\b/,
      variable: {
        pattern: /[a-z]\w*(?:\s*\.\s*(?:\d+|\$?[a-z]\w*))*/i
      }
    })
    Prism.languages.insertBefore('tt2', 'keyword', {
      delimiter: {
        pattern: /^(?:\[%|%%)-?|-?%]$/,
        alias: 'punctuation'
      }
    })
    Prism.languages.insertBefore('tt2', 'string', {
      'single-quoted-string': {
        pattern: /'[^\\']*(?:\\[\s\S][^\\']*)*'/,
        greedy: true,
        alias: 'string'
      },
      'double-quoted-string': {
        pattern: /"[^\\"]*(?:\\[\s\S][^\\"]*)*"/,
        greedy: true,
        alias: 'string',
        inside: {
          variable: {
            pattern: /\$(?:[a-z]\w*(?:\.(?:\d+|\$?[a-z]\w*))*)/i
          }
        }
      }
    }) // The different types of TT2 strings "replace" the C-like standard string
    delete Prism.languages.tt2.string
    Prism.hooks.add('before-tokenize', function(env) {
      var tt2Pattern = /\[%[\s\S]+?%\]/g
      Prism.languages['markup-templating'].buildPlaceholders(
        env,
        'tt2',
        tt2Pattern
      )
    })
    Prism.hooks.add('after-tokenize', function(env) {
      Prism.languages['markup-templating'].tokenizePlaceholders(env, 'tt2')
    })
  })(Prism)
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyX2xhbmd1YWdlc19yZWZyYWN0b3JfdHQyLmV4cGxvcmVyLmRldi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkIsZUFBZSxlQUFlO0FBQzlCLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNFQUFzRTtBQUN0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixRQUFRO0FBQzNCLG1CQUFtQixRQUFRO0FBQzNCLG1CQUFtQixRQUFRO0FBQzNCLG1CQUFtQiw0QkFBNEI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixRQUFRO0FBQzNCLG1CQUFtQixRQUFRO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLG1CQUFtQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7Ozs7Ozs7Ozs7O0FDeEhZO0FBQ1osZ0NBQWdDLG1CQUFPLENBQUMsa0ZBQXdCO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQHplc3R5LWlvL2V4cGxvcmVyLy4vbm9kZV9tb2R1bGVzL3JlZnJhY3Rvci9sYW5nL21hcmt1cC10ZW1wbGF0aW5nLmpzIiwid2VicGFjazovL0B6ZXN0eS1pby9leHBsb3Jlci8uL25vZGVfbW9kdWxlcy9yZWZyYWN0b3IvbGFuZy90dDIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gbWFya3VwVGVtcGxhdGluZ1xubWFya3VwVGVtcGxhdGluZy5kaXNwbGF5TmFtZSA9ICdtYXJrdXBUZW1wbGF0aW5nJ1xubWFya3VwVGVtcGxhdGluZy5hbGlhc2VzID0gW11cbmZ1bmN0aW9uIG1hcmt1cFRlbXBsYXRpbmcoUHJpc20pIHtcbiAgOyhmdW5jdGlvbihQcmlzbSkge1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHBsYWNlaG9sZGVyIGZvciB0aGUgZ2l2ZW4gbGFuZ3VhZ2UgaWQgYW5kIGluZGV4LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGxhbmd1YWdlXG4gICAgICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSBpbmRleFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0UGxhY2Vob2xkZXIobGFuZ3VhZ2UsIGluZGV4KSB7XG4gICAgICByZXR1cm4gJ19fXycgKyBsYW5ndWFnZS50b1VwcGVyQ2FzZSgpICsgaW5kZXggKyAnX19fJ1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcygoUHJpc20ubGFuZ3VhZ2VzWydtYXJrdXAtdGVtcGxhdGluZyddID0ge30pLCB7XG4gICAgICBidWlsZFBsYWNlaG9sZGVyczoge1xuICAgICAgICAvKipcbiAgICAgICAgICogVG9rZW5pemUgYWxsIGlubGluZSB0ZW1wbGF0aW5nIGV4cHJlc3Npb25zIG1hdGNoaW5nIGBwbGFjZWhvbGRlclBhdHRlcm5gLlxuICAgICAgICAgKlxuICAgICAgICAgKiBJZiBgcmVwbGFjZUZpbHRlcmAgaXMgcHJvdmlkZWQsIG9ubHkgbWF0Y2hlcyBvZiBgcGxhY2Vob2xkZXJQYXR0ZXJuYCBmb3Igd2hpY2ggYHJlcGxhY2VGaWx0ZXJgIHJldHVybnNcbiAgICAgICAgICogYHRydWVgIHdpbGwgYmUgcmVwbGFjZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbnYgVGhlIGVudmlyb25tZW50IG9mIHRoZSBgYmVmb3JlLXRva2VuaXplYCBob29rLlxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbGFuZ3VhZ2UgVGhlIGxhbmd1YWdlIGlkLlxuICAgICAgICAgKiBAcGFyYW0ge1JlZ0V4cH0gcGxhY2Vob2xkZXJQYXR0ZXJuIFRoZSBtYXRjaGVzIG9mIHRoaXMgcGF0dGVybiB3aWxsIGJlIHJlcGxhY2VkIGJ5IHBsYWNlaG9sZGVycy5cbiAgICAgICAgICogQHBhcmFtIHsobWF0Y2g6IHN0cmluZykgPT4gYm9vbGVhbn0gW3JlcGxhY2VGaWx0ZXJdXG4gICAgICAgICAqL1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oZW52LCBsYW5ndWFnZSwgcGxhY2Vob2xkZXJQYXR0ZXJuLCByZXBsYWNlRmlsdGVyKSB7XG4gICAgICAgICAgaWYgKGVudi5sYW5ndWFnZSAhPT0gbGFuZ3VhZ2UpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgdG9rZW5TdGFjayA9IChlbnYudG9rZW5TdGFjayA9IFtdKVxuICAgICAgICAgIGVudi5jb2RlID0gZW52LmNvZGUucmVwbGFjZShwbGFjZWhvbGRlclBhdHRlcm4sIGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJlcGxhY2VGaWx0ZXIgPT09ICdmdW5jdGlvbicgJiYgIXJlcGxhY2VGaWx0ZXIobWF0Y2gpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBtYXRjaFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGkgPSB0b2tlblN0YWNrLmxlbmd0aFxuICAgICAgICAgICAgdmFyIHBsYWNlaG9sZGVyIC8vIENoZWNrIGZvciBleGlzdGluZyBzdHJpbmdzXG4gICAgICAgICAgICB3aGlsZSAoXG4gICAgICAgICAgICAgIGVudi5jb2RlLmluZGV4T2YoKHBsYWNlaG9sZGVyID0gZ2V0UGxhY2Vob2xkZXIobGFuZ3VhZ2UsIGkpKSkgIT09XG4gICAgICAgICAgICAgIC0xXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAgICsraSAvLyBDcmVhdGUgYSBzcGFyc2UgYXJyYXlcbiAgICAgICAgICAgIHRva2VuU3RhY2tbaV0gPSBtYXRjaFxuICAgICAgICAgICAgcmV0dXJuIHBsYWNlaG9sZGVyXG4gICAgICAgICAgfSkgLy8gU3dpdGNoIHRoZSBncmFtbWFyIHRvIG1hcmt1cFxuICAgICAgICAgIGVudi5ncmFtbWFyID0gUHJpc20ubGFuZ3VhZ2VzLm1hcmt1cFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdG9rZW5pemVQbGFjZWhvbGRlcnM6IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlcGxhY2UgcGxhY2Vob2xkZXJzIHdpdGggcHJvcGVyIHRva2VucyBhZnRlciB0b2tlbml6aW5nLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZW52IFRoZSBlbnZpcm9ubWVudCBvZiB0aGUgYGFmdGVyLXRva2VuaXplYCBob29rLlxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbGFuZ3VhZ2UgVGhlIGxhbmd1YWdlIGlkLlxuICAgICAgICAgKi9cbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKGVudiwgbGFuZ3VhZ2UpIHtcbiAgICAgICAgICBpZiAoZW52Lmxhbmd1YWdlICE9PSBsYW5ndWFnZSB8fCAhZW52LnRva2VuU3RhY2spIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH0gLy8gU3dpdGNoIHRoZSBncmFtbWFyIGJhY2tcbiAgICAgICAgICBlbnYuZ3JhbW1hciA9IFByaXNtLmxhbmd1YWdlc1tsYW5ndWFnZV1cbiAgICAgICAgICB2YXIgaiA9IDBcbiAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGVudi50b2tlblN0YWNrKVxuICAgICAgICAgIGZ1bmN0aW9uIHdhbGtUb2tlbnModG9rZW5zKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAvLyBhbGwgcGxhY2Vob2xkZXJzIGFyZSByZXBsYWNlZCBhbHJlYWR5XG4gICAgICAgICAgICAgIGlmIChqID49IGtleXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB2YXIgdG9rZW4gPSB0b2tlbnNbaV1cbiAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHR5cGVvZiB0b2tlbiA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgICAgICAgICAodG9rZW4uY29udGVudCAmJiB0eXBlb2YgdG9rZW4uY29udGVudCA9PT0gJ3N0cmluZycpXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHZhciBrID0ga2V5c1tqXVxuICAgICAgICAgICAgICAgIHZhciB0ID0gZW52LnRva2VuU3RhY2tba11cbiAgICAgICAgICAgICAgICB2YXIgcyA9IHR5cGVvZiB0b2tlbiA9PT0gJ3N0cmluZycgPyB0b2tlbiA6IHRva2VuLmNvbnRlbnRcbiAgICAgICAgICAgICAgICB2YXIgcGxhY2Vob2xkZXIgPSBnZXRQbGFjZWhvbGRlcihsYW5ndWFnZSwgaylcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBzLmluZGV4T2YocGxhY2Vob2xkZXIpXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICsralxuICAgICAgICAgICAgICAgICAgdmFyIGJlZm9yZSA9IHMuc3Vic3RyaW5nKDAsIGluZGV4KVxuICAgICAgICAgICAgICAgICAgdmFyIG1pZGRsZSA9IG5ldyBQcmlzbS5Ub2tlbihcbiAgICAgICAgICAgICAgICAgICAgbGFuZ3VhZ2UsXG4gICAgICAgICAgICAgICAgICAgIFByaXNtLnRva2VuaXplKHQsIGVudi5ncmFtbWFyKSxcbiAgICAgICAgICAgICAgICAgICAgJ2xhbmd1YWdlLScgKyBsYW5ndWFnZSxcbiAgICAgICAgICAgICAgICAgICAgdFxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgdmFyIGFmdGVyID0gcy5zdWJzdHJpbmcoaW5kZXggKyBwbGFjZWhvbGRlci5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICB2YXIgcmVwbGFjZW1lbnQgPSBbXVxuICAgICAgICAgICAgICAgICAgaWYgKGJlZm9yZSkge1xuICAgICAgICAgICAgICAgICAgICByZXBsYWNlbWVudC5wdXNoLmFwcGx5KHJlcGxhY2VtZW50LCB3YWxrVG9rZW5zKFtiZWZvcmVdKSlcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHJlcGxhY2VtZW50LnB1c2gobWlkZGxlKVxuICAgICAgICAgICAgICAgICAgaWYgKGFmdGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2VtZW50LnB1c2guYXBwbHkocmVwbGFjZW1lbnQsIHdhbGtUb2tlbnMoW2FmdGVyXSkpXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRva2VuID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbnMuc3BsaWNlLmFwcGx5KHRva2VucywgW2ksIDFdLmNvbmNhdChyZXBsYWNlbWVudCkpXG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbi5jb250ZW50ID0gcmVwbGFjZW1lbnRcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgdG9rZW4uY29udGVudFxuICAgICAgICAgICAgICAgIC8qICYmIHR5cGVvZiB0b2tlbi5jb250ZW50ICE9PSAnc3RyaW5nJyAqL1xuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB3YWxrVG9rZW5zKHRva2VuLmNvbnRlbnQpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0b2tlbnNcbiAgICAgICAgICB9XG4gICAgICAgICAgd2Fsa1Rva2VucyhlbnYudG9rZW5zKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfSkoUHJpc20pXG59XG4iLCIndXNlIHN0cmljdCdcbnZhciByZWZyYWN0b3JNYXJrdXBUZW1wbGF0aW5nID0gcmVxdWlyZSgnLi9tYXJrdXAtdGVtcGxhdGluZy5qcycpXG5tb2R1bGUuZXhwb3J0cyA9IHR0MlxudHQyLmRpc3BsYXlOYW1lID0gJ3R0MidcbnR0Mi5hbGlhc2VzID0gW11cbmZ1bmN0aW9uIHR0MihQcmlzbSkge1xuICBQcmlzbS5yZWdpc3RlcihyZWZyYWN0b3JNYXJrdXBUZW1wbGF0aW5nKVxuICA7KGZ1bmN0aW9uKFByaXNtKSB7XG4gICAgUHJpc20ubGFuZ3VhZ2VzLnR0MiA9IFByaXNtLmxhbmd1YWdlcy5leHRlbmQoJ2NsaWtlJywge1xuICAgICAgY29tbWVudDogLyMuKnxcXFslI1tcXHNcXFNdKj8lXFxdLyxcbiAgICAgIGtleXdvcmQ6IC9cXGIoPzpCTE9DS3xDQUxMfENBU0V8Q0FUQ0h8Q0xFQVJ8REVCVUd8REVGQVVMVHxFTFNFfEVMU0lGfEVORHxGSUxURVJ8RklOQUx8Rk9SRUFDSHxHRVR8SUZ8SU58SU5DTFVERXxJTlNFUlR8TEFTVHxNQUNST3xNRVRBfE5FWFR8UEVSTHxQUk9DRVNTfFJBV1BFUkx8UkVUVVJOfFNFVHxTVE9QfFRBR1N8VEhST1d8VFJZfFNXSVRDSHxVTkxFU1N8VVNFfFdISUxFfFdSQVBQRVIpXFxiLyxcbiAgICAgIHB1bmN0dWF0aW9uOiAvW1tcXF17fSwoKV0vXG4gICAgfSlcbiAgICBQcmlzbS5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKCd0dDInLCAnbnVtYmVyJywge1xuICAgICAgb3BlcmF0b3I6IC89Wz49XT98IT0/fDw9P3w+PT98JiZ8XFx8XFx8P3xcXGIoPzphbmR8b3J8bm90KVxcYi8sXG4gICAgICB2YXJpYWJsZToge1xuICAgICAgICBwYXR0ZXJuOiAvW2Etel1cXHcqKD86XFxzKlxcLlxccyooPzpcXGQrfFxcJD9bYS16XVxcdyopKSovaVxuICAgICAgfVxuICAgIH0pXG4gICAgUHJpc20ubGFuZ3VhZ2VzLmluc2VydEJlZm9yZSgndHQyJywgJ2tleXdvcmQnLCB7XG4gICAgICBkZWxpbWl0ZXI6IHtcbiAgICAgICAgcGF0dGVybjogL14oPzpcXFslfCUlKS0/fC0/JV0kLyxcbiAgICAgICAgYWxpYXM6ICdwdW5jdHVhdGlvbidcbiAgICAgIH1cbiAgICB9KVxuICAgIFByaXNtLmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoJ3R0MicsICdzdHJpbmcnLCB7XG4gICAgICAnc2luZ2xlLXF1b3RlZC1zdHJpbmcnOiB7XG4gICAgICAgIHBhdHRlcm46IC8nW15cXFxcJ10qKD86XFxcXFtcXHNcXFNdW15cXFxcJ10qKSonLyxcbiAgICAgICAgZ3JlZWR5OiB0cnVlLFxuICAgICAgICBhbGlhczogJ3N0cmluZydcbiAgICAgIH0sXG4gICAgICAnZG91YmxlLXF1b3RlZC1zdHJpbmcnOiB7XG4gICAgICAgIHBhdHRlcm46IC9cIlteXFxcXFwiXSooPzpcXFxcW1xcc1xcU11bXlxcXFxcIl0qKSpcIi8sXG4gICAgICAgIGdyZWVkeTogdHJ1ZSxcbiAgICAgICAgYWxpYXM6ICdzdHJpbmcnLFxuICAgICAgICBpbnNpZGU6IHtcbiAgICAgICAgICB2YXJpYWJsZToge1xuICAgICAgICAgICAgcGF0dGVybjogL1xcJCg/OlthLXpdXFx3Kig/OlxcLig/OlxcZCt8XFwkP1thLXpdXFx3KikpKikvaVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pIC8vIFRoZSBkaWZmZXJlbnQgdHlwZXMgb2YgVFQyIHN0cmluZ3MgXCJyZXBsYWNlXCIgdGhlIEMtbGlrZSBzdGFuZGFyZCBzdHJpbmdcbiAgICBkZWxldGUgUHJpc20ubGFuZ3VhZ2VzLnR0Mi5zdHJpbmdcbiAgICBQcmlzbS5ob29rcy5hZGQoJ2JlZm9yZS10b2tlbml6ZScsIGZ1bmN0aW9uKGVudikge1xuICAgICAgdmFyIHR0MlBhdHRlcm4gPSAvXFxbJVtcXHNcXFNdKz8lXFxdL2dcbiAgICAgIFByaXNtLmxhbmd1YWdlc1snbWFya3VwLXRlbXBsYXRpbmcnXS5idWlsZFBsYWNlaG9sZGVycyhcbiAgICAgICAgZW52LFxuICAgICAgICAndHQyJyxcbiAgICAgICAgdHQyUGF0dGVyblxuICAgICAgKVxuICAgIH0pXG4gICAgUHJpc20uaG9va3MuYWRkKCdhZnRlci10b2tlbml6ZScsIGZ1bmN0aW9uKGVudikge1xuICAgICAgUHJpc20ubGFuZ3VhZ2VzWydtYXJrdXAtdGVtcGxhdGluZyddLnRva2VuaXplUGxhY2Vob2xkZXJzKGVudiwgJ3R0MicpXG4gICAgfSlcbiAgfSkoUHJpc20pXG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=