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
    autoSnap: true,
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

### Options

#### `autoUpdateTransform (default: true)`

`autoUpdateTransform` will make `PeekAHeader` automatically update the transform on the element.
In some cases you may want to control this yourself if you are also applying other transforms, then this should be set to false.

#### `autoAriaHidden (default: true)`

`autoAriaHidden` will automatically update `aria-hidden` on your header. In some cases you might want to set this to false, if there are other factors that may make the header hidden.

#### `autoSnap (default: false)`

`autoSnap` makes the header snap into place once scroll ends.

### Methods

#### `show()`

Makes the header fully visible

#### `partialHide()`

Hides the header as much as possible, if the header is fixed, it will be completely hidden.

#### `hide()`

You should probably use `partialHide()`
Makes the header completely hidden.

NOTE: if used on a sticky header it may go further up than it's static position. For sticky headers you may use `partialHide()`

#### `destroy()`

destroy should be called when you no longer need the header. Maybe you are switching page to a page that does not use the same header, then you should call this function.

Calling any functions after this function is called will result in undefined behavior and most likely memory leaking.

#### `lock(position: 'hidden' | 'shown' | 'current')`

May currently not work well with sticky headers if there is anything before the flow of it.

Locks the header in place, either `'hidden'`, `'shown'` or `'current'`.

#### `unlock()`

Unlocks the header if it was locked.

#### `on()`, `off()`

see Events

### Events

#### `progress`

```typescript
(progress: { progress: number, amount: number })
```

progress is the percentage of the header that is hidden and amount is the amount of pixels of the header that is hidden.

#### `transitionStart` and `transitionEnd`

These events are emitted when a transiton is started and ended.

#### `hidden`

Emitted when the header is completely hidden.

#### `unhidden`

Emitted when the header is no longer completely hidden, and partially visible.

## Development

TODO:

## Publishing

```bash
pnpm version # patch | minor | major
pnpm build
pnpm publish
```
