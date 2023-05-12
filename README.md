# Peek A Header 👻

[Demo](https://oak-digital.github.io/peek-a-header/)

Peek A Header is a library that can automatically hide and show your header based on scroll, see gif below.

![peek-a-header-demo](https://github.com/Oak-Digital/peek-a-header/assets/1552267/8546fa51-70c2-4e9b-ac9d-5f19f3a24e9a)

## Requirements

This package will only work on `sticky` or `fixed` html elements that have `top: 0`.

## Getting started

### Insallation

Install with your package manager

```bash
$ npm install @oak-digital/peek-a-header
$ pnpm install @oak-digital/peek-a-header
$ yarn add @oak-digital/peek-a-header
```

### Basic usage

```typescript
import PeekAHeader from '@oak-digital/peek-a-header';

const element = document.getElementById('myHeader')!;
const peekAHeader = new PeekAHeader(element);
```

## Usage

### Base

`PeekAHeader` needs an `HTMLElement` as it's first argument and a set of options as it's second argument. All options are optional

```typescript
const options = {
    // transitionStrategy: See Transitions
    autoUpdateTransform: true,
    autoAriaHidden: true,
};
const peekAHeader = new PeekAHeader(element, options);
```

### Transitions

If you want to have transitions when calling `show()`, `hide()` or `partialHide()`, you should add a transition strategy when instantiating `PeekAHeader`.

example:

```typescript
import PeekAHeader, { TransitionClassStrategy } from '@oak-digital/peek-a-header';

const element = document.getElementById('myHeader')!;

const transitionStrategy = new TransitionClassStrategy({
    showClass: 'transition-transforms',
    hideClass: 'transition-transforms-fast',
});
const peekAHeader = new PeekAHeader(element, {
    transitionStrategy: transitionStrategy,
})
```

In this example we use the built-in `TransitionClassStrategy` which sets a class when transitioning, you will have to define the classes yourself.

You can also define the transitions yourself by making a class that implements `TransitionStrategy`. For example if you want to use your some animation library like `framer-motion` or `popmotion`.

## Development

TODO:

## Publishing

```bash
pnpm version # patch | minor | major
pnpm build
pnpm publish
```
