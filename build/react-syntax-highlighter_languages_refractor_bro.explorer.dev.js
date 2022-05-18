"use strict";
(this["webpackChunk_zesty_io_explorer"] = this["webpackChunk_zesty_io_explorer"] || []).push([["react-syntax-highlighter_languages_refractor_bro"],{

/***/ "./node_modules/refractor/lang/bro.js":
/*!********************************************!*\
  !*** ./node_modules/refractor/lang/bro.js ***!
  \********************************************/
/***/ ((module) => {



module.exports = bro
bro.displayName = 'bro'
bro.aliases = []
function bro(Prism) {
  Prism.languages.bro = {
    comment: {
      pattern: /(^|[^\\$])#.*/,
      lookbehind: true,
      inside: {
        italic: /\b(?:TODO|FIXME|XXX)\b/
      }
    },
    string: {
      pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: true
    },
    boolean: /\b[TF]\b/,
    function: {
      pattern: /(?:function|hook|event) \w+(?:::\w+)?/,
      inside: {
        keyword: /^(?:function|hook|event)/
      }
    },
    variable: {
      pattern: /(?:global|local) \w+/i,
      inside: {
        keyword: /(?:global|local)/
      }
    },
    builtin: /(?:@(?:load(?:-(?:sigs|plugin))?|unload|prefixes|ifn?def|else|(?:end)?if|DIR|FILENAME))|(?:&?(?:redef|priority|log|optional|default|add_func|delete_func|expire_func|read_expire|write_expire|create_expire|synchronized|persistent|rotate_interval|rotate_size|encrypt|raw_output|mergeable|group|error_handler|type_column))/,
    constant: {
      pattern: /const \w+/i,
      inside: {
        keyword: /const/
      }
    },
    keyword: /\b(?:break|next|continue|alarm|using|of|add|delete|export|print|return|schedule|when|timeout|addr|any|bool|count|double|enum|file|int|interval|pattern|opaque|port|record|set|string|subnet|table|time|vector|for|if|else|in|module|function)\b/,
    operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&|\|\|?|\?|\*|\/|~|\^|%/,
    number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
    punctuation: /[{}[\];(),.:]/
  }
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyX2xhbmd1YWdlc19yZWZyYWN0b3JfYnJvLmV4cGxvcmVyLmRldi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLElBQUk7QUFDekI7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0B6ZXN0eS1pby9leHBsb3Jlci8uL25vZGVfbW9kdWxlcy9yZWZyYWN0b3IvbGFuZy9icm8uanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gYnJvXG5icm8uZGlzcGxheU5hbWUgPSAnYnJvJ1xuYnJvLmFsaWFzZXMgPSBbXVxuZnVuY3Rpb24gYnJvKFByaXNtKSB7XG4gIFByaXNtLmxhbmd1YWdlcy5icm8gPSB7XG4gICAgY29tbWVudDoge1xuICAgICAgcGF0dGVybjogLyhefFteXFxcXCRdKSMuKi8sXG4gICAgICBsb29rYmVoaW5kOiB0cnVlLFxuICAgICAgaW5zaWRlOiB7XG4gICAgICAgIGl0YWxpYzogL1xcYig/OlRPRE98RklYTUV8WFhYKVxcYi9cbiAgICAgIH1cbiAgICB9LFxuICAgIHN0cmluZzoge1xuICAgICAgcGF0dGVybjogLyhbXCInXSkoPzpcXFxcKD86XFxyXFxufFtcXHNcXFNdKXwoPyFcXDEpW15cXFxcXFxyXFxuXSkqXFwxLyxcbiAgICAgIGdyZWVkeTogdHJ1ZVxuICAgIH0sXG4gICAgYm9vbGVhbjogL1xcYltURl1cXGIvLFxuICAgIGZ1bmN0aW9uOiB7XG4gICAgICBwYXR0ZXJuOiAvKD86ZnVuY3Rpb258aG9va3xldmVudCkgXFx3Kyg/Ojo6XFx3Kyk/LyxcbiAgICAgIGluc2lkZToge1xuICAgICAgICBrZXl3b3JkOiAvXig/OmZ1bmN0aW9ufGhvb2t8ZXZlbnQpL1xuICAgICAgfVxuICAgIH0sXG4gICAgdmFyaWFibGU6IHtcbiAgICAgIHBhdHRlcm46IC8oPzpnbG9iYWx8bG9jYWwpIFxcdysvaSxcbiAgICAgIGluc2lkZToge1xuICAgICAgICBrZXl3b3JkOiAvKD86Z2xvYmFsfGxvY2FsKS9cbiAgICAgIH1cbiAgICB9LFxuICAgIGJ1aWx0aW46IC8oPzpAKD86bG9hZCg/Oi0oPzpzaWdzfHBsdWdpbikpP3x1bmxvYWR8cHJlZml4ZXN8aWZuP2RlZnxlbHNlfCg/OmVuZCk/aWZ8RElSfEZJTEVOQU1FKSl8KD86Jj8oPzpyZWRlZnxwcmlvcml0eXxsb2d8b3B0aW9uYWx8ZGVmYXVsdHxhZGRfZnVuY3xkZWxldGVfZnVuY3xleHBpcmVfZnVuY3xyZWFkX2V4cGlyZXx3cml0ZV9leHBpcmV8Y3JlYXRlX2V4cGlyZXxzeW5jaHJvbml6ZWR8cGVyc2lzdGVudHxyb3RhdGVfaW50ZXJ2YWx8cm90YXRlX3NpemV8ZW5jcnlwdHxyYXdfb3V0cHV0fG1lcmdlYWJsZXxncm91cHxlcnJvcl9oYW5kbGVyfHR5cGVfY29sdW1uKSkvLFxuICAgIGNvbnN0YW50OiB7XG4gICAgICBwYXR0ZXJuOiAvY29uc3QgXFx3Ky9pLFxuICAgICAgaW5zaWRlOiB7XG4gICAgICAgIGtleXdvcmQ6IC9jb25zdC9cbiAgICAgIH1cbiAgICB9LFxuICAgIGtleXdvcmQ6IC9cXGIoPzpicmVha3xuZXh0fGNvbnRpbnVlfGFsYXJtfHVzaW5nfG9mfGFkZHxkZWxldGV8ZXhwb3J0fHByaW50fHJldHVybnxzY2hlZHVsZXx3aGVufHRpbWVvdXR8YWRkcnxhbnl8Ym9vbHxjb3VudHxkb3VibGV8ZW51bXxmaWxlfGludHxpbnRlcnZhbHxwYXR0ZXJufG9wYXF1ZXxwb3J0fHJlY29yZHxzZXR8c3RyaW5nfHN1Ym5ldHx0YWJsZXx0aW1lfHZlY3Rvcnxmb3J8aWZ8ZWxzZXxpbnxtb2R1bGV8ZnVuY3Rpb24pXFxiLyxcbiAgICBvcGVyYXRvcjogLy0tP3xcXCtcXCs/fCE9Pz0/fDw9P3w+PT98PT0/PT98JiZ8XFx8XFx8P3xcXD98XFwqfFxcL3x+fFxcXnwlLyxcbiAgICBudW1iZXI6IC9cXGIweFtcXGRhLWZdK1xcYnwoPzpcXGJcXGQrXFwuP1xcZCp8XFxCXFwuXFxkKykoPzplWystXT9cXGQrKT8vaSxcbiAgICBwdW5jdHVhdGlvbjogL1t7fVtcXF07KCksLjpdL1xuICB9XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=