# LaunchKit

## Usage

```sh
# Install globally
yarn global add launchkit

# See detailed usage instructions
launchkit -h
```

## Config

```js
// The general schema of the file should look like this
// Note that any config is deeply merged with "default" if present
MainConfig {
  [envName]: EnvConfig,
  default: EnvConfig,
}

// Individual configs for each branch
EnvConfig {
  deployer: string,
  protected: boolean,
  options: DeployerOptions,
}

DeployerOptions {
  // ...any data that the provider might need to deploy
}

// Only the "now" provider is currently supported:
NowDeployerOptions {
  token: string
  alias: string // aliasing pattern using mustache, see example below
  vars: {
    [TARGET_ENV_VAR]: ""
  }
}
```

## Example Config File

```yaml
default:
  deployer: now
  options:
    alias: '{{PROJECT_REPONAME}}-{{BRANCH}}.example.com'
    token: XxMTU7FBlszCFkMnzsAGhnho
    vars:
      CAREERS_SITE: 'https://careers-site-dev.example.com'
      DATA_SERVICE: 'https://data-service-dev.example.com'
      PUBLIC_API: 'https://public-api-dev.example.com'
dev:
  options:
    alias: '{{PROJECT_REPONAME}}-dev.example.com'
    vars:
      CAREERS_SITE: 'https://careers-site.example.com'
      DATA_SERVICE: 'https://data-service.example.com'
      PUBLIC_API: 'https://public-api.example.com'
      SUPER_SECRET_TOKEN: beep
production:
  options:
    alias: '{{PROJECT_REPONAME}}.example.com'
    vars:
      CAREERS_SITE: 'https://careers-site.example.com'
      DATA_SERVICE: 'https://data-service.example.com'
      PUBLIC_API: 'https://public-api.example.com'
      SUPER_SECRET_TOKEN: foo

```
