"use strict";
(this["webpackChunk_zesty_io_explorer"] = this["webpackChunk_zesty_io_explorer"] || []).push([["react-syntax-highlighter_languages_refractor_elixir"],{

/***/ "./node_modules/refractor/lang/elixir.js":
/*!***********************************************!*\
  !*** ./node_modules/refractor/lang/elixir.js ***!
  \***********************************************/
/***/ ((module) => {



module.exports = elixir
elixir.displayName = 'elixir'
elixir.aliases = []
function elixir(Prism) {
  Prism.languages.elixir = {
    comment: /#.*/m,
    // ~r"""foo""" (multi-line), ~r'''foo''' (multi-line), ~r/foo/, ~r|foo|, ~r"foo", ~r'foo', ~r(foo), ~r[foo], ~r{foo}, ~r<foo>
    regex: {
      pattern: /~[rR](?:("""|''')(?:\\[\s\S]|(?!\1)[^\\])+\1|([\/|"'])(?:\\.|(?!\2)[^\\\r\n])+\2|\((?:\\.|[^\\)\r\n])+\)|\[(?:\\.|[^\\\]\r\n])+\]|\{(?:\\.|[^\\}\r\n])+\}|<(?:\\.|[^\\>\r\n])+>)[uismxfr]*/,
      greedy: true
    },
    string: [
      {
        // ~s"""foo""" (multi-line), ~s'''foo''' (multi-line), ~s/foo/, ~s|foo|, ~s"foo", ~s'foo', ~s(foo), ~s[foo], ~s{foo} (with interpolation care), ~s<foo>
        pattern: /~[cCsSwW](?:("""|''')(?:\\[\s\S]|(?!\1)[^\\])+\1|([\/|"'])(?:\\.|(?!\2)[^\\\r\n])+\2|\((?:\\.|[^\\)\r\n])+\)|\[(?:\\.|[^\\\]\r\n])+\]|\{(?:\\.|#\{[^}]+\}|[^\\}\r\n])+\}|<(?:\\.|[^\\>\r\n])+>)[csa]?/,
        greedy: true,
        inside: {
          // See interpolation below
        }
      },
      {
        pattern: /("""|''')[\s\S]*?\1/,
        greedy: true,
        inside: {
          // See interpolation below
        }
      },
      {
        // Multi-line strings are allowed
        pattern: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: true,
        inside: {
          // See interpolation below
        }
      }
    ],
    atom: {
      // Look-behind prevents bad highlighting of the :: operator
      pattern: /(^|[^:]):\w+/,
      lookbehind: true,
      alias: 'symbol'
    },
    // Look-ahead prevents bad highlighting of the :: operator
    'attr-name': /\w+:(?!:)/,
    capture: {
      // Look-behind prevents bad highlighting of the && operator
      pattern: /(^|[^&])&(?:[^&\s\d()][^\s()]*|(?=\())/,
      lookbehind: true,
      alias: 'function'
    },
    argument: {
      // Look-behind prevents bad highlighting of the && operator
      pattern: /(^|[^&])&\d+/,
      lookbehind: true,
      alias: 'variable'
    },
    attribute: {
      pattern: /@\w+/,
      alias: 'variable'
    },
    number: /\b(?:0[box][a-f\d_]+|\d[\d_]*)(?:\.[\d_]+)?(?:e[+-]?[\d_]+)?\b/i,
    keyword: /\b(?:after|alias|and|case|catch|cond|def(?:callback|exception|impl|module|p|protocol|struct)?|do|else|end|fn|for|if|import|not|or|require|rescue|try|unless|use|when)\b/,
    boolean: /\b(?:true|false|nil)\b/,
    operator: [
      /\bin\b|&&?|\|[|>]?|\\\\|::|\.\.\.?|\+\+?|-[->]?|<[-=>]|>=|!==?|\B!|=(?:==?|[>~])?|[*\/^]/,
      {
        // We don't want to match <<
        pattern: /([^<])<(?!<)/,
        lookbehind: true
      },
      {
        // We don't want to match >>
        pattern: /([^>])>(?!>)/,
        lookbehind: true
      }
    ],
    punctuation: /<<|>>|[.,%\[\]{}()]/
  }
  Prism.languages.elixir.string.forEach(function(o) {
    o.inside = {
      interpolation: {
        pattern: /#\{[^}]+\}/,
        inside: {
          delimiter: {
            pattern: /^#\{|\}$/,
            alias: 'punctuation'
          },
          rest: Prism.languages.elixir
        }
      }
    }
  })
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyX2xhbmd1YWdlc19yZWZyYWN0b3JfZWxpeGlyLmV4cGxvcmVyLmRldi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvSEFBb0gsSUFBSTtBQUN4SDtBQUNBLG9KQUFvSixZQUFZLFNBQVM7QUFDeks7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLHdIQUF3SCxLQUFLO0FBQzdILDBKQUEwSixVQUFVLEdBQUcsSUFBSSxNQUFNLFNBQVM7QUFDMUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixHQUFHLElBQUk7QUFDNUI7QUFDQTtBQUNBLDBCQUEwQixHQUFHO0FBQzdCO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQHplc3R5LWlvL2V4cGxvcmVyLy4vbm9kZV9tb2R1bGVzL3JlZnJhY3Rvci9sYW5nL2VsaXhpci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSBlbGl4aXJcbmVsaXhpci5kaXNwbGF5TmFtZSA9ICdlbGl4aXInXG5lbGl4aXIuYWxpYXNlcyA9IFtdXG5mdW5jdGlvbiBlbGl4aXIoUHJpc20pIHtcbiAgUHJpc20ubGFuZ3VhZ2VzLmVsaXhpciA9IHtcbiAgICBjb21tZW50OiAvIy4qL20sXG4gICAgLy8gfnJcIlwiXCJmb29cIlwiXCIgKG11bHRpLWxpbmUpLCB+cicnJ2ZvbycnJyAobXVsdGktbGluZSksIH5yL2Zvby8sIH5yfGZvb3wsIH5yXCJmb29cIiwgfnInZm9vJywgfnIoZm9vKSwgfnJbZm9vXSwgfnJ7Zm9vfSwgfnI8Zm9vPlxuICAgIHJlZ2V4OiB7XG4gICAgICBwYXR0ZXJuOiAvfltyUl0oPzooXCJcIlwifCcnJykoPzpcXFxcW1xcc1xcU118KD8hXFwxKVteXFxcXF0pK1xcMXwoW1xcL3xcIiddKSg/OlxcXFwufCg/IVxcMilbXlxcXFxcXHJcXG5dKStcXDJ8XFwoKD86XFxcXC58W15cXFxcKVxcclxcbl0pK1xcKXxcXFsoPzpcXFxcLnxbXlxcXFxcXF1cXHJcXG5dKStcXF18XFx7KD86XFxcXC58W15cXFxcfVxcclxcbl0pK1xcfXw8KD86XFxcXC58W15cXFxcPlxcclxcbl0pKz4pW3Vpc214ZnJdKi8sXG4gICAgICBncmVlZHk6IHRydWVcbiAgICB9LFxuICAgIHN0cmluZzogW1xuICAgICAge1xuICAgICAgICAvLyB+c1wiXCJcImZvb1wiXCJcIiAobXVsdGktbGluZSksIH5zJycnZm9vJycnIChtdWx0aS1saW5lKSwgfnMvZm9vLywgfnN8Zm9vfCwgfnNcImZvb1wiLCB+cydmb28nLCB+cyhmb28pLCB+c1tmb29dLCB+c3tmb299ICh3aXRoIGludGVycG9sYXRpb24gY2FyZSksIH5zPGZvbz5cbiAgICAgICAgcGF0dGVybjogL35bY0NzU3dXXSg/OihcIlwiXCJ8JycnKSg/OlxcXFxbXFxzXFxTXXwoPyFcXDEpW15cXFxcXSkrXFwxfChbXFwvfFwiJ10pKD86XFxcXC58KD8hXFwyKVteXFxcXFxcclxcbl0pK1xcMnxcXCgoPzpcXFxcLnxbXlxcXFwpXFxyXFxuXSkrXFwpfFxcWyg/OlxcXFwufFteXFxcXFxcXVxcclxcbl0pK1xcXXxcXHsoPzpcXFxcLnwjXFx7W159XStcXH18W15cXFxcfVxcclxcbl0pK1xcfXw8KD86XFxcXC58W15cXFxcPlxcclxcbl0pKz4pW2NzYV0/LyxcbiAgICAgICAgZ3JlZWR5OiB0cnVlLFxuICAgICAgICBpbnNpZGU6IHtcbiAgICAgICAgICAvLyBTZWUgaW50ZXJwb2xhdGlvbiBiZWxvd1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXR0ZXJuOiAvKFwiXCJcInwnJycpW1xcc1xcU10qP1xcMS8sXG4gICAgICAgIGdyZWVkeTogdHJ1ZSxcbiAgICAgICAgaW5zaWRlOiB7XG4gICAgICAgICAgLy8gU2VlIGludGVycG9sYXRpb24gYmVsb3dcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgLy8gTXVsdGktbGluZSBzdHJpbmdzIGFyZSBhbGxvd2VkXG4gICAgICAgIHBhdHRlcm46IC8oXCJ8JykoPzpcXFxcKD86XFxyXFxufFtcXHNcXFNdKXwoPyFcXDEpW15cXFxcXFxyXFxuXSkqXFwxLyxcbiAgICAgICAgZ3JlZWR5OiB0cnVlLFxuICAgICAgICBpbnNpZGU6IHtcbiAgICAgICAgICAvLyBTZWUgaW50ZXJwb2xhdGlvbiBiZWxvd1xuICAgICAgICB9XG4gICAgICB9XG4gICAgXSxcbiAgICBhdG9tOiB7XG4gICAgICAvLyBMb29rLWJlaGluZCBwcmV2ZW50cyBiYWQgaGlnaGxpZ2h0aW5nIG9mIHRoZSA6OiBvcGVyYXRvclxuICAgICAgcGF0dGVybjogLyhefFteOl0pOlxcdysvLFxuICAgICAgbG9va2JlaGluZDogdHJ1ZSxcbiAgICAgIGFsaWFzOiAnc3ltYm9sJ1xuICAgIH0sXG4gICAgLy8gTG9vay1haGVhZCBwcmV2ZW50cyBiYWQgaGlnaGxpZ2h0aW5nIG9mIHRoZSA6OiBvcGVyYXRvclxuICAgICdhdHRyLW5hbWUnOiAvXFx3KzooPyE6KS8sXG4gICAgY2FwdHVyZToge1xuICAgICAgLy8gTG9vay1iZWhpbmQgcHJldmVudHMgYmFkIGhpZ2hsaWdodGluZyBvZiB0aGUgJiYgb3BlcmF0b3JcbiAgICAgIHBhdHRlcm46IC8oXnxbXiZdKSYoPzpbXiZcXHNcXGQoKV1bXlxccygpXSp8KD89XFwoKSkvLFxuICAgICAgbG9va2JlaGluZDogdHJ1ZSxcbiAgICAgIGFsaWFzOiAnZnVuY3Rpb24nXG4gICAgfSxcbiAgICBhcmd1bWVudDoge1xuICAgICAgLy8gTG9vay1iZWhpbmQgcHJldmVudHMgYmFkIGhpZ2hsaWdodGluZyBvZiB0aGUgJiYgb3BlcmF0b3JcbiAgICAgIHBhdHRlcm46IC8oXnxbXiZdKSZcXGQrLyxcbiAgICAgIGxvb2tiZWhpbmQ6IHRydWUsXG4gICAgICBhbGlhczogJ3ZhcmlhYmxlJ1xuICAgIH0sXG4gICAgYXR0cmlidXRlOiB7XG4gICAgICBwYXR0ZXJuOiAvQFxcdysvLFxuICAgICAgYWxpYXM6ICd2YXJpYWJsZSdcbiAgICB9LFxuICAgIG51bWJlcjogL1xcYig/OjBbYm94XVthLWZcXGRfXSt8XFxkW1xcZF9dKikoPzpcXC5bXFxkX10rKT8oPzplWystXT9bXFxkX10rKT9cXGIvaSxcbiAgICBrZXl3b3JkOiAvXFxiKD86YWZ0ZXJ8YWxpYXN8YW5kfGNhc2V8Y2F0Y2h8Y29uZHxkZWYoPzpjYWxsYmFja3xleGNlcHRpb258aW1wbHxtb2R1bGV8cHxwcm90b2NvbHxzdHJ1Y3QpP3xkb3xlbHNlfGVuZHxmbnxmb3J8aWZ8aW1wb3J0fG5vdHxvcnxyZXF1aXJlfHJlc2N1ZXx0cnl8dW5sZXNzfHVzZXx3aGVuKVxcYi8sXG4gICAgYm9vbGVhbjogL1xcYig/OnRydWV8ZmFsc2V8bmlsKVxcYi8sXG4gICAgb3BlcmF0b3I6IFtcbiAgICAgIC9cXGJpblxcYnwmJj98XFx8W3w+XT98XFxcXFxcXFx8Ojp8XFwuXFwuXFwuP3xcXCtcXCs/fC1bLT5dP3w8Wy09Pl18Pj18IT09P3xcXEIhfD0oPzo9PT98Wz5+XSk/fFsqXFwvXl0vLFxuICAgICAge1xuICAgICAgICAvLyBXZSBkb24ndCB3YW50IHRvIG1hdGNoIDw8XG4gICAgICAgIHBhdHRlcm46IC8oW148XSk8KD8hPCkvLFxuICAgICAgICBsb29rYmVoaW5kOiB0cnVlXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAvLyBXZSBkb24ndCB3YW50IHRvIG1hdGNoID4+XG4gICAgICAgIHBhdHRlcm46IC8oW14+XSk+KD8hPikvLFxuICAgICAgICBsb29rYmVoaW5kOiB0cnVlXG4gICAgICB9XG4gICAgXSxcbiAgICBwdW5jdHVhdGlvbjogLzw8fD4+fFsuLCVcXFtcXF17fSgpXS9cbiAgfVxuICBQcmlzbS5sYW5ndWFnZXMuZWxpeGlyLnN0cmluZy5mb3JFYWNoKGZ1bmN0aW9uKG8pIHtcbiAgICBvLmluc2lkZSA9IHtcbiAgICAgIGludGVycG9sYXRpb246IHtcbiAgICAgICAgcGF0dGVybjogLyNcXHtbXn1dK1xcfS8sXG4gICAgICAgIGluc2lkZToge1xuICAgICAgICAgIGRlbGltaXRlcjoge1xuICAgICAgICAgICAgcGF0dGVybjogL14jXFx7fFxcfSQvLFxuICAgICAgICAgICAgYWxpYXM6ICdwdW5jdHVhdGlvbidcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlc3Q6IFByaXNtLmxhbmd1YWdlcy5lbGl4aXJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSlcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==