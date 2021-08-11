# Vers - App Versioning Manager
Automatically manage application version, installation, version selection, forward and rollback
For the moment, simple in design.
Creation of symbolic links to redirect on the application folder and of a "versions" folder for the various versions available.

Definition of the number of versions kept in order to allow the rollback in the fastest way.
Creation of logs for each version installed and registered.

Based on nodejs, required.

## Installation
Use the package manager [NPM](https://www.npmjs.com/) for install `vers`
```bash
npm install -g vers
```

## Usage
Init a vers service with `vers init` in the folder and answer questions.
For a setup auto, type `vers init -y` (without any, repo, installing and other features)

Tree Structure :
```txt
- folder
| - current => ./versions/[version]
| - versions
  | - [version]
| - vers.config.json 
```

For new version, type `vers new` in folder or `vers new -n [nameofservice]`

For rollback `vers rollback` or forward `vers forward`. You can set an index of rollback `vers rb --set 0`. For rollback with delete the current version `vers rollback --delete` or `vers rb -d`

For reset information in vers service, use `vers reset`. Answer questions for done.

Vers can be run on background with `vers [cmd] --no-process` or `-np`. With this, no result will be show and main process stop right after command.
## Still to do
- [x] Simply do what i expect for the moment
- [ ] Implementation of file (bash or js)
- [x] Get all versions of service
- [x] Set vers globals system 
- [x] Redefine init with questions
- [ ] Logs
- [ ] Many other features

## Contribute
Offer me some features and I will try to implement them. Or improve my code.

## License
Ver is available under [MIT](https://choosealicense.com/licenses/mit/) license.
