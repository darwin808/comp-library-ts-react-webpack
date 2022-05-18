"use strict";
(this["webpackChunk_zesty_io_explorer"] = this["webpackChunk_zesty_io_explorer"] || []).push([["react-syntax-highlighter_languages_refractor_pascal"],{

/***/ "./node_modules/refractor/lang/pascal.js":
/*!***********************************************!*\
  !*** ./node_modules/refractor/lang/pascal.js ***!
  \***********************************************/
/***/ ((module) => {



module.exports = pascal
pascal.displayName = 'pascal'
pascal.aliases = ['objectpascal']
function pascal(Prism) {
  // Based on Free Pascal
  /* TODO
Support inline asm ?
*/
  Prism.languages.pascal = {
    comment: [/\(\*[\s\S]+?\*\)/, /\{[\s\S]+?\}/, /\/\/.*/],
    string: {
      pattern: /(?:'(?:''|[^'\r\n])*'|#[&$%]?[a-f\d]+)+|\^[a-z]/i,
      greedy: true
    },
    keyword: [
      {
        // Turbo Pascal
        pattern: /(^|[^&])\b(?:absolute|array|asm|begin|case|const|constructor|destructor|do|downto|else|end|file|for|function|goto|if|implementation|inherited|inline|interface|label|nil|object|of|operator|packed|procedure|program|record|reintroduce|repeat|self|set|string|then|to|type|unit|until|uses|var|while|with)\b/i,
        lookbehind: true
      },
      {
        // Free Pascal
        pattern: /(^|[^&])\b(?:dispose|exit|false|new|true)\b/i,
        lookbehind: true
      },
      {
        // Object Pascal
        pattern: /(^|[^&])\b(?:class|dispinterface|except|exports|finalization|finally|initialization|inline|library|on|out|packed|property|raise|resourcestring|threadvar|try)\b/i,
        lookbehind: true
      },
      {
        // Modifiers
        pattern: /(^|[^&])\b(?:absolute|abstract|alias|assembler|bitpacked|break|cdecl|continue|cppdecl|cvar|default|deprecated|dynamic|enumerator|experimental|export|external|far|far16|forward|generic|helper|implements|index|interrupt|iochecks|local|message|name|near|nodefault|noreturn|nostackframe|oldfpccall|otherwise|overload|override|pascal|platform|private|protected|public|published|read|register|reintroduce|result|safecall|saveregisters|softfloat|specialize|static|stdcall|stored|strict|unaligned|unimplemented|varargs|virtual|write)\b/i,
        lookbehind: true
      }
    ],
    number: [
      // Hexadecimal, octal and binary
      /(?:[&%]\d+|\$[a-f\d]+)/i, // Decimal
      /\b\d+(?:\.\d+)?(?:e[+-]?\d+)?/i
    ],
    operator: [
      /\.\.|\*\*|:=|<[<=>]?|>[>=]?|[+\-*\/]=?|[@^=]/i,
      {
        pattern: /(^|[^&])\b(?:and|as|div|exclude|in|include|is|mod|not|or|shl|shr|xor)\b/,
        lookbehind: true
      }
    ],
    punctuation: /\(\.|\.\)|[()\[\]:;,.]/
  }
  Prism.languages.objectpascal = Prism.languages.pascal
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyX2xhbmd1YWdlc19yZWZyYWN0b3JfcGFzY2FsLmV4cGxvcmVyLmRldi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsVUFBVTtBQUMvQztBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQHplc3R5LWlvL2V4cGxvcmVyLy4vbm9kZV9tb2R1bGVzL3JlZnJhY3Rvci9sYW5nL3Bhc2NhbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSBwYXNjYWxcbnBhc2NhbC5kaXNwbGF5TmFtZSA9ICdwYXNjYWwnXG5wYXNjYWwuYWxpYXNlcyA9IFsnb2JqZWN0cGFzY2FsJ11cbmZ1bmN0aW9uIHBhc2NhbChQcmlzbSkge1xuICAvLyBCYXNlZCBvbiBGcmVlIFBhc2NhbFxuICAvKiBUT0RPXG5TdXBwb3J0IGlubGluZSBhc20gP1xuKi9cbiAgUHJpc20ubGFuZ3VhZ2VzLnBhc2NhbCA9IHtcbiAgICBjb21tZW50OiBbL1xcKFxcKltcXHNcXFNdKz9cXCpcXCkvLCAvXFx7W1xcc1xcU10rP1xcfS8sIC9cXC9cXC8uKi9dLFxuICAgIHN0cmluZzoge1xuICAgICAgcGF0dGVybjogLyg/OicoPzonJ3xbXidcXHJcXG5dKSonfCNbJiQlXT9bYS1mXFxkXSspK3xcXF5bYS16XS9pLFxuICAgICAgZ3JlZWR5OiB0cnVlXG4gICAgfSxcbiAgICBrZXl3b3JkOiBbXG4gICAgICB7XG4gICAgICAgIC8vIFR1cmJvIFBhc2NhbFxuICAgICAgICBwYXR0ZXJuOiAvKF58W14mXSlcXGIoPzphYnNvbHV0ZXxhcnJheXxhc218YmVnaW58Y2FzZXxjb25zdHxjb25zdHJ1Y3RvcnxkZXN0cnVjdG9yfGRvfGRvd250b3xlbHNlfGVuZHxmaWxlfGZvcnxmdW5jdGlvbnxnb3RvfGlmfGltcGxlbWVudGF0aW9ufGluaGVyaXRlZHxpbmxpbmV8aW50ZXJmYWNlfGxhYmVsfG5pbHxvYmplY3R8b2Z8b3BlcmF0b3J8cGFja2VkfHByb2NlZHVyZXxwcm9ncmFtfHJlY29yZHxyZWludHJvZHVjZXxyZXBlYXR8c2VsZnxzZXR8c3RyaW5nfHRoZW58dG98dHlwZXx1bml0fHVudGlsfHVzZXN8dmFyfHdoaWxlfHdpdGgpXFxiL2ksXG4gICAgICAgIGxvb2tiZWhpbmQ6IHRydWVcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIC8vIEZyZWUgUGFzY2FsXG4gICAgICAgIHBhdHRlcm46IC8oXnxbXiZdKVxcYig/OmRpc3Bvc2V8ZXhpdHxmYWxzZXxuZXd8dHJ1ZSlcXGIvaSxcbiAgICAgICAgbG9va2JlaGluZDogdHJ1ZVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgLy8gT2JqZWN0IFBhc2NhbFxuICAgICAgICBwYXR0ZXJuOiAvKF58W14mXSlcXGIoPzpjbGFzc3xkaXNwaW50ZXJmYWNlfGV4Y2VwdHxleHBvcnRzfGZpbmFsaXphdGlvbnxmaW5hbGx5fGluaXRpYWxpemF0aW9ufGlubGluZXxsaWJyYXJ5fG9ufG91dHxwYWNrZWR8cHJvcGVydHl8cmFpc2V8cmVzb3VyY2VzdHJpbmd8dGhyZWFkdmFyfHRyeSlcXGIvaSxcbiAgICAgICAgbG9va2JlaGluZDogdHJ1ZVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgLy8gTW9kaWZpZXJzXG4gICAgICAgIHBhdHRlcm46IC8oXnxbXiZdKVxcYig/OmFic29sdXRlfGFic3RyYWN0fGFsaWFzfGFzc2VtYmxlcnxiaXRwYWNrZWR8YnJlYWt8Y2RlY2x8Y29udGludWV8Y3BwZGVjbHxjdmFyfGRlZmF1bHR8ZGVwcmVjYXRlZHxkeW5hbWljfGVudW1lcmF0b3J8ZXhwZXJpbWVudGFsfGV4cG9ydHxleHRlcm5hbHxmYXJ8ZmFyMTZ8Zm9yd2FyZHxnZW5lcmljfGhlbHBlcnxpbXBsZW1lbnRzfGluZGV4fGludGVycnVwdHxpb2NoZWNrc3xsb2NhbHxtZXNzYWdlfG5hbWV8bmVhcnxub2RlZmF1bHR8bm9yZXR1cm58bm9zdGFja2ZyYW1lfG9sZGZwY2NhbGx8b3RoZXJ3aXNlfG92ZXJsb2FkfG92ZXJyaWRlfHBhc2NhbHxwbGF0Zm9ybXxwcml2YXRlfHByb3RlY3RlZHxwdWJsaWN8cHVibGlzaGVkfHJlYWR8cmVnaXN0ZXJ8cmVpbnRyb2R1Y2V8cmVzdWx0fHNhZmVjYWxsfHNhdmVyZWdpc3RlcnN8c29mdGZsb2F0fHNwZWNpYWxpemV8c3RhdGljfHN0ZGNhbGx8c3RvcmVkfHN0cmljdHx1bmFsaWduZWR8dW5pbXBsZW1lbnRlZHx2YXJhcmdzfHZpcnR1YWx8d3JpdGUpXFxiL2ksXG4gICAgICAgIGxvb2tiZWhpbmQ6IHRydWVcbiAgICAgIH1cbiAgICBdLFxuICAgIG51bWJlcjogW1xuICAgICAgLy8gSGV4YWRlY2ltYWwsIG9jdGFsIGFuZCBiaW5hcnlcbiAgICAgIC8oPzpbJiVdXFxkK3xcXCRbYS1mXFxkXSspL2ksIC8vIERlY2ltYWxcbiAgICAgIC9cXGJcXGQrKD86XFwuXFxkKyk/KD86ZVsrLV0/XFxkKyk/L2lcbiAgICBdLFxuICAgIG9wZXJhdG9yOiBbXG4gICAgICAvXFwuXFwufFxcKlxcKnw6PXw8Wzw9Pl0/fD5bPj1dP3xbK1xcLSpcXC9dPT98W0BePV0vaSxcbiAgICAgIHtcbiAgICAgICAgcGF0dGVybjogLyhefFteJl0pXFxiKD86YW5kfGFzfGRpdnxleGNsdWRlfGlufGluY2x1ZGV8aXN8bW9kfG5vdHxvcnxzaGx8c2hyfHhvcilcXGIvLFxuICAgICAgICBsb29rYmVoaW5kOiB0cnVlXG4gICAgICB9XG4gICAgXSxcbiAgICBwdW5jdHVhdGlvbjogL1xcKFxcLnxcXC5cXCl8WygpXFxbXFxdOjssLl0vXG4gIH1cbiAgUHJpc20ubGFuZ3VhZ2VzLm9iamVjdHBhc2NhbCA9IFByaXNtLmxhbmd1YWdlcy5wYXNjYWxcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==