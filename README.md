<p align="center">
  <img src="https://github.com/codeclimate.png?size=200" alt="Code Climate">
</p>

# setup-codeclimate

[![version](https://badgen.net/github/release/remarkablemark/setup-codeclimate)](https://github.com/remarkablemark/setup-codeclimate/releases)
[![build](https://github.com/remarkablemark/setup-codeclimate/actions/workflows/build.yml/badge.svg)](https://github.com/remarkablemark/setup-codeclimate/actions/workflows/build.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/41506f89fd7e38398c84/maintainability)](https://codeclimate.com/github/remarkablemark/setup-codeclimate/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/41506f89fd7e38398c84/test_coverage)](https://codeclimate.com/github/remarkablemark/setup-codeclimate/test_coverage)

⚙️ Set up your GitHub Actions workflow with [Code Climate test reporter](https://github.com/codeclimate/test-reporter).

## Quick Start

```yaml
- name: Setup Code Climate
  uses: remarkablemark/setup-codeclimate@v2

- name: Run Test and Upload Coverage
  run: |
    cc-test-reporter before-build
    # insert your test command here
    cc-test-reporter after-build --exit-code $?
  env:
    CC_TEST_REPORTER_ID: ${{ secrets.CC_TEST_REPORTER_ID }}
```

## Usage

See [action.yml](action.yml)

**Basic:**

```yaml
- uses: remarkablemark/setup-codeclimate@v2
```

**Example:**

```yaml
- uses: remarkablemark/setup-codeclimate@v2
- run: |
    cc-test-reporter before-build
    npm test
    cc-test-reporter after-build --exit-code $?
  env:
    CC_TEST_REPORTER_ID: ${{ secrets.CC_TEST_REPORTER_ID }}
```

## Inputs

### `codeclimate-version`

**Optional**: The Code Climate test reporter [version](https://github.com/codeclimate/test-reporter/releases). Defaults to `latest`:

```yaml
- uses: remarkablemark/setup-codeclimate@v2
  with:
    codeclimate-version: 0.11.1
```

### `cli-name`

**Optional**: The Code Climate test reporter CLI name. Defaults to `cc-test-reporter`):

```yaml
- uses: remarkablemark/setup-codeclimate@v2
  with:
    cli-name: cc-test-reporter
```

## Examples

- [remarkablemark/codeclimate-github-actions-examples](https://github.com/remarkablemark/codeclimate-github-actions-examples)

## Contributions

Contributions are welcome!

## License

[MIT](LICENSE)
