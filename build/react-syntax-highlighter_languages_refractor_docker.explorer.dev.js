"use strict";
(this["webpackChunk_zesty_io_explorer"] = this["webpackChunk_zesty_io_explorer"] || []).push([["react-syntax-highlighter_languages_refractor_docker"],{

/***/ "./node_modules/refractor/lang/docker.js":
/*!***********************************************!*\
  !*** ./node_modules/refractor/lang/docker.js ***!
  \***********************************************/
/***/ ((module) => {



module.exports = docker
docker.displayName = 'docker'
docker.aliases = ['dockerfile']
function docker(Prism) {
  Prism.languages.docker = {
    keyword: {
      pattern: /(^\s*)(?:ADD|ARG|CMD|COPY|ENTRYPOINT|ENV|EXPOSE|FROM|HEALTHCHECK|LABEL|MAINTAINER|ONBUILD|RUN|SHELL|STOPSIGNAL|USER|VOLUME|WORKDIR)(?=\s)/im,
      lookbehind: true
    },
    string: /("|')(?:(?!\1)[^\\\r\n]|\\(?:\r\n|[\s\S]))*\1/,
    comment: /#.*/,
    punctuation: /---|\.\.\.|[:[\]{}\-,|>?]/
  }
  Prism.languages.dockerfile = Prism.languages.docker
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyX2xhbmd1YWdlc19yZWZyYWN0b3JfZG9ja2VyLmV4cGxvcmVyLmRldi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQHplc3R5LWlvL2V4cGxvcmVyLy4vbm9kZV9tb2R1bGVzL3JlZnJhY3Rvci9sYW5nL2RvY2tlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSBkb2NrZXJcbmRvY2tlci5kaXNwbGF5TmFtZSA9ICdkb2NrZXInXG5kb2NrZXIuYWxpYXNlcyA9IFsnZG9ja2VyZmlsZSddXG5mdW5jdGlvbiBkb2NrZXIoUHJpc20pIHtcbiAgUHJpc20ubGFuZ3VhZ2VzLmRvY2tlciA9IHtcbiAgICBrZXl3b3JkOiB7XG4gICAgICBwYXR0ZXJuOiAvKF5cXHMqKSg/OkFERHxBUkd8Q01EfENPUFl8RU5UUllQT0lOVHxFTlZ8RVhQT1NFfEZST018SEVBTFRIQ0hFQ0t8TEFCRUx8TUFJTlRBSU5FUnxPTkJVSUxEfFJVTnxTSEVMTHxTVE9QU0lHTkFMfFVTRVJ8Vk9MVU1FfFdPUktESVIpKD89XFxzKS9pbSxcbiAgICAgIGxvb2tiZWhpbmQ6IHRydWVcbiAgICB9LFxuICAgIHN0cmluZzogLyhcInwnKSg/Oig/IVxcMSlbXlxcXFxcXHJcXG5dfFxcXFwoPzpcXHJcXG58W1xcc1xcU10pKSpcXDEvLFxuICAgIGNvbW1lbnQ6IC8jLiovLFxuICAgIHB1bmN0dWF0aW9uOiAvLS0tfFxcLlxcLlxcLnxbOltcXF17fVxcLSx8Pj9dL1xuICB9XG4gIFByaXNtLmxhbmd1YWdlcy5kb2NrZXJmaWxlID0gUHJpc20ubGFuZ3VhZ2VzLmRvY2tlclxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9