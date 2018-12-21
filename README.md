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

## Azure DNS Settings
Azure DNS can be configured manually, or with help of PowerShell script, for example. 

```powershell
function New-AzureRedirectDnsZone {
    Param($Name, $ResourceGroupName, $FunctionIPv4Address, $FunctionDomainName)

    if ([string]::IsNullOrEmpty($Name)) {
        Write-Error "Missing parameter: Name"
        return
    }
    if ([string]::IsNullOrEmpty($ResourceGroupName)) {
        Write-Error "Missing parameter: ResourceGroupName"
        return
    }
    if ([string]::IsNullOrEmpty($FunctionIPv4Address)) {
        Write-Error "Missing parameter: FunctionIPv4Address"
        return
    }
    if ([string]::IsNullOrEmpty($FunctionDomainName)) {
        Write-Error "Missing parameter: FunctionDomainName"
        return
    }

    New-AzureRmDnsZone -Name $Name -ResourceGroupName $ResourceGroupName
    New-AzureRmDnsRecordSet -Name "@" -RecordType A -ZoneName $Name -ResourceGroupName $ResourceGroupName -Ttl 3600 -DnsRecords (New-AzureRmDnsRecordConfig -IPv4Address $FunctionIPv4Address)
    New-AzureRmDnsRecordSet -Name "@" -RecordType TXT -ZoneName $Name -ResourceGroupName $ResourceGroupName -Ttl 3600 -DnsRecords (New-AzureRmDnsRecordConfig -Value $FunctionDomainName)
    New-AzureRmDnsRecordSet -Name "www" -RecordType CNAME -ZoneName $Name -ResourceGroupName $ResourceGroupName -Ttl 3600 -DnsRecords (New-AzureRmDnsRecordConfig -Cname $FunctionDomainName)
}
```

Here is an example how to use the function.

```PS C:\>New-AzureRedirectDnsZone -Name "contoso.com" -ResourceGroupName "Example" -FunctionIPv4Address "1.2.3.4" -FunctionDomainName "example-http-301-redirect.azurewebsites.net"```
