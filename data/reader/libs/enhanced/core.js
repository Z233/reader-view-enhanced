const scripts = [
  {
    src: '/data/reader/libs/enhanced/highlight.min.js',
    callback: () => {
      const pres = document.querySelectorAll('pre')
      for (let pre of pres) {
        const code = document.createElement('code')
        code.textContent = pre.innerText
        const newPre = pre.cloneNode()
        newPre.appendChild(code)
        pre.replaceWith(newPre)
      }
      hljs.highlightAll()
      const style = document.createElement('style')
      style.textContent = `.hljs { color: #000; } .language-xml .hljs-meta, .language-xml .hljs-meta-string { font-weight: bold; font-style: italic; color: #48b; } .hljs-comment, .hljs-quote { font-style: italic; color: #070; } .hljs-name, .hljs-keyword, .hljs-built_in { color: #808; } .hljs-name, .hljs-attr { font-weight: bold; } .hljs-string { font-weight: normal; } .hljs-code, .hljs-string, .hljs-meta .hljs-string, .hljs-number, .hljs-regexp, .hljs-link { color: #00f; } .hljs-title, .hljs-symbol, .hljs-bullet, .hljs-variable, .hljs-template-variable { color: #f40; } .hljs-title.class_, .hljs-class .hljs-title, .hljs-type { font-weight: bold; color: #639; } .hljs-title.function_, .hljs-function .hljs-title, .hljs-attr, .hljs-subst, .hljs-tag { color: #000; } .hljs-formula { background-color: #eee; font-style: italic; } .hljs-addition { background-color: #beb; } .hljs-deletion { background-color: #fbb; } .hljs-meta { color: #269; } .hljs-section, .hljs-selector-id, .hljs-selector-class, .hljs-selector-pseudo, .hljs-selector-tag { font-weight: bold; color: #48b; } .hljs-selector-pseudo { font-style: italic; } .hljs-doctag, .hljs-strong { font-weight: bold; } .hljs-emphasis { font-style: italic; }`
      document.head.appendChild(style)
    },
  },
  {
    src: '/data/reader/libs/enhanced/pangu.min.js',
    callback: () => {
      pangu.autoSpacingPage()
    },
  },
  {
    src: '/data/reader/libs/enhanced/opencc-js/data.min.js',
  },
  {
    src: '/data/reader/libs/enhanced/opencc-js/data.t2cn.min.js',
  },
  {
    src: '/data/reader/libs/enhanced/opencc-js/bundle-browser.min.js',
    callback: () => {
      const converter = OpenCC.Converter({ from: 'hk', to: 'cn' })
      const rootNode = document.documentElement

      function inner(currentNode) {
        /* Do not convert these elements */
        if (currentNode.tagName === 'SCRIPT') return
        if (currentNode.tagName === 'STYLE') return

        /* 處理特殊屬性 */
        if (
          currentNode.tagName === 'META' &&
          currentNode.name === 'description'
        ) {
          currentNode.content = converter(currentNode.content)
        } else if (
          currentNode.tagName === 'META' &&
          currentNode.name === 'keywords'
        ) {
          currentNode.content = converter(currentNode.content)
        } else if (currentNode.tagName === 'IMG') {
          currentNode.alt = converter(currentNode.alt)
        } else if (
          currentNode.tagName === 'INPUT' &&
          currentNode.type === 'button'
        ) {
          currentNode.value = converter(currentNode.nodeValue)
        }

        for (const node of currentNode.childNodes) {
          if (node.nodeType === Node.TEXT_NODE) {
            node.nodeValue = converter(node.nodeValue)
          } else {
            inner(node)
          }
        }
      }

      inner(rootNode)
    },
  },
]

for (const script of scripts) {
  const scriptEle = document.createElement('script')
  scriptEle.src = script.src
  document.head.appendChild(scriptEle)
  if (script.callback) scriptEle.onload = script.callback
}
