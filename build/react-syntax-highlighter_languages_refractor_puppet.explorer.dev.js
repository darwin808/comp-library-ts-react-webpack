"use strict";
(this["webpackChunk_zesty_io_explorer"] = this["webpackChunk_zesty_io_explorer"] || []).push([["react-syntax-highlighter_languages_refractor_puppet"],{

/***/ "./node_modules/refractor/lang/puppet.js":
/*!***********************************************!*\
  !*** ./node_modules/refractor/lang/puppet.js ***!
  \***********************************************/
/***/ ((module) => {



module.exports = puppet
puppet.displayName = 'puppet'
puppet.aliases = []
function puppet(Prism) {
  ;(function(Prism) {
    Prism.languages.puppet = {
      heredoc: [
        // Matches the content of a quoted heredoc string (subject to interpolation)
        {
          pattern: /(@\("([^"\r\n\/):]+)"(?:\/[nrts$uL]*)?\).*(?:\r?\n|\r))(?:.*(?:\r?\n|\r))*?[ \t]*\|?[ \t]*-?[ \t]*\2/,
          lookbehind: true,
          alias: 'string',
          inside: {
            // Matches the end tag
            punctuation: /(?=\S).*\S(?= *$)/ // See interpolation below
          }
        }, // Matches the content of an unquoted heredoc string (no interpolation)
        {
          pattern: /(@\(([^"\r\n\/):]+)(?:\/[nrts$uL]*)?\).*(?:\r?\n|\r))(?:.*(?:\r?\n|\r))*?[ \t]*\|?[ \t]*-?[ \t]*\2/,
          lookbehind: true,
          greedy: true,
          alias: 'string',
          inside: {
            // Matches the end tag
            punctuation: /(?=\S).*\S(?= *$)/
          }
        }, // Matches the start tag of heredoc strings
        {
          pattern: /@\("?(?:[^"\r\n\/):]+)"?(?:\/[nrts$uL]*)?\)/,
          alias: 'string',
          inside: {
            punctuation: {
              pattern: /(\().+?(?=\))/,
              lookbehind: true
            }
          }
        }
      ],
      'multiline-comment': {
        pattern: /(^|[^\\])\/\*[\s\S]*?\*\//,
        lookbehind: true,
        greedy: true,
        alias: 'comment'
      },
      regex: {
        // Must be prefixed with the keyword "node" or a non-word char
        pattern: /((?:\bnode\s+|[~=\(\[\{,]\s*|[=+]>\s*|^\s*))\/(?:[^\/\\]|\\[\s\S])+\/(?:[imx]+\b|\B)/,
        lookbehind: true,
        greedy: true,
        inside: {
          // Extended regexes must have the x flag. They can contain single-line comments.
          'extended-regex': {
            pattern: /^\/(?:[^\/\\]|\\[\s\S])+\/[im]*x[im]*$/,
            inside: {
              comment: /#.*/
            }
          }
        }
      },
      comment: {
        pattern: /(^|[^\\])#.*/,
        lookbehind: true,
        greedy: true
      },
      string: {
        // Allow for one nested level of double quotes inside interpolation
        pattern: /(["'])(?:\$\{(?:[^'"}]|(["'])(?:(?!\2)[^\\]|\\[\s\S])*\2)+\}|(?!\1)[^\\]|\\[\s\S])*\1/,
        greedy: true,
        inside: {
          'double-quoted': {
            pattern: /^"[\s\S]*"$/,
            inside: {
              // See interpolation below
            }
          }
        }
      },
      variable: {
        pattern: /\$(?:::)?\w+(?:::\w+)*/,
        inside: {
          punctuation: /::/
        }
      },
      'attr-name': /(?:\w+|\*)(?=\s*=>)/,
      function: [
        {
          pattern: /(\.)(?!\d)\w+/,
          lookbehind: true
        },
        /\b(?:contain|debug|err|fail|include|info|notice|realize|require|tag|warning)\b|\b(?!\d)\w+(?=\()/
      ],
      number: /\b(?:0x[a-f\d]+|\d+(?:\.\d+)?(?:e-?\d+)?)\b/i,
      boolean: /\b(?:true|false)\b/,
      // Includes words reserved for future use
      keyword: /\b(?:application|attr|case|class|consumes|default|define|else|elsif|function|if|import|inherits|node|private|produces|type|undef|unless)\b/,
      datatype: {
        pattern: /\b(?:Any|Array|Boolean|Callable|Catalogentry|Class|Collection|Data|Default|Enum|Float|Hash|Integer|NotUndef|Numeric|Optional|Pattern|Regexp|Resource|Runtime|Scalar|String|Struct|Tuple|Type|Undef|Variant)\b/,
        alias: 'symbol'
      },
      operator: /=[=~>]?|![=~]?|<(?:<\|?|[=~|-])?|>[>=]?|->?|~>|\|>?>?|[*\/%+?]|\b(?:and|in|or)\b/,
      punctuation: /[\[\]{}().,;]|:+/
    }
    var interpolation = [
      {
        // Allow for one nested level of braces inside interpolation
        pattern: /(^|[^\\])\$\{(?:[^'"{}]|\{[^}]*\}|(["'])(?:(?!\2)[^\\]|\\[\s\S])*\2)+\}/,
        lookbehind: true,
        inside: {
          'short-variable': {
            // Negative look-ahead prevent wrong highlighting of functions
            pattern: /(^\$\{)(?!\w+\()(?:::)?\w+(?:::\w+)*/,
            lookbehind: true,
            alias: 'variable',
            inside: {
              punctuation: /::/
            }
          },
          delimiter: {
            pattern: /^\$/,
            alias: 'variable'
          },
          rest: Prism.languages.puppet
        }
      },
      {
        pattern: /(^|[^\\])\$(?:::)?\w+(?:::\w+)*/,
        lookbehind: true,
        alias: 'variable',
        inside: {
          punctuation: /::/
        }
      }
    ]
    Prism.languages.puppet['heredoc'][0].inside.interpolation = interpolation
    Prism.languages.puppet['string'].inside[
      'double-quoted'
    ].inside.interpolation = interpolation
  })(Prism)
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyX2xhbmd1YWdlc19yZWZyYWN0b3JfcHVwcGV0LmV4cGxvcmVyLmRldi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EseUNBQXlDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLCtCQUErQixRQUFRLHVDQUF1QztBQUM5RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLDJCQUEyQixLQUFLO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLFNBQVMsSUFBSSxHQUFHLElBQUksc0NBQXNDO0FBQ3pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0giLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AemVzdHktaW8vZXhwbG9yZXIvLi9ub2RlX21vZHVsZXMvcmVmcmFjdG9yL2xhbmcvcHVwcGV0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IHB1cHBldFxucHVwcGV0LmRpc3BsYXlOYW1lID0gJ3B1cHBldCdcbnB1cHBldC5hbGlhc2VzID0gW11cbmZ1bmN0aW9uIHB1cHBldChQcmlzbSkge1xuICA7KGZ1bmN0aW9uKFByaXNtKSB7XG4gICAgUHJpc20ubGFuZ3VhZ2VzLnB1cHBldCA9IHtcbiAgICAgIGhlcmVkb2M6IFtcbiAgICAgICAgLy8gTWF0Y2hlcyB0aGUgY29udGVudCBvZiBhIHF1b3RlZCBoZXJlZG9jIHN0cmluZyAoc3ViamVjdCB0byBpbnRlcnBvbGF0aW9uKVxuICAgICAgICB7XG4gICAgICAgICAgcGF0dGVybjogLyhAXFwoXCIoW15cIlxcclxcblxcLyk6XSspXCIoPzpcXC9bbnJ0cyR1TF0qKT9cXCkuKig/Olxccj9cXG58XFxyKSkoPzouKig/Olxccj9cXG58XFxyKSkqP1sgXFx0XSpcXHw/WyBcXHRdKi0/WyBcXHRdKlxcMi8sXG4gICAgICAgICAgbG9va2JlaGluZDogdHJ1ZSxcbiAgICAgICAgICBhbGlhczogJ3N0cmluZycsXG4gICAgICAgICAgaW5zaWRlOiB7XG4gICAgICAgICAgICAvLyBNYXRjaGVzIHRoZSBlbmQgdGFnXG4gICAgICAgICAgICBwdW5jdHVhdGlvbjogLyg/PVxcUykuKlxcUyg/PSAqJCkvIC8vIFNlZSBpbnRlcnBvbGF0aW9uIGJlbG93XG4gICAgICAgICAgfVxuICAgICAgICB9LCAvLyBNYXRjaGVzIHRoZSBjb250ZW50IG9mIGFuIHVucXVvdGVkIGhlcmVkb2Mgc3RyaW5nIChubyBpbnRlcnBvbGF0aW9uKVxuICAgICAgICB7XG4gICAgICAgICAgcGF0dGVybjogLyhAXFwoKFteXCJcXHJcXG5cXC8pOl0rKSg/OlxcL1tucnRzJHVMXSopP1xcKS4qKD86XFxyP1xcbnxcXHIpKSg/Oi4qKD86XFxyP1xcbnxcXHIpKSo/WyBcXHRdKlxcfD9bIFxcdF0qLT9bIFxcdF0qXFwyLyxcbiAgICAgICAgICBsb29rYmVoaW5kOiB0cnVlLFxuICAgICAgICAgIGdyZWVkeTogdHJ1ZSxcbiAgICAgICAgICBhbGlhczogJ3N0cmluZycsXG4gICAgICAgICAgaW5zaWRlOiB7XG4gICAgICAgICAgICAvLyBNYXRjaGVzIHRoZSBlbmQgdGFnXG4gICAgICAgICAgICBwdW5jdHVhdGlvbjogLyg/PVxcUykuKlxcUyg/PSAqJCkvXG4gICAgICAgICAgfVxuICAgICAgICB9LCAvLyBNYXRjaGVzIHRoZSBzdGFydCB0YWcgb2YgaGVyZWRvYyBzdHJpbmdzXG4gICAgICAgIHtcbiAgICAgICAgICBwYXR0ZXJuOiAvQFxcKFwiPyg/OlteXCJcXHJcXG5cXC8pOl0rKVwiPyg/OlxcL1tucnRzJHVMXSopP1xcKS8sXG4gICAgICAgICAgYWxpYXM6ICdzdHJpbmcnLFxuICAgICAgICAgIGluc2lkZToge1xuICAgICAgICAgICAgcHVuY3R1YXRpb246IHtcbiAgICAgICAgICAgICAgcGF0dGVybjogLyhcXCgpLis/KD89XFwpKS8sXG4gICAgICAgICAgICAgIGxvb2tiZWhpbmQ6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICAnbXVsdGlsaW5lLWNvbW1lbnQnOiB7XG4gICAgICAgIHBhdHRlcm46IC8oXnxbXlxcXFxdKVxcL1xcKltcXHNcXFNdKj9cXCpcXC8vLFxuICAgICAgICBsb29rYmVoaW5kOiB0cnVlLFxuICAgICAgICBncmVlZHk6IHRydWUsXG4gICAgICAgIGFsaWFzOiAnY29tbWVudCdcbiAgICAgIH0sXG4gICAgICByZWdleDoge1xuICAgICAgICAvLyBNdXN0IGJlIHByZWZpeGVkIHdpdGggdGhlIGtleXdvcmQgXCJub2RlXCIgb3IgYSBub24td29yZCBjaGFyXG4gICAgICAgIHBhdHRlcm46IC8oKD86XFxibm9kZVxccyt8W349XFwoXFxbXFx7LF1cXHMqfFs9K10+XFxzKnxeXFxzKikpXFwvKD86W15cXC9cXFxcXXxcXFxcW1xcc1xcU10pK1xcLyg/OltpbXhdK1xcYnxcXEIpLyxcbiAgICAgICAgbG9va2JlaGluZDogdHJ1ZSxcbiAgICAgICAgZ3JlZWR5OiB0cnVlLFxuICAgICAgICBpbnNpZGU6IHtcbiAgICAgICAgICAvLyBFeHRlbmRlZCByZWdleGVzIG11c3QgaGF2ZSB0aGUgeCBmbGFnLiBUaGV5IGNhbiBjb250YWluIHNpbmdsZS1saW5lIGNvbW1lbnRzLlxuICAgICAgICAgICdleHRlbmRlZC1yZWdleCc6IHtcbiAgICAgICAgICAgIHBhdHRlcm46IC9eXFwvKD86W15cXC9cXFxcXXxcXFxcW1xcc1xcU10pK1xcL1tpbV0qeFtpbV0qJC8sXG4gICAgICAgICAgICBpbnNpZGU6IHtcbiAgICAgICAgICAgICAgY29tbWVudDogLyMuKi9cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjb21tZW50OiB7XG4gICAgICAgIHBhdHRlcm46IC8oXnxbXlxcXFxdKSMuKi8sXG4gICAgICAgIGxvb2tiZWhpbmQ6IHRydWUsXG4gICAgICAgIGdyZWVkeTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIHN0cmluZzoge1xuICAgICAgICAvLyBBbGxvdyBmb3Igb25lIG5lc3RlZCBsZXZlbCBvZiBkb3VibGUgcXVvdGVzIGluc2lkZSBpbnRlcnBvbGF0aW9uXG4gICAgICAgIHBhdHRlcm46IC8oW1wiJ10pKD86XFwkXFx7KD86W14nXCJ9XXwoW1wiJ10pKD86KD8hXFwyKVteXFxcXF18XFxcXFtcXHNcXFNdKSpcXDIpK1xcfXwoPyFcXDEpW15cXFxcXXxcXFxcW1xcc1xcU10pKlxcMS8sXG4gICAgICAgIGdyZWVkeTogdHJ1ZSxcbiAgICAgICAgaW5zaWRlOiB7XG4gICAgICAgICAgJ2RvdWJsZS1xdW90ZWQnOiB7XG4gICAgICAgICAgICBwYXR0ZXJuOiAvXlwiW1xcc1xcU10qXCIkLyxcbiAgICAgICAgICAgIGluc2lkZToge1xuICAgICAgICAgICAgICAvLyBTZWUgaW50ZXJwb2xhdGlvbiBiZWxvd1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHZhcmlhYmxlOiB7XG4gICAgICAgIHBhdHRlcm46IC9cXCQoPzo6Oik/XFx3Kyg/Ojo6XFx3KykqLyxcbiAgICAgICAgaW5zaWRlOiB7XG4gICAgICAgICAgcHVuY3R1YXRpb246IC86Oi9cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdhdHRyLW5hbWUnOiAvKD86XFx3K3xcXCopKD89XFxzKj0+KS8sXG4gICAgICBmdW5jdGlvbjogW1xuICAgICAgICB7XG4gICAgICAgICAgcGF0dGVybjogLyhcXC4pKD8hXFxkKVxcdysvLFxuICAgICAgICAgIGxvb2tiZWhpbmQ6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgL1xcYig/OmNvbnRhaW58ZGVidWd8ZXJyfGZhaWx8aW5jbHVkZXxpbmZvfG5vdGljZXxyZWFsaXplfHJlcXVpcmV8dGFnfHdhcm5pbmcpXFxifFxcYig/IVxcZClcXHcrKD89XFwoKS9cbiAgICAgIF0sXG4gICAgICBudW1iZXI6IC9cXGIoPzoweFthLWZcXGRdK3xcXGQrKD86XFwuXFxkKyk/KD86ZS0/XFxkKyk/KVxcYi9pLFxuICAgICAgYm9vbGVhbjogL1xcYig/OnRydWV8ZmFsc2UpXFxiLyxcbiAgICAgIC8vIEluY2x1ZGVzIHdvcmRzIHJlc2VydmVkIGZvciBmdXR1cmUgdXNlXG4gICAgICBrZXl3b3JkOiAvXFxiKD86YXBwbGljYXRpb258YXR0cnxjYXNlfGNsYXNzfGNvbnN1bWVzfGRlZmF1bHR8ZGVmaW5lfGVsc2V8ZWxzaWZ8ZnVuY3Rpb258aWZ8aW1wb3J0fGluaGVyaXRzfG5vZGV8cHJpdmF0ZXxwcm9kdWNlc3x0eXBlfHVuZGVmfHVubGVzcylcXGIvLFxuICAgICAgZGF0YXR5cGU6IHtcbiAgICAgICAgcGF0dGVybjogL1xcYig/OkFueXxBcnJheXxCb29sZWFufENhbGxhYmxlfENhdGFsb2dlbnRyeXxDbGFzc3xDb2xsZWN0aW9ufERhdGF8RGVmYXVsdHxFbnVtfEZsb2F0fEhhc2h8SW50ZWdlcnxOb3RVbmRlZnxOdW1lcmljfE9wdGlvbmFsfFBhdHRlcm58UmVnZXhwfFJlc291cmNlfFJ1bnRpbWV8U2NhbGFyfFN0cmluZ3xTdHJ1Y3R8VHVwbGV8VHlwZXxVbmRlZnxWYXJpYW50KVxcYi8sXG4gICAgICAgIGFsaWFzOiAnc3ltYm9sJ1xuICAgICAgfSxcbiAgICAgIG9wZXJhdG9yOiAvPVs9fj5dP3whWz1+XT98PCg/OjxcXHw/fFs9fnwtXSk/fD5bPj1dP3wtPj98fj58XFx8Pj8+P3xbKlxcLyUrP118XFxiKD86YW5kfGlufG9yKVxcYi8sXG4gICAgICBwdW5jdHVhdGlvbjogL1tcXFtcXF17fSgpLiw7XXw6Ky9cbiAgICB9XG4gICAgdmFyIGludGVycG9sYXRpb24gPSBbXG4gICAgICB7XG4gICAgICAgIC8vIEFsbG93IGZvciBvbmUgbmVzdGVkIGxldmVsIG9mIGJyYWNlcyBpbnNpZGUgaW50ZXJwb2xhdGlvblxuICAgICAgICBwYXR0ZXJuOiAvKF58W15cXFxcXSlcXCRcXHsoPzpbXidcInt9XXxcXHtbXn1dKlxcfXwoW1wiJ10pKD86KD8hXFwyKVteXFxcXF18XFxcXFtcXHNcXFNdKSpcXDIpK1xcfS8sXG4gICAgICAgIGxvb2tiZWhpbmQ6IHRydWUsXG4gICAgICAgIGluc2lkZToge1xuICAgICAgICAgICdzaG9ydC12YXJpYWJsZSc6IHtcbiAgICAgICAgICAgIC8vIE5lZ2F0aXZlIGxvb2stYWhlYWQgcHJldmVudCB3cm9uZyBoaWdobGlnaHRpbmcgb2YgZnVuY3Rpb25zXG4gICAgICAgICAgICBwYXR0ZXJuOiAvKF5cXCRcXHspKD8hXFx3K1xcKCkoPzo6Oik/XFx3Kyg/Ojo6XFx3KykqLyxcbiAgICAgICAgICAgIGxvb2tiZWhpbmQ6IHRydWUsXG4gICAgICAgICAgICBhbGlhczogJ3ZhcmlhYmxlJyxcbiAgICAgICAgICAgIGluc2lkZToge1xuICAgICAgICAgICAgICBwdW5jdHVhdGlvbjogLzo6L1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGVsaW1pdGVyOiB7XG4gICAgICAgICAgICBwYXR0ZXJuOiAvXlxcJC8sXG4gICAgICAgICAgICBhbGlhczogJ3ZhcmlhYmxlJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVzdDogUHJpc20ubGFuZ3VhZ2VzLnB1cHBldFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXR0ZXJuOiAvKF58W15cXFxcXSlcXCQoPzo6Oik/XFx3Kyg/Ojo6XFx3KykqLyxcbiAgICAgICAgbG9va2JlaGluZDogdHJ1ZSxcbiAgICAgICAgYWxpYXM6ICd2YXJpYWJsZScsXG4gICAgICAgIGluc2lkZToge1xuICAgICAgICAgIHB1bmN0dWF0aW9uOiAvOjovXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdXG4gICAgUHJpc20ubGFuZ3VhZ2VzLnB1cHBldFsnaGVyZWRvYyddWzBdLmluc2lkZS5pbnRlcnBvbGF0aW9uID0gaW50ZXJwb2xhdGlvblxuICAgIFByaXNtLmxhbmd1YWdlcy5wdXBwZXRbJ3N0cmluZyddLmluc2lkZVtcbiAgICAgICdkb3VibGUtcXVvdGVkJ1xuICAgIF0uaW5zaWRlLmludGVycG9sYXRpb24gPSBpbnRlcnBvbGF0aW9uXG4gIH0pKFByaXNtKVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9