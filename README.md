# 😎 parallaxed

Easily apply parallax effects to page elements as you scroll.

## How to install

Via [npm](https://npmjs.com/package/parallaxed)

```sh
npm install --save parallaxed
```

Via [Yarn](https://yarn.fyi/parallaxed)

```sh
yarn add parallaxed
```

## How to use

### Options

* `selectors {string || Array}` - Selectors used to generate the html elements that will be reported on.

* `onEnter {function}` - Handler called when an element enters the viewport.

* `onExit {function}` - Handler called when an element exits the viewport.

* `onProgress {function}` - Handler called when as an element progresses through the viewport.

### Example

[Simple Example](examples/simple.html)

## License

[MIT](LICENSE) © [Ryan Hefner](https://www.ryanhefner.com)
