// https://github.com/ahrm/chrome-fastread/blob/main/utils.js
let defaultHighlightSheet = 'font-weight: 600;'
let defaultRestSheet = 'opacity: 0.8;'
let defaultAlgorithm = '+ 0 1 2 3 3 0.7'

function fastreadifyPage(contentDocument) {
  const document = contentDocument

  function parseAlgorithm(algorithm) {
    try {
      var res = {
        exclude: true,
        sizes: [],
        restRatio: 0.4,
      }
      let parts = algorithm.split(' ')

      if (parts[0] == '+') {
        res.exclude = false
      }

      res.restRatio = Number(parts[parts.length - 1])

      for (var i = 1; i < parts.length - 1; i++) {
        res.sizes.push(parts[i])
      }
      return res
    } catch {
      var defaultRes = {
        exclude: true,
        sizes: [1, 1, 2],
        restRatio: 0.4,
      }
      console.log('not parsed')
      console.log(defaultRes)
      return defaultRes
    }
  }

  chrome.storage.local.get(['fastread-algorithm'], (data) => {
    const algorithm = parseAlgorithm(
      data['fastread-algorithm'] || defaultAlgorithm
    )

    function createStylesheet() {
      chrome.storage.sync.get(
        ['highlightSheet', 'restSheet'],
        function (data) {
          var style = document.createElement('style')
          style.type = 'text/css'
          style.id = 'fastread-style-id'
          const highlightSheet =
            data.highlightSheet || defaultHighlightSheet
          const restSheet = data.restSheet || defaultRestSheet
          style.innerHTML =
            '.fastread-highlight {' +
            highlightSheet +
            ' } .fastread-rest {' +
            restSheet +
            '}'
          document.getElementsByTagName('head')[0].appendChild(style)
        }
      )
    }

    function deleteStyleSheet() {
      var sheet = document.getElementById('fastread-style-id')
      sheet.remove()
    }

    function hasStyleSheet() {
      return document.getElementById('fastread-style-id') != null
    }
    /*     function fastreadifyWord(word) {
     *         var numBold = 1;
     *         if (word.length == 1) {
     *             return word;
     *         }
     *         if (word.length == 4) {
     *             numBold = 2;
     *         }
     *         else if (word.length > 4) {
     *             numBold = Math.floor(word.length * 0.4);
     *         }
     *
     *         return "<span class=\"fastread-highlight\">" + word.slice(0, numBold) + "</span>" + "<span class=\"fastread-rest\">" + word.slice(numBold) + "</span>";
     *     } */

    let commonWords = [
      'the',
      'be',
      'to',
      'of',
      'and',
      'a',
      'an',
      'it',
      'at',
      'on',
      'he',
      'she',
      'but',
      'is',
      'my',
    ]

    function fastreadifyWord(words) {
      let ret = ''

      words = words.split(/(-|\.|,|')/)

      for (const word of words) {
        if (word.length >= 1) {
          var index = word.length - 1
          var numBold = 1

          if (word.length <= 3 && algorithm.exclude) {
            if (isCommon(word)) return word
          }

          if (index < algorithm.sizes.length) {
            numBold = algorithm.sizes[index]
          } else {
            numBold = Math.ceil(word.length * algorithm.restRatio)
          }

          ret +=
            '<span class="fastread-highlight">' +
            word.slice(0, numBold) +
            '</span>' +
            '<span class="fastread-rest">' +
            word.slice(numBold) +
            '</span>'
        } else {
          ret += word
        }
      }

      function isCommon(word) {
        return commonWords.indexOf(word) != -1
      }

      return ret
    }

    function fastreadifyText(text) {
      var res = ''
      if (text.length < 10) {
        return text
      }
      for (var word of text.split(' ')) {
        res += fastreadifyWord(word) + ' '
      }
      return res
    }

    function fastreadifyNode(node) {
      if (
        node.tagName === 'SCRIPT' ||
        node.tagName === 'STYLE' ||
        node.nodeType === 8
      )
        return
      if (
        node.childNodes == undefined ||
        node.childNodes.length == 0
      ) {
        if (
          node.textContent != undefined &&
          node.tagName == undefined
        ) {
          var newNode = document.createElement('span')
          newNode.classList.add('fastread-container')
          newNode.innerHTML = fastreadifyText(node.textContent)
          if (node.textContent.length > 20) {
            node.replaceWith(newNode)
          }
        }
      } else {
        for (var child of node.childNodes) {
          fastreadifyNode(child)
        }
      }
    }

    if (hasStyleSheet()) {
      deleteStyleSheet()
    } else {
      createStylesheet()
      fastreadifyNode(document.body)
    }
  })
}

function patternsInclude(patterns, url) {
  for (var pattern of patterns) {
    if (url.match(pattern)) {
      return true
    }
  }
  return false
}
