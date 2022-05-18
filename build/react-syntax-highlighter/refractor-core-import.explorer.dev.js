(this["webpackChunk_zesty_io_explorer"] = this["webpackChunk_zesty_io_explorer"] || []).push([["react-syntax-highlighter/refractor-core-import"],{

/***/ "./node_modules/comma-separated-tokens/index.js":
/*!******************************************************!*\
  !*** ./node_modules/comma-separated-tokens/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.parse = parse
exports.stringify = stringify

var comma = ','
var space = ' '
var empty = ''

// Parse comma-separated tokens to an array.
function parse(value) {
  var values = []
  var input = String(value || empty)
  var index = input.indexOf(comma)
  var lastIndex = 0
  var end = false
  var val

  while (!end) {
    if (index === -1) {
      index = input.length
      end = true
    }

    val = input.slice(lastIndex, index).trim()

    if (val || !end) {
      values.push(val)
    }

    lastIndex = index + 1
    index = input.indexOf(comma, lastIndex)
  }

  return values
}

// Compile an array to comma-separated tokens.
// `options.padLeft` (default: `true`) pads a space left of each token, and
// `options.padRight` (default: `false`) pads a space to the right of each token.
function stringify(values, options) {
  var settings = options || {}
  var left = settings.padLeft === false ? empty : space
  var right = settings.padRight ? space : empty

  // Ensure the last empty entry is seen.
  if (values[values.length - 1] === empty) {
    values = values.concat(empty)
  }

  return values.join(right + comma + left).trim()
}


/***/ }),

/***/ "./node_modules/hast-util-parse-selector/index.js":
/*!********************************************************!*\
  !*** ./node_modules/hast-util-parse-selector/index.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


module.exports = parse

var search = /[#.]/g

// Create a hast element from a simple CSS selector.
function parse(selector, defaultTagName) {
  var value = selector || ''
  var name = defaultTagName || 'div'
  var props = {}
  var start = 0
  var subvalue
  var previous
  var match

  while (start < value.length) {
    search.lastIndex = start
    match = search.exec(value)
    subvalue = value.slice(start, match ? match.index : value.length)

    if (subvalue) {
      if (!previous) {
        name = subvalue
      } else if (previous === '#') {
        props.id = subvalue
      } else if (props.className) {
        props.className.push(subvalue)
      } else {
        props.className = [subvalue]
      }

      start += subvalue.length
    }

    if (match) {
      previous = match[0]
      start++
    }
  }

  return {type: 'element', tagName: name, properties: props, children: []}
}


/***/ }),

/***/ "./node_modules/hastscript/factory.js":
/*!********************************************!*\
  !*** ./node_modules/hastscript/factory.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var find = __webpack_require__(/*! property-information/find */ "./node_modules/property-information/find.js")
var normalize = __webpack_require__(/*! property-information/normalize */ "./node_modules/property-information/normalize.js")
var parseSelector = __webpack_require__(/*! hast-util-parse-selector */ "./node_modules/hast-util-parse-selector/index.js")
var spaces = (__webpack_require__(/*! space-separated-tokens */ "./node_modules/space-separated-tokens/index.js").parse)
var commas = (__webpack_require__(/*! comma-separated-tokens */ "./node_modules/comma-separated-tokens/index.js").parse)

module.exports = factory

var own = {}.hasOwnProperty

function factory(schema, defaultTagName, caseSensitive) {
  var adjust = caseSensitive ? createAdjustMap(caseSensitive) : null

  return h

  // Hyperscript compatible DSL for creating virtual hast trees.
  function h(selector, properties) {
    var node = parseSelector(selector, defaultTagName)
    var children = Array.prototype.slice.call(arguments, 2)
    var name = node.tagName.toLowerCase()
    var property

    node.tagName = adjust && own.call(adjust, name) ? adjust[name] : name

    if (properties && isChildren(properties, node)) {
      children.unshift(properties)
      properties = null
    }

    if (properties) {
      for (property in properties) {
        addProperty(node.properties, property, properties[property])
      }
    }

    addChild(node.children, children)

    if (node.tagName === 'template') {
      node.content = {type: 'root', children: node.children}
      node.children = []
    }

    return node
  }

  function addProperty(properties, key, value) {
    var info
    var property
    var result

    // Ignore nully and NaN values.
    if (value === null || value === undefined || value !== value) {
      return
    }

    info = find(schema, key)
    property = info.property
    result = value

    // Handle list values.
    if (typeof result === 'string') {
      if (info.spaceSeparated) {
        result = spaces(result)
      } else if (info.commaSeparated) {
        result = commas(result)
      } else if (info.commaOrSpaceSeparated) {
        result = spaces(commas(result).join(' '))
      }
    }

    // Accept `object` on style.
    if (property === 'style' && typeof value !== 'string') {
      result = style(result)
    }

    // Class-names (which can be added both on the `selector` and here).
    if (property === 'className' && properties.className) {
      result = properties.className.concat(result)
    }

    properties[property] = parsePrimitives(info, property, result)
  }
}

function isChildren(value, node) {
  return (
    typeof value === 'string' ||
    'length' in value ||
    isNode(node.tagName, value)
  )
}

function isNode(tagName, value) {
  var type = value.type

  if (tagName === 'input' || !type || typeof type !== 'string') {
    return false
  }

  if (typeof value.children === 'object' && 'length' in value.children) {
    return true
  }

  type = type.toLowerCase()

  if (tagName === 'button') {
    return (
      type !== 'menu' &&
      type !== 'submit' &&
      type !== 'reset' &&
      type !== 'button'
    )
  }

  return 'value' in value
}

function addChild(nodes, value) {
  var index
  var length

  if (typeof value === 'string' || typeof value === 'number') {
    nodes.push({type: 'text', value: String(value)})
    return
  }

  if (typeof value === 'object' && 'length' in value) {
    index = -1
    length = value.length

    while (++index < length) {
      addChild(nodes, value[index])
    }

    return
  }

  if (typeof value !== 'object' || !('type' in value)) {
    throw new Error('Expected node, nodes, or string, got `' + value + '`')
  }

  nodes.push(value)
}

// Parse a (list of) primitives.
function parsePrimitives(info, name, value) {
  var index
  var length
  var result

  if (typeof value !== 'object' || !('length' in value)) {
    return parsePrimitive(info, name, value)
  }

  length = value.length
  index = -1
  result = []

  while (++index < length) {
    result[index] = parsePrimitive(info, name, value[index])
  }

  return result
}

// Parse a single primitives.
function parsePrimitive(info, name, value) {
  var result = value

  if (info.number || info.positiveNumber) {
    if (!isNaN(result) && result !== '') {
      result = Number(result)
    }
  } else if (info.boolean || info.overloadedBoolean) {
    // Accept `boolean` and `string`.
    if (
      typeof result === 'string' &&
      (result === '' || normalize(value) === normalize(name))
    ) {
      result = true
    }
  }

  return result
}

function style(value) {
  var result = []
  var key

  for (key in value) {
    result.push([key, value[key]].join(': '))
  }

  return result.join('; ')
}

function createAdjustMap(values) {
  var length = values.length
  var index = -1
  var result = {}
  var value

  while (++index < length) {
    value = values[index]
    result[value.toLowerCase()] = value
  }

  return result
}


/***/ }),

/***/ "./node_modules/hastscript/html.js":
/*!*****************************************!*\
  !*** ./node_modules/hastscript/html.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var schema = __webpack_require__(/*! property-information/html */ "./node_modules/property-information/html.js")
var factory = __webpack_require__(/*! ./factory */ "./node_modules/hastscript/factory.js")

var html = factory(schema, 'div')
html.displayName = 'html'

module.exports = html


/***/ }),

/***/ "./node_modules/hastscript/index.js":
/*!******************************************!*\
  !*** ./node_modules/hastscript/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = __webpack_require__(/*! ./html */ "./node_modules/hastscript/html.js")


/***/ }),

/***/ "./node_modules/is-alphabetical/index.js":
/*!***********************************************!*\
  !*** ./node_modules/is-alphabetical/index.js ***!
  \***********************************************/
/***/ ((module) => {

"use strict";


module.exports = alphabetical

// Check if the given character code, or the character code at the first
// character, is alphabetical.
function alphabetical(character) {
  var code = typeof character === 'string' ? character.charCodeAt(0) : character

  return (
    (code >= 97 && code <= 122) /* a-z */ ||
    (code >= 65 && code <= 90) /* A-Z */
  )
}


/***/ }),

/***/ "./node_modules/is-alphanumerical/index.js":
/*!*************************************************!*\
  !*** ./node_modules/is-alphanumerical/index.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var alphabetical = __webpack_require__(/*! is-alphabetical */ "./node_modules/is-alphabetical/index.js")
var decimal = __webpack_require__(/*! is-decimal */ "./node_modules/is-decimal/index.js")

module.exports = alphanumerical

// Check if the given character code, or the character code at the first
// character, is alphanumerical.
function alphanumerical(character) {
  return alphabetical(character) || decimal(character)
}


/***/ }),

/***/ "./node_modules/is-decimal/index.js":
/*!******************************************!*\
  !*** ./node_modules/is-decimal/index.js ***!
  \******************************************/
/***/ ((module) => {

"use strict";


module.exports = decimal

// Check if the given character code, or the character code at the first
// character, is decimal.
function decimal(character) {
  var code = typeof character === 'string' ? character.charCodeAt(0) : character

  return code >= 48 && code <= 57 /* 0-9 */
}


/***/ }),

/***/ "./node_modules/is-hexadecimal/index.js":
/*!**********************************************!*\
  !*** ./node_modules/is-hexadecimal/index.js ***!
  \**********************************************/
/***/ ((module) => {

"use strict";


module.exports = hexadecimal

// Check if the given character code, or the character code at the first
// character, is hexadecimal.
function hexadecimal(character) {
  var code = typeof character === 'string' ? character.charCodeAt(0) : character

  return (
    (code >= 97 /* a */ && code <= 102) /* z */ ||
    (code >= 65 /* A */ && code <= 70) /* Z */ ||
    (code >= 48 /* A */ && code <= 57) /* Z */
  )
}


/***/ }),

/***/ "./node_modules/parse-entities/decode-entity.browser.js":
/*!**************************************************************!*\
  !*** ./node_modules/parse-entities/decode-entity.browser.js ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";


/* eslint-env browser */

var el

var semicolon = 59 //  ';'

module.exports = decodeEntity

function decodeEntity(characters) {
  var entity = '&' + characters + ';'
  var char

  el = el || document.createElement('i')
  el.innerHTML = entity
  char = el.textContent

  // Some entities do not require the closing semicolon (`&not` - for instance),
  // which leads to situations where parsing the assumed entity of &notit; will
  // result in the string `¬it;`.  When we encounter a trailing semicolon after
  // parsing and the entity to decode was not a semicolon (`&semi;`), we can
  // assume that the matching was incomplete
  if (char.charCodeAt(char.length - 1) === semicolon && characters !== 'semi') {
    return false
  }

  // If the decoded string is equal to the input, the entity was not valid
  return char === entity ? false : char
}


/***/ }),

/***/ "./node_modules/parse-entities/index.js":
/*!**********************************************!*\
  !*** ./node_modules/parse-entities/index.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var legacy = __webpack_require__(/*! character-entities-legacy */ "./node_modules/character-entities-legacy/index.json")
var invalid = __webpack_require__(/*! character-reference-invalid */ "./node_modules/character-reference-invalid/index.json")
var decimal = __webpack_require__(/*! is-decimal */ "./node_modules/is-decimal/index.js")
var hexadecimal = __webpack_require__(/*! is-hexadecimal */ "./node_modules/is-hexadecimal/index.js")
var alphanumerical = __webpack_require__(/*! is-alphanumerical */ "./node_modules/is-alphanumerical/index.js")
var decodeEntity = __webpack_require__(/*! ./decode-entity */ "./node_modules/parse-entities/decode-entity.browser.js")

module.exports = parseEntities

var own = {}.hasOwnProperty
var fromCharCode = String.fromCharCode
var noop = Function.prototype

// Default settings.
var defaults = {
  warning: null,
  reference: null,
  text: null,
  warningContext: null,
  referenceContext: null,
  textContext: null,
  position: {},
  additional: null,
  attribute: false,
  nonTerminated: true
}

// Characters.
var tab = 9 // '\t'
var lineFeed = 10 // '\n'
var formFeed = 12 //  '\f'
var space = 32 // ' '
var ampersand = 38 //  '&'
var semicolon = 59 //  ';'
var lessThan = 60 //  '<'
var equalsTo = 61 //  '='
var numberSign = 35 //  '#'
var uppercaseX = 88 //  'X'
var lowercaseX = 120 //  'x'
var replacementCharacter = 65533 // '�'

// Reference types.
var name = 'named'
var hexa = 'hexadecimal'
var deci = 'decimal'

// Map of bases.
var bases = {}

bases[hexa] = 16
bases[deci] = 10

// Map of types to tests.
// Each type of character reference accepts different characters.
// This test is used to detect whether a reference has ended (as the semicolon
// is not strictly needed).
var tests = {}

tests[name] = alphanumerical
tests[deci] = decimal
tests[hexa] = hexadecimal

// Warning types.
var namedNotTerminated = 1
var numericNotTerminated = 2
var namedEmpty = 3
var numericEmpty = 4
var namedUnknown = 5
var numericDisallowed = 6
var numericProhibited = 7

// Warning messages.
var messages = {}

messages[namedNotTerminated] =
  'Named character references must be terminated by a semicolon'
messages[numericNotTerminated] =
  'Numeric character references must be terminated by a semicolon'
messages[namedEmpty] = 'Named character references cannot be empty'
messages[numericEmpty] = 'Numeric character references cannot be empty'
messages[namedUnknown] = 'Named character references must be known'
messages[numericDisallowed] =
  'Numeric character references cannot be disallowed'
messages[numericProhibited] =
  'Numeric character references cannot be outside the permissible Unicode range'

// Wrap to ensure clean parameters are given to `parse`.
function parseEntities(value, options) {
  var settings = {}
  var option
  var key

  if (!options) {
    options = {}
  }

  for (key in defaults) {
    option = options[key]
    settings[key] =
      option === null || option === undefined ? defaults[key] : option
  }

  if (settings.position.indent || settings.position.start) {
    settings.indent = settings.position.indent || []
    settings.position = settings.position.start
  }

  return parse(value, settings)
}

// Parse entities.
// eslint-disable-next-line complexity
function parse(value, settings) {
  var additional = settings.additional
  var nonTerminated = settings.nonTerminated
  var handleText = settings.text
  var handleReference = settings.reference
  var handleWarning = settings.warning
  var textContext = settings.textContext
  var referenceContext = settings.referenceContext
  var warningContext = settings.warningContext
  var pos = settings.position
  var indent = settings.indent || []
  var length = value.length
  var index = 0
  var lines = -1
  var column = pos.column || 1
  var line = pos.line || 1
  var queue = ''
  var result = []
  var entityCharacters
  var namedEntity
  var terminated
  var characters
  var character
  var reference
  var following
  var warning
  var reason
  var output
  var entity
  var begin
  var start
  var type
  var test
  var prev
  var next
  var diff
  var end

  if (typeof additional === 'string') {
    additional = additional.charCodeAt(0)
  }

  // Cache the current point.
  prev = now()

  // Wrap `handleWarning`.
  warning = handleWarning ? parseError : noop

  // Ensure the algorithm walks over the first character and the end (inclusive).
  index--
  length++

  while (++index < length) {
    // If the previous character was a newline.
    if (character === lineFeed) {
      column = indent[lines] || 1
    }

    character = value.charCodeAt(index)

    if (character === ampersand) {
      following = value.charCodeAt(index + 1)

      // The behaviour depends on the identity of the next character.
      if (
        following === tab ||
        following === lineFeed ||
        following === formFeed ||
        following === space ||
        following === ampersand ||
        following === lessThan ||
        following !== following ||
        (additional && following === additional)
      ) {
        // Not a character reference.
        // No characters are consumed, and nothing is returned.
        // This is not an error, either.
        queue += fromCharCode(character)
        column++

        continue
      }

      start = index + 1
      begin = start
      end = start

      if (following === numberSign) {
        // Numerical entity.
        end = ++begin

        // The behaviour further depends on the next character.
        following = value.charCodeAt(end)

        if (following === uppercaseX || following === lowercaseX) {
          // ASCII hex digits.
          type = hexa
          end = ++begin
        } else {
          // ASCII digits.
          type = deci
        }
      } else {
        // Named entity.
        type = name
      }

      entityCharacters = ''
      entity = ''
      characters = ''
      test = tests[type]
      end--

      while (++end < length) {
        following = value.charCodeAt(end)

        if (!test(following)) {
          break
        }

        characters += fromCharCode(following)

        // Check if we can match a legacy named reference.
        // If so, we cache that as the last viable named reference.
        // This ensures we do not need to walk backwards later.
        if (type === name && own.call(legacy, characters)) {
          entityCharacters = characters
          entity = legacy[characters]
        }
      }

      terminated = value.charCodeAt(end) === semicolon

      if (terminated) {
        end++

        namedEntity = type === name ? decodeEntity(characters) : false

        if (namedEntity) {
          entityCharacters = characters
          entity = namedEntity
        }
      }

      diff = 1 + end - start

      if (!terminated && !nonTerminated) {
        // Empty.
      } else if (!characters) {
        // An empty (possible) entity is valid, unless it’s numeric (thus an
        // ampersand followed by an octothorp).
        if (type !== name) {
          warning(numericEmpty, diff)
        }
      } else if (type === name) {
        // An ampersand followed by anything unknown, and not terminated, is
        // invalid.
        if (terminated && !entity) {
          warning(namedUnknown, 1)
        } else {
          // If theres something after an entity name which is not known, cap
          // the reference.
          if (entityCharacters !== characters) {
            end = begin + entityCharacters.length
            diff = 1 + end - begin
            terminated = false
          }

          // If the reference is not terminated, warn.
          if (!terminated) {
            reason = entityCharacters ? namedNotTerminated : namedEmpty

            if (settings.attribute) {
              following = value.charCodeAt(end)

              if (following === equalsTo) {
                warning(reason, diff)
                entity = null
              } else if (alphanumerical(following)) {
                entity = null
              } else {
                warning(reason, diff)
              }
            } else {
              warning(reason, diff)
            }
          }
        }

        reference = entity
      } else {
        if (!terminated) {
          // All non-terminated numeric entities are not rendered, and trigger a
          // warning.
          warning(numericNotTerminated, diff)
        }

        // When terminated and number, parse as either hexadecimal or decimal.
        reference = parseInt(characters, bases[type])

        // Trigger a warning when the parsed number is prohibited, and replace
        // with replacement character.
        if (prohibited(reference)) {
          warning(numericProhibited, diff)
          reference = fromCharCode(replacementCharacter)
        } else if (reference in invalid) {
          // Trigger a warning when the parsed number is disallowed, and replace
          // by an alternative.
          warning(numericDisallowed, diff)
          reference = invalid[reference]
        } else {
          // Parse the number.
          output = ''

          // Trigger a warning when the parsed number should not be used.
          if (disallowed(reference)) {
            warning(numericDisallowed, diff)
          }

          // Stringify the number.
          if (reference > 0xffff) {
            reference -= 0x10000
            output += fromCharCode((reference >>> (10 & 0x3ff)) | 0xd800)
            reference = 0xdc00 | (reference & 0x3ff)
          }

          reference = output + fromCharCode(reference)
        }
      }

      // Found it!
      // First eat the queued characters as normal text, then eat an entity.
      if (reference) {
        flush()

        prev = now()
        index = end - 1
        column += end - start + 1
        result.push(reference)
        next = now()
        next.offset++

        if (handleReference) {
          handleReference.call(
            referenceContext,
            reference,
            {start: prev, end: next},
            value.slice(start - 1, end)
          )
        }

        prev = next
      } else {
        // If we could not find a reference, queue the checked characters (as
        // normal characters), and move the pointer to their end.
        // This is possible because we can be certain neither newlines nor
        // ampersands are included.
        characters = value.slice(start - 1, end)
        queue += characters
        column += characters.length
        index = end - 1
      }
    } else {
      // Handle anything other than an ampersand, including newlines and EOF.
      if (
        character === 10 // Line feed
      ) {
        line++
        lines++
        column = 0
      }

      if (character === character) {
        queue += fromCharCode(character)
        column++
      } else {
        flush()
      }
    }
  }

  // Return the reduced nodes, and any possible warnings.
  return result.join('')

  // Get current position.
  function now() {
    return {
      line: line,
      column: column,
      offset: index + (pos.offset || 0)
    }
  }

  // “Throw” a parse-error: a warning.
  function parseError(code, offset) {
    var position = now()

    position.column += offset
    position.offset += offset

    handleWarning.call(warningContext, messages[code], position, code)
  }

  // Flush `queue` (normal text).
  // Macro invoked before each entity and at the end of `value`.
  // Does nothing when `queue` is empty.
  function flush() {
    if (queue) {
      result.push(queue)

      if (handleText) {
        handleText.call(textContext, queue, {start: prev, end: now()})
      }

      queue = ''
    }
  }
}

// Check if `character` is outside the permissible unicode range.
function prohibited(code) {
  return (code >= 0xd800 && code <= 0xdfff) || code > 0x10ffff
}

// Check if `character` is disallowed.
function disallowed(code) {
  return (
    (code >= 0x0001 && code <= 0x0008) ||
    code === 0x000b ||
    (code >= 0x000d && code <= 0x001f) ||
    (code >= 0x007f && code <= 0x009f) ||
    (code >= 0xfdd0 && code <= 0xfdef) ||
    (code & 0xffff) === 0xffff ||
    (code & 0xffff) === 0xfffe
  )
}


/***/ }),

/***/ "./node_modules/property-information/find.js":
/*!***************************************************!*\
  !*** ./node_modules/property-information/find.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var normalize = __webpack_require__(/*! ./normalize */ "./node_modules/property-information/normalize.js")
var DefinedInfo = __webpack_require__(/*! ./lib/util/defined-info */ "./node_modules/property-information/lib/util/defined-info.js")
var Info = __webpack_require__(/*! ./lib/util/info */ "./node_modules/property-information/lib/util/info.js")

var data = 'data'

module.exports = find

var valid = /^data[-\w.:]+$/i
var dash = /-[a-z]/g
var cap = /[A-Z]/g

function find(schema, value) {
  var normal = normalize(value)
  var prop = value
  var Type = Info

  if (normal in schema.normal) {
    return schema.property[schema.normal[normal]]
  }

  if (normal.length > 4 && normal.slice(0, 4) === data && valid.test(value)) {
    // Attribute or property.
    if (value.charAt(4) === '-') {
      prop = datasetToProperty(value)
    } else {
      value = datasetToAttribute(value)
    }

    Type = DefinedInfo
  }

  return new Type(prop, value)
}

function datasetToProperty(attribute) {
  var value = attribute.slice(5).replace(dash, camelcase)
  return data + value.charAt(0).toUpperCase() + value.slice(1)
}

function datasetToAttribute(property) {
  var value = property.slice(4)

  if (dash.test(value)) {
    return property
  }

  value = value.replace(cap, kebab)

  if (value.charAt(0) !== '-') {
    value = '-' + value
  }

  return data + value
}

function kebab($0) {
  return '-' + $0.toLowerCase()
}

function camelcase($0) {
  return $0.charAt(1).toUpperCase()
}


/***/ }),

/***/ "./node_modules/property-information/html.js":
/*!***************************************************!*\
  !*** ./node_modules/property-information/html.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var merge = __webpack_require__(/*! ./lib/util/merge */ "./node_modules/property-information/lib/util/merge.js")
var xlink = __webpack_require__(/*! ./lib/xlink */ "./node_modules/property-information/lib/xlink.js")
var xml = __webpack_require__(/*! ./lib/xml */ "./node_modules/property-information/lib/xml.js")
var xmlns = __webpack_require__(/*! ./lib/xmlns */ "./node_modules/property-information/lib/xmlns.js")
var aria = __webpack_require__(/*! ./lib/aria */ "./node_modules/property-information/lib/aria.js")
var html = __webpack_require__(/*! ./lib/html */ "./node_modules/property-information/lib/html.js")

module.exports = merge([xml, xlink, xmlns, aria, html])


/***/ }),

/***/ "./node_modules/property-information/lib/aria.js":
/*!*******************************************************!*\
  !*** ./node_modules/property-information/lib/aria.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var types = __webpack_require__(/*! ./util/types */ "./node_modules/property-information/lib/util/types.js")
var create = __webpack_require__(/*! ./util/create */ "./node_modules/property-information/lib/util/create.js")

var booleanish = types.booleanish
var number = types.number
var spaceSeparated = types.spaceSeparated

module.exports = create({
  transform: ariaTransform,
  properties: {
    ariaActiveDescendant: null,
    ariaAtomic: booleanish,
    ariaAutoComplete: null,
    ariaBusy: booleanish,
    ariaChecked: booleanish,
    ariaColCount: number,
    ariaColIndex: number,
    ariaColSpan: number,
    ariaControls: spaceSeparated,
    ariaCurrent: null,
    ariaDescribedBy: spaceSeparated,
    ariaDetails: null,
    ariaDisabled: booleanish,
    ariaDropEffect: spaceSeparated,
    ariaErrorMessage: null,
    ariaExpanded: booleanish,
    ariaFlowTo: spaceSeparated,
    ariaGrabbed: booleanish,
    ariaHasPopup: null,
    ariaHidden: booleanish,
    ariaInvalid: null,
    ariaKeyShortcuts: null,
    ariaLabel: null,
    ariaLabelledBy: spaceSeparated,
    ariaLevel: number,
    ariaLive: null,
    ariaModal: booleanish,
    ariaMultiLine: booleanish,
    ariaMultiSelectable: booleanish,
    ariaOrientation: null,
    ariaOwns: spaceSeparated,
    ariaPlaceholder: null,
    ariaPosInSet: number,
    ariaPressed: booleanish,
    ariaReadOnly: booleanish,
    ariaRelevant: null,
    ariaRequired: booleanish,
    ariaRoleDescription: spaceSeparated,
    ariaRowCount: number,
    ariaRowIndex: number,
    ariaRowSpan: number,
    ariaSelected: booleanish,
    ariaSetSize: number,
    ariaSort: null,
    ariaValueMax: number,
    ariaValueMin: number,
    ariaValueNow: number,
    ariaValueText: null,
    role: null
  }
})

function ariaTransform(_, prop) {
  return prop === 'role' ? prop : 'aria-' + prop.slice(4).toLowerCase()
}


/***/ }),

/***/ "./node_modules/property-information/lib/html.js":
/*!*******************************************************!*\
  !*** ./node_modules/property-information/lib/html.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var types = __webpack_require__(/*! ./util/types */ "./node_modules/property-information/lib/util/types.js")
var create = __webpack_require__(/*! ./util/create */ "./node_modules/property-information/lib/util/create.js")
var caseInsensitiveTransform = __webpack_require__(/*! ./util/case-insensitive-transform */ "./node_modules/property-information/lib/util/case-insensitive-transform.js")

var boolean = types.boolean
var overloadedBoolean = types.overloadedBoolean
var booleanish = types.booleanish
var number = types.number
var spaceSeparated = types.spaceSeparated
var commaSeparated = types.commaSeparated

module.exports = create({
  space: 'html',
  attributes: {
    acceptcharset: 'accept-charset',
    classname: 'class',
    htmlfor: 'for',
    httpequiv: 'http-equiv'
  },
  transform: caseInsensitiveTransform,
  mustUseProperty: ['checked', 'multiple', 'muted', 'selected'],
  properties: {
    // Standard Properties.
    abbr: null,
    accept: commaSeparated,
    acceptCharset: spaceSeparated,
    accessKey: spaceSeparated,
    action: null,
    allow: null,
    allowFullScreen: boolean,
    allowPaymentRequest: boolean,
    allowUserMedia: boolean,
    alt: null,
    as: null,
    async: boolean,
    autoCapitalize: null,
    autoComplete: spaceSeparated,
    autoFocus: boolean,
    autoPlay: boolean,
    capture: boolean,
    charSet: null,
    checked: boolean,
    cite: null,
    className: spaceSeparated,
    cols: number,
    colSpan: null,
    content: null,
    contentEditable: booleanish,
    controls: boolean,
    controlsList: spaceSeparated,
    coords: number | commaSeparated,
    crossOrigin: null,
    data: null,
    dateTime: null,
    decoding: null,
    default: boolean,
    defer: boolean,
    dir: null,
    dirName: null,
    disabled: boolean,
    download: overloadedBoolean,
    draggable: booleanish,
    encType: null,
    enterKeyHint: null,
    form: null,
    formAction: null,
    formEncType: null,
    formMethod: null,
    formNoValidate: boolean,
    formTarget: null,
    headers: spaceSeparated,
    height: number,
    hidden: boolean,
    high: number,
    href: null,
    hrefLang: null,
    htmlFor: spaceSeparated,
    httpEquiv: spaceSeparated,
    id: null,
    imageSizes: null,
    imageSrcSet: commaSeparated,
    inputMode: null,
    integrity: null,
    is: null,
    isMap: boolean,
    itemId: null,
    itemProp: spaceSeparated,
    itemRef: spaceSeparated,
    itemScope: boolean,
    itemType: spaceSeparated,
    kind: null,
    label: null,
    lang: null,
    language: null,
    list: null,
    loading: null,
    loop: boolean,
    low: number,
    manifest: null,
    max: null,
    maxLength: number,
    media: null,
    method: null,
    min: null,
    minLength: number,
    multiple: boolean,
    muted: boolean,
    name: null,
    nonce: null,
    noModule: boolean,
    noValidate: boolean,
    onAbort: null,
    onAfterPrint: null,
    onAuxClick: null,
    onBeforePrint: null,
    onBeforeUnload: null,
    onBlur: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onContextMenu: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFormData: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLanguageChange: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadEnd: null,
    onLoadStart: null,
    onMessage: null,
    onMessageError: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRejectionHandled: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onSecurityPolicyViolation: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onSlotChange: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnhandledRejection: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onWheel: null,
    open: boolean,
    optimum: number,
    pattern: null,
    ping: spaceSeparated,
    placeholder: null,
    playsInline: boolean,
    poster: null,
    preload: null,
    readOnly: boolean,
    referrerPolicy: null,
    rel: spaceSeparated,
    required: boolean,
    reversed: boolean,
    rows: number,
    rowSpan: number,
    sandbox: spaceSeparated,
    scope: null,
    scoped: boolean,
    seamless: boolean,
    selected: boolean,
    shape: null,
    size: number,
    sizes: null,
    slot: null,
    span: number,
    spellCheck: booleanish,
    src: null,
    srcDoc: null,
    srcLang: null,
    srcSet: commaSeparated,
    start: number,
    step: null,
    style: null,
    tabIndex: number,
    target: null,
    title: null,
    translate: null,
    type: null,
    typeMustMatch: boolean,
    useMap: null,
    value: booleanish,
    width: number,
    wrap: null,

    // Legacy.
    // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
    align: null, // Several. Use CSS `text-align` instead,
    aLink: null, // `<body>`. Use CSS `a:active {color}` instead
    archive: spaceSeparated, // `<object>`. List of URIs to archives
    axis: null, // `<td>` and `<th>`. Use `scope` on `<th>`
    background: null, // `<body>`. Use CSS `background-image` instead
    bgColor: null, // `<body>` and table elements. Use CSS `background-color` instead
    border: number, // `<table>`. Use CSS `border-width` instead,
    borderColor: null, // `<table>`. Use CSS `border-color` instead,
    bottomMargin: number, // `<body>`
    cellPadding: null, // `<table>`
    cellSpacing: null, // `<table>`
    char: null, // Several table elements. When `align=char`, sets the character to align on
    charOff: null, // Several table elements. When `char`, offsets the alignment
    classId: null, // `<object>`
    clear: null, // `<br>`. Use CSS `clear` instead
    code: null, // `<object>`
    codeBase: null, // `<object>`
    codeType: null, // `<object>`
    color: null, // `<font>` and `<hr>`. Use CSS instead
    compact: boolean, // Lists. Use CSS to reduce space between items instead
    declare: boolean, // `<object>`
    event: null, // `<script>`
    face: null, // `<font>`. Use CSS instead
    frame: null, // `<table>`
    frameBorder: null, // `<iframe>`. Use CSS `border` instead
    hSpace: number, // `<img>` and `<object>`
    leftMargin: number, // `<body>`
    link: null, // `<body>`. Use CSS `a:link {color: *}` instead
    longDesc: null, // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
    lowSrc: null, // `<img>`. Use a `<picture>`
    marginHeight: number, // `<body>`
    marginWidth: number, // `<body>`
    noResize: boolean, // `<frame>`
    noHref: boolean, // `<area>`. Use no href instead of an explicit `nohref`
    noShade: boolean, // `<hr>`. Use background-color and height instead of borders
    noWrap: boolean, // `<td>` and `<th>`
    object: null, // `<applet>`
    profile: null, // `<head>`
    prompt: null, // `<isindex>`
    rev: null, // `<link>`
    rightMargin: number, // `<body>`
    rules: null, // `<table>`
    scheme: null, // `<meta>`
    scrolling: booleanish, // `<frame>`. Use overflow in the child context
    standby: null, // `<object>`
    summary: null, // `<table>`
    text: null, // `<body>`. Use CSS `color` instead
    topMargin: number, // `<body>`
    valueType: null, // `<param>`
    version: null, // `<html>`. Use a doctype.
    vAlign: null, // Several. Use CSS `vertical-align` instead
    vLink: null, // `<body>`. Use CSS `a:visited {color}` instead
    vSpace: number, // `<img>` and `<object>`

    // Non-standard Properties.
    allowTransparency: null,
    autoCorrect: null,
    autoSave: null,
    disablePictureInPicture: boolean,
    disableRemotePlayback: boolean,
    prefix: null,
    property: null,
    results: number,
    security: null,
    unselectable: null
  }
})


/***/ }),

/***/ "./node_modules/property-information/lib/util/case-insensitive-transform.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/property-information/lib/util/case-insensitive-transform.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var caseSensitiveTransform = __webpack_require__(/*! ./case-sensitive-transform */ "./node_modules/property-information/lib/util/case-sensitive-transform.js")

