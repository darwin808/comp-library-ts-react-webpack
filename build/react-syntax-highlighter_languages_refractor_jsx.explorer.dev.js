"use strict";
(this["webpackChunk_zesty_io_explorer"] = this["webpackChunk_zesty_io_explorer"] || []).push([["react-syntax-highlighter_languages_refractor_jsx"],{

/***/ "./node_modules/refractor/lang/jsx.js":
/*!********************************************!*\
  !*** ./node_modules/refractor/lang/jsx.js ***!
  \********************************************/
/***/ ((module) => {



module.exports = jsx
jsx.displayName = 'jsx'
jsx.aliases = []
function jsx(Prism) {
  ;(function(Prism) {
    var javascript = Prism.util.clone(Prism.languages.javascript)
    Prism.languages.jsx = Prism.languages.extend('markup', javascript)
    Prism.languages.jsx.tag.pattern = /<\/?(?:[\w.:-]+\s*(?:\s+(?:[\w.:-]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s{'">=]+|\{(?:\{(?:\{[^}]*\}|[^{}])*\}|[^{}])+\}))?|\{\.{3}[a-z_$][\w$]*(?:\.[a-z_$][\w$]*)*\}))*\s*\/?)?>/i
    Prism.languages.jsx.tag.inside['tag'].pattern = /^<\/?[^\s>\/]*/i
    Prism.languages.jsx.tag.inside[
      'attr-value'
    ].pattern = /=(?!\{)(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">]+)/i
    Prism.languages.jsx.tag.inside['tag'].inside[
      'class-name'
    ] = /^[A-Z]\w*(?:\.[A-Z]\w*)*$/
    Prism.languages.insertBefore(
      'inside',
      'attr-name',
      {
        spread: {
          pattern: /\{\.{3}[a-z_$][\w$]*(?:\.[a-z_$][\w$]*)*\}/,
          inside: {
            punctuation: /\.{3}|[{}.]/,
            'attr-value': /\w+/
          }
        }
      },
      Prism.languages.jsx.tag
    )
    Prism.languages.insertBefore(
      'inside',
      'attr-value',
      {
        script: {
          // Allow for two levels of nesting
          pattern: /=(\{(?:\{(?:\{[^}]*\}|[^}])*\}|[^}])+\})/i,
          inside: {
            'script-punctuation': {
              pattern: /^=(?={)/,
              alias: 'punctuation'
            },
            rest: Prism.languages.jsx
          },
          alias: 'language-javascript'
        }
      },
      Prism.languages.jsx.tag
    ) // The following will handle plain text inside tags
    var stringifyToken = function(token) {
      if (!token) {
        return ''
      }
      if (typeof token === 'string') {
        return token
      }
      if (typeof token.content === 'string') {
        return token.content
      }
      return token.content.map(stringifyToken).join('')
    }
    var walkTokens = function(tokens) {
      var openedTags = []
      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i]
        var notTagNorBrace = false
        if (typeof token !== 'string') {
          if (
            token.type === 'tag' &&
            token.content[0] &&
            token.content[0].type === 'tag'
          ) {
            // We found a tag, now find its kind
            if (token.content[0].content[0].content === '</') {
              // Closing tag
              if (
                openedTags.length > 0 &&
                openedTags[openedTags.length - 1].tagName ===
                  stringifyToken(token.content[0].content[1])
              ) {
                // Pop matching opening tag
                openedTags.pop()
              }
            } else {
              if (token.content[token.content.length - 1].content === '/>') {
                // Autoclosed tag, ignore
              } else {
                // Opening tag
                openedTags.push({
                  tagName: stringifyToken(token.content[0].content[1]),
                  openedBraces: 0
                })
              }
            }
          } else if (
            openedTags.length > 0 &&
            token.type === 'punctuation' &&
            token.content === '{'
          ) {
            // Here we might have entered a JSX context inside a tag
            openedTags[openedTags.length - 1].openedBraces++
          } else if (
            openedTags.length > 0 &&
            openedTags[openedTags.length - 1].openedBraces > 0 &&
            token.type === 'punctuation' &&
            token.content === '}'
          ) {
            // Here we might have left a JSX context inside a tag
            openedTags[openedTags.length - 1].openedBraces--
          } else {
            notTagNorBrace = true
          }
        }
        if (notTagNorBrace || typeof token === 'string') {
          if (
            openedTags.length > 0 &&
            openedTags[openedTags.length - 1].openedBraces === 0
          ) {
            // Here we are inside a tag, and not inside a JSX context.
            // That's plain text: drop any tokens matched.
            var plainText = stringifyToken(token) // And merge text with adjacent text
            if (
              i < tokens.length - 1 &&
              (typeof tokens[i + 1] === 'string' ||
                tokens[i + 1].type === 'plain-text')
            ) {
              plainText += stringifyToken(tokens[i + 1])
              tokens.splice(i + 1, 1)
            }
            if (
              i > 0 &&
              (typeof tokens[i - 1] === 'string' ||
                tokens[i - 1].type === 'plain-text')
            ) {
              plainText = stringifyToken(tokens[i - 1]) + plainText
              tokens.splice(i - 1, 1)
              i--
            }
            tokens[i] = new Prism.Token(
              'plain-text',
              plainText,
              null,
              plainText
            )
          }
        }
        if (token.content && typeof token.content !== 'string') {
          walkTokens(token.content)
        }
      }
    }
    Prism.hooks.add('after-tokenize', function(env) {
      if (env.language !== 'jsx' && env.language !== 'tsx') {
        return
      }
      walkTokens(env.tokens)
    })
  })(Prism)
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyX2xhbmd1YWdlc19yZWZyYWN0b3JfanN4LmV4cGxvcmVyLmRldi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsdUhBQXVILFNBQVMsS0FBSyxLQUFLLEdBQUcsSUFBSSxLQUFLLEtBQUssS0FBSyxLQUFLLE1BQU0sR0FBRyxFQUFFLG1DQUFtQztBQUNuTjtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixHQUFHLEVBQUUsbUNBQW1DO0FBQzlEO0FBQ0EsNkJBQTZCLEVBQUUsSUFBSTtBQUNuQztBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixLQUFLLEtBQUssR0FBRyxJQUFJLElBQUksS0FBSyxJQUFJLEtBQUs7QUFDM0Q7QUFDQTtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBLGFBQWE7QUFDYjtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLG1CQUFtQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBLGdDQUFnQztBQUNoQztBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0giLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AemVzdHktaW8vZXhwbG9yZXIvLi9ub2RlX21vZHVsZXMvcmVmcmFjdG9yL2xhbmcvanN4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IGpzeFxuanN4LmRpc3BsYXlOYW1lID0gJ2pzeCdcbmpzeC5hbGlhc2VzID0gW11cbmZ1bmN0aW9uIGpzeChQcmlzbSkge1xuICA7KGZ1bmN0aW9uKFByaXNtKSB7XG4gICAgdmFyIGphdmFzY3JpcHQgPSBQcmlzbS51dGlsLmNsb25lKFByaXNtLmxhbmd1YWdlcy5qYXZhc2NyaXB0KVxuICAgIFByaXNtLmxhbmd1YWdlcy5qc3ggPSBQcmlzbS5sYW5ndWFnZXMuZXh0ZW5kKCdtYXJrdXAnLCBqYXZhc2NyaXB0KVxuICAgIFByaXNtLmxhbmd1YWdlcy5qc3gudGFnLnBhdHRlcm4gPSAvPFxcLz8oPzpbXFx3LjotXStcXHMqKD86XFxzKyg/OltcXHcuOi1dKyg/Oj0oPzooXCJ8JykoPzpcXFxcW1xcc1xcU118KD8hXFwxKVteXFxcXF0pKlxcMXxbXlxcc3snXCI+PV0rfFxceyg/Olxceyg/Olxce1tefV0qXFx9fFtee31dKSpcXH18W157fV0pK1xcfSkpP3xcXHtcXC57M31bYS16XyRdW1xcdyRdKig/OlxcLlthLXpfJF1bXFx3JF0qKSpcXH0pKSpcXHMqXFwvPyk/Pi9pXG4gICAgUHJpc20ubGFuZ3VhZ2VzLmpzeC50YWcuaW5zaWRlWyd0YWcnXS5wYXR0ZXJuID0gL148XFwvP1teXFxzPlxcL10qL2lcbiAgICBQcmlzbS5sYW5ndWFnZXMuanN4LnRhZy5pbnNpZGVbXG4gICAgICAnYXR0ci12YWx1ZSdcbiAgICBdLnBhdHRlcm4gPSAvPSg/IVxceykoPzooXCJ8JykoPzpcXFxcW1xcc1xcU118KD8hXFwxKVteXFxcXF0pKlxcMXxbXlxccydcIj5dKykvaVxuICAgIFByaXNtLmxhbmd1YWdlcy5qc3gudGFnLmluc2lkZVsndGFnJ10uaW5zaWRlW1xuICAgICAgJ2NsYXNzLW5hbWUnXG4gICAgXSA9IC9eW0EtWl1cXHcqKD86XFwuW0EtWl1cXHcqKSokL1xuICAgIFByaXNtLmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoXG4gICAgICAnaW5zaWRlJyxcbiAgICAgICdhdHRyLW5hbWUnLFxuICAgICAge1xuICAgICAgICBzcHJlYWQ6IHtcbiAgICAgICAgICBwYXR0ZXJuOiAvXFx7XFwuezN9W2Etel8kXVtcXHckXSooPzpcXC5bYS16XyRdW1xcdyRdKikqXFx9LyxcbiAgICAgICAgICBpbnNpZGU6IHtcbiAgICAgICAgICAgIHB1bmN0dWF0aW9uOiAvXFwuezN9fFt7fS5dLyxcbiAgICAgICAgICAgICdhdHRyLXZhbHVlJzogL1xcdysvXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgUHJpc20ubGFuZ3VhZ2VzLmpzeC50YWdcbiAgICApXG4gICAgUHJpc20ubGFuZ3VhZ2VzLmluc2VydEJlZm9yZShcbiAgICAgICdpbnNpZGUnLFxuICAgICAgJ2F0dHItdmFsdWUnLFxuICAgICAge1xuICAgICAgICBzY3JpcHQ6IHtcbiAgICAgICAgICAvLyBBbGxvdyBmb3IgdHdvIGxldmVscyBvZiBuZXN0aW5nXG4gICAgICAgICAgcGF0dGVybjogLz0oXFx7KD86XFx7KD86XFx7W159XSpcXH18W159XSkqXFx9fFtefV0pK1xcfSkvaSxcbiAgICAgICAgICBpbnNpZGU6IHtcbiAgICAgICAgICAgICdzY3JpcHQtcHVuY3R1YXRpb24nOiB7XG4gICAgICAgICAgICAgIHBhdHRlcm46IC9ePSg/PXspLyxcbiAgICAgICAgICAgICAgYWxpYXM6ICdwdW5jdHVhdGlvbidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXN0OiBQcmlzbS5sYW5ndWFnZXMuanN4XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhbGlhczogJ2xhbmd1YWdlLWphdmFzY3JpcHQnXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBQcmlzbS5sYW5ndWFnZXMuanN4LnRhZ1xuICAgICkgLy8gVGhlIGZvbGxvd2luZyB3aWxsIGhhbmRsZSBwbGFpbiB0ZXh0IGluc2lkZSB0YWdzXG4gICAgdmFyIHN0cmluZ2lmeVRva2VuID0gZnVuY3Rpb24odG9rZW4pIHtcbiAgICAgIGlmICghdG9rZW4pIHtcbiAgICAgICAgcmV0dXJuICcnXG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHRva2VuID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gdG9rZW5cbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgdG9rZW4uY29udGVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIHRva2VuLmNvbnRlbnRcbiAgICAgIH1cbiAgICAgIHJldHVybiB0b2tlbi5jb250ZW50Lm1hcChzdHJpbmdpZnlUb2tlbikuam9pbignJylcbiAgICB9XG4gICAgdmFyIHdhbGtUb2tlbnMgPSBmdW5jdGlvbih0b2tlbnMpIHtcbiAgICAgIHZhciBvcGVuZWRUYWdzID0gW11cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB0b2tlbiA9IHRva2Vuc1tpXVxuICAgICAgICB2YXIgbm90VGFnTm9yQnJhY2UgPSBmYWxzZVxuICAgICAgICBpZiAodHlwZW9mIHRva2VuICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHRva2VuLnR5cGUgPT09ICd0YWcnICYmXG4gICAgICAgICAgICB0b2tlbi5jb250ZW50WzBdICYmXG4gICAgICAgICAgICB0b2tlbi5jb250ZW50WzBdLnR5cGUgPT09ICd0YWcnXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyBXZSBmb3VuZCBhIHRhZywgbm93IGZpbmQgaXRzIGtpbmRcbiAgICAgICAgICAgIGlmICh0b2tlbi5jb250ZW50WzBdLmNvbnRlbnRbMF0uY29udGVudCA9PT0gJzwvJykge1xuICAgICAgICAgICAgICAvLyBDbG9zaW5nIHRhZ1xuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgb3BlbmVkVGFncy5sZW5ndGggPiAwICYmXG4gICAgICAgICAgICAgICAgb3BlbmVkVGFnc1tvcGVuZWRUYWdzLmxlbmd0aCAtIDFdLnRhZ05hbWUgPT09XG4gICAgICAgICAgICAgICAgICBzdHJpbmdpZnlUb2tlbih0b2tlbi5jb250ZW50WzBdLmNvbnRlbnRbMV0pXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIC8vIFBvcCBtYXRjaGluZyBvcGVuaW5nIHRhZ1xuICAgICAgICAgICAgICAgIG9wZW5lZFRhZ3MucG9wKClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKHRva2VuLmNvbnRlbnRbdG9rZW4uY29udGVudC5sZW5ndGggLSAxXS5jb250ZW50ID09PSAnLz4nKSB7XG4gICAgICAgICAgICAgICAgLy8gQXV0b2Nsb3NlZCB0YWcsIGlnbm9yZVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIE9wZW5pbmcgdGFnXG4gICAgICAgICAgICAgICAgb3BlbmVkVGFncy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgIHRhZ05hbWU6IHN0cmluZ2lmeVRva2VuKHRva2VuLmNvbnRlbnRbMF0uY29udGVudFsxXSksXG4gICAgICAgICAgICAgICAgICBvcGVuZWRCcmFjZXM6IDBcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIG9wZW5lZFRhZ3MubGVuZ3RoID4gMCAmJlxuICAgICAgICAgICAgdG9rZW4udHlwZSA9PT0gJ3B1bmN0dWF0aW9uJyAmJlxuICAgICAgICAgICAgdG9rZW4uY29udGVudCA9PT0gJ3snXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyBIZXJlIHdlIG1pZ2h0IGhhdmUgZW50ZXJlZCBhIEpTWCBjb250ZXh0IGluc2lkZSBhIHRhZ1xuICAgICAgICAgICAgb3BlbmVkVGFnc1tvcGVuZWRUYWdzLmxlbmd0aCAtIDFdLm9wZW5lZEJyYWNlcysrXG4gICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIG9wZW5lZFRhZ3MubGVuZ3RoID4gMCAmJlxuICAgICAgICAgICAgb3BlbmVkVGFnc1tvcGVuZWRUYWdzLmxlbmd0aCAtIDFdLm9wZW5lZEJyYWNlcyA+IDAgJiZcbiAgICAgICAgICAgIHRva2VuLnR5cGUgPT09ICdwdW5jdHVhdGlvbicgJiZcbiAgICAgICAgICAgIHRva2VuLmNvbnRlbnQgPT09ICd9J1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgLy8gSGVyZSB3ZSBtaWdodCBoYXZlIGxlZnQgYSBKU1ggY29udGV4dCBpbnNpZGUgYSB0YWdcbiAgICAgICAgICAgIG9wZW5lZFRhZ3Nbb3BlbmVkVGFncy5sZW5ndGggLSAxXS5vcGVuZWRCcmFjZXMtLVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub3RUYWdOb3JCcmFjZSA9IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vdFRhZ05vckJyYWNlIHx8IHR5cGVvZiB0b2tlbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBvcGVuZWRUYWdzLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICAgIG9wZW5lZFRhZ3Nbb3BlbmVkVGFncy5sZW5ndGggLSAxXS5vcGVuZWRCcmFjZXMgPT09IDBcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIEhlcmUgd2UgYXJlIGluc2lkZSBhIHRhZywgYW5kIG5vdCBpbnNpZGUgYSBKU1ggY29udGV4dC5cbiAgICAgICAgICAgIC8vIFRoYXQncyBwbGFpbiB0ZXh0OiBkcm9wIGFueSB0b2tlbnMgbWF0Y2hlZC5cbiAgICAgICAgICAgIHZhciBwbGFpblRleHQgPSBzdHJpbmdpZnlUb2tlbih0b2tlbikgLy8gQW5kIG1lcmdlIHRleHQgd2l0aCBhZGphY2VudCB0ZXh0XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIGkgPCB0b2tlbnMubGVuZ3RoIC0gMSAmJlxuICAgICAgICAgICAgICAodHlwZW9mIHRva2Vuc1tpICsgMV0gPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICAgICAgICAgdG9rZW5zW2kgKyAxXS50eXBlID09PSAncGxhaW4tdGV4dCcpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgcGxhaW5UZXh0ICs9IHN0cmluZ2lmeVRva2VuKHRva2Vuc1tpICsgMV0pXG4gICAgICAgICAgICAgIHRva2Vucy5zcGxpY2UoaSArIDEsIDEpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIGkgPiAwICYmXG4gICAgICAgICAgICAgICh0eXBlb2YgdG9rZW5zW2kgLSAxXSA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgICAgICAgICB0b2tlbnNbaSAtIDFdLnR5cGUgPT09ICdwbGFpbi10ZXh0JylcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBwbGFpblRleHQgPSBzdHJpbmdpZnlUb2tlbih0b2tlbnNbaSAtIDFdKSArIHBsYWluVGV4dFxuICAgICAgICAgICAgICB0b2tlbnMuc3BsaWNlKGkgLSAxLCAxKVxuICAgICAgICAgICAgICBpLS1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRva2Vuc1tpXSA9IG5ldyBQcmlzbS5Ub2tlbihcbiAgICAgICAgICAgICAgJ3BsYWluLXRleHQnLFxuICAgICAgICAgICAgICBwbGFpblRleHQsXG4gICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgIHBsYWluVGV4dFxuICAgICAgICAgICAgKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodG9rZW4uY29udGVudCAmJiB0eXBlb2YgdG9rZW4uY29udGVudCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB3YWxrVG9rZW5zKHRva2VuLmNvbnRlbnQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgUHJpc20uaG9va3MuYWRkKCdhZnRlci10b2tlbml6ZScsIGZ1bmN0aW9uKGVudikge1xuICAgICAgaWYgKGVudi5sYW5ndWFnZSAhPT0gJ2pzeCcgJiYgZW52Lmxhbmd1YWdlICE9PSAndHN4Jykge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHdhbGtUb2tlbnMoZW52LnRva2VucylcbiAgICB9KVxuICB9KShQcmlzbSlcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==