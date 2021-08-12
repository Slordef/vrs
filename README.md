# VRS - Versioning and Rollback Service
Automatically manage application version, installation, version selection, forward and rollback
For the moment, simple in design.
Creation of symbolic links to redirect on the application folder and of a "versions" folder for the various versions available.

Definition of the number of versions kept in order to allow the rollback in the fastest way.
Creation of logs for each version installed and registered.

**Based on nodejs, required.**

## Installation
Use the package manager [NPM](https://www.npmjs.com/) for install `vrs`
```bash
npm install -g vrs
```

## Usage
Usage is simple :
```bash
vrs [cmd]
```
VRS works in the folder you are primarily in.
For some commands, it's possible to define the name of the service on which it must work.
ex: `vrs new [name]`

Init a VRS service with `vrs init` in the folder and answer questions.
For a setup auto, type `vrs init -y` (default values)

For new version, type `vrs new` in folder or `vrs new [name]`

Setting a version with `vrs set <version> [name]` where 'version' can be folder of version or index.
(all versions with indexes of service can be found with `vrs service [name]`)

Set automatically previous version with `vrs rollback|rb` or next version with `vrs forward|fw`.
For rolling back and delete the current version `vrs rollback --delete` or `vrs rb -d`

For reset information in VRS service, use `vrs reset`. Answer questions for done.

VRS can be run on background with `vrs [cmd] --no-process` or `-np`.
With this, no result will be show and main process will stop right after command.
Only work with `new`, `rollback` and `forward`

Tree Structure :
```txt
- folder
| - current => ./versions/[version]
| - versions
  | - [version]
| - vrs.config.json 
```
## Still to do
- [x] Simply do what i expect for the moment
- [ ] Implementation of file (bash or js)
- [x] Get all versions of service
- [x] Set VRS globals system 
- [x] Redefine init with questions
- [ ] Logs
- [ ] Many other features

## Contribute
Offer me some features, i will try to implement them. Or improve my code.

## License
Ver is available under [MIT](https://choosealicense.com/licenses/mit/) license.
