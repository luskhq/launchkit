# Deployer

## Usage

```sh
# Install gloablly
npm install -g deployer

# See detailed usage instructions
deployer -h
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

```js
{
  "master": {
    "config": {
      "alias": "{{CIRCLE_PROJECT_REPONAME}}.now.sh",
      "vars": {
        "DATA_SERVICE": "https://lusk-data-service.now.sh",
        "CAREERS_SITE": "https://lusk-careers-site.now.sh",
        "PUBLIC_API": "https://lusk-public-api.now.sh"
      }
    }
  },
  "rich-text": {
    "config": {
      "vars": {
        "DATA_SERVICE": "https://lusk-data-service-rich-text.now.sh",
        "CAREERS_SITE": "https://lusk-careers-site-rich-text.now.sh"
      }
    }
  },
  "_default": {
    "provider": "test",
    "config": {
      "token": "sometoken",
      "alias": "{{CIRCLE_PROJECT_REPONAME}}-{{CIRCLE_BRANCH}}.now.sh",
      "vars": {
        "DATA_SERVICE": "https://lusk-data-service-dev.now.sh",
        "CAREERS_SITE": "https://lusk-careers-site-dev.now.sh",
        "PUBLIC_API": "https://lusk-public-api-dev.now.sh"
      }
    }
  }
}
```
