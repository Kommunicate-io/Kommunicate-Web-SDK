---
id: api-authentication
title: Authentication 
sidebar_label: Authentication
---

Kommuncate comes with a set of platform APIs, which provides you more control over the process and opens up the ways for customizations. All endpoints are relative to base URL and accept **application/json** content type.

## Base URL
```
https://services.kommunicate.io/

```
## Authentication

Kommunicate uses the key based authentication. Kommunicate server accepts the request only if valid API key found in request header. Add `apiKey` parameter in the query String or `Api-Key` in request header. Get your api key from [komunicate dashboard](https://dashboard.kommunicate.io/install) or drop a mail on `hello@kommunicate.io`.
