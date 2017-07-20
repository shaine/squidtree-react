# Squidtree React

Node 6 + React iteration of Squidtree, a collection of stuff about Shaine Hatch.

## Installation

1. Clone this repository
1. Set the correct values in config.json
1. Ignore any flag overrides from git
`$ git update-index --assume-unchanged flag-overrides.json`
1. `$ yarn install`
1. `$ yarn build`
1. Start the server somehow

## Development

1. Set the correct values in config.json
1. Start the dev server with `$ yarn dev`

## Common Tasks

### Change a Feature Flag

1. Locate the flag name in config.json
1. Copy the flag into flag-overrides.json
1. Override the value to whatever is needed
1. Rebuild and relaunch the app

Note: Do not commit flag-overrides.json. Permanent changes to feature flags should
be committed to config.json.
