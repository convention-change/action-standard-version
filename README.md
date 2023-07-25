[![Check dist/](https://github.com/convention-change/action-standard-version/actions/workflows/check-dist.yml/badge.svg)](https://github.com/convention-change/action-standard-version/actions/workflows/check-dist.yml)
[![GitHub license](https://img.shields.io/github/license/convention-change/action-standard-version)](https://github.com/convention-change/action-standard-version)
[![GitHub latest SemVer tag)](https://img.shields.io/github/v/tag/convention-change/action-standard-version)](https://github.com/convention-change/action-standard-version/tags)
[![GitHub release)](https://img.shields.io/github/v/release/convention-change/action-standard-version)](https://github.com/convention-change/action-standard-version/releases)

## Features

- [x] create CHANGELOG.md and tag by [standard-version](https://github.com/conventional-changelog/standard-version)
- [x] support `dry-run` to see what commands would be run, without committing to git or updating files
- [x] push tag and CHANGELOG.md to remote branch at `target-branch` or by `GITHUB_REF`
- [x] out put `release-tag-name` and `release-tag-short` to use in next step
    - [x] out env `ACTION_STANDARD_VERSION_RELEASE_TAG_NAME` by default or change by `release-tag-name-env` 

## Usage

```yaml
on:
  pull_request:
    types: 
      - closed

permissions:
  contents: write

jobs:
  create-tag-merged-main:
    if: ${{ github.event.pull_request.merged == true && github.base_ref == 'main' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Configure committer
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"

      - name: create-standard-version
        id: create-standard-version
        uses: convention-change/action-standard-version@v1
        with:
          release-by-ref: ${{ github.head_ref }}
         # dry-run: true
         # push-changes-and-tag: true

      - name: get-action-standard-version-out
        run: |
          echo "outputs.release-tag-name   ${{ steps.create-standard-version.outputs.release-tag-name }}"
          echo "outputs.release-tag-short  ${{ steps.create-standard-version.outputs.release-tag-short }}"
          # change by release-tag-name-env
          echo "ACTION_STANDARD_VERSION_RELEASE_TAG_NAME ${{ env.ACTION_STANDARD_VERSION_RELEASE_TAG_NAME }}"
```

# dev

## Contributing

[![Contributor Covenant](https://img.shields.io/badge/contributor%20covenant-v1.4-ff69b4.svg)](.github/CONTRIBUTING_DOC/CODE_OF_CONDUCT.md)
[![GitHub contributors](https://img.shields.io/github/contributors/convention-change/action-standard-version)](https://github.com/convention-change/action-standard-version/graphs/contributors)

We welcome community contributions to this project.

Please read [Contributor Guide](.github/CONTRIBUTING_DOC/CONTRIBUTING.md) for more information on how to get started.

请阅读有关 [贡献者指南](.github/CONTRIBUTING_DOC/zh-CN/CONTRIBUTING.md) 以获取更多如何入门的信息

## Code in Main

Install the dependencies

```bash
npm install
```

Run the tests :heavy_check_mark:

```bash
$ npm test

 PASS  ./index.test.js
  ✓ throws invalid number (3ms)
  ✓ wait 500 ms (504ms)
  ✓ test runs (95ms)
...
```

## Change action.yml

The action.yml defines the inputs and output for your action.

Update the action.yml with your name, description, inputs and outputs for your action.

See the [documentation](https://help.github.com/en/articles/metadata-syntax-for-github-actions)

## Change the Code

Most toolkit and CI/CD operations involve async operations so the action is run in an async function.

```javascript
const core = require('@actions/core');
...

async function run() {
  try {
      ...
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
```

See the [toolkit documentation](https://github.com/actions/toolkit/blob/master/README.md#packages) for the various packages.

## Package for distribution

GitHub Actions will run the entry point from the action.yml. Packaging assembles the code into one file that can be checked in to Git, enabling fast and reliable execution and preventing the need to check in node_modules.

Actions are run from GitHub repos.  Packaging the action will create a packaged action in the dist folder.

Run prepare

```bash
npm run prepare
```

Since the packaged index.js is run from the dist folder.

```bash
git add dist
```

## Create a release branch

Users shouldn't consume the action from master since that would be latest code and actions can break compatibility between major versions.

Checkin to the v1 release branch

```bash
git checkout -b v1
git commit -a -m "v1 release"
```

```bash
git push origin v1
```

Note: We recommend using the `--license` option for ncc, which will create a license file for all of the production node modules used in your project.

Your action is now published! :rocket:

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

