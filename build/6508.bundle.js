"use strict";(self.webpackChunk_zesty_io_explorer=self.webpackChunk_zesty_io_explorer||[]).push([[6508],{9660:e=>{function t(e){!function(e){e.languages.http={"request-line":{pattern:/^(?:POST|GET|PUT|DELETE|OPTIONS|PATCH|TRACE|CONNECT)\s(?:https?:\/\/|\/)\S+\sHTTP\/[0-9.]+/m,inside:{property:/^(?:POST|GET|PUT|DELETE|OPTIONS|PATCH|TRACE|CONNECT)\b/,"attr-name":/:\w+/}},"response-status":{pattern:/^HTTP\/1.[01] \d+.*/m,inside:{property:{pattern:/(^HTTP\/1.[01] )\d+.*/i,lookbehind:!0}}},"header-name":{pattern:/^[\w-]+:(?=.)/m,alias:"keyword"}};var t,a=e.languages,s={"application/javascript":a.javascript,"application/json":a.json||a.javascript,"application/xml":a.xml,"text/xml":a.xml,"text/html":a.html,"text/css":a.css},n={"application/json":!0,"application/xml":!0};function p(e){var t=e.replace(/^[a-z]+\//,"");return"(?:"+e+"|\\w+/(?:[\\w.-]+\\+)+"+t+"(?![+\\w.-]))"}for(var r in s)if(s[r]){t=t||{};var i=n[r]?p(r):r;t[r]={pattern:RegExp("(content-type:\\s*"+i+"[\\s\\S]*?)(?:\\r?\\n|\\r){2}[\\s\\S]*","i"),lookbehind:!0,inside:{rest:s[r]}}}t&&e.languages.insertBefore("http","header-name",t)}(e)}e.exports=t,t.displayName="http",t.aliases=[]}}]);