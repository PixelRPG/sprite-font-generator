# Sprite Font Generator

A straightforward tool designed to convert web fonts into sprite fonts. At present, it only supports the [ark-pixel-font](https://github.com/TakWolf/ark-pixel-font) and [fusion-pixel-font](https://github.com/TakWolf/fusion-pixel-font). However, plans are underway to broaden its capabilities to encompass various web fonts in the near future.

## Usage

At the moment, we don't have a user interface in place. However, you can easily toggle between fonts using the Space key. Additionally, to activate the debug mode, simply press F1 on your keyboard. To save the sprite font, simply right-click on the canvas and select Save image as.... Please note that this functionality is confirmed to work in Chrome. In the future, we plan to introduce a dedicated user interface for this purpose.

## Development

> **Note on Development Tools**: Our project heavily relies on web development tools such as Node.js and Yarn. We operate under the assumption that contributors or users interacting with our codebase possess a foundational understanding of these tools. As such, we won't delve into detailed explanations or tutorials on their usage within this documentation. If you're unfamiliar with them, we recommend seeking external resources or tutorials to get up to speed.

### Initiate Development Mode

Kick off a local development server with hot-reloading and file-watching capabilities:

```shell
yarn dev
```

### Production Build

Compile and prepare the project for a production environment:

```shell
yarn build
```

### Preview Production Build

Launch a local server to view the production-ready build:

```shell
yarn preview
```