# hypothesis pinboard worker

A Cloudflare Worker that add original web pages to pinboard.

- `GET https://hypothesis-pinboard.ACCOUNT.workers.dev/https://hypothes.is/a/RjuHSrr0Eey-hmukl1Mumg`
    - This endpoint just gets the annotation from hypothesis via its API
- `POST https://hypothesis-pinboard.ACCOUNT.workers.dev/https://hypothes.is/a/RjuHSrr0Eey-hmukl1Mumg`
    - This one adds the highlighted web page to pinboard.

---

This is a project generated by [wrangler](https://github.com/cloudflare/wrangler):

```
wrangler generate projectname https://github.com/cloudflare/worker-template
```

Further documentation for Wrangler can be found [here](https://developers.cloudflare.com/workers/tooling/wrangler).
