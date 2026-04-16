# ACAW / CAMA

[![BSD-3-Clause license](https://badgen.net/github/license/inclusive-design/acaw-cama)](https://github.com/inclusive-design/acaw-cama/blob/main/LICENSE.md)
[![Latest release](https://badgen.net/github/release/inclusive-design/acaw-cama)](https://github.com/inclusive-design/acaw-cama/releases/latest)

Microsite for ACAW / CAMA.

## Release Process

Changelogs and releases are handled by [release-please](https://github.com/googleapis/release-please-action). We use a
modified versioning scheme based on [calendar versioning](https://calver.org/) in the form `YYYY.MM.MICRO` (where
`MICRO`, the third and final number in the version, indicates a patch, starting at 0 within each month's sequence of releases).

Prior to release, commit and push a single commit to bump the version appropriately:

```bash
git commit --allow-empty -m "chore: prepare release

Release-As: 2026.4.2"
```

(In this example, that would be the third release for April 2026 for a given package.)

Once that commit is in the version history, release-please will update the release pull request to the new version and
it can be merged.
