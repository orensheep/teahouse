# Oren — Portfolio

Static portfolio site with three case studies built from the Figma desktop frames (1440px):

- `hightable.html`: HighTable (brand universe / NFT membership / art direction)
- `teahouse.html`: Teahouse.Finance (brand / user segmentation / product UX)
- `tearex.html`: Tea-REX (design system / mascot / mobile-first design)

`index.html` forwards to the first case study.

## Structure

```
css/style.css   shared layout tokens, components, reveal animations
js/main.js      scroll-triggered reveals, parallax, nav state, reading progress
assets/<project>/  images exported from Figma (WebP)
fonts/          self-hosted Geist + Inter (variable, latin)
```

No build step: serve the folder with any static server, e.g. `python3 -m http.server`.

## Animations

Add `data-reveal` to any element (`fade`, `left`, `right`, `scale`, `zoom`, `wipe`, `rule`, or empty for fade-up),
or `data-stagger="<variant>"` to a parent to reveal its children in sequence. `data-parallax="<speed>"` moves an
element relative to its parent while scrolling. All motion is disabled under `prefers-reduced-motion`.