module.exports = caseInsensitiveTransform

function caseInsensitiveTransform(attributes, property) {
  return caseSensitiveTransform(attributes, property.toLowerCase())
}


/***/ }),

/***/ "./node_modules/property-information/lib/util/case-sensitive-transform.js":
/*!********************************************************************************!*\
  !*** ./node_modules/property-information/lib/util/case-sensitive-transform.js ***!
  \********************************************************************************/
/***/ ((module) => {

"use strict";


module.exports = caseSensitiveTransform

function caseSensitiveTransform(attributes, attribute) {
  return attribute in attributes ? attributes[attribute] : attribute
}


/***/ }),

/***/ "./node_modules/property-information/lib/util/create.js":
/*!**************************************************************!*\
  !*** ./node_modules/property-information/lib/util/create.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var normalize = __webpack_require__(/*! ../../normalize */ "./node_modules/property-information/normalize.js")
var Schema = __webpack_require__(/*! ./schema */ "./node_modules/property-information/lib/util/schema.js")
var DefinedInfo = __webpack_require__(/*! ./defined-info */ "./node_modules/property-information/lib/util/defined-info.js")

module.exports = create

function create(definition) {
  var space = definition.space
  var mustUseProperty = definition.mustUseProperty || []
  var attributes = definition.attributes || {}
  var props = definition.properties
  var transform = definition.transform
  var property = {}
  var normal = {}
  var prop
  var info

  for (prop in props) {
    info = new DefinedInfo(
      prop,
      transform(attributes, prop),
      props[prop],
      space
    )

    if (mustUseProperty.indexOf(prop) !== -1) {
      info.mustUseProperty = true
    }

    property[prop] = info

    normal[normalize(prop)] = prop
    normal[normalize(info.attribute)] = prop
  }

  return new Schema(property, normal, space)
}


/***/ }),

/***/ "./node_modules/property-information/lib/util/defined-info.js":
/*!********************************************************************!*\
  !*** ./node_modules/property-information/lib/util/defined-info.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Info = __webpack_require__(/*! ./info */ "./node_modules/property-information/lib/util/info.js")
var types = __webpack_require__(/*! ./types */ "./node_modules/property-information/lib/util/types.js")

module.exports = DefinedInfo

DefinedInfo.prototype = new Info()
DefinedInfo.prototype.defined = true

var checks = [
  'boolean',
  'booleanish',
  'overloadedBoolean',
  'number',
  'commaSeparated',
  'spaceSeparated',
  'commaOrSpaceSeparated'
]
var checksLength = checks.length

function DefinedInfo(property, attribute, mask, space) {
  var index = -1
  var check

  mark(this, 'space', space)

  Info.call(this, property, attribute)

  while (++index < checksLength) {
    check = checks[index]
    mark(this, check, (mask & types[check]) === types[check])
  }
}

function mark(values, key, value) {
  if (value) {
    values[key] = value
  }
}


/***/ }),

/***/ "./node_modules/property-information/lib/util/info.js":
/*!************************************************************!*\
  !*** ./node_modules/property-information/lib/util/info.js ***!
  \************************************************************/
/***/ ((module) => {

"use strict";


module.exports = Info

var proto = Info.prototype

proto.space = null
proto.attribute = null
proto.property = null
proto.boolean = false
proto.booleanish = false
proto.overloadedBoolean = false
proto.number = false
proto.commaSeparated = false
proto.spaceSeparated = false
proto.commaOrSpaceSeparated = false
proto.mustUseProperty = false
proto.defined = false

function Info(property, attribute) {
  this.property = property
  this.attribute = attribute
}


/***/ }),

/***/ "./node_modules/property-information/lib/util/merge.js":
/*!*************************************************************!*\
  !*** ./node_modules/property-information/lib/util/merge.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var xtend = __webpack_require__(/*! xtend */ "./node_modules/xtend/immutable.js")
var Schema = __webpack_require__(/*! ./schema */ "./node_modules/property-information/lib/util/schema.js")

module.exports = merge

function merge(definitions) {
  var length = definitions.length
  var property = []
  var normal = []
  var index = -1
  var info
  var space

  while (++index < length) {
    info = definitions[index]
    property.push(info.property)
    normal.push(info.normal)
    space = info.space
  }

  return new Schema(
    xtend.apply(null, property),
    xtend.apply(null, normal),
    space
  )
}


/***/ }),

/***/ "./node_modules/property-information/lib/util/schema.js":
/*!**************************************************************!*\
  !*** ./node_modules/property-information/lib/util/schema.js ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";


module.exports = Schema

var proto = Schema.prototype

proto.space = null
proto.normal = {}
proto.property = {}

function Schema(property, normal, space) {
  this.property = property
  this.normal = normal

  if (space) {
    this.space = space
  }
}


/***/ }),

/***/ "./node_modules/property-information/lib/util/types.js":
/*!*************************************************************!*\
  !*** ./node_modules/property-information/lib/util/types.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


var powers = 0

exports.boolean = increment()
exports.booleanish = increment()
exports.overloadedBoolean = increment()
exports.number = increment()
exports.spaceSeparated = increment()
exports.commaSeparated = increment()
exports.commaOrSpaceSeparated = increment()

function increment() {
  return Math.pow(2, ++powers)
}


/***/ }),

/***/ "./node_modules/property-information/lib/xlink.js":
/*!********************************************************!*\
  !*** ./node_modules/property-information/lib/xlink.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var create = __webpack_require__(/*! ./util/create */ "./node_modules/property-information/lib/util/create.js")

module.exports = create({
  space: 'xlink',
  transform: xlinkTransform,
  properties: {
    xLinkActuate: null,
    xLinkArcRole: null,
    xLinkHref: null,
    xLinkRole: null,
    xLinkShow: null,
    xLinkTitle: null,
    xLinkType: null
  }
})

function xlinkTransform(_, prop) {
  return 'xlink:' + prop.slice(5).toLowerCase()
}


/***/ }),

/***/ "./node_modules/property-information/lib/xml.js":
/*!******************************************************!*\
  !*** ./node_modules/property-information/lib/xml.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var create = __webpack_require__(/*! ./util/create */ "./node_modules/property-information/lib/util/create.js")

module.exports = create({
  space: 'xml',
  transform: xmlTransform,
  properties: {
    xmlLang: null,
    xmlBase: null,
    xmlSpace: null
  }
})

function xmlTransform(_, prop) {
  return 'xml:' + prop.slice(3).toLowerCase()
}


/***/ }),

/***/ "./node_modules/property-information/lib/xmlns.js":
/*!********************************************************!*\
  !*** ./node_modules/property-information/lib/xmlns.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var create = __webpack_require__(/*! ./util/create */ "./node_modules/property-information/lib/util/create.js")
var caseInsensitiveTransform = __webpack_require__(/*! ./util/case-insensitive-transform */ "./node_modules/property-information/lib/util/case-insensitive-transform.js")

module.exports = create({
  space: 'xmlns',
  attributes: {
    xmlnsxlink: 'xmlns:xlink'
  },
  transform: caseInsensitiveTransform,
  properties: {
    xmlns: null,
    xmlnsXLink: null
  }
})


/***/ }),

/***/ "./node_modules/property-information/normalize.js":
/*!********************************************************!*\
  !*** ./node_modules/property-information/normalize.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


module.exports = normalize

function normalize(value) {
  return value.toLowerCase()
}


/***/ }),

/***/ "./node_modules/refractor/core.js":
/*!****************************************!*\
  !*** ./node_modules/refractor/core.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var window = __webpack_require__(/*! global/window */ "./node_modules/global/window.js");


/* global window, self */

var restore = capture()

// istanbul ignore next - Don't allow Prism to run on page load in browser or
// to start messaging from workers.
var ctx =
  typeof window === 'undefined'
    ? typeof self === 'undefined'
      ? {}
      : self
    : window

ctx.Prism = {manual: true, disableWorkerMessageHandler: true}

// Load all stuff in `prism.js` itself, except for `prism-file-highlight.js`.
// The wrapped non-leaky grammars are loaded instead of Prism’s originals.
var h = __webpack_require__(/*! hastscript */ "./node_modules/hastscript/index.js")
var decode = __webpack_require__(/*! parse-entities */ "./node_modules/parse-entities/index.js")
var Prism = __webpack_require__(/*! prismjs/components/prism-core */ "./node_modules/refractor/node_modules/prismjs/components/prism-core.js")
var markup = __webpack_require__(/*! ./lang/markup */ "./node_modules/refractor/lang/markup.js")
var css = __webpack_require__(/*! ./lang/css */ "./node_modules/refractor/lang/css.js")
var clike = __webpack_require__(/*! ./lang/clike */ "./node_modules/refractor/lang/clike.js")
var js = __webpack_require__(/*! ./lang/javascript */ "./node_modules/refractor/lang/javascript.js")

restore()

var own = {}.hasOwnProperty

// Inherit.
function Refractor() {}

Refractor.prototype = Prism

// Construct.
var refract = new Refractor()

// Expose.
module.exports = refract

// Create.
refract.highlight = highlight
refract.register = register
refract.alias = alias
refract.registered = registered
refract.listLanguages = listLanguages

// Register bundled grammars.
register(markup)
register(css)
register(clike)
register(js)

refract.util.encode = encode
refract.Token.stringify = stringify

function register(grammar) {
  if (typeof grammar !== 'function' || !grammar.displayName) {
    throw new Error('Expected `function` for `grammar`, got `' + grammar + '`')
  }

  // Do not duplicate registrations.
  if (refract.languages[grammar.displayName] === undefined) {
    grammar(refract)
  }
}

function alias(name, alias) {
  var languages = refract.languages
  var map = name
  var key
  var list
  var length
  var index

  if (alias) {
    map = {}
    map[name] = alias
  }

  for (key in map) {
    list = map[key]
    list = typeof list === 'string' ? [list] : list
    length = list.length
    index = -1

    while (++index < length) {
      languages[list[index]] = languages[key]
    }
  }
}

function highlight(value, name) {
  var sup = Prism.highlight
  var grammar

  if (typeof value !== 'string') {
    throw new Error('Expected `string` for `value`, got `' + value + '`')
  }

  // `name` is a grammar object.
  if (refract.util.type(name) === 'Object') {
    grammar = name
    name = null
  } else {
    if (typeof name !== 'string') {
      throw new Error('Expected `string` for `name`, got `' + name + '`')
    }

    if (own.call(refract.languages, name)) {
      grammar = refract.languages[name]
    } else {
      throw new Error('Unknown language: `' + name + '` is not registered')
    }
  }

  return sup.call(this, value, grammar, name)
}

function registered(language) {
  if (typeof language !== 'string') {
    throw new Error('Expected `string` for `language`, got `' + language + '`')
  }

  return own.call(refract.languages, language)
}

function listLanguages() {
  var languages = refract.languages
  var list = []
  var language

  for (language in languages) {
    if (
      own.call(languages, language) &&
      typeof languages[language] === 'object'
    ) {
      list.push(language)
    }
  }

  return list
}

function stringify(value, language, parent) {
  var env

  if (typeof value === 'string') {
    return {type: 'text', value: value}
  }

  if (refract.util.type(value) === 'Array') {
    return stringifyAll(value, language)
  }

  env = {
    type: value.type,
    content: refract.Token.stringify(value.content, language, parent),
    tag: 'span',
    classes: ['token', value.type],
    attributes: {},
    language: language,
    parent: parent
  }

  if (value.alias) {
    env.classes = env.classes.concat(value.alias)
  }

  refract.hooks.run('wrap', env)

  return h(
    env.tag + '.' + env.classes.join('.'),
    attributes(env.attributes),
    env.content
  )
}

function stringifyAll(values, language) {
  var result = []
  var length = values.length
  var index = -1
  var value

  while (++index < length) {
    value = values[index]

    if (value !== '' && value !== null && value !== undefined) {
      result.push(value)
    }
  }

  index = -1
  length = result.length

  while (++index < length) {
    value = result[index]
    result[index] = refract.Token.stringify(value, language, result)
  }

  return result
}

function encode(tokens) {
  return tokens
}

function attributes(attrs) {
  var key

  for (key in attrs) {
    attrs[key] = decode(attrs[key])
  }

  return attrs
}

function capture() {
  var defined = 'Prism' in __webpack_require__.g
  /* istanbul ignore next */
  var current = defined ? __webpack_require__.g.Prism : undefined

  return restore

  function restore() {
    /* istanbul ignore else - Clean leaks after Prism. */
    if (defined) {
      __webpack_require__.g.Prism = current
    } else {
      delete __webpack_require__.g.Prism
    }

    defined = undefined
    current = undefined
  }
}


/***/ }),

/***/ "./node_modules/refractor/lang/clike.js":
/*!**********************************************!*\
  !*** ./node_modules/refractor/lang/clike.js ***!
  \**********************************************/
/***/ ((module) => {

"use strict";


module.exports = clike
clike.displayName = 'clike'
clike.aliases = []
function clike(Prism) {
  Prism.languages.clike = {
    comment: [
      {
        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
        lookbehind: true
      },
      {
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: true,
        greedy: true
      }
    ],
    string: {
      pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: true
    },
    'class-name': {
      pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
      lookbehind: true,
      inside: {
        punctuation: /[.\\]/
      }
    },
    keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    boolean: /\b(?:true|false)\b/,
    function: /\w+(?=\()/,
    number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
    operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
    punctuation: /[{}[\];(),.:]/
  }
}


/***/ }),

/***/ "./node_modules/refractor/lang/css.js":
/*!********************************************!*\
  !*** ./node_modules/refractor/lang/css.js ***!
  \********************************************/
/***/ ((module) => {

"use strict";


module.exports = css
css.displayName = 'css'
css.aliases = []
function css(Prism) {
  ;(function(Prism) {
    var string = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/
    Prism.languages.css = {
      comment: /\/\*[\s\S]*?\*\//,
      atrule: {
        pattern: /@[\w-]+[\s\S]*?(?:;|(?=\s*\{))/,
        inside: {
          rule: /@[\w-]+/ // See rest below
        }
      },
      url: {
        pattern: RegExp('url\\((?:' + string.source + '|[^\n\r()]*)\\)', 'i'),
        inside: {
          function: /^url/i,
          punctuation: /^\(|\)$/
        }
      },
      selector: RegExp(
        '[^{}\\s](?:[^{};"\']|' + string.source + ')*?(?=\\s*\\{)'
      ),
      string: {
        pattern: string,
        greedy: true
      },
      property: /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
      important: /!important\b/i,
      function: /[-a-z0-9]+(?=\()/i,
      punctuation: /[(){};:,]/
    }
    Prism.languages.css['atrule'].inside.rest = Prism.languages.css
    var markup = Prism.languages.markup
    if (markup) {
      markup.tag.addInlined('style', 'css')
      Prism.languages.insertBefore(
        'inside',
        'attr-value',
        {
          'style-attr': {
            pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
            inside: {
              'attr-name': {
                pattern: /^\s*style/i,
                inside: markup.tag.inside
              },
              punctuation: /^\s*=\s*['"]|['"]\s*$/,
              'attr-value': {
                pattern: /.+/i,
                inside: Prism.languages.css
              }
            },
            alias: 'language-css'
          }
        },
        markup.tag
      )
    }
  })(Prism)
}


/***/ }),

/***/ "./node_modules/refractor/lang/javascript.js":
/*!***************************************************!*\
  !*** ./node_modules/refractor/lang/javascript.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = javascript
javascript.displayName = 'javascript'
javascript.aliases = ['js']
function javascript(Prism) {
  Prism.languages.javascript = Prism.languages.extend('clike', {
    'class-name': [
      Prism.languages.clike['class-name'],
      {
        pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
        lookbehind: true
      }
    ],
    keyword: [
      {
        pattern: /((?:^|})\s*)(?:catch|finally)\b/,
        lookbehind: true
      },
      {
        pattern: /(^|[^.])\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
        lookbehind: true
      }
    ],
    number: /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
    // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
    function: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    operator: /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
  })
  Prism.languages.javascript[
    'class-name'
  ][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/
  Prism.languages.insertBefore('javascript', 'keyword', {
    regex: {
      pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=\s*($|[\r\n,.;})\]]))/,
      lookbehind: true,
      greedy: true
    },
    // This must be declared before keyword because we use "function" inside the look-forward
    'function-variable': {
      pattern: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
      alias: 'function'
    },
    parameter: [
      {
        pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
        lookbehind: true,
        inside: Prism.languages.javascript
      },
      {
        pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
        inside: Prism.languages.javascript
      },
      {
        pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
        lookbehind: true,
        inside: Prism.languages.javascript
      },
      {
        pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
        lookbehind: true,
        inside: Prism.languages.javascript
      }
    ],
    constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
  })
  Prism.languages.insertBefore('javascript', 'string', {
    'template-string': {
      pattern: /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|(?!\${)[^\\`])*`/,
      greedy: true,
      inside: {
        'template-punctuation': {
          pattern: /^`|`$/,
          alias: 'string'
        },
        interpolation: {
          pattern: /((?:^|[^\\])(?:\\{2})*)\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
          lookbehind: true,
          inside: {
            'interpolation-punctuation': {
              pattern: /^\${|}$/,
              alias: 'punctuation'
            },
            rest: Prism.languages.javascript
          }
        },
        string: /[\s\S]+/
      }
    }
  })
  if (Prism.languages.markup) {
    Prism.languages.markup.tag.addInlined('script', 'javascript')
  }
  Prism.languages.js = Prism.languages.javascript
}


/***/ }),

/***/ "./node_modules/refractor/lang/markup.js":
/*!***********************************************!*\
  !*** ./node_modules/refractor/lang/markup.js ***!
  \***********************************************/
/***/ ((module) => {

"use strict";


module.exports = markup
markup.displayName = 'markup'
markup.aliases = ['xml', 'html', 'mathml', 'svg']
function markup(Prism) {
  Prism.languages.markup = {
    comment: /<!--[\s\S]*?-->/,
    prolog: /<\?[\s\S]+?\?>/,
    doctype: /<!DOCTYPE[\s\S]+?>/i,
    cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
    tag: {
      pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/i,
      greedy: true,
      inside: {
        tag: {
          pattern: /^<\/?[^\s>\/]+/i,
          inside: {
            punctuation: /^<\/?/,
            namespace: /^[^\s>\/:]+:/
          }
        },
        'attr-value': {
          pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/i,
          inside: {
            punctuation: [
              /^=/,
              {
                pattern: /^(\s*)["']|["']$/,
                lookbehind: true
              }
            ]
          }
        },
        punctuation: /\/?>/,
        'attr-name': {
          pattern: /[^\s>\/]+/,
          inside: {
            namespace: /^[^\s>\/:]+:/
          }
        }
      }
    },
    entity: /&#?[\da-z]{1,8};/i
  }
  Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] =
    Prism.languages.markup['entity'] // Plugin to make entity title show the real entity, idea by Roman Komarov
  Prism.hooks.add('wrap', function(env) {
    if (env.type === 'entity') {
      env.attributes['title'] = env.content.value.replace(/&amp;/, '&')
    }
  })
  Object.defineProperty(Prism.languages.markup.tag, 'addInlined', {
    /**
     * Adds an inlined language to markup.
     *
     * An example of an inlined language is CSS with `<style>` tags.
     *
     * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
     * case insensitive.
     * @param {string} lang The language key.
     * @example
     * addInlined('style', 'css');
     */
    value: function addInlined(tagName, lang) {
      var includedCdataInside = {}
      includedCdataInside['language-' + lang] = {
        pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
        lookbehind: true,
        inside: Prism.languages[lang]
      }
      includedCdataInside['cdata'] = /^<!\[CDATA\[|\]\]>$/i
      var inside = {
        'included-cdata': {
          pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
          inside: includedCdataInside
        }
      }
      inside['language-' + lang] = {
        pattern: /[\s\S]+/,
        inside: Prism.languages[lang]
      }
      var def = {}
      def[tagName] = {
        pattern: RegExp(
          /(<__[\s\S]*?>)(?:<!\[CDATA\[[\s\S]*?\]\]>\s*|[\s\S])*?(?=<\/__>)/.source.replace(
            /__/g,
            tagName
          ),
          'i'
        ),
        lookbehind: true,
        greedy: true,
        inside: inside
      }
      Prism.languages.insertBefore('markup', 'cdata', def)
    }
  })
  Prism.languages.xml = Prism.languages.extend('markup', {})
  Prism.languages.html = Prism.languages.markup
  Prism.languages.mathml = Prism.languages.markup
  Prism.languages.svg = Prism.languages.markup
}


/***/ }),

/***/ "./node_modules/refractor/node_modules/prismjs/components/prism-core.js":
/*!******************************************************************************!*\
  !*** ./node_modules/refractor/node_modules/prismjs/components/prism-core.js ***!
  \******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var window = __webpack_require__(/*! global/window */ "./node_modules/global/window.js");
var _self = (typeof window !== 'undefined')
	? window   // if in browser
	: (
		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
		? self // if in worker
		: {}   // if in node js
	);

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

var Prism = (function (_self){

// Private helper vars
var lang = /\blang(?:uage)?-([\w-]+)\b/i;
var uniqueId = 0;

var _ = {
	manual: _self.Prism && _self.Prism.manual,
	disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
	util: {
		encode: function (tokens) {
			if (tokens instanceof Token) {
				return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
			} else if (Array.isArray(tokens)) {
				return tokens.map(_.util.encode);
			} else {
				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
			}
		},

		type: function (o) {
			return Object.prototype.toString.call(o).slice(8, -1);
		},

		objId: function (obj) {
			if (!obj['__id']) {
				Object.defineProperty(obj, '__id', { value: ++uniqueId });
			}
			return obj['__id'];
		},

		// Deep clone a language definition (e.g. to extend it)
		clone: function deepClone(o, visited) {
			var clone, id, type = _.util.type(o);
			visited = visited || {};

			switch (type) {
				case 'Object':
					id = _.util.objId(o);
					if (visited[id]) {
						return visited[id];
					}
					clone = {};
					visited[id] = clone;

					for (var key in o) {
						if (o.hasOwnProperty(key)) {
							clone[key] = deepClone(o[key], visited);
						}
					}

					return clone;

				case 'Array':
					id = _.util.objId(o);
					if (visited[id]) {
						return visited[id];
					}
					clone = [];
					visited[id] = clone;

					o.forEach(function (v, i) {
						clone[i] = deepClone(v, visited);
					});

					return clone;

				default:
					return o;
			}
		}
	},

	languages: {
		extend: function (id, redef) {
			var lang = _.util.clone(_.languages[id]);

			for (var key in redef) {
				lang[key] = redef[key];
			}

			return lang;
		},

		/**
		 * Insert a token before another token in a language literal
		 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
		 * we cannot just provide an object, we need an object and a key.
		 * @param inside The key (or language id) of the parent
		 * @param before The key to insert before.
		 * @param insert Object with the key/value pairs to insert
		 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
		 */
		insertBefore: function (inside, before, insert, root) {
			root = root || _.languages;
			var grammar = root[inside];
			var ret = {};

			for (var token in grammar) {
				if (grammar.hasOwnProperty(token)) {

					if (token == before) {
						for (var newToken in insert) {
							if (insert.hasOwnProperty(newToken)) {
								ret[newToken] = insert[newToken];
							}
						}
					}

					// Do not insert token which also occur in insert. See #1525
					if (!insert.hasOwnProperty(token)) {
						ret[token] = grammar[token];
					}
				}
			}

			var old = root[inside];
			root[inside] = ret;

			// Update references in other language definitions
			_.languages.DFS(_.languages, function(key, value) {
				if (value === old && key != inside) {
					this[key] = ret;
				}
			});

			return ret;
		},

		// Traverse a language definition with Depth First Search
		DFS: function DFS(o, callback, type, visited) {
			visited = visited || {};

			var objId = _.util.objId;

			for (var i in o) {
				if (o.hasOwnProperty(i)) {
					callback.call(o, i, o[i], type || i);

					var property = o[i],
					    propertyType = _.util.type(property);

					if (propertyType === 'Object' && !visited[objId(property)]) {
						visited[objId(property)] = true;
						DFS(property, callback, null, visited);
					}
					else if (propertyType === 'Array' && !visited[objId(property)]) {
						visited[objId(property)] = true;
						DFS(property, callback, i, visited);
					}
				}
			}
		}
	},
	plugins: {},

	highlightAll: function(async, callback) {
		_.highlightAllUnder(document, async, callback);
	},

	highlightAllUnder: function(container, async, callback) {
		var env = {
			callback: callback,
			selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
		};

		_.hooks.run('before-highlightall', env);

		var elements = container.querySelectorAll(env.selector);

		for (var i=0, element; element = elements[i++];) {
			_.highlightElement(element, async === true, env.callback);
		}
	},

	highlightElement: function(element, async, callback) {
		// Find language
		var language = 'none', grammar, parent = element;

		while (parent && !lang.test(parent.className)) {
			parent = parent.parentNode;
		}

		if (parent) {
			language = (parent.className.match(lang) || [,'none'])[1].toLowerCase();
			grammar = _.languages[language];
		}

		// Set language on the element, if not present
		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

		if (element.parentNode) {
			// Set language on the parent, for styling
			parent = element.parentNode;

			if (/pre/i.test(parent.nodeName)) {
				parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
			}
		}

		var code = element.textContent;

		var env = {
			element: element,
			language: language,
			grammar: grammar,
			code: code
		};

		var insertHighlightedCode = function (highlightedCode) {
			env.highlightedCode = highlightedCode;

			_.hooks.run('before-insert', env);

			env.element.innerHTML = env.highlightedCode;

			_.hooks.run('after-highlight', env);
			_.hooks.run('complete', env);
			callback && callback.call(env.element);
		}

		_.hooks.run('before-sanity-check', env);

		if (!env.code) {
			_.hooks.run('complete', env);
			return;
		}

		_.hooks.run('before-highlight', env);

		if (!env.grammar) {
			insertHighlightedCode(_.util.encode(env.code));
			return;
		}

		if (async && _self.Worker) {
			var worker = new Worker(_.filename);

			worker.onmessage = function(evt) {
				insertHighlightedCode(evt.data);
			};

			worker.postMessage(JSON.stringify({
				language: env.language,
				code: env.code,
				immediateClose: true
			}));
		}
		else {
			insertHighlightedCode(_.highlight(env.code, env.grammar, env.language));
		}
	},

	highlight: function (text, grammar, language) {
		var env = {
			code: text,
			grammar: grammar,
			language: language
		};
		_.hooks.run('before-tokenize', env);
		env.tokens = _.tokenize(env.code, env.grammar);
		_.hooks.run('after-tokenize', env);
		return Token.stringify(_.util.encode(env.tokens), env.language);
	},

	matchGrammar: function (text, strarr, grammar, index, startPos, oneshot, target) {
		for (var token in grammar) {
			if(!grammar.hasOwnProperty(token) || !grammar[token]) {
				continue;
			}

			if (token == target) {
				return;
			}

			var patterns = grammar[token];
			patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];

			for (var j = 0; j < patterns.length; ++j) {
				var pattern = patterns[j],
					inside = pattern.inside,
					lookbehind = !!pattern.lookbehind,
					greedy = !!pattern.greedy,
					lookbehindLength = 0,
					alias = pattern.alias;

				if (greedy && !pattern.pattern.global) {
					// Without the global flag, lastIndex won't work
					var flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
					pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
				}

				pattern = pattern.pattern || pattern;

				// Don’t cache length as it changes during the loop
				for (var i = index, pos = startPos; i < strarr.length; pos += strarr[i].length, ++i) {

					var str = strarr[i];

					if (strarr.length > text.length) {
						// Something went terribly wrong, ABORT, ABORT!
						return;
					}

					if (str instanceof Token) {
						continue;
					}

					if (greedy && i != strarr.length - 1) {
						pattern.lastIndex = pos;
						var match = pattern.exec(text);
						if (!match) {
							break;
						}

						var from = match.index + (lookbehind ? match[1].length : 0),
						    to = match.index + match[0].length,
						    k = i,
						    p = pos;

						for (var len = strarr.length; k < len && (p < to || (!strarr[k].type && !strarr[k - 1].greedy)); ++k) {
							p += strarr[k].length;
							// Move the index i to the element in strarr that is closest to from
							if (from >= p) {
								++i;
								pos = p;
							}
						}

						// If strarr[i] is a Token, then the match starts inside another Token, which is invalid
						if (strarr[i] instanceof Token) {
							continue;
						}

						// Number of tokens to delete and replace with the new match
						delNum = k - i;
						str = text.slice(pos, p);
						match.index -= pos;
					} else {
						pattern.lastIndex = 0;

						var match = pattern.exec(str),
							delNum = 1;
					}

					if (!match) {
						if (oneshot) {
							break;
						}

						continue;
					}

					if(lookbehind) {
						lookbehindLength = match[1] ? match[1].length : 0;
					}

					var from = match.index + lookbehindLength,
					    match = match[0].slice(lookbehindLength),
					    to = from + match.length,
					    before = str.slice(0, from),
					    after = str.slice(to);

					var args = [i, delNum];

					if (before) {
						++i;
						pos += before.length;
						args.push(before);
					}

					var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);

					args.push(wrapped);

					if (after) {
						args.push(after);
					}

					Array.prototype.splice.apply(strarr, args);

					if (delNum != 1)
						_.matchGrammar(text, strarr, grammar, i, pos, true, token);

					if (oneshot)
						break;
				}
			}
		}
	},

	tokenize: function(text, grammar) {
		var strarr = [text];

		var rest = grammar.rest;

		if (rest) {
			for (var token in rest) {
				grammar[token] = rest[token];
			}

			delete grammar.rest;
		}

		_.matchGrammar(text, strarr, grammar, 0, 0, false);

		return strarr;
	},

	hooks: {
		all: {},

		add: function (name, callback) {
			var hooks = _.hooks.all;

			hooks[name] = hooks[name] || [];

			hooks[name].push(callback);
		},

		run: function (name, env) {
			var callbacks = _.hooks.all[name];

			if (!callbacks || !callbacks.length) {
				return;
			}

			for (var i=0, callback; callback = callbacks[i++];) {
				callback(env);
			}
		}
	},

	Token: Token
};

_self.Prism = _;

function Token(type, content, alias, matchedStr, greedy) {
	this.type = type;
	this.content = content;
	this.alias = alias;
	// Copy of the full string this token was created from
	this.length = (matchedStr || "").length|0;
	this.greedy = !!greedy;
}

Token.stringify = function(o, language) {
	if (typeof o == 'string') {
		return o;
	}

	if (Array.isArray(o)) {
		return o.map(function(element) {
			return Token.stringify(element, language);
		}).join('');
	}

	var env = {
		type: o.type,
		content: Token.stringify(o.content, language),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		language: language
	};

	if (o.alias) {
		var aliases = Array.isArray(o.alias) ? o.alias : [o.alias];
		Array.prototype.push.apply(env.classes, aliases);
	}

	_.hooks.run('wrap', env);

	var attributes = Object.keys(env.attributes).map(function(name) {
		return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
	}).join(' ');

	return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>';
};

if (!_self.document) {
	if (!_self.addEventListener) {
		// in Node.js
		return _;
	}

	if (!_.disableWorkerMessageHandler) {
		// In worker
		_self.addEventListener('message', function (evt) {
			var message = JSON.parse(evt.data),
				lang = message.language,
				code = message.code,
				immediateClose = message.immediateClose;

			_self.postMessage(_.highlight(code, _.languages[lang], lang));
			if (immediateClose) {
				_self.close();
			}
		}, false);
	}

	return _;
}

//Get current script and highlight
var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();

if (script) {
	_.filename = script.src;

	if (!_.manual && !script.hasAttribute('data-manual')) {
		if(document.readyState !== "loading") {
			if (window.requestAnimationFrame) {
				window.requestAnimationFrame(_.highlightAll);
			} else {
				window.setTimeout(_.highlightAll, 16);
			}
		}
		else {
			document.addEventListener('DOMContentLoaded', _.highlightAll);
		}
	}
}

return _;

})(_self);

if ( true && module.exports) {
	module.exports = Prism;
}

// hack for components to work correctly in node.js
if (typeof __webpack_require__.g !== 'undefined') {
	__webpack_require__.g.Prism = Prism;
}


/***/ }),

/***/ "./node_modules/space-separated-tokens/index.js":
/*!******************************************************!*\
  !*** ./node_modules/space-separated-tokens/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.parse = parse
exports.stringify = stringify

var empty = ''
var space = ' '
var whiteSpace = /[ \t\n\r\f]+/g

function parse(value) {
  var input = String(value || empty).trim()
  return input === empty ? [] : input.split(whiteSpace)
}

function stringify(values) {
  return values.join(space).trim()
}


/***/ }),

/***/ "./node_modules/xtend/immutable.js":
/*!*****************************************!*\
  !*** ./node_modules/xtend/immutable.js ***!
  \*****************************************/
/***/ ((module) => {

module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}


/***/ }),

/***/ "./node_modules/character-entities-legacy/index.json":
/*!***********************************************************!*\
  !*** ./node_modules/character-entities-legacy/index.json ***!
  \***********************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"AElig":"Æ","AMP":"&","Aacute":"Á","Acirc":"Â","Agrave":"À","Aring":"Å","Atilde":"Ã","Auml":"Ä","COPY":"©","Ccedil":"Ç","ETH":"Ð","Eacute":"É","Ecirc":"Ê","Egrave":"È","Euml":"Ë","GT":">","Iacute":"Í","Icirc":"Î","Igrave":"Ì","Iuml":"Ï","LT":"<","Ntilde":"Ñ","Oacute":"Ó","Ocirc":"Ô","Ograve":"Ò","Oslash":"Ø","Otilde":"Õ","Ouml":"Ö","QUOT":"\\"","REG":"®","THORN":"Þ","Uacute":"Ú","Ucirc":"Û","Ugrave":"Ù","Uuml":"Ü","Yacute":"Ý","aacute":"á","acirc":"â","acute":"´","aelig":"æ","agrave":"à","amp":"&","aring":"å","atilde":"ã","auml":"ä","brvbar":"¦","ccedil":"ç","cedil":"¸","cent":"¢","copy":"©","curren":"¤","deg":"°","divide":"÷","eacute":"é","ecirc":"ê","egrave":"è","eth":"ð","euml":"ë","frac12":"½","frac14":"¼","frac34":"¾","gt":">","iacute":"í","icirc":"î","iexcl":"¡","igrave":"ì","iquest":"¿","iuml":"ï","laquo":"«","lt":"<","macr":"¯","micro":"µ","middot":"·","nbsp":" ","not":"¬","ntilde":"ñ","oacute":"ó","ocirc":"ô","ograve":"ò","ordf":"ª","ordm":"º","oslash":"ø","otilde":"õ","ouml":"ö","para":"¶","plusmn":"±","pound":"£","quot":"\\"","raquo":"»","reg":"®","sect":"§","shy":"­","sup1":"¹","sup2":"²","sup3":"³","szlig":"ß","thorn":"þ","times":"×","uacute":"ú","ucirc":"û","ugrave":"ù","uml":"¨","uuml":"ü","yacute":"ý","yen":"¥","yuml":"ÿ"}');

/***/ }),

