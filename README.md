# Flow-Bro

![Icon](https://i.imgflip.com/1mdkbx.jpg)

## Installation

```
npm install -g flow-bro
yarn global add flow-bro
```

## Usage

```shell
flow-bro get-untyped 25
flow-bro project-coverage
flow-bro coverage
```
### Commands
#### `get-untyped <number>`

It gets you the most untyped components in the current directory. <br>
Example: `flow-bro get-untyped 25`

#### `project-coverage` (alias: `coverage`)

Get your overall flow coverage. <br>
Example: `flow-bro project-coverage`

### `watch` (alias: `w`)

Watches the directory for changes and gets you flow updates. <br>
Example: `flow-bro watch`

## Contributing

To develop locally do the following:

1. clone this repository
2. run `npm link` in the cloned repo
3. install the linked version by running `npm install -g flow-bro`

### TODOs

- make sure we have a pre-commit hook with prettier

## License

MIT © Daniel Schmidt
