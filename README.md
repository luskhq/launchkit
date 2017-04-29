<!--
TODO:
- Add `protected` env feature to prevent accidental production deploys
- `remove` command should be able to remove entire env
-->

# LaunchKit

## Usage

```sh
# Install gloablly
npm install -g launchkit@alpha

# See detailed usage instructions
launchkit -h
```

## Config

```js
// The general schema of the file should look like this
// Note that any config is deeply merged with "_default" if present
MainConfig {
  [configName]: Config
  _default: Config
}

// Individual configs for each branch
Config {
  provider: "provider-name"
  config: ProviderConfig
}

ProviderConfig {
  // ...any data that the provider might need to deploy
}

// Only the "now" provider is currently supported:

NowProvider {
  // token to use for deployment
  token: "od3oi4oue0du3d0p9u"
  // aliasing pattern, uses mustache with process.env
  alias: "{{ANY_ENV_VAR}}.now.sh"
  // vars to send along with the deploy
  vars: {
    [TARGET_ENV_VAR]: ""
  }
}
```

## Example Config File

```yaml
_default:
  deployer: now
  options:
    alias: '{{CIRCLE_PROJECT_REPONAME}}-{{CIRCLE_BRANCH}}.luskapps.net'
    token: XxMTU7FBlszCFkMnzsAGhnho
    vars:
      CAREERS_SITE: 'https://careers-site-dev.luskapps.net'
      DATA_SERVICE: 'https://data-service-dev.luskapps.net'
      PUBLIC_API: 'https://public-api-dev.luskapps.net'
dev:
  options:
    alias: '{{CIRCLE_PROJECT_REPONAME}}-dev.luskapps.net'
    vars:
      CAREERS_SITE: 'https://careers-site.luskapps.net'
      DATA_SERVICE: 'https://data-service.luskapps.net'
      PUBLIC_API: 'https://public-api.luskapps.net'
      SUPER_SECRET_TOKEN: beep
production:
  options:
    alias: '{{CIRCLE_PROJECT_REPONAME}}.luskapps.net'
    vars:
      CAREERS_SITE: 'https://careers-site.luskapps.net'
      DATA_SERVICE: 'https://data-service.luskapps.net'
      PUBLIC_API: 'https://public-api.luskapps.net'
      SUPER_SECRET_TOKEN: foo
rich-text:
  options:
    vars:
      CAREERS_SITE: 'https://careers-site-rich-text.luskapps.net'
      DATA_SERVICE: 'https://data-service-rich-text.luskapps.net'

```
