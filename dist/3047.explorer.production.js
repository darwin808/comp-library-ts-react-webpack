"use strict";(self.webpackChunkExplorer=self.webpackChunkExplorer||[]).push([[3047],{3205:e=>{function n(e){!function(e){function n(e,n){return"___"+e.toUpperCase()+n+"___"}Object.defineProperties(e.languages["markup-templating"]={},{buildPlaceholders:{value:function(t,a,r,o){if(t.language===a){var u=t.tokenStack=[];t.code=t.code.replace(r,(function(e){if("function"==typeof o&&!o(e))return e;for(var r,c=u.length;-1!==t.code.indexOf(r=n(a,c));)++c;return u[c]=e,r})),t.grammar=e.languages.markup}}},tokenizePlaceholders:{value:function(t,a){if(t.language===a&&t.tokenStack){t.grammar=e.languages[a];var r=0,o=Object.keys(t.tokenStack);!function u(c){for(var i=0;i<c.length&&!(r>=o.length);i++){var l=c[i];if("string"==typeof l||l.content&&"string"==typeof l.content){var p=o[r],s=t.tokenStack[p],g="string"==typeof l?l:l.content,f=n(a,p),k=g.indexOf(f);if(k>-1){++r;var h=g.substring(0,k),m=new e.Token(a,e.tokenize(s,t.grammar),"language-"+a,s),d=g.substring(k+f.length),y=[];h&&y.push.apply(y,u([h])),y.push(m),d&&y.push.apply(y,u([d])),"string"==typeof l?c.splice.apply(c,[i,1].concat(y)):l.content=y}}else l.content&&u(l.content)}return c}(t.tokens)}}}})}(e)}e.exports=n,n.displayName="markupTemplating",n.aliases=[]}}]);