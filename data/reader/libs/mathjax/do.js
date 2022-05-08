'use strict';

if (document.querySelector('math')) {
  const s = document.createElement('script');
  s.src = 'libs/mathjax/tex-mml-svg.js';
  document.body.appendChild(s);
}