/***/ "./node_modules/character-reference-invalid/index.json":
/*!*************************************************************!*\
  !*** ./node_modules/character-reference-invalid/index.json ***!
  \*************************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"0":"�","128":"€","130":"‚","131":"ƒ","132":"„","133":"…","134":"†","135":"‡","136":"ˆ","137":"‰","138":"Š","139":"‹","140":"Œ","142":"Ž","145":"‘","146":"’","147":"“","148":"”","149":"•","150":"–","151":"—","152":"˜","153":"™","154":"š","155":"›","156":"œ","158":"ž","159":"Ÿ"}');

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyL3JlZnJhY3Rvci1jb3JlLWltcG9ydC5leHBsb3Jlci5kZXYuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQVk7O0FBRVosYUFBYTtBQUNiLGlCQUFpQjs7QUFFakI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7O0FDbkRZOztBQUVaOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsVUFBVTtBQUNWOzs7Ozs7Ozs7Ozs7QUMxQ1k7O0FBRVosV0FBVyxtQkFBTyxDQUFDLDhFQUEyQjtBQUM5QyxnQkFBZ0IsbUJBQU8sQ0FBQyx3RkFBZ0M7QUFDeEQsb0JBQW9CLG1CQUFPLENBQUMsa0ZBQTBCO0FBQ3RELGFBQWEsMkdBQXVDO0FBQ3BELGFBQWEsMkdBQXVDOztBQUVwRDs7QUFFQSxZQUFZOztBQUVaO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7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QkFBTyxDQUFDLDJFQUFjO0FBQ2xDLGFBQWEsbUJBQU8sQ0FBQyw2RUFBZTtBQUNwQywrQkFBK0IsbUJBQU8sQ0FBQyxxSEFBbUM7O0FBRTFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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UDs7Ozs7Ozs7Ozs7O0FDdGlCWTs7QUFFWixhQUFhO0FBQ2IsaUJBQWlCOztBQUVqQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ2hCQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLG9CQUFvQixzQkFBc0I7QUFDMUM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AemVzdHktaW8vZXhwbG9yZXIvLi9ub2RlX21vZHVsZXMvY29tbWEtc2VwYXJhdGVkLXRva2Vucy9pbmRleC5qcyIsIndlYnBhY2s6Ly9AemVzdHktaW8vZXhwbG9yZXIvLi9ub2RlX21vZHVsZXMvaGFzdC11dGlsLXBhcnNlLXNlbGVjdG9yL2luZGV4LmpzIiwid2VicGFjazovL0B6ZXN0eS1pby9leHBsb3Jlci8uL25vZGVfbW9kdWxlcy9oYXN0c2NyaXB0L2ZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vQHplc3R5LWlvL2V4cGxvcmVyLy4vbm9kZV9tb2R1bGVzL2hhc3RzY3JpcHQvaHRtbC5qcyIsIndlYnBhY2s6Ly9AemVzdHktaW8vZXhwbG9yZXIvLi9ub2RlX21vZHVsZXMvaGFzdHNjcmlwdC9pbmRleC5qcyIsIndlYnBhY2s6Ly9AemVzdHktaW8vZXhwbG9yZXIvLi9ub2RlX21vZHVsZXMvaXMtYWxwaGFiZXRpY2FsL2luZGV4LmpzIiwid2VicGFjazovL0B6ZXN0eS1pby9leHBsb3Jlci8uL25vZGVfbW9kdWxlcy9pcy1hbHBoYW51bWVyaWNhbC9pbmRleC5qcyIsIndlYnBhY2s6Ly9AemVzdHktaW8vZXhwbG9yZXIvLi9ub2RlX21vZHVsZXMvaXMtZGVjaW1hbC9pbmRleC5qcyIsIndlYnBhY2s6Ly9AemVzdHktaW8vZXhwbG9yZXIvLi9ub2RlX21vZHVsZXMvaXMtaGV4YWRlY2ltYWwvaW5kZXguanMiLCJ3ZWJwYWNrOi8vQHplc3R5LWlvL2V4cGxvcmVyLy4vbm9kZV9tb2R1bGVzL3BhcnNlLWVudGl0aWVzL2RlY29kZS1lbnRpdHkuYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly9AemVzdHktaW8vZXhwbG9yZXIvLi9ub2RlX21vZHVsZXMvcGFyc2UtZW50aXRpZXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vQHplc3R5LWlvL2V4cGxvcmVyLy4vbm9kZV9tb2R1bGVzL3Byb3BlcnR5LWluZm9ybWF0aW9uL2ZpbmQuanMiLCJ3ZWJwYWNrOi8vQHplc3R5LWlvL2V4cGxvcmVyLy4vbm9kZV9tb2R1bGVzL3Byb3BlcnR5LWluZm9ybWF0aW9uL2h0bWwuanMiLCJ3ZWJwYWNrOi8vQHplc3R5LWlvL2V4cGxvcmVyLy4vbm9kZV9tb2R1bGVzL3Byb3BlcnR5LWluZm9ybWF0aW9uL2xpYi9hcmlhLmpzIiwid2VicGFjazovL0B6ZXN0eS1pby9leHBsb3Jlci8uL25vZGVfbW9kdWxlcy9wcm9wZXJ0eS1pbmZvcm1hdGlvbi9saWIvaHRtbC5qcyIsIndlYnBhY2s6Ly9AemVzdHktaW8vZXhwbG9yZXIvLi9ub2RlX21vZHVsZXMvcHJvcGVydHktaW5mb3JtYXRpb24vbGliL3V0aWwvY2FzZS1pbnNlbnNpdGl2ZS10cmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vQHplc3R5LWlvL2V4cGxvcmVyLy4vbm9kZV9tb2R1bGVzL3Byb3BlcnR5LWluZm9ybWF0aW9uL2xpYi91dGlsL2Nhc2Utc2Vuc2l0aXZlLXRyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9AemVzdHktaW8vZXhwbG9yZXIvLi9ub2RlX21vZHVsZXMvcHJvcGVydHktaW5mb3JtYXRpb24vbGliL3V0aWwvY3JlYXRlLmpzIiwid2VicGFjazovL0B6ZXN0eS1pby9leHBsb3Jlci8uL25vZGVfbW9kdWxlcy9wcm9wZXJ0eS1pbmZvcm1hdGlvbi9saWIvdXRpbC9kZWZpbmVkLWluZm8uanMiLCJ3ZWJwYWNrOi8vQHplc3R5LWlvL2V4cGxvcmVyLy4vbm9kZV9tb2R1bGVzL3Byb3BlcnR5LWluZm9ybWF0aW9uL2xpYi91dGlsL2luZm8uanMiLCJ3ZWJwYWNrOi8vQHplc3R5LWlvL2V4cGxvcmVyLy4vbm9kZV9tb2R1bGVzL3Byb3BlcnR5LWluZm9ybWF0aW9uL2xpYi91dGlsL21lcmdlLmpzIiwid2VicGFjazovL0B6ZXN0eS1pby9leHBsb3Jlci8uL25vZGVfbW9kdWxlcy9wcm9wZXJ0eS1pbmZvcm1hdGlvbi9saWIvdXRpbC9zY2hlbWEuanMiLCJ3ZWJwYWNrOi8vQHplc3R5LWlvL2V4cGxvcmVyLy4vbm9kZV9tb2R1bGVzL3Byb3BlcnR5LWluZm9ybWF0aW9uL2xpYi91dGlsL3R5cGVzLmpzIiwid2VicGFjazovL0B6ZXN0eS1pby9leHBsb3Jlci8uL25vZGVfbW9kdWxlcy9wcm9wZXJ0eS1pbmZvcm1hdGlvbi9saWIveGxpbmsuanMiLCJ3ZWJwYWNrOi8vQHplc3R5LWlvL2V4cGxvcmVyLy4vbm9kZV9tb2R1bGVzL3Byb3BlcnR5LWluZm9ybWF0aW9uL2xpYi94bWwuanMiLCJ3ZWJwYWNrOi8vQHplc3R5LWlvL2V4cGxvcmVyLy4vbm9kZV9tb2R1bGVzL3Byb3BlcnR5LWluZm9ybWF0aW9uL2xpYi94bWxucy5qcyIsIndlYnBhY2s6Ly9AemVzdHktaW8vZXhwbG9yZXIvLi9ub2RlX21vZHVsZXMvcHJvcGVydHktaW5mb3JtYXRpb24vbm9ybWFsaXplLmpzIiwid2VicGFjazovL0B6ZXN0eS1pby9leHBsb3Jlci8uL25vZGVfbW9kdWxlcy9yZWZyYWN0b3IvY29yZS5qcyIsIndlYnBhY2s6Ly9AemVzdHktaW8vZXhwbG9yZXIvLi9ub2RlX21vZHVsZXMvcmVmcmFjdG9yL2xhbmcvY2xpa2UuanMiLCJ3ZWJwYWNrOi8vQHplc3R5LWlvL2V4cGxvcmVyLy4vbm9kZV9tb2R1bGVzL3JlZnJhY3Rvci9sYW5nL2Nzcy5qcyIsIndlYnBhY2s6Ly9AemVzdHktaW8vZXhwbG9yZXIvLi9ub2RlX21vZHVsZXMvcmVmcmFjdG9yL2xhbmcvamF2YXNjcmlwdC5qcyIsIndlYnBhY2s6Ly9AemVzdHktaW8vZXhwbG9yZXIvLi9ub2RlX21vZHVsZXMvcmVmcmFjdG9yL2xhbmcvbWFya3VwLmpzIiwid2VicGFjazovL0B6ZXN0eS1pby9leHBsb3Jlci8uL25vZGVfbW9kdWxlcy9yZWZyYWN0b3Ivbm9kZV9tb2R1bGVzL3ByaXNtanMvY29tcG9uZW50cy9wcmlzbS1jb3JlLmpzIiwid2VicGFjazovL0B6ZXN0eS1pby9leHBsb3Jlci8uL25vZGVfbW9kdWxlcy9zcGFjZS1zZXBhcmF0ZWQtdG9rZW5zL2luZGV4LmpzIiwid2VicGFjazovL0B6ZXN0eS1pby9leHBsb3Jlci8uL25vZGVfbW9kdWxlcy94dGVuZC9pbW11dGFibGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmV4cG9ydHMucGFyc2UgPSBwYXJzZVxuZXhwb3J0cy5zdHJpbmdpZnkgPSBzdHJpbmdpZnlcblxudmFyIGNvbW1hID0gJywnXG52YXIgc3BhY2UgPSAnICdcbnZhciBlbXB0eSA9ICcnXG5cbi8vIFBhcnNlIGNvbW1hLXNlcGFyYXRlZCB0b2tlbnMgdG8gYW4gYXJyYXkuXG5mdW5jdGlvbiBwYXJzZSh2YWx1ZSkge1xuICB2YXIgdmFsdWVzID0gW11cbiAgdmFyIGlucHV0ID0gU3RyaW5nKHZhbHVlIHx8IGVtcHR5KVxuICB2YXIgaW5kZXggPSBpbnB1dC5pbmRleE9mKGNvbW1hKVxuICB2YXIgbGFzdEluZGV4ID0gMFxuICB2YXIgZW5kID0gZmFsc2VcbiAgdmFyIHZhbFxuXG4gIHdoaWxlICghZW5kKSB7XG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgaW5kZXggPSBpbnB1dC5sZW5ndGhcbiAgICAgIGVuZCA9IHRydWVcbiAgICB9XG5cbiAgICB2YWwgPSBpbnB1dC5zbGljZShsYXN0SW5kZXgsIGluZGV4KS50cmltKClcblxuICAgIGlmICh2YWwgfHwgIWVuZCkge1xuICAgICAgdmFsdWVzLnB1c2godmFsKVxuICAgIH1cblxuICAgIGxhc3RJbmRleCA9IGluZGV4ICsgMVxuICAgIGluZGV4ID0gaW5wdXQuaW5kZXhPZihjb21tYSwgbGFzdEluZGV4KVxuICB9XG5cbiAgcmV0dXJuIHZhbHVlc1xufVxuXG4vLyBDb21waWxlIGFuIGFycmF5IHRvIGNvbW1hLXNlcGFyYXRlZCB0b2tlbnMuXG4vLyBgb3B0aW9ucy5wYWRMZWZ0YCAoZGVmYXVsdDogYHRydWVgKSBwYWRzIGEgc3BhY2UgbGVmdCBvZiBlYWNoIHRva2VuLCBhbmRcbi8vIGBvcHRpb25zLnBhZFJpZ2h0YCAoZGVmYXVsdDogYGZhbHNlYCkgcGFkcyBhIHNwYWNlIHRvIHRoZSByaWdodCBvZiBlYWNoIHRva2VuLlxuZnVuY3Rpb24gc3RyaW5naWZ5KHZhbHVlcywgb3B0aW9ucykge1xuICB2YXIgc2V0dGluZ3MgPSBvcHRpb25zIHx8IHt9XG4gIHZhciBsZWZ0ID0gc2V0dGluZ3MucGFkTGVmdCA9PT0gZmFsc2UgPyBlbXB0eSA6IHNwYWNlXG4gIHZhciByaWdodCA9IHNldHRpbmdzLnBhZFJpZ2h0ID8gc3BhY2UgOiBlbXB0eVxuXG4gIC8vIEVuc3VyZSB0aGUgbGFzdCBlbXB0eSBlbnRyeSBpcyBzZWVuLlxuICBpZiAodmFsdWVzW3ZhbHVlcy5sZW5ndGggLSAxXSA9PT0gZW1wdHkpIHtcbiAgICB2YWx1ZXMgPSB2YWx1ZXMuY29uY2F0KGVtcHR5KVxuICB9XG5cbiAgcmV0dXJuIHZhbHVlcy5qb2luKHJpZ2h0ICsgY29tbWEgKyBsZWZ0KS50cmltKClcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlXG5cbnZhciBzZWFyY2ggPSAvWyMuXS9nXG5cbi8vIENyZWF0ZSBhIGhhc3QgZWxlbWVudCBmcm9tIGEgc2ltcGxlIENTUyBzZWxlY3Rvci5cbmZ1bmN0aW9uIHBhcnNlKHNlbGVjdG9yLCBkZWZhdWx0VGFnTmFtZSkge1xuICB2YXIgdmFsdWUgPSBzZWxlY3RvciB8fCAnJ1xuICB2YXIgbmFtZSA9IGRlZmF1bHRUYWdOYW1lIHx8ICdkaXYnXG4gIHZhciBwcm9wcyA9IHt9XG4gIHZhciBzdGFydCA9IDBcbiAgdmFyIHN1YnZhbHVlXG4gIHZhciBwcmV2aW91c1xuICB2YXIgbWF0Y2hcblxuICB3aGlsZSAoc3RhcnQgPCB2YWx1ZS5sZW5ndGgpIHtcbiAgICBzZWFyY2gubGFzdEluZGV4ID0gc3RhcnRcbiAgICBtYXRjaCA9IHNlYXJjaC5leGVjKHZhbHVlKVxuICAgIHN1YnZhbHVlID0gdmFsdWUuc2xpY2Uoc3RhcnQsIG1hdGNoID8gbWF0Y2guaW5kZXggOiB2YWx1ZS5sZW5ndGgpXG5cbiAgICBpZiAoc3VidmFsdWUpIHtcbiAgICAgIGlmICghcHJldmlvdXMpIHtcbiAgICAgICAgbmFtZSA9IHN1YnZhbHVlXG4gICAgICB9IGVsc2UgaWYgKHByZXZpb3VzID09PSAnIycpIHtcbiAgICAgICAgcHJvcHMuaWQgPSBzdWJ2YWx1ZVxuICAgICAgfSBlbHNlIGlmIChwcm9wcy5jbGFzc05hbWUpIHtcbiAgICAgICAgcHJvcHMuY2xhc3NOYW1lLnB1c2goc3VidmFsdWUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcm9wcy5jbGFzc05hbWUgPSBbc3VidmFsdWVdXG4gICAgICB9XG5cbiAgICAgIHN0YXJ0ICs9IHN1YnZhbHVlLmxlbmd0aFxuICAgIH1cblxuICAgIGlmIChtYXRjaCkge1xuICAgICAgcHJldmlvdXMgPSBtYXRjaFswXVxuICAgICAgc3RhcnQrK1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7dHlwZTogJ2VsZW1lbnQnLCB0YWdOYW1lOiBuYW1lLCBwcm9wZXJ0aWVzOiBwcm9wcywgY2hpbGRyZW46IFtdfVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBmaW5kID0gcmVxdWlyZSgncHJvcGVydHktaW5mb3JtYXRpb24vZmluZCcpXG52YXIgbm9ybWFsaXplID0gcmVxdWlyZSgncHJvcGVydHktaW5mb3JtYXRpb24vbm9ybWFsaXplJylcbnZhciBwYXJzZVNlbGVjdG9yID0gcmVxdWlyZSgnaGFzdC11dGlsLXBhcnNlLXNlbGVjdG9yJylcbnZhciBzcGFjZXMgPSByZXF1aXJlKCdzcGFjZS1zZXBhcmF0ZWQtdG9rZW5zJykucGFyc2VcbnZhciBjb21tYXMgPSByZXF1aXJlKCdjb21tYS1zZXBhcmF0ZWQtdG9rZW5zJykucGFyc2VcblxubW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5XG5cbnZhciBvd24gPSB7fS5oYXNPd25Qcm9wZXJ0eVxuXG5mdW5jdGlvbiBmYWN0b3J5KHNjaGVtYSwgZGVmYXVsdFRhZ05hbWUsIGNhc2VTZW5zaXRpdmUpIHtcbiAgdmFyIGFkanVzdCA9IGNhc2VTZW5zaXRpdmUgPyBjcmVhdGVBZGp1c3RNYXAoY2FzZVNlbnNpdGl2ZSkgOiBudWxsXG5cbiAgcmV0dXJuIGhcblxuICAvLyBIeXBlcnNjcmlwdCBjb21wYXRpYmxlIERTTCBmb3IgY3JlYXRpbmcgdmlydHVhbCBoYXN0IHRyZWVzLlxuICBmdW5jdGlvbiBoKHNlbGVjdG9yLCBwcm9wZXJ0aWVzKSB7XG4gICAgdmFyIG5vZGUgPSBwYXJzZVNlbGVjdG9yKHNlbGVjdG9yLCBkZWZhdWx0VGFnTmFtZSlcbiAgICB2YXIgY2hpbGRyZW4gPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpXG4gICAgdmFyIG5hbWUgPSBub2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgIHZhciBwcm9wZXJ0eVxuXG4gICAgbm9kZS50YWdOYW1lID0gYWRqdXN0ICYmIG93bi5jYWxsKGFkanVzdCwgbmFtZSkgPyBhZGp1c3RbbmFtZV0gOiBuYW1lXG5cbiAgICBpZiAocHJvcGVydGllcyAmJiBpc0NoaWxkcmVuKHByb3BlcnRpZXMsIG5vZGUpKSB7XG4gICAgICBjaGlsZHJlbi51bnNoaWZ0KHByb3BlcnRpZXMpXG4gICAgICBwcm9wZXJ0aWVzID0gbnVsbFxuICAgIH1cblxuICAgIGlmIChwcm9wZXJ0aWVzKSB7XG4gICAgICBmb3IgKHByb3BlcnR5IGluIHByb3BlcnRpZXMpIHtcbiAgICAgICAgYWRkUHJvcGVydHkobm9kZS5wcm9wZXJ0aWVzLCBwcm9wZXJ0eSwgcHJvcGVydGllc1twcm9wZXJ0eV0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgYWRkQ2hpbGQobm9kZS5jaGlsZHJlbiwgY2hpbGRyZW4pXG5cbiAgICBpZiAobm9kZS50YWdOYW1lID09PSAndGVtcGxhdGUnKSB7XG4gICAgICBub2RlLmNvbnRlbnQgPSB7dHlwZTogJ3Jvb3QnLCBjaGlsZHJlbjogbm9kZS5jaGlsZHJlbn1cbiAgICAgIG5vZGUuY2hpbGRyZW4gPSBbXVxuICAgIH1cblxuICAgIHJldHVybiBub2RlXG4gIH1cblxuICBmdW5jdGlvbiBhZGRQcm9wZXJ0eShwcm9wZXJ0aWVzLCBrZXksIHZhbHVlKSB7XG4gICAgdmFyIGluZm9cbiAgICB2YXIgcHJvcGVydHlcbiAgICB2YXIgcmVzdWx0XG5cbiAgICAvLyBJZ25vcmUgbnVsbHkgYW5kIE5hTiB2YWx1ZXMuXG4gICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpbmZvID0gZmluZChzY2hlbWEsIGtleSlcbiAgICBwcm9wZXJ0eSA9IGluZm8ucHJvcGVydHlcbiAgICByZXN1bHQgPSB2YWx1ZVxuXG4gICAgLy8gSGFuZGxlIGxpc3QgdmFsdWVzLlxuICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnc3RyaW5nJykge1xuICAgICAgaWYgKGluZm8uc3BhY2VTZXBhcmF0ZWQpIHtcbiAgICAgICAgcmVzdWx0ID0gc3BhY2VzKHJlc3VsdClcbiAgICAgIH0gZWxzZSBpZiAoaW5mby5jb21tYVNlcGFyYXRlZCkge1xuICAgICAgICByZXN1bHQgPSBjb21tYXMocmVzdWx0KVxuICAgICAgfSBlbHNlIGlmIChpbmZvLmNvbW1hT3JTcGFjZVNlcGFyYXRlZCkge1xuICAgICAgICByZXN1bHQgPSBzcGFjZXMoY29tbWFzKHJlc3VsdCkuam9pbignICcpKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFjY2VwdCBgb2JqZWN0YCBvbiBzdHlsZS5cbiAgICBpZiAocHJvcGVydHkgPT09ICdzdHlsZScgJiYgdHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgcmVzdWx0ID0gc3R5bGUocmVzdWx0KVxuICAgIH1cblxuICAgIC8vIENsYXNzLW5hbWVzICh3aGljaCBjYW4gYmUgYWRkZWQgYm90aCBvbiB0aGUgYHNlbGVjdG9yYCBhbmQgaGVyZSkuXG4gICAgaWYgKHByb3BlcnR5ID09PSAnY2xhc3NOYW1lJyAmJiBwcm9wZXJ0aWVzLmNsYXNzTmFtZSkge1xuICAgICAgcmVzdWx0ID0gcHJvcGVydGllcy5jbGFzc05hbWUuY29uY2F0KHJlc3VsdClcbiAgICB9XG5cbiAgICBwcm9wZXJ0aWVzW3Byb3BlcnR5XSA9IHBhcnNlUHJpbWl0aXZlcyhpbmZvLCBwcm9wZXJ0eSwgcmVzdWx0KVxuICB9XG59XG5cbmZ1bmN0aW9uIGlzQ2hpbGRyZW4odmFsdWUsIG5vZGUpIHtcbiAgcmV0dXJuIChcbiAgICB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8XG4gICAgJ2xlbmd0aCcgaW4gdmFsdWUgfHxcbiAgICBpc05vZGUobm9kZS50YWdOYW1lLCB2YWx1ZSlcbiAgKVxufVxuXG5mdW5jdGlvbiBpc05vZGUodGFnTmFtZSwgdmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB2YWx1ZS50eXBlXG5cbiAgaWYgKHRhZ05hbWUgPT09ICdpbnB1dCcgfHwgIXR5cGUgfHwgdHlwZW9mIHR5cGUgIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlLmNoaWxkcmVuID09PSAnb2JqZWN0JyAmJiAnbGVuZ3RoJyBpbiB2YWx1ZS5jaGlsZHJlbikge1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICB0eXBlID0gdHlwZS50b0xvd2VyQ2FzZSgpXG5cbiAgaWYgKHRhZ05hbWUgPT09ICdidXR0b24nKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHR5cGUgIT09ICdtZW51JyAmJlxuICAgICAgdHlwZSAhPT0gJ3N1Ym1pdCcgJiZcbiAgICAgIHR5cGUgIT09ICdyZXNldCcgJiZcbiAgICAgIHR5cGUgIT09ICdidXR0b24nXG4gICAgKVxuICB9XG5cbiAgcmV0dXJuICd2YWx1ZScgaW4gdmFsdWVcbn1cblxuZnVuY3Rpb24gYWRkQ2hpbGQobm9kZXMsIHZhbHVlKSB7XG4gIHZhciBpbmRleFxuICB2YXIgbGVuZ3RoXG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgIG5vZGVzLnB1c2goe3R5cGU6ICd0ZXh0JywgdmFsdWU6IFN0cmluZyh2YWx1ZSl9KVxuICAgIHJldHVyblxuICB9XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgJ2xlbmd0aCcgaW4gdmFsdWUpIHtcbiAgICBpbmRleCA9IC0xXG4gICAgbGVuZ3RoID0gdmFsdWUubGVuZ3RoXG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgYWRkQ2hpbGQobm9kZXMsIHZhbHVlW2luZGV4XSlcbiAgICB9XG5cbiAgICByZXR1cm5cbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnIHx8ICEoJ3R5cGUnIGluIHZhbHVlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgbm9kZSwgbm9kZXMsIG9yIHN0cmluZywgZ290IGAnICsgdmFsdWUgKyAnYCcpXG4gIH1cblxuICBub2Rlcy5wdXNoKHZhbHVlKVxufVxuXG4vLyBQYXJzZSBhIChsaXN0IG9mKSBwcmltaXRpdmVzLlxuZnVuY3Rpb24gcGFyc2VQcmltaXRpdmVzKGluZm8sIG5hbWUsIHZhbHVlKSB7XG4gIHZhciBpbmRleFxuICB2YXIgbGVuZ3RoXG4gIHZhciByZXN1bHRcblxuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JyB8fCAhKCdsZW5ndGgnIGluIHZhbHVlKSkge1xuICAgIHJldHVybiBwYXJzZVByaW1pdGl2ZShpbmZvLCBuYW1lLCB2YWx1ZSlcbiAgfVxuXG4gIGxlbmd0aCA9IHZhbHVlLmxlbmd0aFxuICBpbmRleCA9IC0xXG4gIHJlc3VsdCA9IFtdXG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICByZXN1bHRbaW5kZXhdID0gcGFyc2VQcmltaXRpdmUoaW5mbywgbmFtZSwgdmFsdWVbaW5kZXhdKVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG4vLyBQYXJzZSBhIHNpbmdsZSBwcmltaXRpdmVzLlxuZnVuY3Rpb24gcGFyc2VQcmltaXRpdmUoaW5mbywgbmFtZSwgdmFsdWUpIHtcbiAgdmFyIHJlc3VsdCA9IHZhbHVlXG5cbiAgaWYgKGluZm8ubnVtYmVyIHx8IGluZm8ucG9zaXRpdmVOdW1iZXIpIHtcbiAgICBpZiAoIWlzTmFOKHJlc3VsdCkgJiYgcmVzdWx0ICE9PSAnJykge1xuICAgICAgcmVzdWx0ID0gTnVtYmVyKHJlc3VsdClcbiAgICB9XG4gIH0gZWxzZSBpZiAoaW5mby5ib29sZWFuIHx8IGluZm8ub3ZlcmxvYWRlZEJvb2xlYW4pIHtcbiAgICAvLyBBY2NlcHQgYGJvb2xlYW5gIGFuZCBgc3RyaW5nYC5cbiAgICBpZiAoXG4gICAgICB0eXBlb2YgcmVzdWx0ID09PSAnc3RyaW5nJyAmJlxuICAgICAgKHJlc3VsdCA9PT0gJycgfHwgbm9ybWFsaXplKHZhbHVlKSA9PT0gbm9ybWFsaXplKG5hbWUpKVxuICAgICkge1xuICAgICAgcmVzdWx0ID0gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHRcbn1cblxuZnVuY3Rpb24gc3R5bGUodmFsdWUpIHtcbiAgdmFyIHJlc3VsdCA9IFtdXG4gIHZhciBrZXlcblxuICBmb3IgKGtleSBpbiB2YWx1ZSkge1xuICAgIHJlc3VsdC5wdXNoKFtrZXksIHZhbHVlW2tleV1dLmpvaW4oJzogJykpXG4gIH1cblxuICByZXR1cm4gcmVzdWx0LmpvaW4oJzsgJylcbn1cblxuZnVuY3Rpb24gY3JlYXRlQWRqdXN0TWFwKHZhbHVlcykge1xuICB2YXIgbGVuZ3RoID0gdmFsdWVzLmxlbmd0aFxuICB2YXIgaW5kZXggPSAtMVxuICB2YXIgcmVzdWx0ID0ge31cbiAgdmFyIHZhbHVlXG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YWx1ZSA9IHZhbHVlc1tpbmRleF1cbiAgICByZXN1bHRbdmFsdWUudG9Mb3dlckNhc2UoKV0gPSB2YWx1ZVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdFxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBzY2hlbWEgPSByZXF1aXJlKCdwcm9wZXJ0eS1pbmZvcm1hdGlvbi9odG1sJylcbnZhciBmYWN0b3J5ID0gcmVxdWlyZSgnLi9mYWN0b3J5JylcblxudmFyIGh0bWwgPSBmYWN0b3J5KHNjaGVtYSwgJ2RpdicpXG5odG1sLmRpc3BsYXlOYW1lID0gJ2h0bWwnXG5cbm1vZHVsZS5leHBvcnRzID0gaHRtbFxuIiwiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9odG1sJylcbiIsIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFscGhhYmV0aWNhbFxuXG4vLyBDaGVjayBpZiB0aGUgZ2l2ZW4gY2hhcmFjdGVyIGNvZGUsIG9yIHRoZSBjaGFyYWN0ZXIgY29kZSBhdCB0aGUgZmlyc3Rcbi8vIGNoYXJhY3RlciwgaXMgYWxwaGFiZXRpY2FsLlxuZnVuY3Rpb24gYWxwaGFiZXRpY2FsKGNoYXJhY3Rlcikge1xuICB2YXIgY29kZSA9IHR5cGVvZiBjaGFyYWN0ZXIgPT09ICdzdHJpbmcnID8gY2hhcmFjdGVyLmNoYXJDb2RlQXQoMCkgOiBjaGFyYWN0ZXJcblxuICByZXR1cm4gKFxuICAgIChjb2RlID49IDk3ICYmIGNvZGUgPD0gMTIyKSAvKiBhLXogKi8gfHxcbiAgICAoY29kZSA+PSA2NSAmJiBjb2RlIDw9IDkwKSAvKiBBLVogKi9cbiAgKVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBhbHBoYWJldGljYWwgPSByZXF1aXJlKCdpcy1hbHBoYWJldGljYWwnKVxudmFyIGRlY2ltYWwgPSByZXF1aXJlKCdpcy1kZWNpbWFsJylcblxubW9kdWxlLmV4cG9ydHMgPSBhbHBoYW51bWVyaWNhbFxuXG4vLyBDaGVjayBpZiB0aGUgZ2l2ZW4gY2hhcmFjdGVyIGNvZGUsIG9yIHRoZSBjaGFyYWN0ZXIgY29kZSBhdCB0aGUgZmlyc3Rcbi8vIGNoYXJhY3RlciwgaXMgYWxwaGFudW1lcmljYWwuXG5mdW5jdGlvbiBhbHBoYW51bWVyaWNhbChjaGFyYWN0ZXIpIHtcbiAgcmV0dXJuIGFscGhhYmV0aWNhbChjaGFyYWN0ZXIpIHx8IGRlY2ltYWwoY2hhcmFjdGVyKVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gZGVjaW1hbFxuXG4vLyBDaGVjayBpZiB0aGUgZ2l2ZW4gY2hhcmFjdGVyIGNvZGUsIG9yIHRoZSBjaGFyYWN0ZXIgY29kZSBhdCB0aGUgZmlyc3Rcbi8vIGNoYXJhY3RlciwgaXMgZGVjaW1hbC5cbmZ1bmN0aW9uIGRlY2ltYWwoY2hhcmFjdGVyKSB7XG4gIHZhciBjb2RlID0gdHlwZW9mIGNoYXJhY3RlciA9PT0gJ3N0cmluZycgPyBjaGFyYWN0ZXIuY2hhckNvZGVBdCgwKSA6IGNoYXJhY3RlclxuXG4gIHJldHVybiBjb2RlID49IDQ4ICYmIGNvZGUgPD0gNTcgLyogMC05ICovXG59XG4iLCIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSBoZXhhZGVjaW1hbFxuXG4vLyBDaGVjayBpZiB0aGUgZ2l2ZW4gY2hhcmFjdGVyIGNvZGUsIG9yIHRoZSBjaGFyYWN0ZXIgY29kZSBhdCB0aGUgZmlyc3Rcbi8vIGNoYXJhY3RlciwgaXMgaGV4YWRlY2ltYWwuXG5mdW5jdGlvbiBoZXhhZGVjaW1hbChjaGFyYWN0ZXIpIHtcbiAgdmFyIGNvZGUgPSB0eXBlb2YgY2hhcmFjdGVyID09PSAnc3RyaW5nJyA/IGNoYXJhY3Rlci5jaGFyQ29kZUF0KDApIDogY2hhcmFjdGVyXG5cbiAgcmV0dXJuIChcbiAgICAoY29kZSA+PSA5NyAvKiBhICovICYmIGNvZGUgPD0gMTAyKSAvKiB6ICovIHx8XG4gICAgKGNvZGUgPj0gNjUgLyogQSAqLyAmJiBjb2RlIDw9IDcwKSAvKiBaICovIHx8XG4gICAgKGNvZGUgPj0gNDggLyogQSAqLyAmJiBjb2RlIDw9IDU3KSAvKiBaICovXG4gIClcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG4vKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cblxudmFyIGVsXG5cbnZhciBzZW1pY29sb24gPSA1OSAvLyAgJzsnXG5cbm1vZHVsZS5leHBvcnRzID0gZGVjb2RlRW50aXR5XG5cbmZ1bmN0aW9uIGRlY29kZUVudGl0eShjaGFyYWN0ZXJzKSB7XG4gIHZhciBlbnRpdHkgPSAnJicgKyBjaGFyYWN0ZXJzICsgJzsnXG4gIHZhciBjaGFyXG5cbiAgZWwgPSBlbCB8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJylcbiAgZWwuaW5uZXJIVE1MID0gZW50aXR5XG4gIGNoYXIgPSBlbC50ZXh0Q29udGVudFxuXG4gIC8vIFNvbWUgZW50aXRpZXMgZG8gbm90IHJlcXVpcmUgdGhlIGNsb3Npbmcgc2VtaWNvbG9uIChgJm5vdGAgLSBmb3IgaW5zdGFuY2UpLFxuICAvLyB3aGljaCBsZWFkcyB0byBzaXR1YXRpb25zIHdoZXJlIHBhcnNpbmcgdGhlIGFzc3VtZWQgZW50aXR5IG9mICZub3RpdDsgd2lsbFxuICAvLyByZXN1bHQgaW4gdGhlIHN0cmluZyBgwqxpdDtgLiAgV2hlbiB3ZSBlbmNvdW50ZXIgYSB0cmFpbGluZyBzZW1pY29sb24gYWZ0ZXJcbiAgLy8gcGFyc2luZyBhbmQgdGhlIGVudGl0eSB0byBkZWNvZGUgd2FzIG5vdCBhIHNlbWljb2xvbiAoYCZzZW1pO2ApLCB3ZSBjYW5cbiAgLy8gYXNzdW1lIHRoYXQgdGhlIG1hdGNoaW5nIHdhcyBpbmNvbXBsZXRlXG4gIGlmIChjaGFyLmNoYXJDb2RlQXQoY2hhci5sZW5ndGggLSAxKSA9PT0gc2VtaWNvbG9uICYmIGNoYXJhY3RlcnMgIT09ICdzZW1pJykge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgLy8gSWYgdGhlIGRlY29kZWQgc3RyaW5nIGlzIGVxdWFsIHRvIHRoZSBpbnB1dCwgdGhlIGVudGl0eSB3YXMgbm90IHZhbGlkXG4gIHJldHVybiBjaGFyID09PSBlbnRpdHkgPyBmYWxzZSA6IGNoYXJcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG52YXIgbGVnYWN5ID0gcmVxdWlyZSgnY2hhcmFjdGVyLWVudGl0aWVzLWxlZ2FjeScpXG52YXIgaW52YWxpZCA9IHJlcXVpcmUoJ2NoYXJhY3Rlci1yZWZlcmVuY2UtaW52YWxpZCcpXG52YXIgZGVjaW1hbCA9IHJlcXVpcmUoJ2lzLWRlY2ltYWwnKVxudmFyIGhleGFkZWNpbWFsID0gcmVxdWlyZSgnaXMtaGV4YWRlY2ltYWwnKVxudmFyIGFscGhhbnVtZXJpY2FsID0gcmVxdWlyZSgnaXMtYWxwaGFudW1lcmljYWwnKVxudmFyIGRlY29kZUVudGl0eSA9IHJlcXVpcmUoJy4vZGVjb2RlLWVudGl0eScpXG5cbm1vZHVsZS5leHBvcnRzID0gcGFyc2VFbnRpdGllc1xuXG52YXIgb3duID0ge30uaGFzT3duUHJvcGVydHlcbnZhciBmcm9tQ2hhckNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlXG52YXIgbm9vcCA9IEZ1bmN0aW9uLnByb3RvdHlwZVxuXG4vLyBEZWZhdWx0IHNldHRpbmdzLlxudmFyIGRlZmF1bHRzID0ge1xuICB3YXJuaW5nOiBudWxsLFxuICByZWZlcmVuY2U6IG51bGwsXG4gIHRleHQ6IG51bGwsXG4gIHdhcm5pbmdDb250ZXh0OiBudWxsLFxuICByZWZlcmVuY2VDb250ZXh0OiBudWxsLFxuICB0ZXh0Q29udGV4dDogbnVsbCxcbiAgcG9zaXRpb246IHt9LFxuICBhZGRpdGlvbmFsOiBudWxsLFxuICBhdHRyaWJ1dGU6IGZhbHNlLFxuICBub25UZXJtaW5hdGVkOiB0cnVlXG59XG5cbi8vIENoYXJhY3RlcnMuXG52YXIgdGFiID0gOSAvLyAnXFx0J1xudmFyIGxpbmVGZWVkID0gMTAgLy8gJ1xcbidcbnZhciBmb3JtRmVlZCA9IDEyIC8vICAnXFxmJ1xudmFyIHNwYWNlID0gMzIgLy8gJyAnXG52YXIgYW1wZXJzYW5kID0gMzggLy8gICcmJ1xudmFyIHNlbWljb2xvbiA9IDU5IC8vICAnOydcbnZhciBsZXNzVGhhbiA9IDYwIC8vICAnPCdcbnZhciBlcXVhbHNUbyA9IDYxIC8vICAnPSdcbnZhciBudW1iZXJTaWduID0gMzUgLy8gICcjJ1xudmFyIHVwcGVyY2FzZVggPSA4OCAvLyAgJ1gnXG52YXIgbG93ZXJjYXNlWCA9IDEyMCAvLyAgJ3gnXG52YXIgcmVwbGFjZW1lbnRDaGFyYWN0ZXIgPSA2NTUzMyAvLyAn77+9J1xuXG4vLyBSZWZlcmVuY2UgdHlwZXMuXG52YXIgbmFtZSA9ICduYW1lZCdcbnZhciBoZXhhID0gJ2hleGFkZWNpbWFsJ1xudmFyIGRlY2kgPSAnZGVjaW1hbCdcblxuLy8gTWFwIG9mIGJhc2VzLlxudmFyIGJhc2VzID0ge31cblxuYmFzZXNbaGV4YV0gPSAxNlxuYmFzZXNbZGVjaV0gPSAxMFxuXG4vLyBNYXAgb2YgdHlwZXMgdG8gdGVzdHMuXG4vLyBFYWNoIHR5cGUgb2YgY2hhcmFjdGVyIHJlZmVyZW5jZSBhY2NlcHRzIGRpZmZlcmVudCBjaGFyYWN0ZXJzLlxuLy8gVGhpcyB0ZXN0IGlzIHVzZWQgdG8gZGV0ZWN0IHdoZXRoZXIgYSByZWZlcmVuY2UgaGFzIGVuZGVkIChhcyB0aGUgc2VtaWNvbG9uXG4vLyBpcyBub3Qgc3RyaWN0bHkgbmVlZGVkKS5cbnZhciB0ZXN0cyA9IHt9XG5cbnRlc3RzW25hbWVdID0gYWxwaGFudW1lcmljYWxcbnRlc3RzW2RlY2ldID0gZGVjaW1hbFxudGVzdHNbaGV4YV0gPSBoZXhhZGVjaW1hbFxuXG4vLyBXYXJuaW5nIHR5cGVzLlxudmFyIG5hbWVkTm90VGVybWluYXRlZCA9IDFcbnZhciBudW1lcmljTm90VGVybWluYXRlZCA9IDJcbnZhciBuYW1lZEVtcHR5ID0gM1xudmFyIG51bWVyaWNFbXB0eSA9IDRcbnZhciBuYW1lZFVua25vd24gPSA1XG52YXIgbnVtZXJpY0Rpc2FsbG93ZWQgPSA2XG52YXIgbnVtZXJpY1Byb2hpYml0ZWQgPSA3XG5cbi8vIFdhcm5pbmcgbWVzc2FnZXMuXG52YXIgbWVzc2FnZXMgPSB7fVxuXG5tZXNzYWdlc1tuYW1lZE5vdFRlcm1pbmF0ZWRdID1cbiAgJ05hbWVkIGNoYXJhY3RlciByZWZlcmVuY2VzIG11c3QgYmUgdGVybWluYXRlZCBieSBhIHNlbWljb2xvbidcbm1lc3NhZ2VzW251bWVyaWNOb3RUZXJtaW5hdGVkXSA9XG4gICdOdW1lcmljIGNoYXJhY3RlciByZWZlcmVuY2VzIG11c3QgYmUgdGVybWluYXRlZCBieSBhIHNlbWljb2xvbidcbm1lc3NhZ2VzW25hbWVkRW1wdHldID0gJ05hbWVkIGNoYXJhY3RlciByZWZlcmVuY2VzIGNhbm5vdCBiZSBlbXB0eSdcbm1lc3NhZ2VzW251bWVyaWNFbXB0eV0gPSAnTnVtZXJpYyBjaGFyYWN0ZXIgcmVmZXJlbmNlcyBjYW5ub3QgYmUgZW1wdHknXG5tZXNzYWdlc1tuYW1lZFVua25vd25dID0gJ05hbWVkIGNoYXJhY3RlciByZWZlcmVuY2VzIG11c3QgYmUga25vd24nXG5tZXNzYWdlc1tudW1lcmljRGlzYWxsb3dlZF0gPVxuICAnTnVtZXJpYyBjaGFyYWN0ZXIgcmVmZXJlbmNlcyBjYW5ub3QgYmUgZGlzYWxsb3dlZCdcbm1lc3NhZ2VzW251bWVyaWNQcm9oaWJpdGVkXSA9XG4gICdOdW1lcmljIGNoYXJhY3RlciByZWZlcmVuY2VzIGNhbm5vdCBiZSBvdXRzaWRlIHRoZSBwZXJtaXNzaWJsZSBVbmljb2RlIHJhbmdlJ1xuXG4vLyBXcmFwIHRvIGVuc3VyZSBjbGVhbiBwYXJhbWV0ZXJzIGFyZSBnaXZlbiB0byBgcGFyc2VgLlxuZnVuY3Rpb24gcGFyc2VFbnRpdGllcyh2YWx1ZSwgb3B0aW9ucykge1xuICB2YXIgc2V0dGluZ3MgPSB7fVxuICB2YXIgb3B0aW9uXG4gIHZhciBrZXlcblxuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge31cbiAgfVxuXG4gIGZvciAoa2V5IGluIGRlZmF1bHRzKSB7XG4gICAgb3B0aW9uID0gb3B0aW9uc1trZXldXG4gICAgc2V0dGluZ3Nba2V5XSA9XG4gICAgICBvcHRpb24gPT09IG51bGwgfHwgb3B0aW9uID09PSB1bmRlZmluZWQgPyBkZWZhdWx0c1trZXldIDogb3B0aW9uXG4gIH1cblxuICBpZiAoc2V0dGluZ3MucG9zaXRpb24uaW5kZW50IHx8IHNldHRpbmdzLnBvc2l0aW9uLnN0YXJ0KSB7XG4gICAgc2V0dGluZ3MuaW5kZW50ID0gc2V0dGluZ3MucG9zaXRpb24uaW5kZW50IHx8IFtdXG4gICAgc2V0dGluZ3MucG9zaXRpb24gPSBzZXR0aW5ncy5wb3NpdGlvbi5zdGFydFxuICB9XG5cbiAgcmV0dXJuIHBhcnNlKHZhbHVlLCBzZXR0aW5ncylcbn1cblxuLy8gUGFyc2UgZW50aXRpZXMuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29tcGxleGl0eVxuZnVuY3Rpb24gcGFyc2UodmFsdWUsIHNldHRpbmdzKSB7XG4gIHZhciBhZGRpdGlvbmFsID0gc2V0dGluZ3MuYWRkaXRpb25hbFxuICB2YXIgbm9uVGVybWluYXRlZCA9IHNldHRpbmdzLm5vblRlcm1pbmF0ZWRcbiAgdmFyIGhhbmRsZVRleHQgPSBzZXR0aW5ncy50ZXh0XG4gIHZhciBoYW5kbGVSZWZlcmVuY2UgPSBzZXR0aW5ncy5yZWZlcmVuY2VcbiAgdmFyIGhhbmRsZVdhcm5pbmcgPSBzZXR0aW5ncy53YXJuaW5nXG4gIHZhciB0ZXh0Q29udGV4dCA9IHNldHRpbmdzLnRleHRDb250ZXh0XG4gIHZhciByZWZlcmVuY2VDb250ZXh0ID0gc2V0dGluZ3MucmVmZXJlbmNlQ29udGV4dFxuICB2YXIgd2FybmluZ0NvbnRleHQgPSBzZXR0aW5ncy53YXJuaW5nQ29udGV4dFxuICB2YXIgcG9zID0gc2V0dGluZ3MucG9zaXRpb25cbiAgdmFyIGluZGVudCA9IHNldHRpbmdzLmluZGVudCB8fCBbXVxuICB2YXIgbGVuZ3RoID0gdmFsdWUubGVuZ3RoXG4gIHZhciBpbmRleCA9IDBcbiAgdmFyIGxpbmVzID0gLTFcbiAgdmFyIGNvbHVtbiA9IHBvcy5jb2x1bW4gfHwgMVxuICB2YXIgbGluZSA9IHBvcy5saW5lIHx8IDFcbiAgdmFyIHF1ZXVlID0gJydcbiAgdmFyIHJlc3VsdCA9IFtdXG4gIHZhciBlbnRpdHlDaGFyYWN0ZXJzXG4gIHZhciBuYW1lZEVudGl0eVxuICB2YXIgdGVybWluYXRlZFxuICB2YXIgY2hhcmFjdGVyc1xuICB2YXIgY2hhcmFjdGVyXG4gIHZhciByZWZlcmVuY2VcbiAgdmFyIGZvbGxvd2luZ1xuICB2YXIgd2FybmluZ1xuICB2YXIgcmVhc29uXG4gIHZhciBvdXRwdXRcbiAgdmFyIGVudGl0eVxuICB2YXIgYmVnaW5cbiAgdmFyIHN0YXJ0XG4gIHZhciB0eXBlXG4gIHZhciB0ZXN0XG4gIHZhciBwcmV2XG4gIHZhciBuZXh0XG4gIHZhciBkaWZmXG4gIHZhciBlbmRcblxuICBpZiAodHlwZW9mIGFkZGl0aW9uYWwgPT09ICdzdHJpbmcnKSB7XG4gICAgYWRkaXRpb25hbCA9IGFkZGl0aW9uYWwuY2hhckNvZGVBdCgwKVxuICB9XG5cbiAgLy8gQ2FjaGUgdGhlIGN1cnJlbnQgcG9pbnQuXG4gIHByZXYgPSBub3coKVxuXG4gIC8vIFdyYXAgYGhhbmRsZVdhcm5pbmdgLlxuICB3YXJuaW5nID0gaGFuZGxlV2FybmluZyA/IHBhcnNlRXJyb3IgOiBub29wXG5cbiAgLy8gRW5zdXJlIHRoZSBhbGdvcml0aG0gd2Fsa3Mgb3ZlciB0aGUgZmlyc3QgY2hhcmFjdGVyIGFuZCB0aGUgZW5kIChpbmNsdXNpdmUpLlxuICBpbmRleC0tXG4gIGxlbmd0aCsrXG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAvLyBJZiB0aGUgcHJldmlvdXMgY2hhcmFjdGVyIHdhcyBhIG5ld2xpbmUuXG4gICAgaWYgKGNoYXJhY3RlciA9PT0gbGluZUZlZWQpIHtcbiAgICAgIGNvbHVtbiA9IGluZGVudFtsaW5lc10gfHwgMVxuICAgIH1cblxuICAgIGNoYXJhY3RlciA9IHZhbHVlLmNoYXJDb2RlQXQoaW5kZXgpXG5cbiAgICBpZiAoY2hhcmFjdGVyID09PSBhbXBlcnNhbmQpIHtcbiAgICAgIGZvbGxvd2luZyA9IHZhbHVlLmNoYXJDb2RlQXQoaW5kZXggKyAxKVxuXG4gICAgICAvLyBUaGUgYmVoYXZpb3VyIGRlcGVuZHMgb24gdGhlIGlkZW50aXR5IG9mIHRoZSBuZXh0IGNoYXJhY3Rlci5cbiAgICAgIGlmIChcbiAgICAgICAgZm9sbG93aW5nID09PSB0YWIgfHxcbiAgICAgICAgZm9sbG93aW5nID09PSBsaW5lRmVlZCB8fFxuICAgICAgICBmb2xsb3dpbmcgPT09IGZvcm1GZWVkIHx8XG4gICAgICAgIGZvbGxvd2luZyA9PT0gc3BhY2UgfHxcbiAgICAgICAgZm9sbG93aW5nID09PSBhbXBlcnNhbmQgfHxcbiAgICAgICAgZm9sbG93aW5nID09PSBsZXNzVGhhbiB8fFxuICAgICAgICBmb2xsb3dpbmcgIT09IGZvbGxvd2luZyB8fFxuICAgICAgICAoYWRkaXRpb25hbCAmJiBmb2xsb3dpbmcgPT09IGFkZGl0aW9uYWwpXG4gICAgICApIHtcbiAgICAgICAgLy8gTm90IGEgY2hhcmFjdGVyIHJlZmVyZW5jZS5cbiAgICAgICAgLy8gTm8gY2hhcmFjdGVycyBhcmUgY29uc3VtZWQsIGFuZCBub3RoaW5nIGlzIHJldHVybmVkLlxuICAgICAgICAvLyBUaGlzIGlzIG5vdCBhbiBlcnJvciwgZWl0aGVyLlxuICAgICAgICBxdWV1ZSArPSBmcm9tQ2hhckNvZGUoY2hhcmFjdGVyKVxuICAgICAgICBjb2x1bW4rK1xuXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIHN0YXJ0ID0gaW5kZXggKyAxXG4gICAgICBiZWdpbiA9IHN0YXJ0XG4gICAgICBlbmQgPSBzdGFydFxuXG4gICAgICBpZiAoZm9sbG93aW5nID09PSBudW1iZXJTaWduKSB7XG4gICAgICAgIC8vIE51bWVyaWNhbCBlbnRpdHkuXG4gICAgICAgIGVuZCA9ICsrYmVnaW5cblxuICAgICAgICAvLyBUaGUgYmVoYXZpb3VyIGZ1cnRoZXIgZGVwZW5kcyBvbiB0aGUgbmV4dCBjaGFyYWN0ZXIuXG4gICAgICAgIGZvbGxvd2luZyA9IHZhbHVlLmNoYXJDb2RlQXQoZW5kKVxuXG4gICAgICAgIGlmIChmb2xsb3dpbmcgPT09IHVwcGVyY2FzZVggfHwgZm9sbG93aW5nID09PSBsb3dlcmNhc2VYKSB7XG4gICAgICAgICAgLy8gQVNDSUkgaGV4IGRpZ2l0cy5cbiAgICAgICAgICB0eXBlID0gaGV4YVxuICAgICAgICAgIGVuZCA9ICsrYmVnaW5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBBU0NJSSBkaWdpdHMuXG4gICAgICAgICAgdHlwZSA9IGRlY2lcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTmFtZWQgZW50aXR5LlxuICAgICAgICB0eXBlID0gbmFtZVxuICAgICAgfVxuXG4gICAgICBlbnRpdHlDaGFyYWN0ZXJzID0gJydcbiAgICAgIGVudGl0eSA9ICcnXG4gICAgICBjaGFyYWN0ZXJzID0gJydcbiAgICAgIHRlc3QgPSB0ZXN0c1t0eXBlXVxuICAgICAgZW5kLS1cblxuICAgICAgd2hpbGUgKCsrZW5kIDwgbGVuZ3RoKSB7XG4gICAgICAgIGZvbGxvd2luZyA9IHZhbHVlLmNoYXJDb2RlQXQoZW5kKVxuXG4gICAgICAgIGlmICghdGVzdChmb2xsb3dpbmcpKSB7XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIGNoYXJhY3RlcnMgKz0gZnJvbUNoYXJDb2RlKGZvbGxvd2luZylcblxuICAgICAgICAvLyBDaGVjayBpZiB3ZSBjYW4gbWF0Y2ggYSBsZWdhY3kgbmFtZWQgcmVmZXJlbmNlLlxuICAgICAgICAvLyBJZiBzbywgd2UgY2FjaGUgdGhhdCBhcyB0aGUgbGFzdCB2aWFibGUgbmFtZWQgcmVmZXJlbmNlLlxuICAgICAgICAvLyBUaGlzIGVuc3VyZXMgd2UgZG8gbm90IG5lZWQgdG8gd2FsayBiYWNrd2FyZHMgbGF0ZXIuXG4gICAgICAgIGlmICh0eXBlID09PSBuYW1lICYmIG93bi5jYWxsKGxlZ2FjeSwgY2hhcmFjdGVycykpIHtcbiAgICAgICAgICBlbnRpdHlDaGFyYWN0ZXJzID0gY2hhcmFjdGVyc1xuICAgICAgICAgIGVudGl0eSA9IGxlZ2FjeVtjaGFyYWN0ZXJzXVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRlcm1pbmF0ZWQgPSB2YWx1ZS5jaGFyQ29kZUF0KGVuZCkgPT09IHNlbWljb2xvblxuXG4gICAgICBpZiAodGVybWluYXRlZCkge1xuICAgICAgICBlbmQrK1xuXG4gICAgICAgIG5hbWVkRW50aXR5ID0gdHlwZSA9PT0gbmFtZSA/IGRlY29kZUVudGl0eShjaGFyYWN0ZXJzKSA6IGZhbHNlXG5cbiAgICAgICAgaWYgKG5hbWVkRW50aXR5KSB7XG4gICAgICAgICAgZW50aXR5Q2hhcmFjdGVycyA9IGNoYXJhY3RlcnNcbiAgICAgICAgICBlbnRpdHkgPSBuYW1lZEVudGl0eVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGRpZmYgPSAxICsgZW5kIC0gc3RhcnRcblxuICAgICAgaWYgKCF0ZXJtaW5hdGVkICYmICFub25UZXJtaW5hdGVkKSB7XG4gICAgICAgIC8vIEVtcHR5LlxuICAgICAgfSBlbHNlIGlmICghY2hhcmFjdGVycykge1xuICAgICAgICAvLyBBbiBlbXB0eSAocG9zc2libGUpIGVudGl0eSBpcyB2YWxpZCwgdW5sZXNzIGl04oCZcyBudW1lcmljICh0aHVzIGFuXG4gICAgICAgIC8vIGFtcGVyc2FuZCBmb2xsb3dlZCBieSBhbiBvY3RvdGhvcnApLlxuICAgICAgICBpZiAodHlwZSAhPT0gbmFtZSkge1xuICAgICAgICAgIHdhcm5pbmcobnVtZXJpY0VtcHR5LCBkaWZmKVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IG5hbWUpIHtcbiAgICAgICAgLy8gQW4gYW1wZXJzYW5kIGZvbGxvd2VkIGJ5IGFueXRoaW5nIHVua25vd24sIGFuZCBub3QgdGVybWluYXRlZCwgaXNcbiAgICAgICAgLy8gaW52YWxpZC5cbiAgICAgICAgaWYgKHRlcm1pbmF0ZWQgJiYgIWVudGl0eSkge1xuICAgICAgICAgIHdhcm5pbmcobmFtZWRVbmtub3duLCAxKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIElmIHRoZXJlcyBzb21ldGhpbmcgYWZ0ZXIgYW4gZW50aXR5IG5hbWUgd2hpY2ggaXMgbm90IGtub3duLCBjYXBcbiAgICAgICAgICAvLyB0aGUgcmVmZXJlbmNlLlxuICAgICAgICAgIGlmIChlbnRpdHlDaGFyYWN0ZXJzICE9PSBjaGFyYWN0ZXJzKSB7XG4gICAgICAgICAgICBlbmQgPSBiZWdpbiArIGVudGl0eUNoYXJhY3RlcnMubGVuZ3RoXG4gICAgICAgICAgICBkaWZmID0gMSArIGVuZCAtIGJlZ2luXG4gICAgICAgICAgICB0ZXJtaW5hdGVkID0gZmFsc2VcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBJZiB0aGUgcmVmZXJlbmNlIGlzIG5vdCB0ZXJtaW5hdGVkLCB3YXJuLlxuICAgICAgICAgIGlmICghdGVybWluYXRlZCkge1xuICAgICAgICAgICAgcmVhc29uID0gZW50aXR5Q2hhcmFjdGVycyA/IG5hbWVkTm90VGVybWluYXRlZCA6IG5hbWVkRW1wdHlcblxuICAgICAgICAgICAgaWYgKHNldHRpbmdzLmF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICBmb2xsb3dpbmcgPSB2YWx1ZS5jaGFyQ29kZUF0KGVuZClcblxuICAgICAgICAgICAgICBpZiAoZm9sbG93aW5nID09PSBlcXVhbHNUbykge1xuICAgICAgICAgICAgICAgIHdhcm5pbmcocmVhc29uLCBkaWZmKVxuICAgICAgICAgICAgICAgIGVudGl0eSA9IG51bGxcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChhbHBoYW51bWVyaWNhbChmb2xsb3dpbmcpKSB7XG4gICAgICAgICAgICAgICAgZW50aXR5ID0gbnVsbFxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHdhcm5pbmcocmVhc29uLCBkaWZmKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB3YXJuaW5nKHJlYXNvbiwgZGlmZilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZWZlcmVuY2UgPSBlbnRpdHlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghdGVybWluYXRlZCkge1xuICAgICAgICAgIC8vIEFsbCBub24tdGVybWluYXRlZCBudW1lcmljIGVudGl0aWVzIGFyZSBub3QgcmVuZGVyZWQsIGFuZCB0cmlnZ2VyIGFcbiAgICAgICAgICAvLyB3YXJuaW5nLlxuICAgICAgICAgIHdhcm5pbmcobnVtZXJpY05vdFRlcm1pbmF0ZWQsIGRpZmYpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBXaGVuIHRlcm1pbmF0ZWQgYW5kIG51bWJlciwgcGFyc2UgYXMgZWl0aGVyIGhleGFkZWNpbWFsIG9yIGRlY2ltYWwuXG4gICAgICAgIHJlZmVyZW5jZSA9IHBhcnNlSW50KGNoYXJhY3RlcnMsIGJhc2VzW3R5cGVdKVxuXG4gICAgICAgIC8vIFRyaWdnZXIgYSB3YXJuaW5nIHdoZW4gdGhlIHBhcnNlZCBudW1iZXIgaXMgcHJvaGliaXRlZCwgYW5kIHJlcGxhY2VcbiAgICAgICAgLy8gd2l0aCByZXBsYWNlbWVudCBjaGFyYWN0ZXIuXG4gICAgICAgIGlmIChwcm9oaWJpdGVkKHJlZmVyZW5jZSkpIHtcbiAgICAgICAgICB3YXJuaW5nKG51bWVyaWNQcm9oaWJpdGVkLCBkaWZmKVxuICAgICAgICAgIHJlZmVyZW5jZSA9IGZyb21DaGFyQ29kZShyZXBsYWNlbWVudENoYXJhY3RlcilcbiAgICAgICAgfSBlbHNlIGlmIChyZWZlcmVuY2UgaW4gaW52YWxpZCkge1xuICAgICAgICAgIC8vIFRyaWdnZXIgYSB3YXJuaW5nIHdoZW4gdGhlIHBhcnNlZCBudW1iZXIgaXMgZGlzYWxsb3dlZCwgYW5kIHJlcGxhY2VcbiAgICAgICAgICAvLyBieSBhbiBhbHRlcm5hdGl2ZS5cbiAgICAgICAgICB3YXJuaW5nKG51bWVyaWNEaXNhbGxvd2VkLCBkaWZmKVxuICAgICAgICAgIHJlZmVyZW5jZSA9IGludmFsaWRbcmVmZXJlbmNlXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFBhcnNlIHRoZSBudW1iZXIuXG4gICAgICAgICAgb3V0cHV0ID0gJydcblxuICAgICAgICAgIC8vIFRyaWdnZXIgYSB3YXJuaW5nIHdoZW4gdGhlIHBhcnNlZCBudW1iZXIgc2hvdWxkIG5vdCBiZSB1c2VkLlxuICAgICAgICAgIGlmIChkaXNhbGxvd2VkKHJlZmVyZW5jZSkpIHtcbiAgICAgICAgICAgIHdhcm5pbmcobnVtZXJpY0Rpc2FsbG93ZWQsIGRpZmYpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gU3RyaW5naWZ5IHRoZSBudW1iZXIuXG4gICAgICAgICAgaWYgKHJlZmVyZW5jZSA+IDB4ZmZmZikge1xuICAgICAgICAgICAgcmVmZXJlbmNlIC09IDB4MTAwMDBcbiAgICAgICAgICAgIG91dHB1dCArPSBmcm9tQ2hhckNvZGUoKHJlZmVyZW5jZSA+Pj4gKDEwICYgMHgzZmYpKSB8IDB4ZDgwMClcbiAgICAgICAgICAgIHJlZmVyZW5jZSA9IDB4ZGMwMCB8IChyZWZlcmVuY2UgJiAweDNmZilcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZWZlcmVuY2UgPSBvdXRwdXQgKyBmcm9tQ2hhckNvZGUocmVmZXJlbmNlKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEZvdW5kIGl0IVxuICAgICAgLy8gRmlyc3QgZWF0IHRoZSBxdWV1ZWQgY2hhcmFjdGVycyBhcyBub3JtYWwgdGV4dCwgdGhlbiBlYXQgYW4gZW50aXR5LlxuICAgICAgaWYgKHJlZmVyZW5jZSkge1xuICAgICAgICBmbHVzaCgpXG5cbiAgICAgICAgcHJldiA9IG5vdygpXG4gICAgICAgIGluZGV4ID0gZW5kIC0gMVxuICAgICAgICBjb2x1bW4gKz0gZW5kIC0gc3RhcnQgKyAxXG4gICAgICAgIHJlc3VsdC5wdXNoKHJlZmVyZW5jZSlcbiAgICAgICAgbmV4dCA9IG5vdygpXG4gICAgICAgIG5leHQub2Zmc2V0KytcblxuICAgICAgICBpZiAoaGFuZGxlUmVmZXJlbmNlKSB7XG4gICAgICAgICAgaGFuZGxlUmVmZXJlbmNlLmNhbGwoXG4gICAgICAgICAgICByZWZlcmVuY2VDb250ZXh0LFxuICAgICAgICAgICAgcmVmZXJlbmNlLFxuICAgICAgICAgICAge3N0YXJ0OiBwcmV2LCBlbmQ6IG5leHR9LFxuICAgICAgICAgICAgdmFsdWUuc2xpY2Uoc3RhcnQgLSAxLCBlbmQpXG4gICAgICAgICAgKVxuICAgICAgICB9XG5cbiAgICAgICAgcHJldiA9IG5leHRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIElmIHdlIGNvdWxkIG5vdCBmaW5kIGEgcmVmZXJlbmNlLCBxdWV1ZSB0aGUgY2hlY2tlZCBjaGFyYWN0ZXJzIChhc1xuICAgICAgICAvLyBub3JtYWwgY2hhcmFjdGVycyksIGFuZCBtb3ZlIHRoZSBwb2ludGVyIHRvIHRoZWlyIGVuZC5cbiAgICAgICAgLy8gVGhpcyBpcyBwb3NzaWJsZSBiZWNhdXNlIHdlIGNhbiBiZSBjZXJ0YWluIG5laXRoZXIgbmV3bGluZXMgbm9yXG4gICAgICAgIC8vIGFtcGVyc2FuZHMgYXJlIGluY2x1ZGVkLlxuICAgICAgICBjaGFyYWN0ZXJzID0gdmFsdWUuc2xpY2Uoc3RhcnQgLSAxLCBlbmQpXG4gICAgICAgIHF1ZXVlICs9IGNoYXJhY3RlcnNcbiAgICAgICAgY29sdW1uICs9IGNoYXJhY3RlcnMubGVuZ3RoXG4gICAgICAgIGluZGV4ID0gZW5kIC0gMVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBIYW5kbGUgYW55dGhpbmcgb3RoZXIgdGhhbiBhbiBhbXBlcnNhbmQsIGluY2x1ZGluZyBuZXdsaW5lcyBhbmQgRU9GLlxuICAgICAgaWYgKFxuICAgICAgICBjaGFyYWN0ZXIgPT09IDEwIC8vIExpbmUgZmVlZFxuICAgICAgKSB7XG4gICAgICAgIGxpbmUrK1xuICAgICAgICBsaW5lcysrXG4gICAgICAgIGNvbHVtbiA9IDBcbiAgICAgIH1cblxuICAgICAgaWYgKGNoYXJhY3RlciA9PT0gY2hhcmFjdGVyKSB7XG4gICAgICAgIHF1ZXVlICs9IGZyb21DaGFyQ29kZShjaGFyYWN0ZXIpXG4gICAgICAgIGNvbHVtbisrXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmbHVzaCgpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gUmV0dXJuIHRoZSByZWR1Y2VkIG5vZGVzLCBhbmQgYW55IHBvc3NpYmxlIHdhcm5pbmdzLlxuICByZXR1cm4gcmVzdWx0LmpvaW4oJycpXG5cbiAgLy8gR2V0IGN1cnJlbnQgcG9zaXRpb24uXG4gIGZ1bmN0aW9uIG5vdygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGluZTogbGluZSxcbiAgICAgIGNvbHVtbjogY29sdW1uLFxuICAgICAgb2Zmc2V0OiBpbmRleCArIChwb3Mub2Zmc2V0IHx8IDApXG4gICAgfVxuICB9XG5cbiAgLy8g4oCcVGhyb3figJ0gYSBwYXJzZS1lcnJvcjogYSB3YXJuaW5nLlxuICBmdW5jdGlvbiBwYXJzZUVycm9yKGNvZGUsIG9mZnNldCkge1xuICAgIHZhciBwb3NpdGlvbiA9IG5vdygpXG5cbiAgICBwb3NpdGlvbi5jb2x1bW4gKz0gb2Zmc2V0XG4gICAgcG9zaXRpb24ub2Zmc2V0ICs9IG9mZnNldFxuXG4gICAgaGFuZGxlV2FybmluZy5jYWxsKHdhcm5pbmdDb250ZXh0LCBtZXNzYWdlc1tjb2RlXSwgcG9zaXRpb24sIGNvZGUpXG4gIH1cblxuICAvLyBGbHVzaCBgcXVldWVgIChub3JtYWwgdGV4dCkuXG4gIC8vIE1hY3JvIGludm9rZWQgYmVmb3JlIGVhY2ggZW50aXR5IGFuZCBhdCB0aGUgZW5kIG9mIGB2YWx1ZWAuXG4gIC8vIERvZXMgbm90aGluZyB3aGVuIGBxdWV1ZWAgaXMgZW1wdHkuXG4gIGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIGlmIChxdWV1ZSkge1xuICAgICAgcmVzdWx0LnB1c2gocXVldWUpXG5cbiAgICAgIGlmIChoYW5kbGVUZXh0KSB7XG4gICAgICAgIGhhbmRsZVRleHQuY2FsbCh0ZXh0Q29udGV4dCwgcXVldWUsIHtzdGFydDogcHJldiwgZW5kOiBub3coKX0pXG4gICAgICB9XG5cbiAgICAgIHF1ZXVlID0gJydcbiAgICB9XG4gIH1cbn1cblxuLy8gQ2hlY2sgaWYgYGNoYXJhY3RlcmAgaXMgb3V0c2lkZSB0aGUgcGVybWlzc2libGUgdW5pY29kZSByYW5nZS5cbmZ1bmN0aW9uIHByb2hpYml0ZWQoY29kZSkge1xuICByZXR1cm4gKGNvZGUgPj0gMHhkODAwICYmIGNvZGUgPD0gMHhkZmZmKSB8fCBjb2RlID4gMHgxMGZmZmZcbn1cblxuLy8gQ2hlY2sgaWYgYGNoYXJhY3RlcmAgaXMgZGlzYWxsb3dlZC5cbmZ1bmN0aW9uIGRpc2FsbG93ZWQoY29kZSkge1xuICByZXR1cm4gKFxuICAgIChjb2RlID49IDB4MDAwMSAmJiBjb2RlIDw9IDB4MDAwOCkgfHxcbiAgICBjb2RlID09PSAweDAwMGIgfHxcbiAgICAoY29kZSA+PSAweDAwMGQgJiYgY29kZSA8PSAweDAwMWYpIHx8XG4gICAgKGNvZGUgPj0gMHgwMDdmICYmIGNvZGUgPD0gMHgwMDlmKSB8fFxuICAgIChjb2RlID49IDB4ZmRkMCAmJiBjb2RlIDw9IDB4ZmRlZikgfHxcbiAgICAoY29kZSAmIDB4ZmZmZikgPT09IDB4ZmZmZiB8fFxuICAgIChjb2RlICYgMHhmZmZmKSA9PT0gMHhmZmZlXG4gIClcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG52YXIgbm9ybWFsaXplID0gcmVxdWlyZSgnLi9ub3JtYWxpemUnKVxudmFyIERlZmluZWRJbmZvID0gcmVxdWlyZSgnLi9saWIvdXRpbC9kZWZpbmVkLWluZm8nKVxudmFyIEluZm8gPSByZXF1aXJlKCcuL2xpYi91dGlsL2luZm8nKVxuXG52YXIgZGF0YSA9ICdkYXRhJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRcblxudmFyIHZhbGlkID0gL15kYXRhWy1cXHcuOl0rJC9pXG52YXIgZGFzaCA9IC8tW2Etel0vZ1xudmFyIGNhcCA9IC9bQS1aXS9nXG5cbmZ1bmN0aW9uIGZpbmQoc2NoZW1hLCB2YWx1ZSkge1xuICB2YXIgbm9ybWFsID0gbm9ybWFsaXplKHZhbHVlKVxuICB2YXIgcHJvcCA9IHZhbHVlXG4gIHZhciBUeXBlID0gSW5mb1xuXG4gIGlmIChub3JtYWwgaW4gc2NoZW1hLm5vcm1hbCkge1xuICAgIHJldHVybiBzY2hlbWEucHJvcGVydHlbc2NoZW1hLm5vcm1hbFtub3JtYWxdXVxuICB9XG5cbiAgaWYgKG5vcm1hbC5sZW5ndGggPiA0ICYmIG5vcm1hbC5zbGljZSgwLCA0KSA9PT0gZGF0YSAmJiB2YWxpZC50ZXN0KHZhbHVlKSkge1xuICAgIC8vIEF0dHJpYnV0ZSBvciBwcm9wZXJ0eS5cbiAgICBpZiAodmFsdWUuY2hhckF0KDQpID09PSAnLScpIHtcbiAgICAgIHByb3AgPSBkYXRhc2V0VG9Qcm9wZXJ0eSh2YWx1ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgPSBkYXRhc2V0VG9BdHRyaWJ1dGUodmFsdWUpXG4gICAgfVxuXG4gICAgVHlwZSA9IERlZmluZWRJbmZvXG4gIH1cblxuICByZXR1cm4gbmV3IFR5cGUocHJvcCwgdmFsdWUpXG59XG5cbmZ1bmN0aW9uIGRhdGFzZXRUb1Byb3BlcnR5KGF0dHJpYnV0ZSkge1xuICB2YXIgdmFsdWUgPSBhdHRyaWJ1dGUuc2xpY2UoNSkucmVwbGFjZShkYXNoLCBjYW1lbGNhc2UpXG4gIHJldHVybiBkYXRhICsgdmFsdWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB2YWx1ZS5zbGljZSgxKVxufVxuXG5mdW5jdGlvbiBkYXRhc2V0VG9BdHRyaWJ1dGUocHJvcGVydHkpIHtcbiAgdmFyIHZhbHVlID0gcHJvcGVydHkuc2xpY2UoNClcblxuICBpZiAoZGFzaC50ZXN0KHZhbHVlKSkge1xuICAgIHJldHVybiBwcm9wZXJ0eVxuICB9XG5cbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKGNhcCwga2ViYWIpXG5cbiAgaWYgKHZhbHVlLmNoYXJBdCgwKSAhPT0gJy0nKSB7XG4gICAgdmFsdWUgPSAnLScgKyB2YWx1ZVxuICB9XG5cbiAgcmV0dXJuIGRhdGEgKyB2YWx1ZVxufVxuXG5mdW5jdGlvbiBrZWJhYigkMCkge1xuICByZXR1cm4gJy0nICsgJDAudG9Mb3dlckNhc2UoKVxufVxuXG5mdW5jdGlvbiBjYW1lbGNhc2UoJDApIHtcbiAgcmV0dXJuICQwLmNoYXJBdCgxKS50b1VwcGVyQ2FzZSgpXG59XG4iLCIndXNlIHN0cmljdCdcblxudmFyIG1lcmdlID0gcmVxdWlyZSgnLi9saWIvdXRpbC9tZXJnZScpXG52YXIgeGxpbmsgPSByZXF1aXJlKCcuL2xpYi94bGluaycpXG52YXIgeG1sID0gcmVxdWlyZSgnLi9saWIveG1sJylcbnZhciB4bWxucyA9IHJlcXVpcmUoJy4vbGliL3htbG5zJylcbnZhciBhcmlhID0gcmVxdWlyZSgnLi9saWIvYXJpYScpXG52YXIgaHRtbCA9IHJlcXVpcmUoJy4vbGliL2h0bWwnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1lcmdlKFt4bWwsIHhsaW5rLCB4bWxucywgYXJpYSwgaHRtbF0pXG4iLCIndXNlIHN0cmljdCdcblxudmFyIHR5cGVzID0gcmVxdWlyZSgnLi91dGlsL3R5cGVzJylcbnZhciBjcmVhdGUgPSByZXF1aXJlKCcuL3V0aWwvY3JlYXRlJylcblxudmFyIGJvb2xlYW5pc2ggPSB0eXBlcy5ib29sZWFuaXNoXG52YXIgbnVtYmVyID0gdHlwZXMubnVtYmVyXG52YXIgc3BhY2VTZXBhcmF0ZWQgPSB0eXBlcy5zcGFjZVNlcGFyYXRlZFxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZSh7XG4gIHRyYW5zZm9ybTogYXJpYVRyYW5zZm9ybSxcbiAgcHJvcGVydGllczoge1xuICAgIGFyaWFBY3RpdmVEZXNjZW5kYW50OiBudWxsLFxuICAgIGFyaWFBdG9taWM6IGJvb2xlYW5pc2gsXG4gICAgYXJpYUF1dG9Db21wbGV0ZTogbnVsbCxcbiAgICBhcmlhQnVzeTogYm9vbGVhbmlzaCxcbiAgICBhcmlhQ2hlY2tlZDogYm9vbGVhbmlzaCxcbiAgICBhcmlhQ29sQ291bnQ6IG51bWJlcixcbiAgICBhcmlhQ29sSW5kZXg6IG51bWJlcixcbiAgICBhcmlhQ29sU3BhbjogbnVtYmVyLFxuICAgIGFyaWFDb250cm9sczogc3BhY2VTZXBhcmF0ZWQsXG4gICAgYXJpYUN1cnJlbnQ6IG51bGwsXG4gICAgYXJpYURlc2NyaWJlZEJ5OiBzcGFjZVNlcGFyYXRlZCxcbiAgICBhcmlhRGV0YWlsczogbnVsbCxcbiAgICBhcmlhRGlzYWJsZWQ6IGJvb2xlYW5pc2gsXG4gICAgYXJpYURyb3BFZmZlY3Q6IHNwYWNlU2VwYXJhdGVkLFxuICAgIGFyaWFFcnJvck1lc3NhZ2U6IG51bGwsXG4gICAgYXJpYUV4cGFuZGVkOiBib29sZWFuaXNoLFxuICAgIGFyaWFGbG93VG86IHNwYWNlU2VwYXJhdGVkLFxuICAgIGFyaWFHcmFiYmVkOiBib29sZWFuaXNoLFxuICAgIGFyaWFIYXNQb3B1cDogbnVsbCxcbiAgICBhcmlhSGlkZGVuOiBib29sZWFuaXNoLFxuICAgIGFyaWFJbnZhbGlkOiBudWxsLFxuICAgIGFyaWFLZXlTaG9ydGN1dHM6IG51bGwsXG4gICAgYXJpYUxhYmVsOiBudWxsLFxuICAgIGFyaWFMYWJlbGxlZEJ5OiBzcGFjZVNlcGFyYXRlZCxcbiAgICBhcmlhTGV2ZWw6IG51bWJlcixcbiAgICBhcmlhTGl2ZTogbnVsbCxcbiAgICBhcmlhTW9kYWw6IGJvb2xlYW5pc2gsXG4gICAgYXJpYU11bHRpTGluZTogYm9vbGVhbmlzaCxcbiAgICBhcmlhTXVsdGlTZWxlY3RhYmxlOiBib29sZWFuaXNoLFxuICAgIGFyaWFPcmllbnRhdGlvbjogbnVsbCxcbiAgICBhcmlhT3duczogc3BhY2VTZXBhcmF0ZWQsXG4gICAgYXJpYVBsYWNlaG9sZGVyOiBudWxsLFxuICAgIGFyaWFQb3NJblNldDogbnVtYmVyLFxuICAgIGFyaWFQcmVzc2VkOiBib29sZWFuaXNoLFxuICAgIGFyaWFSZWFkT25seTogYm9vbGVhbmlzaCxcbiAgICBhcmlhUmVsZXZhbnQ6IG51bGwsXG4gICAgYXJpYVJlcXVpcmVkOiBib29sZWFuaXNoLFxuICAgIGFyaWFSb2xlRGVzY3JpcHRpb246IHNwYWNlU2VwYXJhdGVkLFxuICAgIGFyaWFSb3dDb3VudDogbnVtYmVyLFxuICAgIGFyaWFSb3dJbmRleDogbnVtYmVyLFxuICAgIGFyaWFSb3dTcGFuOiBudW1iZXIsXG4gICAgYXJpYVNlbGVjdGVkOiBib29sZWFuaXNoLFxuICAgIGFyaWFTZXRTaXplOiBudW1iZXIsXG4gICAgYXJpYVNvcnQ6IG51bGwsXG4gICAgYXJpYVZhbHVlTWF4OiBudW1iZXIsXG4gICAgYXJpYVZhbHVlTWluOiBudW1iZXIsXG4gICAgYXJpYVZhbHVlTm93OiBudW1iZXIsXG4gICAgYXJpYVZhbHVlVGV4dDogbnVsbCxcbiAgICByb2xlOiBudWxsXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIGFyaWFUcmFuc2Zvcm0oXywgcHJvcCkge1xuICByZXR1cm4gcHJvcCA9PT0gJ3JvbGUnID8gcHJvcCA6ICdhcmlhLScgKyBwcm9wLnNsaWNlKDQpLnRvTG93ZXJDYXNlKClcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG52YXIgdHlwZXMgPSByZXF1aXJlKCcuL3V0aWwvdHlwZXMnKVxudmFyIGNyZWF0ZSA9IHJlcXVpcmUoJy4vdXRpbC9jcmVhdGUnKVxudmFyIGNhc2VJbnNlbnNpdGl2ZVRyYW5zZm9ybSA9IHJlcXVpcmUoJy4vdXRpbC9jYXNlLWluc2Vuc2l0aXZlLXRyYW5zZm9ybScpXG5cbnZhciBib29sZWFuID0gdHlwZXMuYm9vbGVhblxudmFyIG92ZXJsb2FkZWRCb29sZWFuID0gdHlwZXMub3ZlcmxvYWRlZEJvb2xlYW5cbnZhciBib29sZWFuaXNoID0gdHlwZXMuYm9vbGVhbmlzaFxudmFyIG51bWJlciA9IHR5cGVzLm51bWJlclxudmFyIHNwYWNlU2VwYXJhdGVkID0gdHlwZXMuc3BhY2VTZXBhcmF0ZWRcbnZhciBjb21tYVNlcGFyYXRlZCA9IHR5cGVzLmNvbW1hU2VwYXJhdGVkXG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlKHtcbiAgc3BhY2U6ICdodG1sJyxcbiAgYXR0cmlidXRlczoge1xuICAgIGFjY2VwdGNoYXJzZXQ6ICdhY2NlcHQtY2hhcnNldCcsXG4gICAgY2xhc3NuYW1lOiAnY2xhc3MnLFxuICAgIGh0bWxmb3I6ICdmb3InLFxuICAgIGh0dHBlcXVpdjogJ2h0dHAtZXF1aXYnXG4gIH0sXG4gIHRyYW5zZm9ybTogY2FzZUluc2Vuc2l0aXZlVHJhbnNmb3JtLFxuICBtdXN0VXNlUHJvcGVydHk6IFsnY2hlY2tlZCcsICdtdWx0aXBsZScsICdtdXRlZCcsICdzZWxlY3RlZCddLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgLy8gU3RhbmRhcmQgUHJvcGVydGllcy5cbiAgICBhYmJyOiBudWxsLFxuICAgIGFjY2VwdDogY29tbWFTZXBhcmF0ZWQsXG4gICAgYWNjZXB0Q2hhcnNldDogc3BhY2VTZXBhcmF0ZWQsXG4gICAgYWNjZXNzS2V5OiBzcGFjZVNlcGFyYXRlZCxcbiAgICBhY3Rpb246IG51bGwsXG4gICAgYWxsb3c6IG51bGwsXG4gICAgYWxsb3dGdWxsU2NyZWVuOiBib29sZWFuLFxuICAgIGFsbG93UGF5bWVudFJlcXVlc3Q6IGJvb2xlYW4sXG4gICAgYWxsb3dVc2VyTWVkaWE6IGJvb2xlYW4sXG4gICAgYWx0OiBudWxsLFxuICAgIGFzOiBudWxsLFxuICAgIGFzeW5jOiBib29sZWFuLFxuICAgIGF1dG9DYXBpdGFsaXplOiBudWxsLFxuICAgIGF1dG9Db21wbGV0ZTogc3BhY2VTZXBhcmF0ZWQsXG4gICAgYXV0b0ZvY3VzOiBib29sZWFuLFxuICAgIGF1dG9QbGF5OiBib29sZWFuLFxuICAgIGNhcHR1cmU6IGJvb2xlYW4sXG4gICAgY2hhclNldDogbnVsbCxcbiAgICBjaGVja2VkOiBib29sZWFuLFxuICAgIGNpdGU6IG51bGwsXG4gICAgY2xhc3NOYW1lOiBzcGFjZVNlcGFyYXRlZCxcbiAgICBjb2xzOiBudW1iZXIsXG4gICAgY29sU3BhbjogbnVsbCxcbiAgICBjb250ZW50OiBudWxsLFxuICAgIGNvbnRlbnRFZGl0YWJsZTogYm9vbGVhbmlzaCxcbiAgICBjb250cm9sczogYm9vbGVhbixcbiAgICBjb250cm9sc0xpc3Q6IHNwYWNlU2VwYXJhdGVkLFxuICAgIGNvb3JkczogbnVtYmVyIHwgY29tbWFTZXBhcmF0ZWQsXG4gICAgY3Jvc3NPcmlnaW46IG51bGwsXG4gICAgZGF0YTogbnVsbCxcbiAgICBkYXRlVGltZTogbnVsbCxcbiAgICBkZWNvZGluZzogbnVsbCxcbiAgICBkZWZhdWx0OiBib29sZWFuLFxuICAgIGRlZmVyOiBib29sZWFuLFxuICAgIGRpcjogbnVsbCxcbiAgICBkaXJOYW1lOiBudWxsLFxuICAgIGRpc2FibGVkOiBib29sZWFuLFxuICAgIGRvd25sb2FkOiBvdmVybG9hZGVkQm9vbGVhbixcbiAgICBkcmFnZ2FibGU6IGJvb2xlYW5pc2gsXG4gICAgZW5jVHlwZTogbnVsbCxcbiAgICBlbnRlcktleUhpbnQ6IG51bGwsXG4gICAgZm9ybTogbnVsbCxcbiAgICBmb3JtQWN0aW9uOiBudWxsLFxuICAgIGZvcm1FbmNUeXBlOiBudWxsLFxuICAgIGZvcm1NZXRob2Q6IG51bGwsXG4gICAgZm9ybU5vVmFsaWRhdGU6IGJvb2xlYW4sXG4gICAgZm9ybVRhcmdldDogbnVsbCxcbiAgICBoZWFkZXJzOiBzcGFjZVNlcGFyYXRlZCxcbiAgICBoZWlnaHQ6IG51bWJlcixcbiAgICBoaWRkZW46IGJvb2xlYW4sXG4gICAgaGlnaDogbnVtYmVyLFxuICAgIGhyZWY6IG51bGwsXG4gICAgaHJlZkxhbmc6IG51bGwsXG4gICAgaHRtbEZvcjogc3BhY2VTZXBhcmF0ZWQsXG4gICAgaHR0cEVxdWl2OiBzcGFjZVNlcGFyYXRlZCxcbiAgICBpZDogbnVsbCxcbiAgICBpbWFnZVNpemVzOiBudWxsLFxuICAgIGltYWdlU3JjU2V0OiBjb21tYVNlcGFyYXRlZCxcbiAgICBpbnB1dE1vZGU6IG51bGwsXG4gICAgaW50ZWdyaXR5OiBudWxsLFxuICAgIGlzOiBudWxsLFxuICAgIGlzTWFwOiBib29sZWFuLFxuICAgIGl0ZW1JZDogbnVsbCxcbiAgICBpdGVtUHJvcDogc3BhY2VTZXBhcmF0ZWQsXG4gICAgaXRlbVJlZjogc3BhY2VTZXBhcmF0ZWQsXG4gICAgaXRlbVNjb3BlOiBib29sZWFuLFxuICAgIGl0ZW1UeXBlOiBzcGFjZVNlcGFyYXRlZCxcbiAgICBraW5kOiBudWxsLFxuICAgIGxhYmVsOiBudWxsLFxuICAgIGxhbmc6IG51bGwsXG4gICAgbGFuZ3VhZ2U6IG51bGwsXG4gICAgbGlzdDogbnVsbCxcbiAgICBsb2FkaW5nOiBudWxsLFxuICAgIGxvb3A6IGJvb2xlYW4sXG4gICAgbG93OiBudW1iZXIsXG4gICAgbWFuaWZlc3Q6IG51bGwsXG4gICAgbWF4OiBudWxsLFxuICAgIG1heExlbmd0aDogbnVtYmVyLFxuICAgIG1lZGlhOiBudWxsLFxuICAgIG1ldGhvZDogbnVsbCxcbiAgICBtaW46IG51bGwsXG4gICAgbWluTGVuZ3RoOiBudW1iZXIsXG4gICAgbXVsdGlwbGU6IGJvb2xlYW4sXG4gICAgbXV0ZWQ6IGJvb2xlYW4sXG4gICAgbmFtZTogbnVsbCxcbiAgICBub25jZTogbnVsbCxcbiAgICBub01vZHVsZTogYm9vbGVhbixcbiAgICBub1ZhbGlkYXRlOiBib29sZWFuLFxuICAgIG9uQWJvcnQ6IG51bGwsXG4gICAgb25BZnRlclByaW50OiBudWxsLFxuICAgIG9uQXV4Q2xpY2s6IG51bGwsXG4gICAgb25CZWZvcmVQcmludDogbnVsbCxcbiAgICBvbkJlZm9yZVVubG9hZDogbnVsbCxcbiAgICBvbkJsdXI6IG51bGwsXG4gICAgb25DYW5jZWw6IG51bGwsXG4gICAgb25DYW5QbGF5OiBudWxsLFxuICAgIG9uQ2FuUGxheVRocm91Z2g6IG51bGwsXG4gICAgb25DaGFuZ2U6IG51bGwsXG4gICAgb25DbGljazogbnVsbCxcbiAgICBvbkNsb3NlOiBudWxsLFxuICAgIG9uQ29udGV4dE1lbnU6IG51bGwsXG4gICAgb25Db3B5OiBudWxsLFxuICAgIG9uQ3VlQ2hhbmdlOiBudWxsLFxuICAgIG9uQ3V0OiBudWxsLFxuICAgIG9uRGJsQ2xpY2s6IG51bGwsXG4gICAgb25EcmFnOiBudWxsLFxuICAgIG9uRHJhZ0VuZDogbnVsbCxcbiAgICBvbkRyYWdFbnRlcjogbnVsbCxcbiAgICBvbkRyYWdFeGl0OiBudWxsLFxuICAgIG9uRHJhZ0xlYXZlOiBudWxsLFxuICAgIG9uRHJhZ092ZXI6IG51bGwsXG4gICAgb25EcmFnU3RhcnQ6IG51bGwsXG4gICAgb25Ecm9wOiBudWxsLFxuICAgIG9uRHVyYXRpb25DaGFuZ2U6IG51bGwsXG4gICAgb25FbXB0aWVkOiBudWxsLFxuICAgIG9uRW5kZWQ6IG51bGwsXG4gICAgb25FcnJvcjogbnVsbCxcbiAgICBvbkZvY3VzOiBudWxsLFxuICAgIG9uRm9ybURhdGE6IG51bGwsXG4gICAgb25IYXNoQ2hhbmdlOiBudWxsLFxuICAgIG9uSW5wdXQ6IG51bGwsXG4gICAgb25JbnZhbGlkOiBudWxsLFxuICAgIG9uS2V5RG93bjogbnVsbCxcbiAgICBvbktleVByZXNzOiBudWxsLFxuICAgIG9uS2V5VXA6IG51bGwsXG4gICAgb25MYW5ndWFnZUNoYW5nZTogbnVsbCxcbiAgICBvbkxvYWQ6IG51bGwsXG4gICAgb25Mb2FkZWREYXRhOiBudWxsLFxuICAgIG9uTG9hZGVkTWV0YWRhdGE6IG51bGwsXG4gICAgb25Mb2FkRW5kOiBudWxsLFxuICAgIG9uTG9hZFN0YXJ0OiBudWxsLFxuICAgIG9uTWVzc2FnZTogbnVsbCxcbiAgICBvbk1lc3NhZ2VFcnJvcjogbnVsbCxcbiAgICBvbk1vdXNlRG93bjogbnVsbCxcbiAgICBvbk1vdXNlRW50ZXI6IG51bGwsXG4gICAgb25Nb3VzZUxlYXZlOiBudWxsLFxuICAgIG9uTW91c2VNb3ZlOiBudWxsLFxuICAgIG9uTW91c2VPdXQ6IG51bGwsXG4gICAgb25Nb3VzZU92ZXI6IG51bGwsXG4gICAgb25Nb3VzZVVwOiBudWxsLFxuICAgIG9uT2ZmbGluZTogbnVsbCxcbiAgICBvbk9ubGluZTogbnVsbCxcbiAgICBvblBhZ2VIaWRlOiBudWxsLFxuICAgIG9uUGFnZVNob3c6IG51bGwsXG4gICAgb25QYXN0ZTogbnVsbCxcbiAgICBvblBhdXNlOiBudWxsLFxuICAgIG9uUGxheTogbnVsbCxcbiAgICBvblBsYXlpbmc6IG51bGwsXG4gICAgb25Qb3BTdGF0ZTogbnVsbCxcbiAgICBvblByb2dyZXNzOiBudWxsLFxuICAgIG9uUmF0ZUNoYW5nZTogbnVsbCxcbiAgICBvblJlamVjdGlvbkhhbmRsZWQ6IG51bGwsXG4gICAgb25SZXNldDogbnVsbCxcbiAgICBvblJlc2l6ZTogbnVsbCxcbiAgICBvblNjcm9sbDogbnVsbCxcbiAgICBvblNlY3VyaXR5UG9saWN5VmlvbGF0aW9uOiBudWxsLFxuICAgIG9uU2Vla2VkOiBudWxsLFxuICAgIG9uU2Vla2luZzogbnVsbCxcbiAgICBvblNlbGVjdDogbnVsbCxcbiAgICBvblNsb3RDaGFuZ2U6IG51bGwsXG4gICAgb25TdGFsbGVkOiBudWxsLFxuICAgIG9uU3RvcmFnZTogbnVsbCxcbiAgICBvblN1Ym1pdDogbnVsbCxcbiAgICBvblN1c3BlbmQ6IG51bGwsXG4gICAgb25UaW1lVXBkYXRlOiBudWxsLFxuICAgIG9uVG9nZ2xlOiBudWxsLFxuICAgIG9uVW5oYW5kbGVkUmVqZWN0aW9uOiBudWxsLFxuICAgIG9uVW5sb2FkOiBudWxsLFxuICAgIG9uVm9sdW1lQ2hhbmdlOiBudWxsLFxuICAgIG9uV2FpdGluZzogbnVsbCxcbiAgICBvbldoZWVsOiBudWxsLFxuICAgIG9wZW46IGJvb2xlYW4sXG4gICAgb3B0aW11bTogbnVtYmVyLFxuICAgIHBhdHRlcm46IG51bGwsXG4gICAgcGluZzogc3BhY2VTZXBhcmF0ZWQsXG4gICAgcGxhY2Vob2xkZXI6IG51bGwsXG4gICAgcGxheXNJbmxpbmU6IGJvb2xlYW4sXG4gICAgcG9zdGVyOiBudWxsLFxuICAgIHByZWxvYWQ6IG51bGwsXG4gICAgcmVhZE9ubHk6IGJvb2xlYW4sXG4gICAgcmVmZXJyZXJQb2xpY3k6IG51bGwsXG4gICAgcmVsOiBzcGFjZVNlcGFyYXRlZCxcbiAgICByZXF1aXJlZDogYm9vbGVhbixcbiAgICByZXZlcnNlZDogYm9vbGVhbixcbiAgICByb3dzOiBudW1iZXIsXG4gICAgcm93U3BhbjogbnVtYmVyLFxuICAgIHNhbmRib3g6IHNwYWNlU2VwYXJhdGVkLFxuICAgIHNjb3BlOiBudWxsLFxuICAgIHNjb3BlZDogYm9vbGVhbixcbiAgICBzZWFtbGVzczogYm9vbGVhbixcbiAgICBzZWxlY3RlZDogYm9vbGVhbixcbiAgICBzaGFwZTogbnVsbCxcbiAgICBzaXplOiBudW1iZXIsXG4gICAgc2l6ZXM6IG51bGwsXG4gICAgc2xvdDogbnVsbCxcbiAgICBzcGFuOiBudW1iZXIsXG4gICAgc3BlbGxDaGVjazogYm9vbGVhbmlzaCxcbiAgICBzcmM6IG51bGwsXG4gICAgc3JjRG9jOiBudWxsLFxuICAgIHNyY0xhbmc6IG51bGwsXG4gICAgc3JjU2V0OiBjb21tYVNlcGFyYXRlZCxcbiAgICBzdGFydDogbnVtYmVyLFxuICAgIHN0ZXA6IG51bGwsXG4gICAgc3R5bGU6IG51bGwsXG4gICAgdGFiSW5kZXg6IG51bWJlcixcbiAgICB0YXJnZXQ6IG51bGwsXG4gICAgdGl0bGU6IG51bGwsXG4gICAgdHJhbnNsYXRlOiBudWxsLFxuICAgIHR5cGU6IG51bGwsXG4gICAgdHlwZU11c3RNYXRjaDogYm9vbGVhbixcbiAgICB1c2VNYXA6IG51bGwsXG4gICAgdmFsdWU6IGJvb2xlYW5pc2gsXG4gICAgd2lkdGg6IG51bWJlcixcbiAgICB3cmFwOiBudWxsLFxuXG4gICAgLy8gTGVnYWN5LlxuICAgIC8vIFNlZTogaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy8jb3RoZXItZWxlbWVudHMsLWF0dHJpYnV0ZXMtYW5kLWFwaXNcbiAgICBhbGlnbjogbnVsbCwgLy8gU2V2ZXJhbC4gVXNlIENTUyBgdGV4dC1hbGlnbmAgaW5zdGVhZCxcbiAgICBhTGluazogbnVsbCwgLy8gYDxib2R5PmAuIFVzZSBDU1MgYGE6YWN0aXZlIHtjb2xvcn1gIGluc3RlYWRcbiAgICBhcmNoaXZlOiBzcGFjZVNlcGFyYXRlZCwgLy8gYDxvYmplY3Q+YC4gTGlzdCBvZiBVUklzIHRvIGFyY2hpdmVzXG4gICAgYXhpczogbnVsbCwgLy8gYDx0ZD5gIGFuZCBgPHRoPmAuIFVzZSBgc2NvcGVgIG9uIGA8dGg+YFxuICAgIGJhY2tncm91bmQ6IG51bGwsIC8vIGA8Ym9keT5gLiBVc2UgQ1NTIGBiYWNrZ3JvdW5kLWltYWdlYCBpbnN0ZWFkXG4gICAgYmdDb2xvcjogbnVsbCwgLy8gYDxib2R5PmAgYW5kIHRhYmxlIGVsZW1lbnRzLiBVc2UgQ1NTIGBiYWNrZ3JvdW5kLWNvbG9yYCBpbnN0ZWFkXG4gICAgYm9yZGVyOiBudW1iZXIsIC8vIGA8dGFibGU+YC4gVXNlIENTUyBgYm9yZGVyLXdpZHRoYCBpbnN0ZWFkLFxuICAgIGJvcmRlckNvbG9yOiBudWxsLCAvLyBgPHRhYmxlPmAuIFVzZSBDU1MgYGJvcmRlci1jb2xvcmAgaW5zdGVhZCxcbiAgICBib3R0b21NYXJnaW46IG51bWJlciwgLy8gYDxib2R5PmBcbiAgICBjZWxsUGFkZGluZzogbnVsbCwgLy8gYDx0YWJsZT5gXG4gICAgY2VsbFNwYWNpbmc6IG51bGwsIC8vIGA8dGFibGU+YFxuICAgIGNoYXI6IG51bGwsIC8vIFNldmVyYWwgdGFibGUgZWxlbWVudHMuIFdoZW4gYGFsaWduPWNoYXJgLCBzZXRzIHRoZSBjaGFyYWN0ZXIgdG8gYWxpZ24gb25cbiAgICBjaGFyT2ZmOiBudWxsLCAvLyBTZXZlcmFsIHRhYmxlIGVsZW1lbnRzLiBXaGVuIGBjaGFyYCwgb2Zmc2V0cyB0aGUgYWxpZ25tZW50XG4gICAgY2xhc3NJZDogbnVsbCwgLy8gYDxvYmplY3Q+YFxuICAgIGNsZWFyOiBudWxsLCAvLyBgPGJyPmAuIFVzZSBDU1MgYGNsZWFyYCBpbnN0ZWFkXG4gICAgY29kZTogbnVsbCwgLy8gYDxvYmplY3Q+YFxuICAgIGNvZGVCYXNlOiBudWxsLCAvLyBgPG9iamVjdD5gXG4gICAgY29kZVR5cGU6IG51bGwsIC8vIGA8b2JqZWN0PmBcbiAgICBjb2xvcjogbnVsbCwgLy8gYDxmb250PmAgYW5kIGA8aHI+YC4gVXNlIENTUyBpbnN0ZWFkXG4gICAgY29tcGFjdDogYm9vbGVhbiwgLy8gTGlzdHMuIFVzZSBDU1MgdG8gcmVkdWNlIHNwYWNlIGJldHdlZW4gaXRlbXMgaW5zdGVhZFxuICAgIGRlY2xhcmU6IGJvb2xlYW4sIC8vIGA8b2JqZWN0PmBcbiAgICBldmVudDogbnVsbCwgLy8gYDxzY3JpcHQ+YFxuICAgIGZhY2U6IG51bGwsIC8vIGA8Zm9udD5gLiBVc2UgQ1NTIGluc3RlYWRcbiAgICBmcmFtZTogbnVsbCwgLy8gYDx0YWJsZT5gXG4gICAgZnJhbWVCb3JkZXI6IG51bGwsIC8vIGA8aWZyYW1lPmAuIFVzZSBDU1MgYGJvcmRlcmAgaW5zdGVhZFxuICAgIGhTcGFjZTogbnVtYmVyLCAvLyBgPGltZz5gIGFuZCBgPG9iamVjdD5gXG4gICAgbGVmdE1hcmdpbjogbnVtYmVyLCAvLyBgPGJvZHk+YFxuICAgIGxpbms6IG51bGwsIC8vIGA8Ym9keT5gLiBVc2UgQ1NTIGBhOmxpbmsge2NvbG9yOiAqfWAgaW5zdGVhZFxuICAgIGxvbmdEZXNjOiBudWxsLCAvLyBgPGZyYW1lPmAsIGA8aWZyYW1lPmAsIGFuZCBgPGltZz5gLiBVc2UgYW4gYDxhPmBcbiAgICBsb3dTcmM6IG51bGwsIC8vIGA8aW1nPmAuIFVzZSBhIGA8cGljdHVyZT5gXG4gICAgbWFyZ2luSGVpZ2h0OiBudW1iZXIsIC8vIGA8Ym9keT5gXG4gICAgbWFyZ2luV2lkdGg6IG51bWJlciwgLy8gYDxib2R5PmBcbiAgICBub1Jlc2l6ZTogYm9vbGVhbiwgLy8gYDxmcmFtZT5gXG4gICAgbm9IcmVmOiBib29sZWFuLCAvLyBgPGFyZWE+YC4gVXNlIG5vIGhyZWYgaW5zdGVhZCBvZiBhbiBleHBsaWNpdCBgbm9ocmVmYFxuICAgIG5vU2hhZGU6IGJvb2xlYW4sIC8vIGA8aHI+YC4gVXNlIGJhY2tncm91bmQtY29sb3IgYW5kIGhlaWdodCBpbnN0ZWFkIG9mIGJvcmRlcnNcbiAgICBub1dyYXA6IGJvb2xlYW4sIC8vIGA8dGQ+YCBhbmQgYDx0aD5gXG4gICAgb2JqZWN0OiBudWxsLCAvLyBgPGFwcGxldD5gXG4gICAgcHJvZmlsZTogbnVsbCwgLy8gYDxoZWFkPmBcbiAgICBwcm9tcHQ6IG51bGwsIC8vIGA8aXNpbmRleD5gXG4gICAgcmV2OiBudWxsLCAvLyBgPGxpbms+YFxuICAgIHJpZ2h0TWFyZ2luOiBudW1iZXIsIC8vIGA8Ym9keT5gXG4gICAgcnVsZXM6IG51bGwsIC8vIGA8dGFibGU+YFxuICAgIHNjaGVtZTogbnVsbCwgLy8gYDxtZXRhPmBcbiAgICBzY3JvbGxpbmc6IGJvb2xlYW5pc2gsIC8vIGA8ZnJhbWU+YC4gVXNlIG92ZXJmbG93IGluIHRoZSBjaGlsZCBjb250ZXh0XG4gICAgc3RhbmRieTogbnVsbCwgLy8gYDxvYmplY3Q+YFxuICAgIHN1bW1hcnk6IG51bGwsIC8vIGA8dGFibGU+YFxuICAgIHRleHQ6IG51bGwsIC8vIGA8Ym9keT5gLiBVc2UgQ1NTIGBjb2xvcmAgaW5zdGVhZFxuICAgIHRvcE1hcmdpbjogbnVtYmVyLCAvLyBgPGJvZHk+YFxuICAgIHZhbHVlVHlwZTogbnVsbCwgLy8gYDxwYXJhbT5gXG4gICAgdmVyc2lvbjogbnVsbCwgLy8gYDxodG1sPmAuIFVzZSBhIGRvY3R5cGUuXG4gICAgdkFsaWduOiBudWxsLCAvLyBTZXZlcmFsLiBVc2UgQ1NTIGB2ZXJ0aWNhbC1hbGlnbmAgaW5zdGVhZFxuICAgIHZMaW5rOiBudWxsLCAvLyBgPGJvZHk+YC4gVXNlIENTUyBgYTp2aXNpdGVkIHtjb2xvcn1gIGluc3RlYWRcbiAgICB2U3BhY2U6IG51bWJlciwgLy8gYDxpbWc+YCBhbmQgYDxvYmplY3Q+YFxuXG4gICAgLy8gTm9uLXN0YW5kYXJkIFByb3BlcnRpZXMuXG4gICAgYWxsb3dUcmFuc3BhcmVuY3k6IG51bGwsXG4gICAgYXV0b0NvcnJlY3Q6IG51bGwsXG4gICAgYXV0b1NhdmU6IG51bGwsXG4gICAgZGlzYWJsZVBpY3R1cmVJblBpY3R1cmU6IGJvb2xlYW4sXG4gICAgZGlzYWJsZVJlbW90ZVBsYXliYWNrOiBib29sZWFuLFxuICAgIHByZWZpeDogbnVsbCxcbiAgICBwcm9wZXJ0eTogbnVsbCxcbiAgICByZXN1bHRzOiBudW1iZXIsXG4gICAgc2VjdXJpdHk6IG51bGwsXG4gICAgdW5zZWxlY3RhYmxlOiBudWxsXG4gIH1cbn0pXG4iLCIndXNlIHN0cmljdCdcblxudmFyIGNhc2VTZW5zaXRpdmVUcmFuc2Zvcm0gPSByZXF1aXJlKCcuL2Nhc2Utc2Vuc2l0aXZlLXRyYW5zZm9ybScpXG5cbm1vZHVsZS5leHBvcnRzID0gY2FzZUluc2Vuc2l0aXZlVHJhbnNmb3JtXG5cbmZ1bmN0aW9uIGNhc2VJbnNlbnNpdGl2ZVRyYW5zZm9ybShhdHRyaWJ1dGVzLCBwcm9wZXJ0eSkge1xuICByZXR1cm4gY2FzZVNlbnNpdGl2ZVRyYW5zZm9ybShhdHRyaWJ1dGVzLCBwcm9wZXJ0eS50b0xvd2VyQ2FzZSgpKVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gY2FzZVNlbnNpdGl2ZVRyYW5zZm9ybVxuXG5mdW5jdGlvbiBjYXNlU2Vuc2l0aXZlVHJhbnNmb3JtKGF0dHJpYnV0ZXMsIGF0dHJpYnV0ZSkge1xuICByZXR1cm4gYXR0cmlidXRlIGluIGF0dHJpYnV0ZXMgPyBhdHRyaWJ1dGVzW2F0dHJpYnV0ZV0gOiBhdHRyaWJ1dGVcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG52YXIgbm9ybWFsaXplID0gcmVxdWlyZSgnLi4vLi4vbm9ybWFsaXplJylcbnZhciBTY2hlbWEgPSByZXF1aXJlKCcuL3NjaGVtYScpXG52YXIgRGVmaW5lZEluZm8gPSByZXF1aXJlKCcuL2RlZmluZWQtaW5mbycpXG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlXG5cbmZ1bmN0aW9uIGNyZWF0ZShkZWZpbml0aW9uKSB7XG4gIHZhciBzcGFjZSA9IGRlZmluaXRpb24uc3BhY2VcbiAgdmFyIG11c3RVc2VQcm9wZXJ0eSA9IGRlZmluaXRpb24ubXVzdFVzZVByb3BlcnR5IHx8IFtdXG4gIHZhciBhdHRyaWJ1dGVzID0gZGVmaW5pdGlvbi5hdHRyaWJ1dGVzIHx8IHt9XG4gIHZhciBwcm9wcyA9IGRlZmluaXRpb24ucHJvcGVydGllc1xuICB2YXIgdHJhbnNmb3JtID0gZGVmaW5pdGlvbi50cmFuc2Zvcm1cbiAgdmFyIHByb3BlcnR5ID0ge31cbiAgdmFyIG5vcm1hbCA9IHt9XG4gIHZhciBwcm9wXG4gIHZhciBpbmZvXG5cbiAgZm9yIChwcm9wIGluIHByb3BzKSB7XG4gICAgaW5mbyA9IG5ldyBEZWZpbmVkSW5mbyhcbiAgICAgIHByb3AsXG4gICAgICB0cmFuc2Zvcm0oYXR0cmlidXRlcywgcHJvcCksXG4gICAgICBwcm9wc1twcm9wXSxcbiAgICAgIHNwYWNlXG4gICAgKVxuXG4gICAgaWYgKG11c3RVc2VQcm9wZXJ0eS5pbmRleE9mKHByb3ApICE9PSAtMSkge1xuICAgICAgaW5mby5tdXN0VXNlUHJvcGVydHkgPSB0cnVlXG4gICAgfVxuXG4gICAgcHJvcGVydHlbcHJvcF0gPSBpbmZvXG5cbiAgICBub3JtYWxbbm9ybWFsaXplKHByb3ApXSA9IHByb3BcbiAgICBub3JtYWxbbm9ybWFsaXplKGluZm8uYXR0cmlidXRlKV0gPSBwcm9wXG4gIH1cblxuICByZXR1cm4gbmV3IFNjaGVtYShwcm9wZXJ0eSwgbm9ybWFsLCBzcGFjZSlcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG52YXIgSW5mbyA9IHJlcXVpcmUoJy4vaW5mbycpXG52YXIgdHlwZXMgPSByZXF1aXJlKCcuL3R5cGVzJylcblxubW9kdWxlLmV4cG9ydHMgPSBEZWZpbmVkSW5mb1xuXG5EZWZpbmVkSW5mby5wcm90b3R5cGUgPSBuZXcgSW5mbygpXG5EZWZpbmVkSW5mby5wcm90b3R5cGUuZGVmaW5lZCA9IHRydWVcblxudmFyIGNoZWNrcyA9IFtcbiAgJ2Jvb2xlYW4nLFxuICAnYm9vbGVhbmlzaCcsXG4gICdvdmVybG9hZGVkQm9vbGVhbicsXG4gICdudW1iZXInLFxuICAnY29tbWFTZXBhcmF0ZWQnLFxuICAnc3BhY2VTZXBhcmF0ZWQnLFxuICAnY29tbWFPclNwYWNlU2VwYXJhdGVkJ1xuXVxudmFyIGNoZWNrc0xlbmd0aCA9IGNoZWNrcy5sZW5ndGhcblxuZnVuY3Rpb24gRGVmaW5lZEluZm8ocHJvcGVydHksIGF0dHJpYnV0ZSwgbWFzaywgc3BhY2UpIHtcbiAgdmFyIGluZGV4ID0gLTFcbiAgdmFyIGNoZWNrXG5cbiAgbWFyayh0aGlzLCAnc3BhY2UnLCBzcGFjZSlcblxuICBJbmZvLmNhbGwodGhpcywgcHJvcGVydHksIGF0dHJpYnV0ZSlcblxuICB3aGlsZSAoKytpbmRleCA8IGNoZWNrc0xlbmd0aCkge1xuICAgIGNoZWNrID0gY2hlY2tzW2luZGV4XVxuICAgIG1hcmsodGhpcywgY2hlY2ssIChtYXNrICYgdHlwZXNbY2hlY2tdKSA9PT0gdHlwZXNbY2hlY2tdKVxuICB9XG59XG5cbmZ1bmN0aW9uIG1hcmsodmFsdWVzLCBrZXksIHZhbHVlKSB7XG4gIGlmICh2YWx1ZSkge1xuICAgIHZhbHVlc1trZXldID0gdmFsdWVcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gSW5mb1xuXG52YXIgcHJvdG8gPSBJbmZvLnByb3RvdHlwZVxuXG5wcm90by5zcGFjZSA9IG51bGxcbnByb3RvLmF0dHJpYnV0ZSA9IG51bGxcbnByb3RvLnByb3BlcnR5ID0gbnVsbFxucHJvdG8uYm9vbGVhbiA9IGZhbHNlXG5wcm90by5ib29sZWFuaXNoID0gZmFsc2VcbnByb3RvLm92ZXJsb2FkZWRCb29sZWFuID0gZmFsc2VcbnByb3RvLm51bWJlciA9IGZhbHNlXG5wcm90by5jb21tYVNlcGFyYXRlZCA9IGZhbHNlXG5wcm90by5zcGFjZVNlcGFyYXRlZCA9IGZhbHNlXG5wcm90by5jb21tYU9yU3BhY2VTZXBhcmF0ZWQgPSBmYWxzZVxucHJvdG8ubXVzdFVzZVByb3BlcnR5ID0gZmFsc2VcbnByb3RvLmRlZmluZWQgPSBmYWxzZVxuXG5mdW5jdGlvbiBJbmZvKHByb3BlcnR5LCBhdHRyaWJ1dGUpIHtcbiAgdGhpcy5wcm9wZXJ0eSA9IHByb3BlcnR5XG4gIHRoaXMuYXR0cmlidXRlID0gYXR0cmlidXRlXG59XG4iLCIndXNlIHN0cmljdCdcblxudmFyIHh0ZW5kID0gcmVxdWlyZSgneHRlbmQnKVxudmFyIFNjaGVtYSA9IHJlcXVpcmUoJy4vc2NoZW1hJylcblxubW9kdWxlLmV4cG9ydHMgPSBtZXJnZVxuXG5mdW5jdGlvbiBtZXJnZShkZWZpbml0aW9ucykge1xuICB2YXIgbGVuZ3RoID0gZGVmaW5pdGlvbnMubGVuZ3RoXG4gIHZhciBwcm9wZXJ0eSA9IFtdXG4gIHZhciBub3JtYWwgPSBbXVxuICB2YXIgaW5kZXggPSAtMVxuICB2YXIgaW5mb1xuICB2YXIgc3BhY2VcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGluZm8gPSBkZWZpbml0aW9uc1tpbmRleF1cbiAgICBwcm9wZXJ0eS5wdXNoKGluZm8ucHJvcGVydHkpXG4gICAgbm9ybWFsLnB1c2goaW5mby5ub3JtYWwpXG4gICAgc3BhY2UgPSBpbmZvLnNwYWNlXG4gIH1cblxuICByZXR1cm4gbmV3IFNjaGVtYShcbiAgICB4dGVuZC5hcHBseShudWxsLCBwcm9wZXJ0eSksXG4gICAgeHRlbmQuYXBwbHkobnVsbCwgbm9ybWFsKSxcbiAgICBzcGFjZVxuICApXG59XG4iLCIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSBTY2hlbWFcblxudmFyIHByb3RvID0gU2NoZW1hLnByb3RvdHlwZVxuXG5wcm90by5zcGFjZSA9IG51bGxcbnByb3RvLm5vcm1hbCA9IHt9XG5wcm90by5wcm9wZXJ0eSA9IHt9XG5cbmZ1bmN0aW9uIFNjaGVtYShwcm9wZXJ0eSwgbm9ybWFsLCBzcGFjZSkge1xuICB0aGlzLnByb3BlcnR5ID0gcHJvcGVydHlcbiAgdGhpcy5ub3JtYWwgPSBub3JtYWxcblxuICBpZiAoc3BhY2UpIHtcbiAgICB0aGlzLnNwYWNlID0gc3BhY2VcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBwb3dlcnMgPSAwXG5cbmV4cG9ydHMuYm9vbGVhbiA9IGluY3JlbWVudCgpXG5leHBvcnRzLmJvb2xlYW5pc2ggPSBpbmNyZW1lbnQoKVxuZXhwb3J0cy5vdmVybG9hZGVkQm9vbGVhbiA9IGluY3JlbWVudCgpXG5leHBvcnRzLm51bWJlciA9IGluY3JlbWVudCgpXG5leHBvcnRzLnNwYWNlU2VwYXJhdGVkID0gaW5jcmVtZW50KClcbmV4cG9ydHMuY29tbWFTZXBhcmF0ZWQgPSBpbmNyZW1lbnQoKVxuZXhwb3J0cy5jb21tYU9yU3BhY2VTZXBhcmF0ZWQgPSBpbmNyZW1lbnQoKVxuXG5mdW5jdGlvbiBpbmNyZW1lbnQoKSB7XG4gIHJldHVybiBNYXRoLnBvdygyLCArK3Bvd2Vycylcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG52YXIgY3JlYXRlID0gcmVxdWlyZSgnLi91dGlsL2NyZWF0ZScpXG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlKHtcbiAgc3BhY2U6ICd4bGluaycsXG4gIHRyYW5zZm9ybTogeGxpbmtUcmFuc2Zvcm0sXG4gIHByb3BlcnRpZXM6IHtcbiAgICB4TGlua0FjdHVhdGU6IG51bGwsXG4gICAgeExpbmtBcmNSb2xlOiBudWxsLFxuICAgIHhMaW5rSHJlZjogbnVsbCxcbiAgICB4TGlua1JvbGU6IG51bGwsXG4gICAgeExpbmtTaG93OiBudWxsLFxuICAgIHhMaW5rVGl0bGU6IG51bGwsXG4gICAgeExpbmtUeXBlOiBudWxsXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIHhsaW5rVHJhbnNmb3JtKF8sIHByb3ApIHtcbiAgcmV0dXJuICd4bGluazonICsgcHJvcC5zbGljZSg1KS50b0xvd2VyQ2FzZSgpXG59XG4iLCIndXNlIHN0cmljdCdcblxudmFyIGNyZWF0ZSA9IHJlcXVpcmUoJy4vdXRpbC9jcmVhdGUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZSh7XG4gIHNwYWNlOiAneG1sJyxcbiAgdHJhbnNmb3JtOiB4bWxUcmFuc2Zvcm0sXG4gIHByb3BlcnRpZXM6IHtcbiAgICB4bWxMYW5nOiBudWxsLFxuICAgIHhtbEJhc2U6IG51bGwsXG4gICAgeG1sU3BhY2U6IG51bGxcbiAgfVxufSlcblxuZnVuY3Rpb24geG1sVHJhbnNmb3JtKF8sIHByb3ApIHtcbiAgcmV0dXJuICd4bWw6JyArIHByb3Auc2xpY2UoMykudG9Mb3dlckNhc2UoKVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBjcmVhdGUgPSByZXF1aXJlKCcuL3V0aWwvY3JlYXRlJylcbnZhciBjYXNlSW5zZW5zaXRpdmVUcmFuc2Zvcm0gPSByZXF1aXJlKCcuL3V0aWwvY2FzZS1pbnNlbnNpdGl2ZS10cmFuc2Zvcm0nKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZSh7XG4gIHNwYWNlOiAneG1sbnMnLFxuICBhdHRyaWJ1dGVzOiB7XG4gICAgeG1sbnN4bGluazogJ3htbG5zOnhsaW5rJ1xuICB9LFxuICB0cmFuc2Zvcm06IGNhc2VJbnNlbnNpdGl2ZVRyYW5zZm9ybSxcbiAgcHJvcGVydGllczoge1xuICAgIHhtbG5zOiBudWxsLFxuICAgIHhtbG5zWExpbms6IG51bGxcbiAgfVxufSlcbiIsIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5vcm1hbGl6ZVxuXG5mdW5jdGlvbiBub3JtYWxpemUodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlLnRvTG93ZXJDYXNlKClcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG4vKiBnbG9iYWwgd2luZG93LCBzZWxmICovXG5cbnZhciByZXN0b3JlID0gY2FwdHVyZSgpXG5cbi8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0IC0gRG9uJ3QgYWxsb3cgUHJpc20gdG8gcnVuIG9uIHBhZ2UgbG9hZCBpbiBicm93c2VyIG9yXG4vLyB0byBzdGFydCBtZXNzYWdpbmcgZnJvbSB3b3JrZXJzLlxudmFyIGN0eCA9XG4gIHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnXG4gICAgPyB0eXBlb2Ygc2VsZiA9PT0gJ3VuZGVmaW5lZCdcbiAgICAgID8ge31cbiAgICAgIDogc2VsZlxuICAgIDogd2luZG93XG5cbmN0eC5QcmlzbSA9IHttYW51YWw6IHRydWUsIGRpc2FibGVXb3JrZXJNZXNzYWdlSGFuZGxlcjogdHJ1ZX1cblxuLy8gTG9hZCBhbGwgc3R1ZmYgaW4gYHByaXNtLmpzYCBpdHNlbGYsIGV4Y2VwdCBmb3IgYHByaXNtLWZpbGUtaGlnaGxpZ2h0LmpzYC5cbi8vIFRoZSB3cmFwcGVkIG5vbi1sZWFreSBncmFtbWFycyBhcmUgbG9hZGVkIGluc3RlYWQgb2YgUHJpc23igJlzIG9yaWdpbmFscy5cbnZhciBoID0gcmVxdWlyZSgnaGFzdHNjcmlwdCcpXG52YXIgZGVjb2RlID0gcmVxdWlyZSgncGFyc2UtZW50aXRpZXMnKVxudmFyIFByaXNtID0gcmVxdWlyZSgncHJpc21qcy9jb21wb25lbnRzL3ByaXNtLWNvcmUnKVxudmFyIG1hcmt1cCA9IHJlcXVpcmUoJy4vbGFuZy9tYXJrdXAnKVxudmFyIGNzcyA9IHJlcXVpcmUoJy4vbGFuZy9jc3MnKVxudmFyIGNsaWtlID0gcmVxdWlyZSgnLi9sYW5nL2NsaWtlJylcbnZhciBqcyA9IHJlcXVpcmUoJy4vbGFuZy9qYXZhc2NyaXB0JylcblxucmVzdG9yZSgpXG5cbnZhciBvd24gPSB7fS5oYXNPd25Qcm9wZXJ0eVxuXG4vLyBJbmhlcml0LlxuZnVuY3Rpb24gUmVmcmFjdG9yKCkge31cblxuUmVmcmFjdG9yLnByb3RvdHlwZSA9IFByaXNtXG5cbi8vIENvbnN0cnVjdC5cbnZhciByZWZyYWN0ID0gbmV3IFJlZnJhY3RvcigpXG5cbi8vIEV4cG9zZS5cbm1vZHVsZS5leHBvcnRzID0gcmVmcmFjdFxuXG4vLyBDcmVhdGUuXG5yZWZyYWN0LmhpZ2hsaWdodCA9IGhpZ2hsaWdodFxucmVmcmFjdC5yZWdpc3RlciA9IHJlZ2lzdGVyXG5yZWZyYWN0LmFsaWFzID0gYWxpYXNcbnJlZnJhY3QucmVnaXN0ZXJlZCA9IHJlZ2lzdGVyZWRcbnJlZnJhY3QubGlzdExhbmd1YWdlcyA9IGxpc3RMYW5ndWFnZXNcblxuLy8gUmVnaXN0ZXIgYnVuZGxlZCBncmFtbWFycy5cbnJlZ2lzdGVyKG1hcmt1cClcbnJlZ2lzdGVyKGNzcylcbnJlZ2lzdGVyKGNsaWtlKVxucmVnaXN0ZXIoanMpXG5cbnJlZnJhY3QudXRpbC5lbmNvZGUgPSBlbmNvZGVcbnJlZnJhY3QuVG9rZW4uc3RyaW5naWZ5ID0gc3RyaW5naWZ5XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyKGdyYW1tYXIpIHtcbiAgaWYgKHR5cGVvZiBncmFtbWFyICE9PSAnZnVuY3Rpb24nIHx8ICFncmFtbWFyLmRpc3BsYXlOYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBgZnVuY3Rpb25gIGZvciBgZ3JhbW1hcmAsIGdvdCBgJyArIGdyYW1tYXIgKyAnYCcpXG4gIH1cblxuICAvLyBEbyBub3QgZHVwbGljYXRlIHJlZ2lzdHJhdGlvbnMuXG4gIGlmIChyZWZyYWN0Lmxhbmd1YWdlc1tncmFtbWFyLmRpc3BsYXlOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZ3JhbW1hcihyZWZyYWN0KVxuICB9XG59XG5cbmZ1bmN0aW9uIGFsaWFzKG5hbWUsIGFsaWFzKSB7XG4gIHZhciBsYW5ndWFnZXMgPSByZWZyYWN0Lmxhbmd1YWdlc1xuICB2YXIgbWFwID0gbmFtZVxuICB2YXIga2V5XG4gIHZhciBsaXN0XG4gIHZhciBsZW5ndGhcbiAgdmFyIGluZGV4XG5cbiAgaWYgKGFsaWFzKSB7XG4gICAgbWFwID0ge31cbiAgICBtYXBbbmFtZV0gPSBhbGlhc1xuICB9XG5cbiAgZm9yIChrZXkgaW4gbWFwKSB7XG4gICAgbGlzdCA9IG1hcFtrZXldXG4gICAgbGlzdCA9IHR5cGVvZiBsaXN0ID09PSAnc3RyaW5nJyA/IFtsaXN0XSA6IGxpc3RcbiAgICBsZW5ndGggPSBsaXN0Lmxlbmd0aFxuICAgIGluZGV4ID0gLTFcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICBsYW5ndWFnZXNbbGlzdFtpbmRleF1dID0gbGFuZ3VhZ2VzW2tleV1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gaGlnaGxpZ2h0KHZhbHVlLCBuYW1lKSB7XG4gIHZhciBzdXAgPSBQcmlzbS5oaWdobGlnaHRcbiAgdmFyIGdyYW1tYXJcblxuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgYHN0cmluZ2AgZm9yIGB2YWx1ZWAsIGdvdCBgJyArIHZhbHVlICsgJ2AnKVxuICB9XG5cbiAgLy8gYG5hbWVgIGlzIGEgZ3JhbW1hciBvYmplY3QuXG4gIGlmIChyZWZyYWN0LnV0aWwudHlwZShuYW1lKSA9PT0gJ09iamVjdCcpIHtcbiAgICBncmFtbWFyID0gbmFtZVxuICAgIG5hbWUgPSBudWxsXG4gIH0gZWxzZSB7XG4gICAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBgc3RyaW5nYCBmb3IgYG5hbWVgLCBnb3QgYCcgKyBuYW1lICsgJ2AnKVxuICAgIH1cblxuICAgIGlmIChvd24uY2FsbChyZWZyYWN0Lmxhbmd1YWdlcywgbmFtZSkpIHtcbiAgICAgIGdyYW1tYXIgPSByZWZyYWN0Lmxhbmd1YWdlc1tuYW1lXVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gbGFuZ3VhZ2U6IGAnICsgbmFtZSArICdgIGlzIG5vdCByZWdpc3RlcmVkJylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gc3VwLmNhbGwodGhpcywgdmFsdWUsIGdyYW1tYXIsIG5hbWUpXG59XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyZWQobGFuZ3VhZ2UpIHtcbiAgaWYgKHR5cGVvZiBsYW5ndWFnZSAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIGBzdHJpbmdgIGZvciBgbGFuZ3VhZ2VgLCBnb3QgYCcgKyBsYW5ndWFnZSArICdgJylcbiAgfVxuXG4gIHJldHVybiBvd24uY2FsbChyZWZyYWN0Lmxhbmd1YWdlcywgbGFuZ3VhZ2UpXG59XG5cbmZ1bmN0aW9uIGxpc3RMYW5ndWFnZXMoKSB7XG4gIHZhciBsYW5ndWFnZXMgPSByZWZyYWN0Lmxhbmd1YWdlc1xuICB2YXIgbGlzdCA9IFtdXG4gIHZhciBsYW5ndWFnZVxuXG4gIGZvciAobGFuZ3VhZ2UgaW4gbGFuZ3VhZ2VzKSB7XG4gICAgaWYgKFxuICAgICAgb3duLmNhbGwobGFuZ3VhZ2VzLCBsYW5ndWFnZSkgJiZcbiAgICAgIHR5cGVvZiBsYW5ndWFnZXNbbGFuZ3VhZ2VdID09PSAnb2JqZWN0J1xuICAgICkge1xuICAgICAgbGlzdC5wdXNoKGxhbmd1YWdlKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBsaXN0XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeSh2YWx1ZSwgbGFuZ3VhZ2UsIHBhcmVudCkge1xuICB2YXIgZW52XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4ge3R5cGU6ICd0ZXh0JywgdmFsdWU6IHZhbHVlfVxuICB9XG5cbiAgaWYgKHJlZnJhY3QudXRpbC50eXBlKHZhbHVlKSA9PT0gJ0FycmF5Jykge1xuICAgIHJldHVybiBzdHJpbmdpZnlBbGwodmFsdWUsIGxhbmd1YWdlKVxuICB9XG5cbiAgZW52ID0ge1xuICAgIHR5cGU6IHZhbHVlLnR5cGUsXG4gICAgY29udGVudDogcmVmcmFjdC5Ub2tlbi5zdHJpbmdpZnkodmFsdWUuY29udGVudCwgbGFuZ3VhZ2UsIHBhcmVudCksXG4gICAgdGFnOiAnc3BhbicsXG4gICAgY2xhc3NlczogWyd0b2tlbicsIHZhbHVlLnR5cGVdLFxuICAgIGF0dHJpYnV0ZXM6IHt9LFxuICAgIGxhbmd1YWdlOiBsYW5ndWFnZSxcbiAgICBwYXJlbnQ6IHBhcmVudFxuICB9XG5cbiAgaWYgKHZhbHVlLmFsaWFzKSB7XG4gICAgZW52LmNsYXNzZXMgPSBlbnYuY2xhc3Nlcy5jb25jYXQodmFsdWUuYWxpYXMpXG4gIH1cblxuICByZWZyYWN0Lmhvb2tzLnJ1bignd3JhcCcsIGVudilcblxuICByZXR1cm4gaChcbiAgICBlbnYudGFnICsgJy4nICsgZW52LmNsYXNzZXMuam9pbignLicpLFxuICAgIGF0dHJpYnV0ZXMoZW52LmF0dHJpYnV0ZXMpLFxuICAgIGVudi5jb250ZW50XG4gIClcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5QWxsKHZhbHVlcywgbGFuZ3VhZ2UpIHtcbiAgdmFyIHJlc3VsdCA9IFtdXG4gIHZhciBsZW5ndGggPSB2YWx1ZXMubGVuZ3RoXG4gIHZhciBpbmRleCA9IC0xXG4gIHZhciB2YWx1ZVxuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFsdWUgPSB2YWx1ZXNbaW5kZXhdXG5cbiAgICBpZiAodmFsdWUgIT09ICcnICYmIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKVxuICAgIH1cbiAgfVxuXG4gIGluZGV4ID0gLTFcbiAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aFxuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFsdWUgPSByZXN1bHRbaW5kZXhdXG4gICAgcmVzdWx0W2luZGV4XSA9IHJlZnJhY3QuVG9rZW4uc3RyaW5naWZ5KHZhbHVlLCBsYW5ndWFnZSwgcmVzdWx0KVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG5mdW5jdGlvbiBlbmNvZGUodG9rZW5zKSB7XG4gIHJldHVybiB0b2tlbnNcbn1cblxuZnVuY3Rpb24gYXR0cmlidXRlcyhhdHRycykge1xuICB2YXIga2V5XG5cbiAgZm9yIChrZXkgaW4gYXR0cnMpIHtcbiAgICBhdHRyc1trZXldID0gZGVjb2RlKGF0dHJzW2tleV0pXG4gIH1cblxuICByZXR1cm4gYXR0cnNcbn1cblxuZnVuY3Rpb24gY2FwdHVyZSgpIHtcbiAgdmFyIGRlZmluZWQgPSAnUHJpc20nIGluIGdsb2JhbFxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICB2YXIgY3VycmVudCA9IGRlZmluZWQgPyBnbG9iYWwuUHJpc20gOiB1bmRlZmluZWRcblxuICByZXR1cm4gcmVzdG9yZVxuXG4gIGZ1bmN0aW9uIHJlc3RvcmUoKSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgLSBDbGVhbiBsZWFrcyBhZnRlciBQcmlzbS4gKi9cbiAgICBpZiAoZGVmaW5lZCkge1xuICAgICAgZ2xvYmFsLlByaXNtID0gY3VycmVudFxuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgZ2xvYmFsLlByaXNtXG4gICAgfVxuXG4gICAgZGVmaW5lZCA9IHVuZGVmaW5lZFxuICAgIGN1cnJlbnQgPSB1bmRlZmluZWRcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gY2xpa2VcbmNsaWtlLmRpc3BsYXlOYW1lID0gJ2NsaWtlJ1xuY2xpa2UuYWxpYXNlcyA9IFtdXG5mdW5jdGlvbiBjbGlrZShQcmlzbSkge1xuICBQcmlzbS5sYW5ndWFnZXMuY2xpa2UgPSB7XG4gICAgY29tbWVudDogW1xuICAgICAge1xuICAgICAgICBwYXR0ZXJuOiAvKF58W15cXFxcXSlcXC9cXCpbXFxzXFxTXSo/KD86XFwqXFwvfCQpLyxcbiAgICAgICAgbG9va2JlaGluZDogdHJ1ZVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0dGVybjogLyhefFteXFxcXDpdKVxcL1xcLy4qLyxcbiAgICAgICAgbG9va2JlaGluZDogdHJ1ZSxcbiAgICAgICAgZ3JlZWR5OiB0cnVlXG4gICAgICB9XG4gICAgXSxcbiAgICBzdHJpbmc6IHtcbiAgICAgIHBhdHRlcm46IC8oW1wiJ10pKD86XFxcXCg/OlxcclxcbnxbXFxzXFxTXSl8KD8hXFwxKVteXFxcXFxcclxcbl0pKlxcMS8sXG4gICAgICBncmVlZHk6IHRydWVcbiAgICB9LFxuICAgICdjbGFzcy1uYW1lJzoge1xuICAgICAgcGF0dGVybjogLygoPzpcXGIoPzpjbGFzc3xpbnRlcmZhY2V8ZXh0ZW5kc3xpbXBsZW1lbnRzfHRyYWl0fGluc3RhbmNlb2Z8bmV3KVxccyspfCg/OmNhdGNoXFxzK1xcKCkpW1xcdy5cXFxcXSsvaSxcbiAgICAgIGxvb2tiZWhpbmQ6IHRydWUsXG4gICAgICBpbnNpZGU6IHtcbiAgICAgICAgcHVuY3R1YXRpb246IC9bLlxcXFxdL1xuICAgICAgfVxuICAgIH0sXG4gICAga2V5d29yZDogL1xcYig/OmlmfGVsc2V8d2hpbGV8ZG98Zm9yfHJldHVybnxpbnxpbnN0YW5jZW9mfGZ1bmN0aW9ufG5ld3x0cnl8dGhyb3d8Y2F0Y2h8ZmluYWxseXxudWxsfGJyZWFrfGNvbnRpbnVlKVxcYi8sXG4gICAgYm9vbGVhbjogL1xcYig/OnRydWV8ZmFsc2UpXFxiLyxcbiAgICBmdW5jdGlvbjogL1xcdysoPz1cXCgpLyxcbiAgICBudW1iZXI6IC9cXGIweFtcXGRhLWZdK1xcYnwoPzpcXGJcXGQrXFwuP1xcZCp8XFxCXFwuXFxkKykoPzplWystXT9cXGQrKT8vaSxcbiAgICBvcGVyYXRvcjogLy0tP3xcXCtcXCs/fCE9Pz0/fDw9P3w+PT98PT0/PT98JiY/fFxcfFxcfD98XFw/fFxcKnxcXC98fnxcXF58JS8sXG4gICAgcHVuY3R1YXRpb246IC9be31bXFxdOygpLC46XS9cbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gY3NzXG5jc3MuZGlzcGxheU5hbWUgPSAnY3NzJ1xuY3NzLmFsaWFzZXMgPSBbXVxuZnVuY3Rpb24gY3NzKFByaXNtKSB7XG4gIDsoZnVuY3Rpb24oUHJpc20pIHtcbiAgICB2YXIgc3RyaW5nID0gLyhcInwnKSg/OlxcXFwoPzpcXHJcXG58W1xcc1xcU10pfCg/IVxcMSlbXlxcXFxcXHJcXG5dKSpcXDEvXG4gICAgUHJpc20ubGFuZ3VhZ2VzLmNzcyA9IHtcbiAgICAgIGNvbW1lbnQ6IC9cXC9cXCpbXFxzXFxTXSo/XFwqXFwvLyxcbiAgICAgIGF0cnVsZToge1xuICAgICAgICBwYXR0ZXJuOiAvQFtcXHctXStbXFxzXFxTXSo/KD86O3woPz1cXHMqXFx7KSkvLFxuICAgICAgICBpbnNpZGU6IHtcbiAgICAgICAgICBydWxlOiAvQFtcXHctXSsvIC8vIFNlZSByZXN0IGJlbG93XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB1cmw6IHtcbiAgICAgICAgcGF0dGVybjogUmVnRXhwKCd1cmxcXFxcKCg/OicgKyBzdHJpbmcuc291cmNlICsgJ3xbXlxcblxccigpXSopXFxcXCknLCAnaScpLFxuICAgICAgICBpbnNpZGU6IHtcbiAgICAgICAgICBmdW5jdGlvbjogL151cmwvaSxcbiAgICAgICAgICBwdW5jdHVhdGlvbjogL15cXCh8XFwpJC9cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHNlbGVjdG9yOiBSZWdFeHAoXG4gICAgICAgICdbXnt9XFxcXHNdKD86W157fTtcIlxcJ118JyArIHN0cmluZy5zb3VyY2UgKyAnKSo/KD89XFxcXHMqXFxcXHspJ1xuICAgICAgKSxcbiAgICAgIHN0cmluZzoge1xuICAgICAgICBwYXR0ZXJuOiBzdHJpbmcsXG4gICAgICAgIGdyZWVkeTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIHByb3BlcnR5OiAvWy1fYS16XFx4QTAtXFx1RkZGRl1bLVxcd1xceEEwLVxcdUZGRkZdKig/PVxccyo6KS9pLFxuICAgICAgaW1wb3J0YW50OiAvIWltcG9ydGFudFxcYi9pLFxuICAgICAgZnVuY3Rpb246IC9bLWEtejAtOV0rKD89XFwoKS9pLFxuICAgICAgcHVuY3R1YXRpb246IC9bKCl7fTs6LF0vXG4gICAgfVxuICAgIFByaXNtLmxhbmd1YWdlcy5jc3NbJ2F0cnVsZSddLmluc2lkZS5yZXN0ID0gUHJpc20ubGFuZ3VhZ2VzLmNzc1xuICAgIHZhciBtYXJrdXAgPSBQcmlzbS5sYW5ndWFnZXMubWFya3VwXG4gICAgaWYgKG1hcmt1cCkge1xuICAgICAgbWFya3VwLnRhZy5hZGRJbmxpbmVkKCdzdHlsZScsICdjc3MnKVxuICAgICAgUHJpc20ubGFuZ3VhZ2VzLmluc2VydEJlZm9yZShcbiAgICAgICAgJ2luc2lkZScsXG4gICAgICAgICdhdHRyLXZhbHVlJyxcbiAgICAgICAge1xuICAgICAgICAgICdzdHlsZS1hdHRyJzoge1xuICAgICAgICAgICAgcGF0dGVybjogL1xccypzdHlsZT0oXCJ8JykoPzpcXFxcW1xcc1xcU118KD8hXFwxKVteXFxcXF0pKlxcMS9pLFxuICAgICAgICAgICAgaW5zaWRlOiB7XG4gICAgICAgICAgICAgICdhdHRyLW5hbWUnOiB7XG4gICAgICAgICAgICAgICAgcGF0dGVybjogL15cXHMqc3R5bGUvaSxcbiAgICAgICAgICAgICAgICBpbnNpZGU6IG1hcmt1cC50YWcuaW5zaWRlXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHB1bmN0dWF0aW9uOiAvXlxccyo9XFxzKlsnXCJdfFsnXCJdXFxzKiQvLFxuICAgICAgICAgICAgICAnYXR0ci12YWx1ZSc6IHtcbiAgICAgICAgICAgICAgICBwYXR0ZXJuOiAvLisvaSxcbiAgICAgICAgICAgICAgICBpbnNpZGU6IFByaXNtLmxhbmd1YWdlcy5jc3NcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFsaWFzOiAnbGFuZ3VhZ2UtY3NzJ1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbWFya3VwLnRhZ1xuICAgICAgKVxuICAgIH1cbiAgfSkoUHJpc20pXG59XG4iLCIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSBqYXZhc2NyaXB0XG5qYXZhc2NyaXB0LmRpc3BsYXlOYW1lID0gJ2phdmFzY3JpcHQnXG5qYXZhc2NyaXB0LmFsaWFzZXMgPSBbJ2pzJ11cbmZ1bmN0aW9uIGphdmFzY3JpcHQoUHJpc20pIHtcbiAgUHJpc20ubGFuZ3VhZ2VzLmphdmFzY3JpcHQgPSBQcmlzbS5sYW5ndWFnZXMuZXh0ZW5kKCdjbGlrZScsIHtcbiAgICAnY2xhc3MtbmFtZSc6IFtcbiAgICAgIFByaXNtLmxhbmd1YWdlcy5jbGlrZVsnY2xhc3MtbmFtZSddLFxuICAgICAge1xuICAgICAgICBwYXR0ZXJuOiAvKF58W14kXFx3XFx4QTAtXFx1RkZGRl0pW18kQS1aXFx4QTAtXFx1RkZGRl1bJFxcd1xceEEwLVxcdUZGRkZdKig/PVxcLig/OnByb3RvdHlwZXxjb25zdHJ1Y3RvcikpLyxcbiAgICAgICAgbG9va2JlaGluZDogdHJ1ZVxuICAgICAgfVxuICAgIF0sXG4gICAga2V5d29yZDogW1xuICAgICAge1xuICAgICAgICBwYXR0ZXJuOiAvKCg/Ol58fSlcXHMqKSg/OmNhdGNofGZpbmFsbHkpXFxiLyxcbiAgICAgICAgbG9va2JlaGluZDogdHJ1ZVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0dGVybjogLyhefFteLl0pXFxiKD86YXN8YXN5bmMoPz1cXHMqKD86ZnVuY3Rpb25cXGJ8XFwofFskXFx3XFx4QTAtXFx1RkZGRl18JCkpfGF3YWl0fGJyZWFrfGNhc2V8Y2xhc3N8Y29uc3R8Y29udGludWV8ZGVidWdnZXJ8ZGVmYXVsdHxkZWxldGV8ZG98ZWxzZXxlbnVtfGV4cG9ydHxleHRlbmRzfGZvcnxmcm9tfGZ1bmN0aW9ufGdldHxpZnxpbXBsZW1lbnRzfGltcG9ydHxpbnxpbnN0YW5jZW9mfGludGVyZmFjZXxsZXR8bmV3fG51bGx8b2Z8cGFja2FnZXxwcml2YXRlfHByb3RlY3RlZHxwdWJsaWN8cmV0dXJufHNldHxzdGF0aWN8c3VwZXJ8c3dpdGNofHRoaXN8dGhyb3d8dHJ5fHR5cGVvZnx1bmRlZmluZWR8dmFyfHZvaWR8d2hpbGV8d2l0aHx5aWVsZClcXGIvLFxuICAgICAgICBsb29rYmVoaW5kOiB0cnVlXG4gICAgICB9XG4gICAgXSxcbiAgICBudW1iZXI6IC9cXGIoPzooPzowW3hYXSg/OltcXGRBLUZhLWZdKD86X1tcXGRBLUZhLWZdKT8pK3wwW2JCXSg/OlswMV0oPzpfWzAxXSk/KSt8MFtvT10oPzpbMC03XSg/Ol9bMC03XSk/KSspbj98KD86XFxkKD86X1xcZCk/KStufE5hTnxJbmZpbml0eSlcXGJ8KD86XFxiKD86XFxkKD86X1xcZCk/KStcXC4/KD86XFxkKD86X1xcZCk/KSp8XFxCXFwuKD86XFxkKD86X1xcZCk/KSspKD86W0VlXVsrLV0/KD86XFxkKD86X1xcZCk/KSspPy8sXG4gICAgLy8gQWxsb3cgZm9yIGFsbCBub24tQVNDSUkgY2hhcmFjdGVycyAoU2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIwMDg0NDQpXG4gICAgZnVuY3Rpb246IC8jP1tfJGEtekEtWlxceEEwLVxcdUZGRkZdWyRcXHdcXHhBMC1cXHVGRkZGXSooPz1cXHMqKD86XFwuXFxzKig/OmFwcGx5fGJpbmR8Y2FsbClcXHMqKT9cXCgpLyxcbiAgICBvcGVyYXRvcjogLy1bLT1dP3xcXCtbKz1dP3whPT89P3w8PD89P3w+Pj8+Pz0/fD0oPzo9PT98Pik/fCZbJj1dP3xcXHxbfD1dP3xcXCpcXCo/PT98XFwvPT98fnxcXF49P3wlPT98XFw/fFxcLnszfS9cbiAgfSlcbiAgUHJpc20ubGFuZ3VhZ2VzLmphdmFzY3JpcHRbXG4gICAgJ2NsYXNzLW5hbWUnXG4gIF1bMF0ucGF0dGVybiA9IC8oXFxiKD86Y2xhc3N8aW50ZXJmYWNlfGV4dGVuZHN8aW1wbGVtZW50c3xpbnN0YW5jZW9mfG5ldylcXHMrKVtcXHcuXFxcXF0rL1xuICBQcmlzbS5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKCdqYXZhc2NyaXB0JywgJ2tleXdvcmQnLCB7XG4gICAgcmVnZXg6IHtcbiAgICAgIHBhdHRlcm46IC8oKD86XnxbXiRcXHdcXHhBMC1cXHVGRkZGLlwiJ1xcXSlcXHNdKVxccyopXFwvKFxcWyg/OlteXFxdXFxcXFxcclxcbl18XFxcXC4pKl18XFxcXC58W14vXFxcXFxcW1xcclxcbl0pK1xcL1tnaW15dXNdezAsNn0oPz1cXHMqKCR8W1xcclxcbiwuO30pXFxdXSkpLyxcbiAgICAgIGxvb2tiZWhpbmQ6IHRydWUsXG4gICAgICBncmVlZHk6IHRydWVcbiAgICB9LFxuICAgIC8vIFRoaXMgbXVzdCBiZSBkZWNsYXJlZCBiZWZvcmUga2V5d29yZCBiZWNhdXNlIHdlIHVzZSBcImZ1bmN0aW9uXCIgaW5zaWRlIHRoZSBsb29rLWZvcndhcmRcbiAgICAnZnVuY3Rpb24tdmFyaWFibGUnOiB7XG4gICAgICBwYXR0ZXJuOiAvIz9bXyRhLXpBLVpcXHhBMC1cXHVGRkZGXVskXFx3XFx4QTAtXFx1RkZGRl0qKD89XFxzKls9Ol1cXHMqKD86YXN5bmNcXHMqKT8oPzpcXGJmdW5jdGlvblxcYnwoPzpcXCgoPzpbXigpXXxcXChbXigpXSpcXCkpKlxcKXxbXyRhLXpBLVpcXHhBMC1cXHVGRkZGXVskXFx3XFx4QTAtXFx1RkZGRl0qKVxccyo9PikpLyxcbiAgICAgIGFsaWFzOiAnZnVuY3Rpb24nXG4gICAgfSxcbiAgICBwYXJhbWV0ZXI6IFtcbiAgICAgIHtcbiAgICAgICAgcGF0dGVybjogLyhmdW5jdGlvbig/OlxccytbXyRBLVphLXpcXHhBMC1cXHVGRkZGXVskXFx3XFx4QTAtXFx1RkZGRl0qKT9cXHMqXFwoXFxzKikoPyFcXHMpKD86W14oKV18XFwoW14oKV0qXFwpKSs/KD89XFxzKlxcKSkvLFxuICAgICAgICBsb29rYmVoaW5kOiB0cnVlLFxuICAgICAgICBpbnNpZGU6IFByaXNtLmxhbmd1YWdlcy5qYXZhc2NyaXB0XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXR0ZXJuOiAvW18kYS16XFx4QTAtXFx1RkZGRl1bJFxcd1xceEEwLVxcdUZGRkZdKig/PVxccyo9PikvaSxcbiAgICAgICAgaW5zaWRlOiBQcmlzbS5sYW5ndWFnZXMuamF2YXNjcmlwdFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0dGVybjogLyhcXChcXHMqKSg/IVxccykoPzpbXigpXXxcXChbXigpXSpcXCkpKz8oPz1cXHMqXFwpXFxzKj0+KS8sXG4gICAgICAgIGxvb2tiZWhpbmQ6IHRydWUsXG4gICAgICAgIGluc2lkZTogUHJpc20ubGFuZ3VhZ2VzLmphdmFzY3JpcHRcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdHRlcm46IC8oKD86XFxifFxcc3xeKSg/ISg/OmFzfGFzeW5jfGF3YWl0fGJyZWFrfGNhc2V8Y2F0Y2h8Y2xhc3N8Y29uc3R8Y29udGludWV8ZGVidWdnZXJ8ZGVmYXVsdHxkZWxldGV8ZG98ZWxzZXxlbnVtfGV4cG9ydHxleHRlbmRzfGZpbmFsbHl8Zm9yfGZyb218ZnVuY3Rpb258Z2V0fGlmfGltcGxlbWVudHN8aW1wb3J0fGlufGluc3RhbmNlb2Z8aW50ZXJmYWNlfGxldHxuZXd8bnVsbHxvZnxwYWNrYWdlfHByaXZhdGV8cHJvdGVjdGVkfHB1YmxpY3xyZXR1cm58c2V0fHN0YXRpY3xzdXBlcnxzd2l0Y2h8dGhpc3x0aHJvd3x0cnl8dHlwZW9mfHVuZGVmaW5lZHx2YXJ8dm9pZHx3aGlsZXx3aXRofHlpZWxkKSg/IVskXFx3XFx4QTAtXFx1RkZGRl0pKSg/OltfJEEtWmEtelxceEEwLVxcdUZGRkZdWyRcXHdcXHhBMC1cXHVGRkZGXSpcXHMqKVxcKFxccyopKD8hXFxzKSg/OlteKCldfFxcKFteKCldKlxcKSkrPyg/PVxccypcXClcXHMqXFx7KS8sXG4gICAgICAgIGxvb2tiZWhpbmQ6IHRydWUsXG4gICAgICAgIGluc2lkZTogUHJpc20ubGFuZ3VhZ2VzLmphdmFzY3JpcHRcbiAgICAgIH1cbiAgICBdLFxuICAgIGNvbnN0YW50OiAvXFxiW0EtWl0oPzpbQS1aX118XFxkeD8pKlxcYi9cbiAgfSlcbiAgUHJpc20ubGFuZ3VhZ2VzLmluc2VydEJlZm9yZSgnamF2YXNjcmlwdCcsICdzdHJpbmcnLCB7XG4gICAgJ3RlbXBsYXRlLXN0cmluZyc6IHtcbiAgICAgIHBhdHRlcm46IC9gKD86XFxcXFtcXHNcXFNdfFxcJHsoPzpbXnt9XXx7KD86W157fV18e1tefV0qfSkqfSkrfXwoPyFcXCR7KVteXFxcXGBdKSpgLyxcbiAgICAgIGdyZWVkeTogdHJ1ZSxcbiAgICAgIGluc2lkZToge1xuICAgICAgICAndGVtcGxhdGUtcHVuY3R1YXRpb24nOiB7XG4gICAgICAgICAgcGF0dGVybjogL15gfGAkLyxcbiAgICAgICAgICBhbGlhczogJ3N0cmluZydcbiAgICAgICAgfSxcbiAgICAgICAgaW50ZXJwb2xhdGlvbjoge1xuICAgICAgICAgIHBhdHRlcm46IC8oKD86XnxbXlxcXFxdKSg/OlxcXFx7Mn0pKilcXCR7KD86W157fV18eyg/Oltee31dfHtbXn1dKn0pKn0pK30vLFxuICAgICAgICAgIGxvb2tiZWhpbmQ6IHRydWUsXG4gICAgICAgICAgaW5zaWRlOiB7XG4gICAgICAgICAgICAnaW50ZXJwb2xhdGlvbi1wdW5jdHVhdGlvbic6IHtcbiAgICAgICAgICAgICAgcGF0dGVybjogL15cXCR7fH0kLyxcbiAgICAgICAgICAgICAgYWxpYXM6ICdwdW5jdHVhdGlvbidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXN0OiBQcmlzbS5sYW5ndWFnZXMuamF2YXNjcmlwdFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgc3RyaW5nOiAvW1xcc1xcU10rL1xuICAgICAgfVxuICAgIH1cbiAgfSlcbiAgaWYgKFByaXNtLmxhbmd1YWdlcy5tYXJrdXApIHtcbiAgICBQcmlzbS5sYW5ndWFnZXMubWFya3VwLnRhZy5hZGRJbmxpbmVkKCdzY3JpcHQnLCAnamF2YXNjcmlwdCcpXG4gIH1cbiAgUHJpc20ubGFuZ3VhZ2VzLmpzID0gUHJpc20ubGFuZ3VhZ2VzLmphdmFzY3JpcHRcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcmt1cFxubWFya3VwLmRpc3BsYXlOYW1lID0gJ21hcmt1cCdcbm1hcmt1cC5hbGlhc2VzID0gWyd4bWwnLCAnaHRtbCcsICdtYXRobWwnLCAnc3ZnJ11cbmZ1bmN0aW9uIG1hcmt1cChQcmlzbSkge1xuICBQcmlzbS5sYW5ndWFnZXMubWFya3VwID0ge1xuICAgIGNvbW1lbnQ6IC88IS0tW1xcc1xcU10qPy0tPi8sXG4gICAgcHJvbG9nOiAvPFxcP1tcXHNcXFNdKz9cXD8+LyxcbiAgICBkb2N0eXBlOiAvPCFET0NUWVBFW1xcc1xcU10rPz4vaSxcbiAgICBjZGF0YTogLzwhXFxbQ0RBVEFcXFtbXFxzXFxTXSo/XV0+L2ksXG4gICAgdGFnOiB7XG4gICAgICBwYXR0ZXJuOiAvPFxcLz8oPyFcXGQpW15cXHM+XFwvPSQ8JV0rKD86XFxzKD86XFxzKlteXFxzPlxcLz1dKyg/Olxccyo9XFxzKig/OlwiW15cIl0qXCJ8J1teJ10qJ3xbXlxccydcIj49XSsoPz1bXFxzPl0pKXwoPz1bXFxzLz5dKSkpKyk/XFxzKlxcLz8+L2ksXG4gICAgICBncmVlZHk6IHRydWUsXG4gICAgICBpbnNpZGU6IHtcbiAgICAgICAgdGFnOiB7XG4gICAgICAgICAgcGF0dGVybjogL148XFwvP1teXFxzPlxcL10rL2ksXG4gICAgICAgICAgaW5zaWRlOiB7XG4gICAgICAgICAgICBwdW5jdHVhdGlvbjogL148XFwvPy8sXG4gICAgICAgICAgICBuYW1lc3BhY2U6IC9eW15cXHM+XFwvOl0rOi9cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgICdhdHRyLXZhbHVlJzoge1xuICAgICAgICAgIHBhdHRlcm46IC89XFxzKig/OlwiW15cIl0qXCJ8J1teJ10qJ3xbXlxccydcIj49XSspL2ksXG4gICAgICAgICAgaW5zaWRlOiB7XG4gICAgICAgICAgICBwdW5jdHVhdGlvbjogW1xuICAgICAgICAgICAgICAvXj0vLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcGF0dGVybjogL14oXFxzKilbXCInXXxbXCInXSQvLFxuICAgICAgICAgICAgICAgIGxvb2tiZWhpbmQ6IHRydWVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcHVuY3R1YXRpb246IC9cXC8/Pi8sXG4gICAgICAgICdhdHRyLW5hbWUnOiB7XG4gICAgICAgICAgcGF0dGVybjogL1teXFxzPlxcL10rLyxcbiAgICAgICAgICBpbnNpZGU6IHtcbiAgICAgICAgICAgIG5hbWVzcGFjZTogL15bXlxccz5cXC86XSs6L1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgZW50aXR5OiAvJiM/W1xcZGEtel17MSw4fTsvaVxuICB9XG4gIFByaXNtLmxhbmd1YWdlcy5tYXJrdXBbJ3RhZyddLmluc2lkZVsnYXR0ci12YWx1ZSddLmluc2lkZVsnZW50aXR5J10gPVxuICAgIFByaXNtLmxhbmd1YWdlcy5tYXJrdXBbJ2VudGl0eSddIC8vIFBsdWdpbiB0byBtYWtlIGVudGl0eSB0aXRsZSBzaG93IHRoZSByZWFsIGVudGl0eSwgaWRlYSBieSBSb21hbiBLb21hcm92XG4gIFByaXNtLmhvb2tzLmFkZCgnd3JhcCcsIGZ1bmN0aW9uKGVudikge1xuICAgIGlmIChlbnYudHlwZSA9PT0gJ2VudGl0eScpIHtcbiAgICAgIGVudi5hdHRyaWJ1dGVzWyd0aXRsZSddID0gZW52LmNvbnRlbnQudmFsdWUucmVwbGFjZSgvJmFtcDsvLCAnJicpXG4gICAgfVxuICB9KVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUHJpc20ubGFuZ3VhZ2VzLm1hcmt1cC50YWcsICdhZGRJbmxpbmVkJywge1xuICAgIC8qKlxuICAgICAqIEFkZHMgYW4gaW5saW5lZCBsYW5ndWFnZSB0byBtYXJrdXAuXG4gICAgICpcbiAgICAgKiBBbiBleGFtcGxlIG9mIGFuIGlubGluZWQgbGFuZ3VhZ2UgaXMgQ1NTIHdpdGggYDxzdHlsZT5gIHRhZ3MuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGFnTmFtZSBUaGUgbmFtZSBvZiB0aGUgdGFnIHRoYXQgY29udGFpbnMgdGhlIGlubGluZWQgbGFuZ3VhZ2UuIFRoaXMgbmFtZSB3aWxsIGJlIHRyZWF0ZWQgYXNcbiAgICAgKiBjYXNlIGluc2Vuc2l0aXZlLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsYW5nIFRoZSBsYW5ndWFnZSBrZXkuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBhZGRJbmxpbmVkKCdzdHlsZScsICdjc3MnKTtcbiAgICAgKi9cbiAgICB2YWx1ZTogZnVuY3Rpb24gYWRkSW5saW5lZCh0YWdOYW1lLCBsYW5nKSB7XG4gICAgICB2YXIgaW5jbHVkZWRDZGF0YUluc2lkZSA9IHt9XG4gICAgICBpbmNsdWRlZENkYXRhSW5zaWRlWydsYW5ndWFnZS0nICsgbGFuZ10gPSB7XG4gICAgICAgIHBhdHRlcm46IC8oXjwhXFxbQ0RBVEFcXFspW1xcc1xcU10rPyg/PVxcXVxcXT4kKS9pLFxuICAgICAgICBsb29rYmVoaW5kOiB0cnVlLFxuICAgICAgICBpbnNpZGU6IFByaXNtLmxhbmd1YWdlc1tsYW5nXVxuICAgICAgfVxuICAgICAgaW5jbHVkZWRDZGF0YUluc2lkZVsnY2RhdGEnXSA9IC9ePCFcXFtDREFUQVxcW3xcXF1cXF0+JC9pXG4gICAgICB2YXIgaW5zaWRlID0ge1xuICAgICAgICAnaW5jbHVkZWQtY2RhdGEnOiB7XG4gICAgICAgICAgcGF0dGVybjogLzwhXFxbQ0RBVEFcXFtbXFxzXFxTXSo/XFxdXFxdPi9pLFxuICAgICAgICAgIGluc2lkZTogaW5jbHVkZWRDZGF0YUluc2lkZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpbnNpZGVbJ2xhbmd1YWdlLScgKyBsYW5nXSA9IHtcbiAgICAgICAgcGF0dGVybjogL1tcXHNcXFNdKy8sXG4gICAgICAgIGluc2lkZTogUHJpc20ubGFuZ3VhZ2VzW2xhbmddXG4gICAgICB9XG4gICAgICB2YXIgZGVmID0ge31cbiAgICAgIGRlZlt0YWdOYW1lXSA9IHtcbiAgICAgICAgcGF0dGVybjogUmVnRXhwKFxuICAgICAgICAgIC8oPF9fW1xcc1xcU10qPz4pKD86PCFcXFtDREFUQVxcW1tcXHNcXFNdKj9cXF1cXF0+XFxzKnxbXFxzXFxTXSkqPyg/PTxcXC9fXz4pLy5zb3VyY2UucmVwbGFjZShcbiAgICAgICAgICAgIC9fXy9nLFxuICAgICAgICAgICAgdGFnTmFtZVxuICAgICAgICAgICksXG4gICAgICAgICAgJ2knXG4gICAgICAgICksXG4gICAgICAgIGxvb2tiZWhpbmQ6IHRydWUsXG4gICAgICAgIGdyZWVkeTogdHJ1ZSxcbiAgICAgICAgaW5zaWRlOiBpbnNpZGVcbiAgICAgIH1cbiAgICAgIFByaXNtLmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoJ21hcmt1cCcsICdjZGF0YScsIGRlZilcbiAgICB9XG4gIH0pXG4gIFByaXNtLmxhbmd1YWdlcy54bWwgPSBQcmlzbS5sYW5ndWFnZXMuZXh0ZW5kKCdtYXJrdXAnLCB7fSlcbiAgUHJpc20ubGFuZ3VhZ2VzLmh0bWwgPSBQcmlzbS5sYW5ndWFnZXMubWFya3VwXG4gIFByaXNtLmxhbmd1YWdlcy5tYXRobWwgPSBQcmlzbS5sYW5ndWFnZXMubWFya3VwXG4gIFByaXNtLmxhbmd1YWdlcy5zdmcgPSBQcmlzbS5sYW5ndWFnZXMubWFya3VwXG59XG4iLCJ2YXIgX3NlbGYgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpXG5cdD8gd2luZG93ICAgLy8gaWYgaW4gYnJvd3NlclxuXHQ6IChcblx0XHQodHlwZW9mIFdvcmtlckdsb2JhbFNjb3BlICE9PSAndW5kZWZpbmVkJyAmJiBzZWxmIGluc3RhbmNlb2YgV29ya2VyR2xvYmFsU2NvcGUpXG5cdFx0PyBzZWxmIC8vIGlmIGluIHdvcmtlclxuXHRcdDoge30gICAvLyBpZiBpbiBub2RlIGpzXG5cdCk7XG5cbi8qKlxuICogUHJpc206IExpZ2h0d2VpZ2h0LCByb2J1c3QsIGVsZWdhbnQgc3ludGF4IGhpZ2hsaWdodGluZ1xuICogTUlUIGxpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHAvXG4gKiBAYXV0aG9yIExlYSBWZXJvdSBodHRwOi8vbGVhLnZlcm91Lm1lXG4gKi9cblxudmFyIFByaXNtID0gKGZ1bmN0aW9uIChfc2VsZil7XG5cbi8vIFByaXZhdGUgaGVscGVyIHZhcnNcbnZhciBsYW5nID0gL1xcYmxhbmcoPzp1YWdlKT8tKFtcXHctXSspXFxiL2k7XG52YXIgdW5pcXVlSWQgPSAwO1xuXG52YXIgXyA9IHtcblx0bWFudWFsOiBfc2VsZi5QcmlzbSAmJiBfc2VsZi5QcmlzbS5tYW51YWwsXG5cdGRpc2FibGVXb3JrZXJNZXNzYWdlSGFuZGxlcjogX3NlbGYuUHJpc20gJiYgX3NlbGYuUHJpc20uZGlzYWJsZVdvcmtlck1lc3NhZ2VIYW5kbGVyLFxuXHR1dGlsOiB7XG5cdFx0ZW5jb2RlOiBmdW5jdGlvbiAodG9rZW5zKSB7XG5cdFx0XHRpZiAodG9rZW5zIGluc3RhbmNlb2YgVG9rZW4pIHtcblx0XHRcdFx0cmV0dXJuIG5ldyBUb2tlbih0b2tlbnMudHlwZSwgXy51dGlsLmVuY29kZSh0b2tlbnMuY29udGVudCksIHRva2Vucy5hbGlhcyk7XG5cdFx0XHR9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodG9rZW5zKSkge1xuXHRcdFx0XHRyZXR1cm4gdG9rZW5zLm1hcChfLnV0aWwuZW5jb2RlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiB0b2tlbnMucmVwbGFjZSgvJi9nLCAnJmFtcDsnKS5yZXBsYWNlKC88L2csICcmbHQ7JykucmVwbGFjZSgvXFx1MDBhMC9nLCAnICcpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHR0eXBlOiBmdW5jdGlvbiAobykge1xuXHRcdFx0cmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7XG5cdFx0fSxcblxuXHRcdG9iaklkOiBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRpZiAoIW9ialsnX19pZCddKSB7XG5cdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosICdfX2lkJywgeyB2YWx1ZTogKyt1bmlxdWVJZCB9KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBvYmpbJ19faWQnXTtcblx0XHR9LFxuXG5cdFx0Ly8gRGVlcCBjbG9uZSBhIGxhbmd1YWdlIGRlZmluaXRpb24gKGUuZy4gdG8gZXh0ZW5kIGl0KVxuXHRcdGNsb25lOiBmdW5jdGlvbiBkZWVwQ2xvbmUobywgdmlzaXRlZCkge1xuXHRcdFx0dmFyIGNsb25lLCBpZCwgdHlwZSA9IF8udXRpbC50eXBlKG8pO1xuXHRcdFx0dmlzaXRlZCA9IHZpc2l0ZWQgfHwge307XG5cblx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRjYXNlICdPYmplY3QnOlxuXHRcdFx0XHRcdGlkID0gXy51dGlsLm9iaklkKG8pO1xuXHRcdFx0XHRcdGlmICh2aXNpdGVkW2lkXSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHZpc2l0ZWRbaWRdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjbG9uZSA9IHt9O1xuXHRcdFx0XHRcdHZpc2l0ZWRbaWRdID0gY2xvbmU7XG5cblx0XHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gbykge1xuXHRcdFx0XHRcdFx0aWYgKG8uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuXHRcdFx0XHRcdFx0XHRjbG9uZVtrZXldID0gZGVlcENsb25lKG9ba2V5XSwgdmlzaXRlZCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIGNsb25lO1xuXG5cdFx0XHRcdGNhc2UgJ0FycmF5Jzpcblx0XHRcdFx0XHRpZCA9IF8udXRpbC5vYmpJZChvKTtcblx0XHRcdFx0XHRpZiAodmlzaXRlZFtpZF0pIHtcblx0XHRcdFx0XHRcdHJldHVybiB2aXNpdGVkW2lkXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2xvbmUgPSBbXTtcblx0XHRcdFx0XHR2aXNpdGVkW2lkXSA9IGNsb25lO1xuXG5cdFx0XHRcdFx0by5mb3JFYWNoKGZ1bmN0aW9uICh2LCBpKSB7XG5cdFx0XHRcdFx0XHRjbG9uZVtpXSA9IGRlZXBDbG9uZSh2LCB2aXNpdGVkKTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdHJldHVybiBjbG9uZTtcblxuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHJldHVybiBvO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRsYW5ndWFnZXM6IHtcblx0XHRleHRlbmQ6IGZ1bmN0aW9uIChpZCwgcmVkZWYpIHtcblx0XHRcdHZhciBsYW5nID0gXy51dGlsLmNsb25lKF8ubGFuZ3VhZ2VzW2lkXSk7XG5cblx0XHRcdGZvciAodmFyIGtleSBpbiByZWRlZikge1xuXHRcdFx0XHRsYW5nW2tleV0gPSByZWRlZltrZXldO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbGFuZztcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogSW5zZXJ0IGEgdG9rZW4gYmVmb3JlIGFub3RoZXIgdG9rZW4gaW4gYSBsYW5ndWFnZSBsaXRlcmFsXG5cdFx0ICogQXMgdGhpcyBuZWVkcyB0byByZWNyZWF0ZSB0aGUgb2JqZWN0ICh3ZSBjYW5ub3QgYWN0dWFsbHkgaW5zZXJ0IGJlZm9yZSBrZXlzIGluIG9iamVjdCBsaXRlcmFscyksXG5cdFx0ICogd2UgY2Fubm90IGp1c3QgcHJvdmlkZSBhbiBvYmplY3QsIHdlIG5lZWQgYW4gb2JqZWN0IGFuZCBhIGtleS5cblx0XHQgKiBAcGFyYW0gaW5zaWRlIFRoZSBrZXkgKG9yIGxhbmd1YWdlIGlkKSBvZiB0aGUgcGFyZW50XG5cdFx0ICogQHBhcmFtIGJlZm9yZSBUaGUga2V5IHRvIGluc2VydCBiZWZvcmUuXG5cdFx0ICogQHBhcmFtIGluc2VydCBPYmplY3Qgd2l0aCB0aGUga2V5L3ZhbHVlIHBhaXJzIHRvIGluc2VydFxuXHRcdCAqIEBwYXJhbSByb290IFRoZSBvYmplY3QgdGhhdCBjb250YWlucyBgaW5zaWRlYC4gSWYgZXF1YWwgdG8gUHJpc20ubGFuZ3VhZ2VzLCBpdCBjYW4gYmUgb21pdHRlZC5cblx0XHQgKi9cblx0XHRpbnNlcnRCZWZvcmU6IGZ1bmN0aW9uIChpbnNpZGUsIGJlZm9yZSwgaW5zZXJ0LCByb290KSB7XG5cdFx0XHRyb290ID0gcm9vdCB8fCBfLmxhbmd1YWdlcztcblx0XHRcdHZhciBncmFtbWFyID0gcm9vdFtpbnNpZGVdO1xuXHRcdFx0dmFyIHJldCA9IHt9O1xuXG5cdFx0XHRmb3IgKHZhciB0b2tlbiBpbiBncmFtbWFyKSB7XG5cdFx0XHRcdGlmIChncmFtbWFyLmhhc093blByb3BlcnR5KHRva2VuKSkge1xuXG5cdFx0XHRcdFx0aWYgKHRva2VuID09IGJlZm9yZSkge1xuXHRcdFx0XHRcdFx0Zm9yICh2YXIgbmV3VG9rZW4gaW4gaW5zZXJ0KSB7XG5cdFx0XHRcdFx0XHRcdGlmIChpbnNlcnQuaGFzT3duUHJvcGVydHkobmV3VG9rZW4pKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0W25ld1Rva2VuXSA9IGluc2VydFtuZXdUb2tlbl07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBEbyBub3QgaW5zZXJ0IHRva2VuIHdoaWNoIGFsc28gb2NjdXIgaW4gaW5zZXJ0LiBTZWUgIzE1MjVcblx0XHRcdFx0XHRpZiAoIWluc2VydC5oYXNPd25Qcm9wZXJ0eSh0b2tlbikpIHtcblx0XHRcdFx0XHRcdHJldFt0b2tlbl0gPSBncmFtbWFyW3Rva2VuXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0dmFyIG9sZCA9IHJvb3RbaW5zaWRlXTtcblx0XHRcdHJvb3RbaW5zaWRlXSA9IHJldDtcblxuXHRcdFx0Ly8gVXBkYXRlIHJlZmVyZW5jZXMgaW4gb3RoZXIgbGFuZ3VhZ2UgZGVmaW5pdGlvbnNcblx0XHRcdF8ubGFuZ3VhZ2VzLkRGUyhfLmxhbmd1YWdlcywgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuXHRcdFx0XHRpZiAodmFsdWUgPT09IG9sZCAmJiBrZXkgIT0gaW5zaWRlKSB7XG5cdFx0XHRcdFx0dGhpc1trZXldID0gcmV0O1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIHJldDtcblx0XHR9LFxuXG5cdFx0Ly8gVHJhdmVyc2UgYSBsYW5ndWFnZSBkZWZpbml0aW9uIHdpdGggRGVwdGggRmlyc3QgU2VhcmNoXG5cdFx0REZTOiBmdW5jdGlvbiBERlMobywgY2FsbGJhY2ssIHR5cGUsIHZpc2l0ZWQpIHtcblx0XHRcdHZpc2l0ZWQgPSB2aXNpdGVkIHx8IHt9O1xuXG5cdFx0XHR2YXIgb2JqSWQgPSBfLnV0aWwub2JqSWQ7XG5cblx0XHRcdGZvciAodmFyIGkgaW4gbykge1xuXHRcdFx0XHRpZiAoby5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdGNhbGxiYWNrLmNhbGwobywgaSwgb1tpXSwgdHlwZSB8fCBpKTtcblxuXHRcdFx0XHRcdHZhciBwcm9wZXJ0eSA9IG9baV0sXG5cdFx0XHRcdFx0ICAgIHByb3BlcnR5VHlwZSA9IF8udXRpbC50eXBlKHByb3BlcnR5KTtcblxuXHRcdFx0XHRcdGlmIChwcm9wZXJ0eVR5cGUgPT09ICdPYmplY3QnICYmICF2aXNpdGVkW29iaklkKHByb3BlcnR5KV0pIHtcblx0XHRcdFx0XHRcdHZpc2l0ZWRbb2JqSWQocHJvcGVydHkpXSA9IHRydWU7XG5cdFx0XHRcdFx0XHRERlMocHJvcGVydHksIGNhbGxiYWNrLCBudWxsLCB2aXNpdGVkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSBpZiAocHJvcGVydHlUeXBlID09PSAnQXJyYXknICYmICF2aXNpdGVkW29iaklkKHByb3BlcnR5KV0pIHtcblx0XHRcdFx0XHRcdHZpc2l0ZWRbb2JqSWQocHJvcGVydHkpXSA9IHRydWU7XG5cdFx0XHRcdFx0XHRERlMocHJvcGVydHksIGNhbGxiYWNrLCBpLCB2aXNpdGVkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdHBsdWdpbnM6IHt9LFxuXG5cdGhpZ2hsaWdodEFsbDogZnVuY3Rpb24oYXN5bmMsIGNhbGxiYWNrKSB7XG5cdFx0Xy5oaWdobGlnaHRBbGxVbmRlcihkb2N1bWVudCwgYXN5bmMsIGNhbGxiYWNrKTtcblx0fSxcblxuXHRoaWdobGlnaHRBbGxVbmRlcjogZnVuY3Rpb24oY29udGFpbmVyLCBhc3luYywgY2FsbGJhY2spIHtcblx0XHR2YXIgZW52ID0ge1xuXHRcdFx0Y2FsbGJhY2s6IGNhbGxiYWNrLFxuXHRcdFx0c2VsZWN0b3I6ICdjb2RlW2NsYXNzKj1cImxhbmd1YWdlLVwiXSwgW2NsYXNzKj1cImxhbmd1YWdlLVwiXSBjb2RlLCBjb2RlW2NsYXNzKj1cImxhbmctXCJdLCBbY2xhc3MqPVwibGFuZy1cIl0gY29kZSdcblx0XHR9O1xuXG5cdFx0Xy5ob29rcy5ydW4oJ2JlZm9yZS1oaWdobGlnaHRhbGwnLCBlbnYpO1xuXG5cdFx0dmFyIGVsZW1lbnRzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoZW52LnNlbGVjdG9yKTtcblxuXHRcdGZvciAodmFyIGk9MCwgZWxlbWVudDsgZWxlbWVudCA9IGVsZW1lbnRzW2krK107KSB7XG5cdFx0XHRfLmhpZ2hsaWdodEVsZW1lbnQoZWxlbWVudCwgYXN5bmMgPT09IHRydWUsIGVudi5jYWxsYmFjayk7XG5cdFx0fVxuXHR9LFxuXG5cdGhpZ2hsaWdodEVsZW1lbnQ6IGZ1bmN0aW9uKGVsZW1lbnQsIGFzeW5jLCBjYWxsYmFjaykge1xuXHRcdC8vIEZpbmQgbGFuZ3VhZ2Vcblx0XHR2YXIgbGFuZ3VhZ2UgPSAnbm9uZScsIGdyYW1tYXIsIHBhcmVudCA9IGVsZW1lbnQ7XG5cblx0XHR3aGlsZSAocGFyZW50ICYmICFsYW5nLnRlc3QocGFyZW50LmNsYXNzTmFtZSkpIHtcblx0XHRcdHBhcmVudCA9IHBhcmVudC5wYXJlbnROb2RlO1xuXHRcdH1cblxuXHRcdGlmIChwYXJlbnQpIHtcblx0XHRcdGxhbmd1YWdlID0gKHBhcmVudC5jbGFzc05hbWUubWF0Y2gobGFuZykgfHwgWywnbm9uZSddKVsxXS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0Z3JhbW1hciA9IF8ubGFuZ3VhZ2VzW2xhbmd1YWdlXTtcblx0XHR9XG5cblx0XHQvLyBTZXQgbGFuZ3VhZ2Ugb24gdGhlIGVsZW1lbnQsIGlmIG5vdCBwcmVzZW50XG5cdFx0ZWxlbWVudC5jbGFzc05hbWUgPSBlbGVtZW50LmNsYXNzTmFtZS5yZXBsYWNlKGxhbmcsICcnKS5yZXBsYWNlKC9cXHMrL2csICcgJykgKyAnIGxhbmd1YWdlLScgKyBsYW5ndWFnZTtcblxuXHRcdGlmIChlbGVtZW50LnBhcmVudE5vZGUpIHtcblx0XHRcdC8vIFNldCBsYW5ndWFnZSBvbiB0aGUgcGFyZW50LCBmb3Igc3R5bGluZ1xuXHRcdFx0cGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xuXG5cdFx0XHRpZiAoL3ByZS9pLnRlc3QocGFyZW50Lm5vZGVOYW1lKSkge1xuXHRcdFx0XHRwYXJlbnQuY2xhc3NOYW1lID0gcGFyZW50LmNsYXNzTmFtZS5yZXBsYWNlKGxhbmcsICcnKS5yZXBsYWNlKC9cXHMrL2csICcgJykgKyAnIGxhbmd1YWdlLScgKyBsYW5ndWFnZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR2YXIgY29kZSA9IGVsZW1lbnQudGV4dENvbnRlbnQ7XG5cblx0XHR2YXIgZW52ID0ge1xuXHRcdFx0ZWxlbWVudDogZWxlbWVudCxcblx0XHRcdGxhbmd1YWdlOiBsYW5ndWFnZSxcblx0XHRcdGdyYW1tYXI6IGdyYW1tYXIsXG5cdFx0XHRjb2RlOiBjb2RlXG5cdFx0fTtcblxuXHRcdHZhciBpbnNlcnRIaWdobGlnaHRlZENvZGUgPSBmdW5jdGlvbiAoaGlnaGxpZ2h0ZWRDb2RlKSB7XG5cdFx0XHRlbnYuaGlnaGxpZ2h0ZWRDb2RlID0gaGlnaGxpZ2h0ZWRDb2RlO1xuXG5cdFx0XHRfLmhvb2tzLnJ1bignYmVmb3JlLWluc2VydCcsIGVudik7XG5cblx0XHRcdGVudi5lbGVtZW50LmlubmVySFRNTCA9IGVudi5oaWdobGlnaHRlZENvZGU7XG5cblx0XHRcdF8uaG9va3MucnVuKCdhZnRlci1oaWdobGlnaHQnLCBlbnYpO1xuXHRcdFx0Xy5ob29rcy5ydW4oJ2NvbXBsZXRlJywgZW52KTtcblx0XHRcdGNhbGxiYWNrICYmIGNhbGxiYWNrLmNhbGwoZW52LmVsZW1lbnQpO1xuXHRcdH1cblxuXHRcdF8uaG9va3MucnVuKCdiZWZvcmUtc2FuaXR5LWNoZWNrJywgZW52KTtcblxuXHRcdGlmICghZW52LmNvZGUpIHtcblx0XHRcdF8uaG9va3MucnVuKCdjb21wbGV0ZScsIGVudik7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Xy5ob29rcy5ydW4oJ2JlZm9yZS1oaWdobGlnaHQnLCBlbnYpO1xuXG5cdFx0aWYgKCFlbnYuZ3JhbW1hcikge1xuXHRcdFx0aW5zZXJ0SGlnaGxpZ2h0ZWRDb2RlKF8udXRpbC5lbmNvZGUoZW52LmNvZGUpKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoYXN5bmMgJiYgX3NlbGYuV29ya2VyKSB7XG5cdFx0XHR2YXIgd29ya2VyID0gbmV3IFdvcmtlcihfLmZpbGVuYW1lKTtcblxuXHRcdFx0d29ya2VyLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2dCkge1xuXHRcdFx0XHRpbnNlcnRIaWdobGlnaHRlZENvZGUoZXZ0LmRhdGEpO1xuXHRcdFx0fTtcblxuXHRcdFx0d29ya2VyLnBvc3RNZXNzYWdlKEpTT04uc3RyaW5naWZ5KHtcblx0XHRcdFx0bGFuZ3VhZ2U6IGVudi5sYW5ndWFnZSxcblx0XHRcdFx0Y29kZTogZW52LmNvZGUsXG5cdFx0XHRcdGltbWVkaWF0ZUNsb3NlOiB0cnVlXG5cdFx0XHR9KSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0aW5zZXJ0SGlnaGxpZ2h0ZWRDb2RlKF8uaGlnaGxpZ2h0KGVudi5jb2RlLCBlbnYuZ3JhbW1hciwgZW52Lmxhbmd1YWdlKSk7XG5cdFx0fVxuXHR9LFxuXG5cdGhpZ2hsaWdodDogZnVuY3Rpb24gKHRleHQsIGdyYW1tYXIsIGxhbmd1YWdlKSB7XG5cdFx0dmFyIGVudiA9IHtcblx0XHRcdGNvZGU6IHRleHQsXG5cdFx0XHRncmFtbWFyOiBncmFtbWFyLFxuXHRcdFx0bGFuZ3VhZ2U6IGxhbmd1YWdlXG5cdFx0fTtcblx0XHRfLmhvb2tzLnJ1bignYmVmb3JlLXRva2VuaXplJywgZW52KTtcblx0XHRlbnYudG9rZW5zID0gXy50b2tlbml6ZShlbnYuY29kZSwgZW52LmdyYW1tYXIpO1xuXHRcdF8uaG9va3MucnVuKCdhZnRlci10b2tlbml6ZScsIGVudik7XG5cdFx0cmV0dXJuIFRva2VuLnN0cmluZ2lmeShfLnV0aWwuZW5jb2RlKGVudi50b2tlbnMpLCBlbnYubGFuZ3VhZ2UpO1xuXHR9LFxuXG5cdG1hdGNoR3JhbW1hcjogZnVuY3Rpb24gKHRleHQsIHN0cmFyciwgZ3JhbW1hciwgaW5kZXgsIHN0YXJ0UG9zLCBvbmVzaG90LCB0YXJnZXQpIHtcblx0XHRmb3IgKHZhciB0b2tlbiBpbiBncmFtbWFyKSB7XG5cdFx0XHRpZighZ3JhbW1hci5oYXNPd25Qcm9wZXJ0eSh0b2tlbikgfHwgIWdyYW1tYXJbdG9rZW5dKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodG9rZW4gPT0gdGFyZ2V0KSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dmFyIHBhdHRlcm5zID0gZ3JhbW1hclt0b2tlbl07XG5cdFx0XHRwYXR0ZXJucyA9IChfLnV0aWwudHlwZShwYXR0ZXJucykgPT09IFwiQXJyYXlcIikgPyBwYXR0ZXJucyA6IFtwYXR0ZXJuc107XG5cblx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgcGF0dGVybnMubGVuZ3RoOyArK2opIHtcblx0XHRcdFx0dmFyIHBhdHRlcm4gPSBwYXR0ZXJuc1tqXSxcblx0XHRcdFx0XHRpbnNpZGUgPSBwYXR0ZXJuLmluc2lkZSxcblx0XHRcdFx0XHRsb29rYmVoaW5kID0gISFwYXR0ZXJuLmxvb2tiZWhpbmQsXG5cdFx0XHRcdFx0Z3JlZWR5ID0gISFwYXR0ZXJuLmdyZWVkeSxcblx0XHRcdFx0XHRsb29rYmVoaW5kTGVuZ3RoID0gMCxcblx0XHRcdFx0XHRhbGlhcyA9IHBhdHRlcm4uYWxpYXM7XG5cblx0XHRcdFx0aWYgKGdyZWVkeSAmJiAhcGF0dGVybi5wYXR0ZXJuLmdsb2JhbCkge1xuXHRcdFx0XHRcdC8vIFdpdGhvdXQgdGhlIGdsb2JhbCBmbGFnLCBsYXN0SW5kZXggd29uJ3Qgd29ya1xuXHRcdFx0XHRcdHZhciBmbGFncyA9IHBhdHRlcm4ucGF0dGVybi50b1N0cmluZygpLm1hdGNoKC9baW11eV0qJC8pWzBdO1xuXHRcdFx0XHRcdHBhdHRlcm4ucGF0dGVybiA9IFJlZ0V4cChwYXR0ZXJuLnBhdHRlcm4uc291cmNlLCBmbGFncyArIFwiZ1wiKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHBhdHRlcm4gPSBwYXR0ZXJuLnBhdHRlcm4gfHwgcGF0dGVybjtcblxuXHRcdFx0XHQvLyBEb27igJl0IGNhY2hlIGxlbmd0aCBhcyBpdCBjaGFuZ2VzIGR1cmluZyB0aGUgbG9vcFxuXHRcdFx0XHRmb3IgKHZhciBpID0gaW5kZXgsIHBvcyA9IHN0YXJ0UG9zOyBpIDwgc3RyYXJyLmxlbmd0aDsgcG9zICs9IHN0cmFycltpXS5sZW5ndGgsICsraSkge1xuXG5cdFx0XHRcdFx0dmFyIHN0ciA9IHN0cmFycltpXTtcblxuXHRcdFx0XHRcdGlmIChzdHJhcnIubGVuZ3RoID4gdGV4dC5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdC8vIFNvbWV0aGluZyB3ZW50IHRlcnJpYmx5IHdyb25nLCBBQk9SVCwgQUJPUlQhXG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKHN0ciBpbnN0YW5jZW9mIFRva2VuKSB7XG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoZ3JlZWR5ICYmIGkgIT0gc3RyYXJyLmxlbmd0aCAtIDEpIHtcblx0XHRcdFx0XHRcdHBhdHRlcm4ubGFzdEluZGV4ID0gcG9zO1xuXHRcdFx0XHRcdFx0dmFyIG1hdGNoID0gcGF0dGVybi5leGVjKHRleHQpO1xuXHRcdFx0XHRcdFx0aWYgKCFtYXRjaCkge1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0dmFyIGZyb20gPSBtYXRjaC5pbmRleCArIChsb29rYmVoaW5kID8gbWF0Y2hbMV0ubGVuZ3RoIDogMCksXG5cdFx0XHRcdFx0XHQgICAgdG8gPSBtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aCxcblx0XHRcdFx0XHRcdCAgICBrID0gaSxcblx0XHRcdFx0XHRcdCAgICBwID0gcG9zO1xuXG5cdFx0XHRcdFx0XHRmb3IgKHZhciBsZW4gPSBzdHJhcnIubGVuZ3RoOyBrIDwgbGVuICYmIChwIDwgdG8gfHwgKCFzdHJhcnJba10udHlwZSAmJiAhc3RyYXJyW2sgLSAxXS5ncmVlZHkpKTsgKytrKSB7XG5cdFx0XHRcdFx0XHRcdHAgKz0gc3RyYXJyW2tdLmxlbmd0aDtcblx0XHRcdFx0XHRcdFx0Ly8gTW92ZSB0aGUgaW5kZXggaSB0byB0aGUgZWxlbWVudCBpbiBzdHJhcnIgdGhhdCBpcyBjbG9zZXN0IHRvIGZyb21cblx0XHRcdFx0XHRcdFx0aWYgKGZyb20gPj0gcCkge1xuXHRcdFx0XHRcdFx0XHRcdCsraTtcblx0XHRcdFx0XHRcdFx0XHRwb3MgPSBwO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIElmIHN0cmFycltpXSBpcyBhIFRva2VuLCB0aGVuIHRoZSBtYXRjaCBzdGFydHMgaW5zaWRlIGFub3RoZXIgVG9rZW4sIHdoaWNoIGlzIGludmFsaWRcblx0XHRcdFx0XHRcdGlmIChzdHJhcnJbaV0gaW5zdGFuY2VvZiBUb2tlbikge1xuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gTnVtYmVyIG9mIHRva2VucyB0byBkZWxldGUgYW5kIHJlcGxhY2Ugd2l0aCB0aGUgbmV3IG1hdGNoXG5cdFx0XHRcdFx0XHRkZWxOdW0gPSBrIC0gaTtcblx0XHRcdFx0XHRcdHN0ciA9IHRleHQuc2xpY2UocG9zLCBwKTtcblx0XHRcdFx0XHRcdG1hdGNoLmluZGV4IC09IHBvcztcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cGF0dGVybi5sYXN0SW5kZXggPSAwO1xuXG5cdFx0XHRcdFx0XHR2YXIgbWF0Y2ggPSBwYXR0ZXJuLmV4ZWMoc3RyKSxcblx0XHRcdFx0XHRcdFx0ZGVsTnVtID0gMTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIW1hdGNoKSB7XG5cdFx0XHRcdFx0XHRpZiAob25lc2hvdCkge1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYobG9va2JlaGluZCkge1xuXHRcdFx0XHRcdFx0bG9va2JlaGluZExlbmd0aCA9IG1hdGNoWzFdID8gbWF0Y2hbMV0ubGVuZ3RoIDogMDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR2YXIgZnJvbSA9IG1hdGNoLmluZGV4ICsgbG9va2JlaGluZExlbmd0aCxcblx0XHRcdFx0XHQgICAgbWF0Y2ggPSBtYXRjaFswXS5zbGljZShsb29rYmVoaW5kTGVuZ3RoKSxcblx0XHRcdFx0XHQgICAgdG8gPSBmcm9tICsgbWF0Y2gubGVuZ3RoLFxuXHRcdFx0XHRcdCAgICBiZWZvcmUgPSBzdHIuc2xpY2UoMCwgZnJvbSksXG5cdFx0XHRcdFx0ICAgIGFmdGVyID0gc3RyLnNsaWNlKHRvKTtcblxuXHRcdFx0XHRcdHZhciBhcmdzID0gW2ksIGRlbE51bV07XG5cblx0XHRcdFx0XHRpZiAoYmVmb3JlKSB7XG5cdFx0XHRcdFx0XHQrK2k7XG5cdFx0XHRcdFx0XHRwb3MgKz0gYmVmb3JlLmxlbmd0aDtcblx0XHRcdFx0XHRcdGFyZ3MucHVzaChiZWZvcmUpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHZhciB3cmFwcGVkID0gbmV3IFRva2VuKHRva2VuLCBpbnNpZGU/IF8udG9rZW5pemUobWF0Y2gsIGluc2lkZSkgOiBtYXRjaCwgYWxpYXMsIG1hdGNoLCBncmVlZHkpO1xuXG5cdFx0XHRcdFx0YXJncy5wdXNoKHdyYXBwZWQpO1xuXG5cdFx0XHRcdFx0aWYgKGFmdGVyKSB7XG5cdFx0XHRcdFx0XHRhcmdzLnB1c2goYWZ0ZXIpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdEFycmF5LnByb3RvdHlwZS5zcGxpY2UuYXBwbHkoc3RyYXJyLCBhcmdzKTtcblxuXHRcdFx0XHRcdGlmIChkZWxOdW0gIT0gMSlcblx0XHRcdFx0XHRcdF8ubWF0Y2hHcmFtbWFyKHRleHQsIHN0cmFyciwgZ3JhbW1hciwgaSwgcG9zLCB0cnVlLCB0b2tlbik7XG5cblx0XHRcdFx0XHRpZiAob25lc2hvdClcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdHRva2VuaXplOiBmdW5jdGlvbih0ZXh0LCBncmFtbWFyKSB7XG5cdFx0dmFyIHN0cmFyciA9IFt0ZXh0XTtcblxuXHRcdHZhciByZXN0ID0gZ3JhbW1hci5yZXN0O1xuXG5cdFx0aWYgKHJlc3QpIHtcblx0XHRcdGZvciAodmFyIHRva2VuIGluIHJlc3QpIHtcblx0XHRcdFx0Z3JhbW1hclt0b2tlbl0gPSByZXN0W3Rva2VuXTtcblx0XHRcdH1cblxuXHRcdFx0ZGVsZXRlIGdyYW1tYXIucmVzdDtcblx0XHR9XG5cblx0XHRfLm1hdGNoR3JhbW1hcih0ZXh0LCBzdHJhcnIsIGdyYW1tYXIsIDAsIDAsIGZhbHNlKTtcblxuXHRcdHJldHVybiBzdHJhcnI7XG5cdH0sXG5cblx0aG9va3M6IHtcblx0XHRhbGw6IHt9LFxuXG5cdFx0YWRkOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2spIHtcblx0XHRcdHZhciBob29rcyA9IF8uaG9va3MuYWxsO1xuXG5cdFx0XHRob29rc1tuYW1lXSA9IGhvb2tzW25hbWVdIHx8IFtdO1xuXG5cdFx0XHRob29rc1tuYW1lXS5wdXNoKGNhbGxiYWNrKTtcblx0XHR9LFxuXG5cdFx0cnVuOiBmdW5jdGlvbiAobmFtZSwgZW52KSB7XG5cdFx0XHR2YXIgY2FsbGJhY2tzID0gXy5ob29rcy5hbGxbbmFtZV07XG5cblx0XHRcdGlmICghY2FsbGJhY2tzIHx8ICFjYWxsYmFja3MubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Zm9yICh2YXIgaT0wLCBjYWxsYmFjazsgY2FsbGJhY2sgPSBjYWxsYmFja3NbaSsrXTspIHtcblx0XHRcdFx0Y2FsbGJhY2soZW52KTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0VG9rZW46IFRva2VuXG59O1xuXG5fc2VsZi5QcmlzbSA9IF87XG5cbmZ1bmN0aW9uIFRva2VuKHR5cGUsIGNvbnRlbnQsIGFsaWFzLCBtYXRjaGVkU3RyLCBncmVlZHkpIHtcblx0dGhpcy50eXBlID0gdHlwZTtcblx0dGhpcy5jb250ZW50ID0gY29udGVudDtcblx0dGhpcy5hbGlhcyA9IGFsaWFzO1xuXHQvLyBDb3B5IG9mIHRoZSBmdWxsIHN0cmluZyB0aGlzIHRva2VuIHdhcyBjcmVhdGVkIGZyb21cblx0dGhpcy5sZW5ndGggPSAobWF0Y2hlZFN0ciB8fCBcIlwiKS5sZW5ndGh8MDtcblx0dGhpcy5ncmVlZHkgPSAhIWdyZWVkeTtcbn1cblxuVG9rZW4uc3RyaW5naWZ5ID0gZnVuY3Rpb24obywgbGFuZ3VhZ2UpIHtcblx0aWYgKHR5cGVvZiBvID09ICdzdHJpbmcnKSB7XG5cdFx0cmV0dXJuIG87XG5cdH1cblxuXHRpZiAoQXJyYXkuaXNBcnJheShvKSkge1xuXHRcdHJldHVybiBvLm1hcChmdW5jdGlvbihlbGVtZW50KSB7XG5cdFx0XHRyZXR1cm4gVG9rZW4uc3RyaW5naWZ5KGVsZW1lbnQsIGxhbmd1YWdlKTtcblx0XHR9KS5qb2luKCcnKTtcblx0fVxuXG5cdHZhciBlbnYgPSB7XG5cdFx0dHlwZTogby50eXBlLFxuXHRcdGNvbnRlbnQ6IFRva2VuLnN0cmluZ2lmeShvLmNvbnRlbnQsIGxhbmd1YWdlKSxcblx0XHR0YWc6ICdzcGFuJyxcblx0XHRjbGFzc2VzOiBbJ3Rva2VuJywgby50eXBlXSxcblx0XHRhdHRyaWJ1dGVzOiB7fSxcblx0XHRsYW5ndWFnZTogbGFuZ3VhZ2Vcblx0fTtcblxuXHRpZiAoby5hbGlhcykge1xuXHRcdHZhciBhbGlhc2VzID0gQXJyYXkuaXNBcnJheShvLmFsaWFzKSA/IG8uYWxpYXMgOiBbby5hbGlhc107XG5cdFx0QXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoZW52LmNsYXNzZXMsIGFsaWFzZXMpO1xuXHR9XG5cblx0Xy5ob29rcy5ydW4oJ3dyYXAnLCBlbnYpO1xuXG5cdHZhciBhdHRyaWJ1dGVzID0gT2JqZWN0LmtleXMoZW52LmF0dHJpYnV0ZXMpLm1hcChmdW5jdGlvbihuYW1lKSB7XG5cdFx0cmV0dXJuIG5hbWUgKyAnPVwiJyArIChlbnYuYXR0cmlidXRlc1tuYW1lXSB8fCAnJykucmVwbGFjZSgvXCIvZywgJyZxdW90OycpICsgJ1wiJztcblx0fSkuam9pbignICcpO1xuXG5cdHJldHVybiAnPCcgKyBlbnYudGFnICsgJyBjbGFzcz1cIicgKyBlbnYuY2xhc3Nlcy5qb2luKCcgJykgKyAnXCInICsgKGF0dHJpYnV0ZXMgPyAnICcgKyBhdHRyaWJ1dGVzIDogJycpICsgJz4nICsgZW52LmNvbnRlbnQgKyAnPC8nICsgZW52LnRhZyArICc+Jztcbn07XG5cbmlmICghX3NlbGYuZG9jdW1lbnQpIHtcblx0aWYgKCFfc2VsZi5hZGRFdmVudExpc3RlbmVyKSB7XG5cdFx0Ly8gaW4gTm9kZS5qc1xuXHRcdHJldHVybiBfO1xuXHR9XG5cblx0aWYgKCFfLmRpc2FibGVXb3JrZXJNZXNzYWdlSGFuZGxlcikge1xuXHRcdC8vIEluIHdvcmtlclxuXHRcdF9zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXZ0KSB7XG5cdFx0XHR2YXIgbWVzc2FnZSA9IEpTT04ucGFyc2UoZXZ0LmRhdGEpLFxuXHRcdFx0XHRsYW5nID0gbWVzc2FnZS5sYW5ndWFnZSxcblx0XHRcdFx0Y29kZSA9IG1lc3NhZ2UuY29kZSxcblx0XHRcdFx0aW1tZWRpYXRlQ2xvc2UgPSBtZXNzYWdlLmltbWVkaWF0ZUNsb3NlO1xuXG5cdFx0XHRfc2VsZi5wb3N0TWVzc2FnZShfLmhpZ2hsaWdodChjb2RlLCBfLmxhbmd1YWdlc1tsYW5nXSwgbGFuZykpO1xuXHRcdFx0aWYgKGltbWVkaWF0ZUNsb3NlKSB7XG5cdFx0XHRcdF9zZWxmLmNsb3NlKCk7XG5cdFx0XHR9XG5cdFx0fSwgZmFsc2UpO1xuXHR9XG5cblx0cmV0dXJuIF87XG59XG5cbi8vR2V0IGN1cnJlbnQgc2NyaXB0IGFuZCBoaWdobGlnaHRcbnZhciBzY3JpcHQgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0IHx8IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIikpLnBvcCgpO1xuXG5pZiAoc2NyaXB0KSB7XG5cdF8uZmlsZW5hbWUgPSBzY3JpcHQuc3JjO1xuXG5cdGlmICghXy5tYW51YWwgJiYgIXNjcmlwdC5oYXNBdHRyaWJ1dGUoJ2RhdGEtbWFudWFsJykpIHtcblx0XHRpZihkb2N1bWVudC5yZWFkeVN0YXRlICE9PSBcImxvYWRpbmdcIikge1xuXHRcdFx0aWYgKHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcblx0XHRcdFx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShfLmhpZ2hsaWdodEFsbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR3aW5kb3cuc2V0VGltZW91dChfLmhpZ2hsaWdodEFsbCwgMTYpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBfLmhpZ2hsaWdodEFsbCk7XG5cdFx0fVxuXHR9XG59XG5cbnJldHVybiBfO1xuXG59KShfc2VsZik7XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRtb2R1bGUuZXhwb3J0cyA9IFByaXNtO1xufVxuXG4vLyBoYWNrIGZvciBjb21wb25lbnRzIHRvIHdvcmsgY29ycmVjdGx5IGluIG5vZGUuanNcbmlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuXHRnbG9iYWwuUHJpc20gPSBQcmlzbTtcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5leHBvcnRzLnBhcnNlID0gcGFyc2VcbmV4cG9ydHMuc3RyaW5naWZ5ID0gc3RyaW5naWZ5XG5cbnZhciBlbXB0eSA9ICcnXG52YXIgc3BhY2UgPSAnICdcbnZhciB3aGl0ZVNwYWNlID0gL1sgXFx0XFxuXFxyXFxmXSsvZ1xuXG5mdW5jdGlvbiBwYXJzZSh2YWx1ZSkge1xuICB2YXIgaW5wdXQgPSBTdHJpbmcodmFsdWUgfHwgZW1wdHkpLnRyaW0oKVxuICByZXR1cm4gaW5wdXQgPT09IGVtcHR5ID8gW10gOiBpbnB1dC5zcGxpdCh3aGl0ZVNwYWNlKVxufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnkodmFsdWVzKSB7XG4gIHJldHVybiB2YWx1ZXMuam9pbihzcGFjZSkudHJpbSgpXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGV4dGVuZFxuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5mdW5jdGlvbiBleHRlbmQoKSB7XG4gICAgdmFyIHRhcmdldCA9IHt9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldXG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldFxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9