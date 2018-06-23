# Codex Protocol | Codex Viewer

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> Web Frontend for the Codex Registry

The Codex Viewer allows individuals and organizations the ability to create and maintain records within the Codex Registry.

## Table of Contents

- [Background](#background)
- [Dependencies](#dependencies)
- [Install](#install)
- [Build](#build)
- [Maintainers](#maintainers)
- [Contribute](#contribute)
- [License](#license)

## Background

The Codex Viewer is the web front end to the Codex Registry. The Codex Registry allows records (in the form of [ERC-721](http://erc721.org/) tokens) to be created and maintained.

## Dependencies

* [Node.js](https://nodejs.org/en/) (> 8.x)
* NPM (> 5.x)
* [Codex Ethereum Service](https://github.com/codex-protocol/npm.ethereum-service)
* [Codex Registry API](https://github.com/codex-protocol/service.codex-registry-api)
* [Ethereum Event Listener (EEL)](https://github.com/codex-protocol/service.eel)

## Install

First install and run the Codex Ethereum Service, the Codex Registry API and EEL.

```
$ git clone https://github.com/codex-protocol/web.codex-viewer
$ cd web.codex-viewer
$ npm install
$ npm run link-all
$ npm run start
```

## Build

`$ TARGET_ENV=production npm run build` will build static site assets into the `/dist` directory. Serve this using your preferred static site hosting provider.

## Maintainers

- [John Forrest](mailto:john@codexprotocol.com) ([@johnhforrest](https://github.com/johnhforrest))
- [Colin Wood](mailto:colin@codexprotocol.com) ([@Anaphase](https://github.com/Anaphase))
- [Shawn Price](mailto:shawn@codexprotocol.com) ([@sprice](https://github.com/sprice))

## Contribute

If you have any questions, feel free to reach out to one of the repository [maintainers](#maintainers) or simply [open an issue](https://github.com/codex-protocol/web.codex-viewer/issues/new) here on GitHub.

[Pull Requests](https://github.com/codex-protocol/web.codex-viewer/pulls) are not only allowed, but highly encouraged! All Pull Requests must pass CI checks (if applicable) and be approved by at least one repository [maintainer](#maintainers) before being considered for merge.

Codex Labs, Inc follows the [Contributor Covenant Code of Conduct](https://contributor-covenant.org/version/1/4/code-of-conduct).

## License

[GNU Affero General Public License v3.0 or later](LICENSE) © Codex Labs, Inc
