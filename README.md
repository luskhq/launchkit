# LaunchKit

This command line utility is useful for providing interface
for deploying to various providers (currently only supports Zeit.co's Now).

## Usage

### Install

#### using Yarn
```sh
$ yarn global add launchkit
```
#### using NPM
```sh
$ npm i -g launchkit
```

#### See detailed usage instructions
```sh
$ launchkit -h
```

### Deploy

Intended usage is to create a `launchkit.yml` in the root of your
project's repository using the syntax described below and encrypt using
a secret stored in `.key` file. 


#### ProjectRoot/.key
```
Your secret token phrase
```

#### ProjectRoot/launchkit.yml
```
default:
  deployer: now
  options:
    alias: dev.example.com
    token: [your Now API token]
    vars: 
      NODE_ENV: development
production:
  options:
    alias: example.com
```

#### Encrypt
This encrypts the file so you can keep it in version 
control like .git repository and keep different configurations
for different branches/features you work on. The only thing
you then need to share with your team is the `.key` file.
```
$ launchkit encrypt launchkit.yml
```

#### Update config var
```
$ launchkit update production options.vars.NODE_ENV=production
```

#### View current config
```
$ launchkit view
default:
  deployer: now
  options:
    alias: dev.example.com
    token: [your Now API token]
    vars: 
      NODE_ENV: development
production:
  options:
    alias: example.com
    vars:
      NODE_ENV: production
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
  // Aliasing pattern using Mustache, see example below. Can also be a list
  // of strings if you need to alias to multiple URLs.
  alias: string
  vars: {
    [TARGET_ENV_VAR]: ""
  }
}
```

## Example Complete Config File Using the Now Deployer

> You can include environment variables in the configuration 
> (options.alias and options.vars) using handlebars. This feature
> is currently only available for the *Now* deployer.

```yaml
default:
  deployer: now
  options:
    alias: '{{PROJECT_REPONAME}}-{{BRANCH}}.example.com'
    token: XxMTU7FBlszCFkMnzsAGhnho
    vars:
      CAREERS_SITE: 'https://careers-site-dev.example.com'
      DATA_SERVICE: 'https://data-service-dev.example.com'
      PUBLIC_API: 'https://public-api-{{ENVIRONMENT}}.example.com'
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
    alias:
      - 'www.example.com'
      - 'example.com'
    vars:
      CAREERS_SITE: 'https://careers-site.example.com'
      DATA_SERVICE: 'https://data-service.example.com'
      PUBLIC_API: 'https://public-api.example.com'
      SUPER_SECRET_TOKEN: foo

```
