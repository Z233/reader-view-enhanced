Origin: https://github.com/rNeomy/reader-view

### Features

- code highlight ([highlight.js](https://highlightjs.org/))
- chinese typography enhanced
  ([pangu.js](https://github.com/vinta/pangu.js))
- traditional chinese convert to simplified chinese
  ([opencc-js](https://github.com/nk2028/opencc-js))
  
### Custom Styling

```css
body {
  padding-bottom: 64px;
}
a:visited {
  color: #d33bf0;
}
a:link, a:link:hover, a:link:active, a:link * {
  color: #0095dd;
}
a:link {
  text-decoration: none;
  font-weight: normal;
}
pre {
  white-space: pre-wrap;
}
pre code {
  background-color: #eff0f1;
  color: #393318;
  font-family: Dank Mono;
  display: block;
  padding: 5px 10px;
}
/* for supermemo 18 */
.hljs span[class^=hljs]:not([class*=tag]):not([class*=string]) {
  display: inline-table;
  white-space: pre;
}
.hljs {
  font-family: Dank Mono, Consolas, Monaco;
  font-size: 16px;
  line-height: 1.5;
}
blockquote {
    font-size: 1.1rem;
    color: #999;
    border-left: 0.2rem solid #dfe2e5;
    margin: 1rem 0;
    padding: 0 0 0 1rem;
}
body[data-mode="dark"] pre code {
  background-color: #585858;
  color: #e8e8e8;
}

/* CSS for sans-serif fonts */
body[data-font=sans-serif] {
  font-family: "NYTImperial", "Noto Serif CJK SC", "Source Han Serif SC", "Source Han Serif CN";
}
/* CSS for serif fonts */
body[data-font=serif] {}

/* CSS for "sepia" theme */
body[data-mode=sepia] {
}
/* CSS for "light" theme */
body[data-mode=light] {}
/* CSS for "dark" theme */
body[data-mode=dark] {}
```
