"use strict";
(this["webpackChunk_zesty_io_explorer"] = this["webpackChunk_zesty_io_explorer"] || []).push([["react-syntax-highlighter_languages_refractor_php"],{

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

/***/ "./node_modules/refractor/lang/php.js":
/*!********************************************!*\
  !*** ./node_modules/refractor/lang/php.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var refractorMarkupTemplating = __webpack_require__(/*! ./markup-templating.js */ "./node_modules/refractor/lang/markup-templating.js")
module.exports = php
php.displayName = 'php'
php.aliases = []
function php(Prism) {
  Prism.register(refractorMarkupTemplating)
  /**
   * Original by Aaron Harun: http://aahacreative.com/2012/07/31/php-syntax-highlighting-prism/
   * Modified by Miles Johnson: http://milesj.me
   *
   * Supports the following:
   *      - Extends clike syntax
   *      - Support for PHP 5.3+ (namespaces, traits, generators, etc)
   *      - Smarter constant and function matching
   *
   * Adds the following new token classes:
   *      constant, delimiter, variable, function, package
   */
  ;(function(Prism) {
    Prism.languages.php = Prism.languages.extend('clike', {
      keyword: /\b(?:__halt_compiler|abstract|and|array|as|break|callable|case|catch|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|final|finally|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|namespace|new|or|parent|print|private|protected|public|require|require_once|return|static|switch|throw|trait|try|unset|use|var|while|xor|yield)\b/i,
      boolean: {
        pattern: /\b(?:false|true)\b/i,
        alias: 'constant'
      },
      constant: [/\b[A-Z_][A-Z0-9_]*\b/, /\b(?:null)\b/i],
      comment: {
        pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/,
        lookbehind: true
      }
    })
    Prism.languages.insertBefore('php', 'string', {
      'shell-comment': {
        pattern: /(^|[^\\])#.*/,
        lookbehind: true,
        alias: 'comment'
      }
    })
    Prism.languages.insertBefore('php', 'comment', {
      delimiter: {
        pattern: /\?>$|^<\?(?:php(?=\s)|=)?/i,
        alias: 'important'
      }
    })
    Prism.languages.insertBefore('php', 'keyword', {
      variable: /\$+(?:\w+\b|(?={))/i,
      package: {
        pattern: /(\\|namespace\s+|use\s+)[\w\\]+/,
        lookbehind: true,
        inside: {
          punctuation: /\\/
        }
      }
    }) // Must be defined after the function pattern
    Prism.languages.insertBefore('php', 'operator', {
      property: {
        pattern: /(->)[\w]+/,
        lookbehind: true
      }
    })
    var string_interpolation = {
      pattern: /{\$(?:{(?:{[^{}]+}|[^{}]+)}|[^{}])+}|(^|[^\\{])\$+(?:\w+(?:\[.+?]|->\w+)*)/,
      lookbehind: true,
      inside: {
        rest: Prism.languages.php
      }
    }
    Prism.languages.insertBefore('php', 'string', {
      'nowdoc-string': {
        pattern: /<<<'([^']+)'(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?\1;/,
        greedy: true,
        alias: 'string',
        inside: {
          delimiter: {
            pattern: /^<<<'[^']+'|[a-z_]\w*;$/i,
            alias: 'symbol',
            inside: {
              punctuation: /^<<<'?|[';]$/
            }
          }
        }
      },
      'heredoc-string': {
        pattern: /<<<(?:"([^"]+)"(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?\1;|([a-z_]\w*)(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?\2;)/i,
        greedy: true,
        alias: 'string',
        inside: {
          delimiter: {
            pattern: /^<<<(?:"[^"]+"|[a-z_]\w*)|[a-z_]\w*;$/i,
            alias: 'symbol',
            inside: {
              punctuation: /^<<<"?|[";]$/
            }
          },
          interpolation: string_interpolation // See below
        }
      },
      'single-quoted-string': {
        pattern: /'(?:\\[\s\S]|[^\\'])*'/,
        greedy: true,
        alias: 'string'
      },
      'double-quoted-string': {
        pattern: /"(?:\\[\s\S]|[^\\"])*"/,
        greedy: true,
        alias: 'string',
        inside: {
          interpolation: string_interpolation // See below
        }
      }
    }) // The different types of PHP strings "replace" the C-like standard string
    delete Prism.languages.php['string']
    Prism.hooks.add('before-tokenize', function(env) {
      if (!/<\?/.test(env.code)) {
        return
      }
      var phpPattern = /<\?(?:[^"'/#]|\/(?![*/])|("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|(?:\/\/|#)(?:[^?\n\r]|\?(?!>))*|\/\*[\s\S]*?(?:\*\/|$))*?(?:\?>|$)/gi
      Prism.languages['markup-templating'].buildPlaceholders(
        env,
        'php',
        phpPattern
      )
    })
    Prism.hooks.add('after-tokenize', function(env) {
      Prism.languages['markup-templating'].tokenizePlaceholders(env, 'php')
    })
  })(Prism)
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyX2xhbmd1YWdlc19yZWZyYWN0b3JfcGhwLmV4cGxvcmVyLmRldi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkIsZUFBZSxlQUFlO0FBQzlCLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNFQUFzRTtBQUN0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixRQUFRO0FBQzNCLG1CQUFtQixRQUFRO0FBQzNCLG1CQUFtQixRQUFRO0FBQzNCLG1CQUFtQiw0QkFBNEI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixRQUFRO0FBQzNCLG1CQUFtQixRQUFRO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLG1CQUFtQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7Ozs7Ozs7Ozs7O0FDeEhZO0FBQ1osZ0NBQWdDLG1CQUFPLENBQUMsa0ZBQXdCO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxpQkFBaUIsTUFBTSxJQUFJLElBQUksR0FBRyxLQUFLLElBQUksS0FBSyxJQUFJLFNBQVM7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBaUU7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEM7QUFDNUM7QUFDQTtBQUNBLHNDQUFzQztBQUN0QztBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxvRUFBb0UsK0NBQStDO0FBQ25IO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMERBQTBEO0FBQzFEO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0giLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AemVzdHktaW8vZXhwbG9yZXIvLi9ub2RlX21vZHVsZXMvcmVmcmFjdG9yL2xhbmcvbWFya3VwLXRlbXBsYXRpbmcuanMiLCJ3ZWJwYWNrOi8vQHplc3R5LWlvL2V4cGxvcmVyLy4vbm9kZV9tb2R1bGVzL3JlZnJhY3Rvci9sYW5nL3BocC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSBtYXJrdXBUZW1wbGF0aW5nXG5tYXJrdXBUZW1wbGF0aW5nLmRpc3BsYXlOYW1lID0gJ21hcmt1cFRlbXBsYXRpbmcnXG5tYXJrdXBUZW1wbGF0aW5nLmFsaWFzZXMgPSBbXVxuZnVuY3Rpb24gbWFya3VwVGVtcGxhdGluZyhQcmlzbSkge1xuICA7KGZ1bmN0aW9uKFByaXNtKSB7XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgcGxhY2Vob2xkZXIgZm9yIHRoZSBnaXZlbiBsYW5ndWFnZSBpZCBhbmQgaW5kZXguXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbGFuZ3VhZ2VcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xudW1iZXJ9IGluZGV4XG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRQbGFjZWhvbGRlcihsYW5ndWFnZSwgaW5kZXgpIHtcbiAgICAgIHJldHVybiAnX19fJyArIGxhbmd1YWdlLnRvVXBwZXJDYXNlKCkgKyBpbmRleCArICdfX18nXG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKChQcmlzbS5sYW5ndWFnZXNbJ21hcmt1cC10ZW1wbGF0aW5nJ10gPSB7fSksIHtcbiAgICAgIGJ1aWxkUGxhY2Vob2xkZXJzOiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUb2tlbml6ZSBhbGwgaW5saW5lIHRlbXBsYXRpbmcgZXhwcmVzc2lvbnMgbWF0Y2hpbmcgYHBsYWNlaG9sZGVyUGF0dGVybmAuXG4gICAgICAgICAqXG4gICAgICAgICAqIElmIGByZXBsYWNlRmlsdGVyYCBpcyBwcm92aWRlZCwgb25seSBtYXRjaGVzIG9mIGBwbGFjZWhvbGRlclBhdHRlcm5gIGZvciB3aGljaCBgcmVwbGFjZUZpbHRlcmAgcmV0dXJuc1xuICAgICAgICAgKiBgdHJ1ZWAgd2lsbCBiZSByZXBsYWNlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGVudiBUaGUgZW52aXJvbm1lbnQgb2YgdGhlIGBiZWZvcmUtdG9rZW5pemVgIGhvb2suXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsYW5ndWFnZSBUaGUgbGFuZ3VhZ2UgaWQuXG4gICAgICAgICAqIEBwYXJhbSB7UmVnRXhwfSBwbGFjZWhvbGRlclBhdHRlcm4gVGhlIG1hdGNoZXMgb2YgdGhpcyBwYXR0ZXJuIHdpbGwgYmUgcmVwbGFjZWQgYnkgcGxhY2Vob2xkZXJzLlxuICAgICAgICAgKiBAcGFyYW0geyhtYXRjaDogc3RyaW5nKSA9PiBib29sZWFufSBbcmVwbGFjZUZpbHRlcl1cbiAgICAgICAgICovXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihlbnYsIGxhbmd1YWdlLCBwbGFjZWhvbGRlclBhdHRlcm4sIHJlcGxhY2VGaWx0ZXIpIHtcbiAgICAgICAgICBpZiAoZW52Lmxhbmd1YWdlICE9PSBsYW5ndWFnZSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB0b2tlblN0YWNrID0gKGVudi50b2tlblN0YWNrID0gW10pXG4gICAgICAgICAgZW52LmNvZGUgPSBlbnYuY29kZS5yZXBsYWNlKHBsYWNlaG9sZGVyUGF0dGVybiwgZnVuY3Rpb24obWF0Y2gpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcmVwbGFjZUZpbHRlciA9PT0gJ2Z1bmN0aW9uJyAmJiAhcmVwbGFjZUZpbHRlcihtYXRjaCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG1hdGNoXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgaSA9IHRva2VuU3RhY2subGVuZ3RoXG4gICAgICAgICAgICB2YXIgcGxhY2Vob2xkZXIgLy8gQ2hlY2sgZm9yIGV4aXN0aW5nIHN0cmluZ3NcbiAgICAgICAgICAgIHdoaWxlIChcbiAgICAgICAgICAgICAgZW52LmNvZGUuaW5kZXhPZigocGxhY2Vob2xkZXIgPSBnZXRQbGFjZWhvbGRlcihsYW5ndWFnZSwgaSkpKSAhPT1cbiAgICAgICAgICAgICAgLTFcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKytpIC8vIENyZWF0ZSBhIHNwYXJzZSBhcnJheVxuICAgICAgICAgICAgdG9rZW5TdGFja1tpXSA9IG1hdGNoXG4gICAgICAgICAgICByZXR1cm4gcGxhY2Vob2xkZXJcbiAgICAgICAgICB9KSAvLyBTd2l0Y2ggdGhlIGdyYW1tYXIgdG8gbWFya3VwXG4gICAgICAgICAgZW52LmdyYW1tYXIgPSBQcmlzbS5sYW5ndWFnZXMubWFya3VwXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB0b2tlbml6ZVBsYWNlaG9sZGVyczoge1xuICAgICAgICAvKipcbiAgICAgICAgICogUmVwbGFjZSBwbGFjZWhvbGRlcnMgd2l0aCBwcm9wZXIgdG9rZW5zIGFmdGVyIHRva2VuaXppbmcuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbnYgVGhlIGVudmlyb25tZW50IG9mIHRoZSBgYWZ0ZXItdG9rZW5pemVgIGhvb2suXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsYW5ndWFnZSBUaGUgbGFuZ3VhZ2UgaWQuXG4gICAgICAgICAqL1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oZW52LCBsYW5ndWFnZSkge1xuICAgICAgICAgIGlmIChlbnYubGFuZ3VhZ2UgIT09IGxhbmd1YWdlIHx8ICFlbnYudG9rZW5TdGFjaykge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfSAvLyBTd2l0Y2ggdGhlIGdyYW1tYXIgYmFja1xuICAgICAgICAgIGVudi5ncmFtbWFyID0gUHJpc20ubGFuZ3VhZ2VzW2xhbmd1YWdlXVxuICAgICAgICAgIHZhciBqID0gMFxuICAgICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZW52LnRva2VuU3RhY2spXG4gICAgICAgICAgZnVuY3Rpb24gd2Fsa1Rva2Vucyh0b2tlbnMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIC8vIGFsbCBwbGFjZWhvbGRlcnMgYXJlIHJlcGxhY2VkIGFscmVhZHlcbiAgICAgICAgICAgICAgaWYgKGogPj0ga2V5cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHZhciB0b2tlbiA9IHRva2Vuc1tpXVxuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgdHlwZW9mIHRva2VuID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgICAgICAgICh0b2tlbi5jb250ZW50ICYmIHR5cGVvZiB0b2tlbi5jb250ZW50ID09PSAnc3RyaW5nJylcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdmFyIGsgPSBrZXlzW2pdXG4gICAgICAgICAgICAgICAgdmFyIHQgPSBlbnYudG9rZW5TdGFja1trXVxuICAgICAgICAgICAgICAgIHZhciBzID0gdHlwZW9mIHRva2VuID09PSAnc3RyaW5nJyA/IHRva2VuIDogdG9rZW4uY29udGVudFxuICAgICAgICAgICAgICAgIHZhciBwbGFjZWhvbGRlciA9IGdldFBsYWNlaG9sZGVyKGxhbmd1YWdlLCBrKVxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHMuaW5kZXhPZihwbGFjZWhvbGRlcilcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgKytqXG4gICAgICAgICAgICAgICAgICB2YXIgYmVmb3JlID0gcy5zdWJzdHJpbmcoMCwgaW5kZXgpXG4gICAgICAgICAgICAgICAgICB2YXIgbWlkZGxlID0gbmV3IFByaXNtLlRva2VuKFxuICAgICAgICAgICAgICAgICAgICBsYW5ndWFnZSxcbiAgICAgICAgICAgICAgICAgICAgUHJpc20udG9rZW5pemUodCwgZW52LmdyYW1tYXIpLFxuICAgICAgICAgICAgICAgICAgICAnbGFuZ3VhZ2UtJyArIGxhbmd1YWdlLFxuICAgICAgICAgICAgICAgICAgICB0XG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICB2YXIgYWZ0ZXIgPSBzLnN1YnN0cmluZyhpbmRleCArIHBsYWNlaG9sZGVyLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgIHZhciByZXBsYWNlbWVudCA9IFtdXG4gICAgICAgICAgICAgICAgICBpZiAoYmVmb3JlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2VtZW50LnB1c2guYXBwbHkocmVwbGFjZW1lbnQsIHdhbGtUb2tlbnMoW2JlZm9yZV0pKVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgcmVwbGFjZW1lbnQucHVzaChtaWRkbGUpXG4gICAgICAgICAgICAgICAgICBpZiAoYWZ0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZW1lbnQucHVzaC5hcHBseShyZXBsYWNlbWVudCwgd2Fsa1Rva2VucyhbYWZ0ZXJdKSlcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdG9rZW4gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2Vucy5zcGxpY2UuYXBwbHkodG9rZW5zLCBbaSwgMV0uY29uY2F0KHJlcGxhY2VtZW50KSlcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2VuLmNvbnRlbnQgPSByZXBsYWNlbWVudFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICB0b2tlbi5jb250ZW50XG4gICAgICAgICAgICAgICAgLyogJiYgdHlwZW9mIHRva2VuLmNvbnRlbnQgIT09ICdzdHJpbmcnICovXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHdhbGtUb2tlbnModG9rZW4uY29udGVudClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRva2Vuc1xuICAgICAgICAgIH1cbiAgICAgICAgICB3YWxrVG9rZW5zKGVudi50b2tlbnMpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9KShQcmlzbSlcbn1cbiIsIid1c2Ugc3RyaWN0J1xudmFyIHJlZnJhY3Rvck1hcmt1cFRlbXBsYXRpbmcgPSByZXF1aXJlKCcuL21hcmt1cC10ZW1wbGF0aW5nLmpzJylcbm1vZHVsZS5leHBvcnRzID0gcGhwXG5waHAuZGlzcGxheU5hbWUgPSAncGhwJ1xucGhwLmFsaWFzZXMgPSBbXVxuZnVuY3Rpb24gcGhwKFByaXNtKSB7XG4gIFByaXNtLnJlZ2lzdGVyKHJlZnJhY3Rvck1hcmt1cFRlbXBsYXRpbmcpXG4gIC8qKlxuICAgKiBPcmlnaW5hbCBieSBBYXJvbiBIYXJ1bjogaHR0cDovL2FhaGFjcmVhdGl2ZS5jb20vMjAxMi8wNy8zMS9waHAtc3ludGF4LWhpZ2hsaWdodGluZy1wcmlzbS9cbiAgICogTW9kaWZpZWQgYnkgTWlsZXMgSm9obnNvbjogaHR0cDovL21pbGVzai5tZVxuICAgKlxuICAgKiBTdXBwb3J0cyB0aGUgZm9sbG93aW5nOlxuICAgKiAgICAgIC0gRXh0ZW5kcyBjbGlrZSBzeW50YXhcbiAgICogICAgICAtIFN1cHBvcnQgZm9yIFBIUCA1LjMrIChuYW1lc3BhY2VzLCB0cmFpdHMsIGdlbmVyYXRvcnMsIGV0YylcbiAgICogICAgICAtIFNtYXJ0ZXIgY29uc3RhbnQgYW5kIGZ1bmN0aW9uIG1hdGNoaW5nXG4gICAqXG4gICAqIEFkZHMgdGhlIGZvbGxvd2luZyBuZXcgdG9rZW4gY2xhc3NlczpcbiAgICogICAgICBjb25zdGFudCwgZGVsaW1pdGVyLCB2YXJpYWJsZSwgZnVuY3Rpb24sIHBhY2thZ2VcbiAgICovXG4gIDsoZnVuY3Rpb24oUHJpc20pIHtcbiAgICBQcmlzbS5sYW5ndWFnZXMucGhwID0gUHJpc20ubGFuZ3VhZ2VzLmV4dGVuZCgnY2xpa2UnLCB7XG4gICAgICBrZXl3b3JkOiAvXFxiKD86X19oYWx0X2NvbXBpbGVyfGFic3RyYWN0fGFuZHxhcnJheXxhc3xicmVha3xjYWxsYWJsZXxjYXNlfGNhdGNofGNsYXNzfGNsb25lfGNvbnN0fGNvbnRpbnVlfGRlY2xhcmV8ZGVmYXVsdHxkaWV8ZG98ZWNob3xlbHNlfGVsc2VpZnxlbXB0eXxlbmRkZWNsYXJlfGVuZGZvcnxlbmRmb3JlYWNofGVuZGlmfGVuZHN3aXRjaHxlbmR3aGlsZXxldmFsfGV4aXR8ZXh0ZW5kc3xmaW5hbHxmaW5hbGx5fGZvcnxmb3JlYWNofGZ1bmN0aW9ufGdsb2JhbHxnb3RvfGlmfGltcGxlbWVudHN8aW5jbHVkZXxpbmNsdWRlX29uY2V8aW5zdGFuY2VvZnxpbnN0ZWFkb2Z8aW50ZXJmYWNlfGlzc2V0fGxpc3R8bmFtZXNwYWNlfG5ld3xvcnxwYXJlbnR8cHJpbnR8cHJpdmF0ZXxwcm90ZWN0ZWR8cHVibGljfHJlcXVpcmV8cmVxdWlyZV9vbmNlfHJldHVybnxzdGF0aWN8c3dpdGNofHRocm93fHRyYWl0fHRyeXx1bnNldHx1c2V8dmFyfHdoaWxlfHhvcnx5aWVsZClcXGIvaSxcbiAgICAgIGJvb2xlYW46IHtcbiAgICAgICAgcGF0dGVybjogL1xcYig/OmZhbHNlfHRydWUpXFxiL2ksXG4gICAgICAgIGFsaWFzOiAnY29uc3RhbnQnXG4gICAgICB9LFxuICAgICAgY29uc3RhbnQ6IFsvXFxiW0EtWl9dW0EtWjAtOV9dKlxcYi8sIC9cXGIoPzpudWxsKVxcYi9pXSxcbiAgICAgIGNvbW1lbnQ6IHtcbiAgICAgICAgcGF0dGVybjogLyhefFteXFxcXF0pKD86XFwvXFwqW1xcc1xcU10qP1xcKlxcL3xcXC9cXC8uKikvLFxuICAgICAgICBsb29rYmVoaW5kOiB0cnVlXG4gICAgICB9XG4gICAgfSlcbiAgICBQcmlzbS5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKCdwaHAnLCAnc3RyaW5nJywge1xuICAgICAgJ3NoZWxsLWNvbW1lbnQnOiB7XG4gICAgICAgIHBhdHRlcm46IC8oXnxbXlxcXFxdKSMuKi8sXG4gICAgICAgIGxvb2tiZWhpbmQ6IHRydWUsXG4gICAgICAgIGFsaWFzOiAnY29tbWVudCdcbiAgICAgIH1cbiAgICB9KVxuICAgIFByaXNtLmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoJ3BocCcsICdjb21tZW50Jywge1xuICAgICAgZGVsaW1pdGVyOiB7XG4gICAgICAgIHBhdHRlcm46IC9cXD8+JHxePFxcPyg/OnBocCg/PVxccyl8PSk/L2ksXG4gICAgICAgIGFsaWFzOiAnaW1wb3J0YW50J1xuICAgICAgfVxuICAgIH0pXG4gICAgUHJpc20ubGFuZ3VhZ2VzLmluc2VydEJlZm9yZSgncGhwJywgJ2tleXdvcmQnLCB7XG4gICAgICB2YXJpYWJsZTogL1xcJCsoPzpcXHcrXFxifCg/PXspKS9pLFxuICAgICAgcGFja2FnZToge1xuICAgICAgICBwYXR0ZXJuOiAvKFxcXFx8bmFtZXNwYWNlXFxzK3x1c2VcXHMrKVtcXHdcXFxcXSsvLFxuICAgICAgICBsb29rYmVoaW5kOiB0cnVlLFxuICAgICAgICBpbnNpZGU6IHtcbiAgICAgICAgICBwdW5jdHVhdGlvbjogL1xcXFwvXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KSAvLyBNdXN0IGJlIGRlZmluZWQgYWZ0ZXIgdGhlIGZ1bmN0aW9uIHBhdHRlcm5cbiAgICBQcmlzbS5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKCdwaHAnLCAnb3BlcmF0b3InLCB7XG4gICAgICBwcm9wZXJ0eToge1xuICAgICAgICBwYXR0ZXJuOiAvKC0+KVtcXHddKy8sXG4gICAgICAgIGxvb2tiZWhpbmQ6IHRydWVcbiAgICAgIH1cbiAgICB9KVxuICAgIHZhciBzdHJpbmdfaW50ZXJwb2xhdGlvbiA9IHtcbiAgICAgIHBhdHRlcm46IC97XFwkKD86eyg/OntbXnt9XSt9fFtee31dKyl9fFtee31dKSt9fChefFteXFxcXHtdKVxcJCsoPzpcXHcrKD86XFxbLis/XXwtPlxcdyspKikvLFxuICAgICAgbG9va2JlaGluZDogdHJ1ZSxcbiAgICAgIGluc2lkZToge1xuICAgICAgICByZXN0OiBQcmlzbS5sYW5ndWFnZXMucGhwXG4gICAgICB9XG4gICAgfVxuICAgIFByaXNtLmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoJ3BocCcsICdzdHJpbmcnLCB7XG4gICAgICAnbm93ZG9jLXN0cmluZyc6IHtcbiAgICAgICAgcGF0dGVybjogLzw8PCcoW14nXSspJyg/Olxcclxcbj98XFxuKSg/Oi4qKD86XFxyXFxuP3xcXG4pKSo/XFwxOy8sXG4gICAgICAgIGdyZWVkeTogdHJ1ZSxcbiAgICAgICAgYWxpYXM6ICdzdHJpbmcnLFxuICAgICAgICBpbnNpZGU6IHtcbiAgICAgICAgICBkZWxpbWl0ZXI6IHtcbiAgICAgICAgICAgIHBhdHRlcm46IC9ePDw8J1teJ10rJ3xbYS16X11cXHcqOyQvaSxcbiAgICAgICAgICAgIGFsaWFzOiAnc3ltYm9sJyxcbiAgICAgICAgICAgIGluc2lkZToge1xuICAgICAgICAgICAgICBwdW5jdHVhdGlvbjogL148PDwnP3xbJztdJC9cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnaGVyZWRvYy1zdHJpbmcnOiB7XG4gICAgICAgIHBhdHRlcm46IC88PDwoPzpcIihbXlwiXSspXCIoPzpcXHJcXG4/fFxcbikoPzouKig/Olxcclxcbj98XFxuKSkqP1xcMTt8KFthLXpfXVxcdyopKD86XFxyXFxuP3xcXG4pKD86LiooPzpcXHJcXG4/fFxcbikpKj9cXDI7KS9pLFxuICAgICAgICBncmVlZHk6IHRydWUsXG4gICAgICAgIGFsaWFzOiAnc3RyaW5nJyxcbiAgICAgICAgaW5zaWRlOiB7XG4gICAgICAgICAgZGVsaW1pdGVyOiB7XG4gICAgICAgICAgICBwYXR0ZXJuOiAvXjw8PCg/OlwiW15cIl0rXCJ8W2Etel9dXFx3Kil8W2Etel9dXFx3KjskL2ksXG4gICAgICAgICAgICBhbGlhczogJ3N5bWJvbCcsXG4gICAgICAgICAgICBpbnNpZGU6IHtcbiAgICAgICAgICAgICAgcHVuY3R1YXRpb246IC9ePDw8XCI/fFtcIjtdJC9cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGludGVycG9sYXRpb246IHN0cmluZ19pbnRlcnBvbGF0aW9uIC8vIFNlZSBiZWxvd1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ3NpbmdsZS1xdW90ZWQtc3RyaW5nJzoge1xuICAgICAgICBwYXR0ZXJuOiAvJyg/OlxcXFxbXFxzXFxTXXxbXlxcXFwnXSkqJy8sXG4gICAgICAgIGdyZWVkeTogdHJ1ZSxcbiAgICAgICAgYWxpYXM6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAgJ2RvdWJsZS1xdW90ZWQtc3RyaW5nJzoge1xuICAgICAgICBwYXR0ZXJuOiAvXCIoPzpcXFxcW1xcc1xcU118W15cXFxcXCJdKSpcIi8sXG4gICAgICAgIGdyZWVkeTogdHJ1ZSxcbiAgICAgICAgYWxpYXM6ICdzdHJpbmcnLFxuICAgICAgICBpbnNpZGU6IHtcbiAgICAgICAgICBpbnRlcnBvbGF0aW9uOiBzdHJpbmdfaW50ZXJwb2xhdGlvbiAvLyBTZWUgYmVsb3dcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pIC8vIFRoZSBkaWZmZXJlbnQgdHlwZXMgb2YgUEhQIHN0cmluZ3MgXCJyZXBsYWNlXCIgdGhlIEMtbGlrZSBzdGFuZGFyZCBzdHJpbmdcbiAgICBkZWxldGUgUHJpc20ubGFuZ3VhZ2VzLnBocFsnc3RyaW5nJ11cbiAgICBQcmlzbS5ob29rcy5hZGQoJ2JlZm9yZS10b2tlbml6ZScsIGZ1bmN0aW9uKGVudikge1xuICAgICAgaWYgKCEvPFxcPy8udGVzdChlbnYuY29kZSkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICB2YXIgcGhwUGF0dGVybiA9IC88XFw/KD86W15cIicvI118XFwvKD8hWyovXSl8KFwifCcpKD86XFxcXFtcXHNcXFNdfCg/IVxcMSlbXlxcXFxdKSpcXDF8KD86XFwvXFwvfCMpKD86W14/XFxuXFxyXXxcXD8oPyE+KSkqfFxcL1xcKltcXHNcXFNdKj8oPzpcXCpcXC98JCkpKj8oPzpcXD8+fCQpL2dpXG4gICAgICBQcmlzbS5sYW5ndWFnZXNbJ21hcmt1cC10ZW1wbGF0aW5nJ10uYnVpbGRQbGFjZWhvbGRlcnMoXG4gICAgICAgIGVudixcbiAgICAgICAgJ3BocCcsXG4gICAgICAgIHBocFBhdHRlcm5cbiAgICAgIClcbiAgICB9KVxuICAgIFByaXNtLmhvb2tzLmFkZCgnYWZ0ZXItdG9rZW5pemUnLCBmdW5jdGlvbihlbnYpIHtcbiAgICAgIFByaXNtLmxhbmd1YWdlc1snbWFya3VwLXRlbXBsYXRpbmcnXS50b2tlbml6ZVBsYWNlaG9sZGVycyhlbnYsICdwaHAnKVxuICAgIH0pXG4gIH0pKFByaXNtKVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9