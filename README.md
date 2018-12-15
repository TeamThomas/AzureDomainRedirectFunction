# Azure Domain Redirect Function
Azure DNS lacks a HTTP Redirect capability. Azure Domain Redirect Function supplements Azure DNS with HTTP Redirect capability. The function listens to http/80 and produces a HTTP 301 redirect to a permanent URL. The domain value is read from `DISGUISED-HOST` environment value.

## Application Settings

### RedirectRules
This setting controls which domain is redirected to which URL.

Here is an example setting value in `local.settings.json`.

```json
{
  "IsEncrypted": false,
  "Values": {
    "RedirectRules": "{\"localhost\":\"http:\/\/www.microsoft.com\/\"}"
  }
}
```


