"use strict";
(this["webpackChunk_zesty_io_explorer"] = this["webpackChunk_zesty_io_explorer"] || []).push([["react-syntax-highlighter_languages_refractor_asciidoc"],{

/***/ "./node_modules/refractor/lang/asciidoc.js":
/*!*************************************************!*\
  !*** ./node_modules/refractor/lang/asciidoc.js ***!
  \*************************************************/
/***/ ((module) => {



module.exports = asciidoc
asciidoc.displayName = 'asciidoc'
asciidoc.aliases = ['adoc']
function asciidoc(Prism) {
  ;(function(Prism) {
    var attributes = {
      pattern: /(^[ \t]*)\[(?!\[)(?:(["'$`])(?:(?!\2)[^\\]|\\.)*\2|\[(?:[^\]\\]|\\.)*\]|[^\]\\]|\\.)*\]/m,
      lookbehind: true,
      inside: {
        quoted: {
          pattern: /([$`])(?:(?!\1)[^\\]|\\.)*\1/,
          inside: {
            punctuation: /^[$`]|[$`]$/
          }
        },
        interpreted: {
          pattern: /'(?:[^'\\]|\\.)*'/,
          inside: {
            punctuation: /^'|'$/ // See rest below
          }
        },
        string: /"(?:[^"\\]|\\.)*"/,
        variable: /\w+(?==)/,
        punctuation: /^\[|\]$|,/,
        operator: /=/,
        // The negative look-ahead prevents blank matches
        'attr-value': /(?!^\s+$).+/
      }
    }
    var asciidoc = (Prism.languages.asciidoc = {
      'comment-block': {
        pattern: /^(\/{4,})(?:\r?\n|\r)(?:[\s\S]*(?:\r?\n|\r))??\1/m,
        alias: 'comment'
      },
      table: {
        pattern: /^\|={3,}(?:(?:\r?\n|\r).*)*?(?:\r?\n|\r)\|={3,}$/m,
        inside: {
          specifiers: {
            pattern: /(?!\|)(?:(?:(?:\d+(?:\.\d+)?|\.\d+)[+*])?(?:[<^>](?:\.[<^>])?|\.[<^>])?[a-z]*)(?=\|)/,
            alias: 'attr-value'
          },
          punctuation: {
            pattern: /(^|[^\\])[|!]=*/,
            lookbehind: true
          } // See rest below
        }
      },
      'passthrough-block': {
        pattern: /^(\+{4,})(?:\r?\n|\r)(?:[\s\S]*(?:\r?\n|\r))??\1$/m,
        inside: {
          punctuation: /^\++|\++$/ // See rest below
        }
      },
      // Literal blocks and listing blocks
      'literal-block': {
        pattern: /^(-{4,}|\.{4,})(?:\r?\n|\r)(?:[\s\S]*(?:\r?\n|\r))??\1$/m,
        inside: {
          punctuation: /^(?:-+|\.+)|(?:-+|\.+)$/ // See rest below
        }
      },
      // Sidebar blocks, quote blocks, example blocks and open blocks
      'other-block': {
        pattern: /^(--|\*{4,}|_{4,}|={4,})(?:\r?\n|\r)(?:[\s\S]*(?:\r?\n|\r))??\1$/m,
        inside: {
          punctuation: /^(?:-+|\*+|_+|=+)|(?:-+|\*+|_+|=+)$/ // See rest below
        }
      },
      // list-punctuation and list-label must appear before indented-block
      'list-punctuation': {
        pattern: /(^[ \t]*)(?:-|\*{1,5}|\.{1,5}|(?:[a-z]|\d+)\.|[xvi]+\))(?= )/im,
        lookbehind: true,
        alias: 'punctuation'
      },
      'list-label': {
        pattern: /(^[ \t]*)[a-z\d].+(?::{2,4}|;;)(?=\s)/im,
        lookbehind: true,
        alias: 'symbol'
      },
      'indented-block': {
        pattern: /((\r?\n|\r)\2)([ \t]+)\S.*(?:(?:\r?\n|\r)\3.+)*(?=\2{2}|$)/,
        lookbehind: true
      },
      comment: /^\/\/.*/m,
      title: {
        pattern: /^.+(?:\r?\n|\r)(?:={3,}|-{3,}|~{3,}|\^{3,}|\+{3,})$|^={1,5} +.+|^\.(?![\s.]).*/m,
        alias: 'important',
        inside: {
          punctuation: /^(?:\.|=+)|(?:=+|-+|~+|\^+|\++)$/ // See rest below
        }
      },
      'attribute-entry': {
        pattern: /^:[^:\r\n]+:(?: .*?(?: \+(?:\r?\n|\r).*?)*)?$/m,
        alias: 'tag'
      },
      attributes: attributes,
      hr: {
        pattern: /^'{3,}$/m,
        alias: 'punctuation'
      },
      'page-break': {
        pattern: /^<{3,}$/m,
        alias: 'punctuation'
      },
      admonition: {
        pattern: /^(?:TIP|NOTE|IMPORTANT|WARNING|CAUTION):/m,
        alias: 'keyword'
      },
      callout: [
        {
          pattern: /(^[ \t]*)<?\d*>/m,
          lookbehind: true,
          alias: 'symbol'
        },
        {
          pattern: /<\d+>/,
          alias: 'symbol'
        }
      ],
      macro: {
        pattern: /\b[a-z\d][a-z\d-]*::?(?:(?:\S+)??\[(?:[^\]\\"]|(["'])(?:(?!\1)[^\\]|\\.)*\1|\\.)*\])/,
        inside: {
          function: /^[a-z\d-]+(?=:)/,
          punctuation: /^::?/,
          attributes: {
            pattern: /(?:\[(?:[^\]\\"]|(["'])(?:(?!\1)[^\\]|\\.)*\1|\\.)*\])/,
            inside: attributes.inside
          }
        }
      },
      inline: {
        /*
The initial look-behind prevents the highlighting of escaped quoted text.
Quoted text can be multi-line but cannot span an empty line.
All quoted text can have attributes before [foobar, 'foobar', baz="bar"].
First, we handle the constrained quotes.
Those must be bounded by non-word chars and cannot have spaces between the delimiter and the first char.
They are, in order: _emphasis_, ``double quotes'', `single quotes', `monospace`, 'emphasis', *strong*, +monospace+ and #unquoted#
Then we handle the unconstrained quotes.
Those do not have the restrictions of the constrained quotes.
They are, in order: __emphasis__, **strong**, ++monospace++, +++passthrough+++, ##unquoted##, $$passthrough$$, ~subscript~, ^superscript^, {attribute-reference}, [[anchor]], [[[bibliography anchor]]], <<xref>>, (((indexes))) and ((indexes))
*/
        pattern: /(^|[^\\])(?:(?:\B\[(?:[^\]\\"]|(["'])(?:(?!\2)[^\\]|\\.)*\2|\\.)*\])?(?:\b_(?!\s)(?: _|[^_\\\r\n]|\\.)+(?:(?:\r?\n|\r)(?: _|[^_\\\r\n]|\\.)+)*_\b|\B``(?!\s).+?(?:(?:\r?\n|\r).+?)*''\B|\B`(?!\s)(?: ['`]|.)+?(?:(?:\r?\n|\r)(?: ['`]|.)+?)*['`]\B|\B(['*+#])(?!\s)(?: \3|(?!\3)[^\\\r\n]|\\.)+(?:(?:\r?\n|\r)(?: \3|(?!\3)[^\\\r\n]|\\.)+)*\3\B)|(?:\[(?:[^\]\\"]|(["'])(?:(?!\4)[^\\]|\\.)*\4|\\.)*\])?(?:(__|\*\*|\+\+\+?|##|\$\$|[~^]).+?(?:(?:\r?\n|\r).+?)*\5|\{[^}\r\n]+\}|\[\[\[?.+?(?:(?:\r?\n|\r).+?)*\]?\]\]|<<.+?(?:(?:\r?\n|\r).+?)*>>|\(\(\(?.+?(?:(?:\r?\n|\r).+?)*\)?\)\)))/m,
        lookbehind: true,
        inside: {
          attributes: attributes,
          url: {
            pattern: /^(?:\[\[\[?.+?\]?\]\]|<<.+?>>)$/,
            inside: {
              punctuation: /^(?:\[\[\[?|<<)|(?:\]\]\]?|>>)$/
            }
          },
          'attribute-ref': {
            pattern: /^\{.+\}$/,
            inside: {
              variable: {
                pattern: /(^\{)[a-z\d,+_-]+/,
                lookbehind: true
              },
              operator: /^[=?!#%@$]|!(?=[:}])/,
              punctuation: /^\{|\}$|::?/
            }
          },
          italic: {
            pattern: /^(['_])[\s\S]+\1$/,
            inside: {
              punctuation: /^(?:''?|__?)|(?:''?|__?)$/
            }
          },
          bold: {
            pattern: /^\*[\s\S]+\*$/,
            inside: {
              punctuation: /^\*\*?|\*\*?$/
            }
          },
          punctuation: /^(?:``?|\+{1,3}|##?|\$\$|[~^]|\(\(\(?)|(?:''?|\+{1,3}|##?|\$\$|[~^`]|\)?\)\))$/
        }
      },
      replacement: {
        pattern: /\((?:C|TM|R)\)/,
        alias: 'builtin'
      },
      entity: /&#?[\da-z]{1,8};/i,
      'line-continuation': {
        pattern: /(^| )\+$/m,
        lookbehind: true,
        alias: 'punctuation'
      }
    }) // Allow some nesting. There is no recursion though, so cloning should not be needed.
    function copyFromAsciiDoc(keys) {
      keys = keys.split(' ')
      var o = {}
      for (var i = 0, l = keys.length; i < l; i++) {
        o[keys[i]] = asciidoc[keys[i]]
      }
      return o
    }
    attributes.inside['interpreted'].inside.rest = copyFromAsciiDoc(
      'macro inline replacement entity'
    )
    asciidoc['passthrough-block'].inside.rest = copyFromAsciiDoc('macro')
    asciidoc['literal-block'].inside.rest = copyFromAsciiDoc('callout')
    asciidoc['table'].inside.rest = copyFromAsciiDoc(
      'comment-block passthrough-block literal-block other-block list-punctuation indented-block comment title attribute-entry attributes hr page-break admonition list-label callout macro inline replacement entity line-continuation'
    )
    asciidoc['other-block'].inside.rest = copyFromAsciiDoc(
      'table list-punctuation indented-block comment attribute-entry attributes hr page-break admonition list-label macro inline replacement entity line-continuation'
    )
    asciidoc['title'].inside.rest = copyFromAsciiDoc(
      'macro inline replacement entity'
    ) // Plugin to make entity title show the real entity, idea by Roman Komarov
    Prism.hooks.add('wrap', function(env) {
      if (env.type === 'entity') {
        env.attributes['title'] = env.content.value.replace(/&amp;/, '&')
      }
    })
    Prism.languages.adoc = Prism.languages.asciidoc
  })(Prism)
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyX2xhbmd1YWdlc19yZWZyYWN0b3JfYXNjaWlkb2MuZXhwbG9yZXIuZGV2LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFZOztBQUVaO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLEdBQUc7QUFDMUI7QUFDQSxPQUFPO0FBQ1A7QUFDQSx1QkFBdUIsR0FBRyxvQ0FBb0MsR0FBRztBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQSxPQUFPO0FBQ1A7QUFDQSx1QkFBdUIsR0FBRztBQUMxQjtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLHNCQUFzQixHQUFHLElBQUksR0FBRztBQUNoQztBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLDBCQUEwQixHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7QUFDekM7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxtQ0FBbUMsSUFBSSxJQUFJLElBQUk7QUFDL0M7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLHlDQUF5QyxJQUFJLEdBQUc7QUFDaEQ7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLHVFQUF1RSxFQUFFO0FBQ3pFO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxzQ0FBc0MsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsTUFBTSxLQUFLO0FBQzlFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EscUJBQXFCLEdBQUc7QUFDeEI7QUFDQSxPQUFPO0FBQ1A7QUFDQSxxQkFBcUIsR0FBRztBQUN4QjtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0SUFBNEksb0JBQW9CO0FBQ2hLO0FBQ0Esd2RBQXdkLEdBQUcsUUFBUTtBQUNuZTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EseUJBQXlCLElBQUk7QUFDN0I7QUFDQTtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBLGVBQWU7QUFDZiwyQ0FBMkM7QUFDM0MsK0JBQStCLEdBQUc7QUFDbEM7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYLG1DQUFtQyxJQUFJLGtDQUFrQyxJQUFJO0FBQzdFO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCwwQkFBMEIsS0FBSztBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxPQUFPO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrRUFBa0U7QUFDbEU7QUFDQSxLQUFLO0FBQ0w7QUFDQSxHQUFHO0FBQ0giLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AemVzdHktaW8vZXhwbG9yZXIvLi9ub2RlX21vZHVsZXMvcmVmcmFjdG9yL2xhbmcvYXNjaWlkb2MuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gYXNjaWlkb2NcbmFzY2lpZG9jLmRpc3BsYXlOYW1lID0gJ2FzY2lpZG9jJ1xuYXNjaWlkb2MuYWxpYXNlcyA9IFsnYWRvYyddXG5mdW5jdGlvbiBhc2NpaWRvYyhQcmlzbSkge1xuICA7KGZ1bmN0aW9uKFByaXNtKSB7XG4gICAgdmFyIGF0dHJpYnV0ZXMgPSB7XG4gICAgICBwYXR0ZXJuOiAvKF5bIFxcdF0qKVxcWyg/IVxcWykoPzooW1wiJyRgXSkoPzooPyFcXDIpW15cXFxcXXxcXFxcLikqXFwyfFxcWyg/OlteXFxdXFxcXF18XFxcXC4pKlxcXXxbXlxcXVxcXFxdfFxcXFwuKSpcXF0vbSxcbiAgICAgIGxvb2tiZWhpbmQ6IHRydWUsXG4gICAgICBpbnNpZGU6IHtcbiAgICAgICAgcXVvdGVkOiB7XG4gICAgICAgICAgcGF0dGVybjogLyhbJGBdKSg/Oig/IVxcMSlbXlxcXFxdfFxcXFwuKSpcXDEvLFxuICAgICAgICAgIGluc2lkZToge1xuICAgICAgICAgICAgcHVuY3R1YXRpb246IC9eWyRgXXxbJGBdJC9cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGludGVycHJldGVkOiB7XG4gICAgICAgICAgcGF0dGVybjogLycoPzpbXidcXFxcXXxcXFxcLikqJy8sXG4gICAgICAgICAgaW5zaWRlOiB7XG4gICAgICAgICAgICBwdW5jdHVhdGlvbjogL14nfCckLyAvLyBTZWUgcmVzdCBiZWxvd1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgc3RyaW5nOiAvXCIoPzpbXlwiXFxcXF18XFxcXC4pKlwiLyxcbiAgICAgICAgdmFyaWFibGU6IC9cXHcrKD89PSkvLFxuICAgICAgICBwdW5jdHVhdGlvbjogL15cXFt8XFxdJHwsLyxcbiAgICAgICAgb3BlcmF0b3I6IC89LyxcbiAgICAgICAgLy8gVGhlIG5lZ2F0aXZlIGxvb2stYWhlYWQgcHJldmVudHMgYmxhbmsgbWF0Y2hlc1xuICAgICAgICAnYXR0ci12YWx1ZSc6IC8oPyFeXFxzKyQpLisvXG4gICAgICB9XG4gICAgfVxuICAgIHZhciBhc2NpaWRvYyA9IChQcmlzbS5sYW5ndWFnZXMuYXNjaWlkb2MgPSB7XG4gICAgICAnY29tbWVudC1ibG9jayc6IHtcbiAgICAgICAgcGF0dGVybjogL14oXFwvezQsfSkoPzpcXHI/XFxufFxccikoPzpbXFxzXFxTXSooPzpcXHI/XFxufFxccikpPz9cXDEvbSxcbiAgICAgICAgYWxpYXM6ICdjb21tZW50J1xuICAgICAgfSxcbiAgICAgIHRhYmxlOiB7XG4gICAgICAgIHBhdHRlcm46IC9eXFx8PXszLH0oPzooPzpcXHI/XFxufFxccikuKikqPyg/Olxccj9cXG58XFxyKVxcfD17Myx9JC9tLFxuICAgICAgICBpbnNpZGU6IHtcbiAgICAgICAgICBzcGVjaWZpZXJzOiB7XG4gICAgICAgICAgICBwYXR0ZXJuOiAvKD8hXFx8KSg/Oig/Oig/OlxcZCsoPzpcXC5cXGQrKT98XFwuXFxkKylbKypdKT8oPzpbPF4+XSg/OlxcLls8Xj5dKT98XFwuWzxePl0pP1thLXpdKikoPz1cXHwpLyxcbiAgICAgICAgICAgIGFsaWFzOiAnYXR0ci12YWx1ZSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHB1bmN0dWF0aW9uOiB7XG4gICAgICAgICAgICBwYXR0ZXJuOiAvKF58W15cXFxcXSlbfCFdPSovLFxuICAgICAgICAgICAgbG9va2JlaGluZDogdHJ1ZVxuICAgICAgICAgIH0gLy8gU2VlIHJlc3QgYmVsb3dcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdwYXNzdGhyb3VnaC1ibG9jayc6IHtcbiAgICAgICAgcGF0dGVybjogL14oXFwrezQsfSkoPzpcXHI/XFxufFxccikoPzpbXFxzXFxTXSooPzpcXHI/XFxufFxccikpPz9cXDEkL20sXG4gICAgICAgIGluc2lkZToge1xuICAgICAgICAgIHB1bmN0dWF0aW9uOiAvXlxcKyt8XFwrKyQvIC8vIFNlZSByZXN0IGJlbG93XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvLyBMaXRlcmFsIGJsb2NrcyBhbmQgbGlzdGluZyBibG9ja3NcbiAgICAgICdsaXRlcmFsLWJsb2NrJzoge1xuICAgICAgICBwYXR0ZXJuOiAvXigtezQsfXxcXC57NCx9KSg/Olxccj9cXG58XFxyKSg/OltcXHNcXFNdKig/Olxccj9cXG58XFxyKSk/P1xcMSQvbSxcbiAgICAgICAgaW5zaWRlOiB7XG4gICAgICAgICAgcHVuY3R1YXRpb246IC9eKD86LSt8XFwuKyl8KD86LSt8XFwuKykkLyAvLyBTZWUgcmVzdCBiZWxvd1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gU2lkZWJhciBibG9ja3MsIHF1b3RlIGJsb2NrcywgZXhhbXBsZSBibG9ja3MgYW5kIG9wZW4gYmxvY2tzXG4gICAgICAnb3RoZXItYmxvY2snOiB7XG4gICAgICAgIHBhdHRlcm46IC9eKC0tfFxcKns0LH18X3s0LH18PXs0LH0pKD86XFxyP1xcbnxcXHIpKD86W1xcc1xcU10qKD86XFxyP1xcbnxcXHIpKT8/XFwxJC9tLFxuICAgICAgICBpbnNpZGU6IHtcbiAgICAgICAgICBwdW5jdHVhdGlvbjogL14oPzotK3xcXCorfF8rfD0rKXwoPzotK3xcXCorfF8rfD0rKSQvIC8vIFNlZSByZXN0IGJlbG93XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvLyBsaXN0LXB1bmN0dWF0aW9uIGFuZCBsaXN0LWxhYmVsIG11c3QgYXBwZWFyIGJlZm9yZSBpbmRlbnRlZC1ibG9ja1xuICAgICAgJ2xpc3QtcHVuY3R1YXRpb24nOiB7XG4gICAgICAgIHBhdHRlcm46IC8oXlsgXFx0XSopKD86LXxcXCp7MSw1fXxcXC57MSw1fXwoPzpbYS16XXxcXGQrKVxcLnxbeHZpXStcXCkpKD89ICkvaW0sXG4gICAgICAgIGxvb2tiZWhpbmQ6IHRydWUsXG4gICAgICAgIGFsaWFzOiAncHVuY3R1YXRpb24nXG4gICAgICB9LFxuICAgICAgJ2xpc3QtbGFiZWwnOiB7XG4gICAgICAgIHBhdHRlcm46IC8oXlsgXFx0XSopW2EtelxcZF0uKyg/Ojp7Miw0fXw7OykoPz1cXHMpL2ltLFxuICAgICAgICBsb29rYmVoaW5kOiB0cnVlLFxuICAgICAgICBhbGlhczogJ3N5bWJvbCdcbiAgICAgIH0sXG4gICAgICAnaW5kZW50ZWQtYmxvY2snOiB7XG4gICAgICAgIHBhdHRlcm46IC8oKFxccj9cXG58XFxyKVxcMikoWyBcXHRdKylcXFMuKig/Oig/Olxccj9cXG58XFxyKVxcMy4rKSooPz1cXDJ7Mn18JCkvLFxuICAgICAgICBsb29rYmVoaW5kOiB0cnVlXG4gICAgICB9LFxuICAgICAgY29tbWVudDogL15cXC9cXC8uKi9tLFxuICAgICAgdGl0bGU6IHtcbiAgICAgICAgcGF0dGVybjogL14uKyg/Olxccj9cXG58XFxyKSg/Oj17Myx9fC17Myx9fH57Myx9fFxcXnszLH18XFwrezMsfSkkfF49ezEsNX0gKy4rfF5cXC4oPyFbXFxzLl0pLiovbSxcbiAgICAgICAgYWxpYXM6ICdpbXBvcnRhbnQnLFxuICAgICAgICBpbnNpZGU6IHtcbiAgICAgICAgICBwdW5jdHVhdGlvbjogL14oPzpcXC58PSspfCg/Oj0rfC0rfH4rfFxcXit8XFwrKykkLyAvLyBTZWUgcmVzdCBiZWxvd1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2F0dHJpYnV0ZS1lbnRyeSc6IHtcbiAgICAgICAgcGF0dGVybjogL146W146XFxyXFxuXSs6KD86IC4qPyg/OiBcXCsoPzpcXHI/XFxufFxccikuKj8pKik/JC9tLFxuICAgICAgICBhbGlhczogJ3RhZydcbiAgICAgIH0sXG4gICAgICBhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLFxuICAgICAgaHI6IHtcbiAgICAgICAgcGF0dGVybjogL14nezMsfSQvbSxcbiAgICAgICAgYWxpYXM6ICdwdW5jdHVhdGlvbidcbiAgICAgIH0sXG4gICAgICAncGFnZS1icmVhayc6IHtcbiAgICAgICAgcGF0dGVybjogL148ezMsfSQvbSxcbiAgICAgICAgYWxpYXM6ICdwdW5jdHVhdGlvbidcbiAgICAgIH0sXG4gICAgICBhZG1vbml0aW9uOiB7XG4gICAgICAgIHBhdHRlcm46IC9eKD86VElQfE5PVEV8SU1QT1JUQU5UfFdBUk5JTkd8Q0FVVElPTik6L20sXG4gICAgICAgIGFsaWFzOiAna2V5d29yZCdcbiAgICAgIH0sXG4gICAgICBjYWxsb3V0OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBwYXR0ZXJuOiAvKF5bIFxcdF0qKTw/XFxkKj4vbSxcbiAgICAgICAgICBsb29rYmVoaW5kOiB0cnVlLFxuICAgICAgICAgIGFsaWFzOiAnc3ltYm9sJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcGF0dGVybjogLzxcXGQrPi8sXG4gICAgICAgICAgYWxpYXM6ICdzeW1ib2wnXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBtYWNybzoge1xuICAgICAgICBwYXR0ZXJuOiAvXFxiW2EtelxcZF1bYS16XFxkLV0qOjo/KD86KD86XFxTKyk/P1xcWyg/OlteXFxdXFxcXFwiXXwoW1wiJ10pKD86KD8hXFwxKVteXFxcXF18XFxcXC4pKlxcMXxcXFxcLikqXFxdKS8sXG4gICAgICAgIGluc2lkZToge1xuICAgICAgICAgIGZ1bmN0aW9uOiAvXlthLXpcXGQtXSsoPz06KS8sXG4gICAgICAgICAgcHVuY3R1YXRpb246IC9eOjo/LyxcbiAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICBwYXR0ZXJuOiAvKD86XFxbKD86W15cXF1cXFxcXCJdfChbXCInXSkoPzooPyFcXDEpW15cXFxcXXxcXFxcLikqXFwxfFxcXFwuKSpcXF0pLyxcbiAgICAgICAgICAgIGluc2lkZTogYXR0cmlidXRlcy5pbnNpZGVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBpbmxpbmU6IHtcbiAgICAgICAgLypcblRoZSBpbml0aWFsIGxvb2stYmVoaW5kIHByZXZlbnRzIHRoZSBoaWdobGlnaHRpbmcgb2YgZXNjYXBlZCBxdW90ZWQgdGV4dC5cblF1b3RlZCB0ZXh0IGNhbiBiZSBtdWx0aS1saW5lIGJ1dCBjYW5ub3Qgc3BhbiBhbiBlbXB0eSBsaW5lLlxuQWxsIHF1b3RlZCB0ZXh0IGNhbiBoYXZlIGF0dHJpYnV0ZXMgYmVmb3JlIFtmb29iYXIsICdmb29iYXInLCBiYXo9XCJiYXJcIl0uXG5GaXJzdCwgd2UgaGFuZGxlIHRoZSBjb25zdHJhaW5lZCBxdW90ZXMuXG5UaG9zZSBtdXN0IGJlIGJvdW5kZWQgYnkgbm9uLXdvcmQgY2hhcnMgYW5kIGNhbm5vdCBoYXZlIHNwYWNlcyBiZXR3ZWVuIHRoZSBkZWxpbWl0ZXIgYW5kIHRoZSBmaXJzdCBjaGFyLlxuVGhleSBhcmUsIGluIG9yZGVyOiBfZW1waGFzaXNfLCBgYGRvdWJsZSBxdW90ZXMnJywgYHNpbmdsZSBxdW90ZXMnLCBgbW9ub3NwYWNlYCwgJ2VtcGhhc2lzJywgKnN0cm9uZyosICttb25vc3BhY2UrIGFuZCAjdW5xdW90ZWQjXG5UaGVuIHdlIGhhbmRsZSB0aGUgdW5jb25zdHJhaW5lZCBxdW90ZXMuXG5UaG9zZSBkbyBub3QgaGF2ZSB0aGUgcmVzdHJpY3Rpb25zIG9mIHRoZSBjb25zdHJhaW5lZCBxdW90ZXMuXG5UaGV5IGFyZSwgaW4gb3JkZXI6IF9fZW1waGFzaXNfXywgKipzdHJvbmcqKiwgKyttb25vc3BhY2UrKywgKysrcGFzc3Rocm91Z2grKyssICMjdW5xdW90ZWQjIywgJCRwYXNzdGhyb3VnaCQkLCB+c3Vic2NyaXB0fiwgXnN1cGVyc2NyaXB0Xiwge2F0dHJpYnV0ZS1yZWZlcmVuY2V9LCBbW2FuY2hvcl1dLCBbW1tiaWJsaW9ncmFwaHkgYW5jaG9yXV1dLCA8PHhyZWY+PiwgKCgoaW5kZXhlcykpKSBhbmQgKChpbmRleGVzKSlcbiovXG4gICAgICAgIHBhdHRlcm46IC8oXnxbXlxcXFxdKSg/Oig/OlxcQlxcWyg/OlteXFxdXFxcXFwiXXwoW1wiJ10pKD86KD8hXFwyKVteXFxcXF18XFxcXC4pKlxcMnxcXFxcLikqXFxdKT8oPzpcXGJfKD8hXFxzKSg/OiBffFteX1xcXFxcXHJcXG5dfFxcXFwuKSsoPzooPzpcXHI/XFxufFxccikoPzogX3xbXl9cXFxcXFxyXFxuXXxcXFxcLikrKSpfXFxifFxcQmBgKD8hXFxzKS4rPyg/Oig/Olxccj9cXG58XFxyKS4rPykqJydcXEJ8XFxCYCg/IVxccykoPzogWydgXXwuKSs/KD86KD86XFxyP1xcbnxcXHIpKD86IFsnYF18LikrPykqWydgXVxcQnxcXEIoWycqKyNdKSg/IVxccykoPzogXFwzfCg/IVxcMylbXlxcXFxcXHJcXG5dfFxcXFwuKSsoPzooPzpcXHI/XFxufFxccikoPzogXFwzfCg/IVxcMylbXlxcXFxcXHJcXG5dfFxcXFwuKSspKlxcM1xcQil8KD86XFxbKD86W15cXF1cXFxcXCJdfChbXCInXSkoPzooPyFcXDQpW15cXFxcXXxcXFxcLikqXFw0fFxcXFwuKSpcXF0pPyg/OihfX3xcXCpcXCp8XFwrXFwrXFwrP3wjI3xcXCRcXCR8W35eXSkuKz8oPzooPzpcXHI/XFxufFxccikuKz8pKlxcNXxcXHtbXn1cXHJcXG5dK1xcfXxcXFtcXFtcXFs/Lis/KD86KD86XFxyP1xcbnxcXHIpLis/KSpcXF0/XFxdXFxdfDw8Lis/KD86KD86XFxyP1xcbnxcXHIpLis/KSo+PnxcXChcXChcXCg/Lis/KD86KD86XFxyP1xcbnxcXHIpLis/KSpcXCk/XFwpXFwpKSkvbSxcbiAgICAgICAgbG9va2JlaGluZDogdHJ1ZSxcbiAgICAgICAgaW5zaWRlOiB7XG4gICAgICAgICAgYXR0cmlidXRlczogYXR0cmlidXRlcyxcbiAgICAgICAgICB1cmw6IHtcbiAgICAgICAgICAgIHBhdHRlcm46IC9eKD86XFxbXFxbXFxbPy4rP1xcXT9cXF1cXF18PDwuKz8+PikkLyxcbiAgICAgICAgICAgIGluc2lkZToge1xuICAgICAgICAgICAgICBwdW5jdHVhdGlvbjogL14oPzpcXFtcXFtcXFs/fDw8KXwoPzpcXF1cXF1cXF0/fD4+KSQvXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICAnYXR0cmlidXRlLXJlZic6IHtcbiAgICAgICAgICAgIHBhdHRlcm46IC9eXFx7LitcXH0kLyxcbiAgICAgICAgICAgIGluc2lkZToge1xuICAgICAgICAgICAgICB2YXJpYWJsZToge1xuICAgICAgICAgICAgICAgIHBhdHRlcm46IC8oXlxceylbYS16XFxkLCtfLV0rLyxcbiAgICAgICAgICAgICAgICBsb29rYmVoaW5kOiB0cnVlXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG9wZXJhdG9yOiAvXls9PyEjJUAkXXwhKD89Wzp9XSkvLFxuICAgICAgICAgICAgICBwdW5jdHVhdGlvbjogL15cXHt8XFx9JHw6Oj8vXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBpdGFsaWM6IHtcbiAgICAgICAgICAgIHBhdHRlcm46IC9eKFsnX10pW1xcc1xcU10rXFwxJC8sXG4gICAgICAgICAgICBpbnNpZGU6IHtcbiAgICAgICAgICAgICAgcHVuY3R1YXRpb246IC9eKD86Jyc/fF9fPyl8KD86Jyc/fF9fPykkL1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgYm9sZDoge1xuICAgICAgICAgICAgcGF0dGVybjogL15cXCpbXFxzXFxTXStcXCokLyxcbiAgICAgICAgICAgIGluc2lkZToge1xuICAgICAgICAgICAgICBwdW5jdHVhdGlvbjogL15cXCpcXCo/fFxcKlxcKj8kL1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgcHVuY3R1YXRpb246IC9eKD86YGA/fFxcK3sxLDN9fCMjP3xcXCRcXCR8W35eXXxcXChcXChcXCg/KXwoPzonJz98XFwrezEsM318IyM/fFxcJFxcJHxbfl5gXXxcXCk/XFwpXFwpKSQvXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICByZXBsYWNlbWVudDoge1xuICAgICAgICBwYXR0ZXJuOiAvXFwoKD86Q3xUTXxSKVxcKS8sXG4gICAgICAgIGFsaWFzOiAnYnVpbHRpbidcbiAgICAgIH0sXG4gICAgICBlbnRpdHk6IC8mIz9bXFxkYS16XXsxLDh9Oy9pLFxuICAgICAgJ2xpbmUtY29udGludWF0aW9uJzoge1xuICAgICAgICBwYXR0ZXJuOiAvKF58IClcXCskL20sXG4gICAgICAgIGxvb2tiZWhpbmQ6IHRydWUsXG4gICAgICAgIGFsaWFzOiAncHVuY3R1YXRpb24nXG4gICAgICB9XG4gICAgfSkgLy8gQWxsb3cgc29tZSBuZXN0aW5nLiBUaGVyZSBpcyBubyByZWN1cnNpb24gdGhvdWdoLCBzbyBjbG9uaW5nIHNob3VsZCBub3QgYmUgbmVlZGVkLlxuICAgIGZ1bmN0aW9uIGNvcHlGcm9tQXNjaWlEb2Moa2V5cykge1xuICAgICAga2V5cyA9IGtleXMuc3BsaXQoJyAnKVxuICAgICAgdmFyIG8gPSB7fVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBrZXlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBvW2tleXNbaV1dID0gYXNjaWlkb2Nba2V5c1tpXV1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvXG4gICAgfVxuICAgIGF0dHJpYnV0ZXMuaW5zaWRlWydpbnRlcnByZXRlZCddLmluc2lkZS5yZXN0ID0gY29weUZyb21Bc2NpaURvYyhcbiAgICAgICdtYWNybyBpbmxpbmUgcmVwbGFjZW1lbnQgZW50aXR5J1xuICAgIClcbiAgICBhc2NpaWRvY1sncGFzc3Rocm91Z2gtYmxvY2snXS5pbnNpZGUucmVzdCA9IGNvcHlGcm9tQXNjaWlEb2MoJ21hY3JvJylcbiAgICBhc2NpaWRvY1snbGl0ZXJhbC1ibG9jayddLmluc2lkZS5yZXN0ID0gY29weUZyb21Bc2NpaURvYygnY2FsbG91dCcpXG4gICAgYXNjaWlkb2NbJ3RhYmxlJ10uaW5zaWRlLnJlc3QgPSBjb3B5RnJvbUFzY2lpRG9jKFxuICAgICAgJ2NvbW1lbnQtYmxvY2sgcGFzc3Rocm91Z2gtYmxvY2sgbGl0ZXJhbC1ibG9jayBvdGhlci1ibG9jayBsaXN0LXB1bmN0dWF0aW9uIGluZGVudGVkLWJsb2NrIGNvbW1lbnQgdGl0bGUgYXR0cmlidXRlLWVudHJ5IGF0dHJpYnV0ZXMgaHIgcGFnZS1icmVhayBhZG1vbml0aW9uIGxpc3QtbGFiZWwgY2FsbG91dCBtYWNybyBpbmxpbmUgcmVwbGFjZW1lbnQgZW50aXR5IGxpbmUtY29udGludWF0aW9uJ1xuICAgIClcbiAgICBhc2NpaWRvY1snb3RoZXItYmxvY2snXS5pbnNpZGUucmVzdCA9IGNvcHlGcm9tQXNjaWlEb2MoXG4gICAgICAndGFibGUgbGlzdC1wdW5jdHVhdGlvbiBpbmRlbnRlZC1ibG9jayBjb21tZW50IGF0dHJpYnV0ZS1lbnRyeSBhdHRyaWJ1dGVzIGhyIHBhZ2UtYnJlYWsgYWRtb25pdGlvbiBsaXN0LWxhYmVsIG1hY3JvIGlubGluZSByZXBsYWNlbWVudCBlbnRpdHkgbGluZS1jb250aW51YXRpb24nXG4gICAgKVxuICAgIGFzY2lpZG9jWyd0aXRsZSddLmluc2lkZS5yZXN0ID0gY29weUZyb21Bc2NpaURvYyhcbiAgICAgICdtYWNybyBpbmxpbmUgcmVwbGFjZW1lbnQgZW50aXR5J1xuICAgICkgLy8gUGx1Z2luIHRvIG1ha2UgZW50aXR5IHRpdGxlIHNob3cgdGhlIHJlYWwgZW50aXR5LCBpZGVhIGJ5IFJvbWFuIEtvbWFyb3ZcbiAgICBQcmlzbS5ob29rcy5hZGQoJ3dyYXAnLCBmdW5jdGlvbihlbnYpIHtcbiAgICAgIGlmIChlbnYudHlwZSA9PT0gJ2VudGl0eScpIHtcbiAgICAgICAgZW52LmF0dHJpYnV0ZXNbJ3RpdGxlJ10gPSBlbnYuY29udGVudC52YWx1ZS5yZXBsYWNlKC8mYW1wOy8sICcmJylcbiAgICAgIH1cbiAgICB9KVxuICAgIFByaXNtLmxhbmd1YWdlcy5hZG9jID0gUHJpc20ubGFuZ3VhZ2VzLmFzY2lpZG9jXG4gIH0pKFByaXNtKVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9