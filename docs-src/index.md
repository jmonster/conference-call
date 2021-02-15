---
layout: page.11ty.cjs
title: <conference-call> ⌲ Home
---

# &lt;conference-call>

`<conference-call>` is an awesome element. It's a great introduction to building web components with LitElement, with nice documentation site as well.

## As easy as HTML

<section class="columns">
  <div>

`<conference-call>` is just an HTML element. You can it anywhere you can use HTML!

```html
<conference-call></conference-call>
```

  </div>
  <div>

<conference-call></conference-call>

  </div>
</section>

## Configure with attributes

<section class="columns">
  <div>

`<conference-call>` can be configured with attributed in plain HTML.

```html
<conference-call name="HTML"></conference-call>
```

  </div>
  <div>

<conference-call name="HTML"></conference-call>

  </div>
</section>

## Declarative rendering

<section class="columns">
  <div>

`<conference-call>` can be used with declarative rendering libraries like Angular, React, Vue, and lit-html

```js
import {html, render} from 'lit-html';

const name="lit-html";

render(html`
  <h2>This is a &lt;conference-call&gt;</h2>
  <conference-call .name=${name}></conference-call>
`, document.body);
```

  </div>
  <div>

<h2>This is a &lt;conference-call&gt;</h2>
<conference-call name="lit-html"></conference-call>

  </div>
</section>
