"use strict";
(this["webpackChunk_zesty_io_explorer"] = this["webpackChunk_zesty_io_explorer"] || []).push([["react-syntax-highlighter_languages_refractor_coffeescript"],{

/***/ "./node_modules/refractor/lang/coffeescript.js":
/*!*****************************************************!*\
  !*** ./node_modules/refractor/lang/coffeescript.js ***!
  \*****************************************************/
/***/ ((module) => {



module.exports = coffeescript
coffeescript.displayName = 'coffeescript'
coffeescript.aliases = ['coffee']
function coffeescript(Prism) {
  ;(function(Prism) {
    // Ignore comments starting with { to privilege string interpolation highlighting
    var comment = /#(?!\{).+/,
      interpolation = {
        pattern: /#\{[^}]+\}/,
        alias: 'variable'
      }
    Prism.languages.coffeescript = Prism.languages.extend('javascript', {
      comment: comment,
      string: [
        // Strings are multiline
        {
          pattern: /'(?:\\[\s\S]|[^\\'])*'/,
          greedy: true
        },
        {
          // Strings are multiline
          pattern: /"(?:\\[\s\S]|[^\\"])*"/,
          greedy: true,
          inside: {
            interpolation: interpolation
          }
        }
      ],
      keyword: /\b(?:and|break|by|catch|class|continue|debugger|delete|do|each|else|extend|extends|false|finally|for|if|in|instanceof|is|isnt|let|loop|namespace|new|no|not|null|of|off|on|or|own|return|super|switch|then|this|throw|true|try|typeof|undefined|unless|until|when|while|window|with|yes|yield)\b/,
      'class-member': {
        pattern: /@(?!\d)\w+/,
        alias: 'variable'
      }
    })
    Prism.languages.insertBefore('coffeescript', 'comment', {
      'multiline-comment': {
        pattern: /###[\s\S]+?###/,
        alias: 'comment'
      },
      // Block regexp can contain comments and interpolation
      'block-regex': {
        pattern: /\/{3}[\s\S]*?\/{3}/,
        alias: 'regex',
        inside: {
          comment: comment,
          interpolation: interpolation
        }
      }
    })
    Prism.languages.insertBefore('coffeescript', 'string', {
      'inline-javascript': {
        pattern: /`(?:\\[\s\S]|[^\\`])*`/,
        inside: {
          delimiter: {
            pattern: /^`|`$/,
            alias: 'punctuation'
          },
          rest: Prism.languages.javascript
        }
      },
      // Block strings
      'multiline-string': [
        {
          pattern: /'''[\s\S]*?'''/,
          greedy: true,
          alias: 'string'
        },
        {
          pattern: /"""[\s\S]*?"""/,
          greedy: true,
          alias: 'string',
          inside: {
            interpolation: interpolation
          }
        }
      ]
    })
    Prism.languages.insertBefore('coffeescript', 'keyword', {
      // Object property
      property: /(?!\d)\w+(?=\s*:(?!:))/
    })
    delete Prism.languages.coffeescript['template-string']
    Prism.languages.coffee = Prism.languages.coffeescript
  })(Prism)
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyX2xhbmd1YWdlc19yZWZyYWN0b3JfY29mZmVlc2NyaXB0LmV4cGxvcmVyLmRldi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCx1Q0FBdUM7QUFDdkMseUJBQXlCO0FBQ3pCO0FBQ0EscUJBQXFCLEdBQUcsSUFBSTtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EscUJBQXFCLEVBQUUsV0FBVyxFQUFFO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0giLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AemVzdHktaW8vZXhwbG9yZXIvLi9ub2RlX21vZHVsZXMvcmVmcmFjdG9yL2xhbmcvY29mZmVlc2NyaXB0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvZmZlZXNjcmlwdFxuY29mZmVlc2NyaXB0LmRpc3BsYXlOYW1lID0gJ2NvZmZlZXNjcmlwdCdcbmNvZmZlZXNjcmlwdC5hbGlhc2VzID0gWydjb2ZmZWUnXVxuZnVuY3Rpb24gY29mZmVlc2NyaXB0KFByaXNtKSB7XG4gIDsoZnVuY3Rpb24oUHJpc20pIHtcbiAgICAvLyBJZ25vcmUgY29tbWVudHMgc3RhcnRpbmcgd2l0aCB7IHRvIHByaXZpbGVnZSBzdHJpbmcgaW50ZXJwb2xhdGlvbiBoaWdobGlnaHRpbmdcbiAgICB2YXIgY29tbWVudCA9IC8jKD8hXFx7KS4rLyxcbiAgICAgIGludGVycG9sYXRpb24gPSB7XG4gICAgICAgIHBhdHRlcm46IC8jXFx7W159XStcXH0vLFxuICAgICAgICBhbGlhczogJ3ZhcmlhYmxlJ1xuICAgICAgfVxuICAgIFByaXNtLmxhbmd1YWdlcy5jb2ZmZWVzY3JpcHQgPSBQcmlzbS5sYW5ndWFnZXMuZXh0ZW5kKCdqYXZhc2NyaXB0Jywge1xuICAgICAgY29tbWVudDogY29tbWVudCxcbiAgICAgIHN0cmluZzogW1xuICAgICAgICAvLyBTdHJpbmdzIGFyZSBtdWx0aWxpbmVcbiAgICAgICAge1xuICAgICAgICAgIHBhdHRlcm46IC8nKD86XFxcXFtcXHNcXFNdfFteXFxcXCddKSonLyxcbiAgICAgICAgICBncmVlZHk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIC8vIFN0cmluZ3MgYXJlIG11bHRpbGluZVxuICAgICAgICAgIHBhdHRlcm46IC9cIig/OlxcXFxbXFxzXFxTXXxbXlxcXFxcIl0pKlwiLyxcbiAgICAgICAgICBncmVlZHk6IHRydWUsXG4gICAgICAgICAgaW5zaWRlOiB7XG4gICAgICAgICAgICBpbnRlcnBvbGF0aW9uOiBpbnRlcnBvbGF0aW9uXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAga2V5d29yZDogL1xcYig/OmFuZHxicmVha3xieXxjYXRjaHxjbGFzc3xjb250aW51ZXxkZWJ1Z2dlcnxkZWxldGV8ZG98ZWFjaHxlbHNlfGV4dGVuZHxleHRlbmRzfGZhbHNlfGZpbmFsbHl8Zm9yfGlmfGlufGluc3RhbmNlb2Z8aXN8aXNudHxsZXR8bG9vcHxuYW1lc3BhY2V8bmV3fG5vfG5vdHxudWxsfG9mfG9mZnxvbnxvcnxvd258cmV0dXJufHN1cGVyfHN3aXRjaHx0aGVufHRoaXN8dGhyb3d8dHJ1ZXx0cnl8dHlwZW9mfHVuZGVmaW5lZHx1bmxlc3N8dW50aWx8d2hlbnx3aGlsZXx3aW5kb3d8d2l0aHx5ZXN8eWllbGQpXFxiLyxcbiAgICAgICdjbGFzcy1tZW1iZXInOiB7XG4gICAgICAgIHBhdHRlcm46IC9AKD8hXFxkKVxcdysvLFxuICAgICAgICBhbGlhczogJ3ZhcmlhYmxlJ1xuICAgICAgfVxuICAgIH0pXG4gICAgUHJpc20ubGFuZ3VhZ2VzLmluc2VydEJlZm9yZSgnY29mZmVlc2NyaXB0JywgJ2NvbW1lbnQnLCB7XG4gICAgICAnbXVsdGlsaW5lLWNvbW1lbnQnOiB7XG4gICAgICAgIHBhdHRlcm46IC8jIyNbXFxzXFxTXSs/IyMjLyxcbiAgICAgICAgYWxpYXM6ICdjb21tZW50J1xuICAgICAgfSxcbiAgICAgIC8vIEJsb2NrIHJlZ2V4cCBjYW4gY29udGFpbiBjb21tZW50cyBhbmQgaW50ZXJwb2xhdGlvblxuICAgICAgJ2Jsb2NrLXJlZ2V4Jzoge1xuICAgICAgICBwYXR0ZXJuOiAvXFwvezN9W1xcc1xcU10qP1xcL3szfS8sXG4gICAgICAgIGFsaWFzOiAncmVnZXgnLFxuICAgICAgICBpbnNpZGU6IHtcbiAgICAgICAgICBjb21tZW50OiBjb21tZW50LFxuICAgICAgICAgIGludGVycG9sYXRpb246IGludGVycG9sYXRpb25cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgUHJpc20ubGFuZ3VhZ2VzLmluc2VydEJlZm9yZSgnY29mZmVlc2NyaXB0JywgJ3N0cmluZycsIHtcbiAgICAgICdpbmxpbmUtamF2YXNjcmlwdCc6IHtcbiAgICAgICAgcGF0dGVybjogL2AoPzpcXFxcW1xcc1xcU118W15cXFxcYF0pKmAvLFxuICAgICAgICBpbnNpZGU6IHtcbiAgICAgICAgICBkZWxpbWl0ZXI6IHtcbiAgICAgICAgICAgIHBhdHRlcm46IC9eYHxgJC8sXG4gICAgICAgICAgICBhbGlhczogJ3B1bmN0dWF0aW9uJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVzdDogUHJpc20ubGFuZ3VhZ2VzLmphdmFzY3JpcHRcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIEJsb2NrIHN0cmluZ3NcbiAgICAgICdtdWx0aWxpbmUtc3RyaW5nJzogW1xuICAgICAgICB7XG4gICAgICAgICAgcGF0dGVybjogLycnJ1tcXHNcXFNdKj8nJycvLFxuICAgICAgICAgIGdyZWVkeTogdHJ1ZSxcbiAgICAgICAgICBhbGlhczogJ3N0cmluZydcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHBhdHRlcm46IC9cIlwiXCJbXFxzXFxTXSo/XCJcIlwiLyxcbiAgICAgICAgICBncmVlZHk6IHRydWUsXG4gICAgICAgICAgYWxpYXM6ICdzdHJpbmcnLFxuICAgICAgICAgIGluc2lkZToge1xuICAgICAgICAgICAgaW50ZXJwb2xhdGlvbjogaW50ZXJwb2xhdGlvblxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0pXG4gICAgUHJpc20ubGFuZ3VhZ2VzLmluc2VydEJlZm9yZSgnY29mZmVlc2NyaXB0JywgJ2tleXdvcmQnLCB7XG4gICAgICAvLyBPYmplY3QgcHJvcGVydHlcbiAgICAgIHByb3BlcnR5OiAvKD8hXFxkKVxcdysoPz1cXHMqOig/ITopKS9cbiAgICB9KVxuICAgIGRlbGV0ZSBQcmlzbS5sYW5ndWFnZXMuY29mZmVlc2NyaXB0Wyd0ZW1wbGF0ZS1zdHJpbmcnXVxuICAgIFByaXNtLmxhbmd1YWdlcy5jb2ZmZWUgPSBQcmlzbS5sYW5ndWFnZXMuY29mZmVlc2NyaXB0XG4gIH0pKFByaXNtKVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9