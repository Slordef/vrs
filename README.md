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
| - ver.config.json 
```

For new version, type `ver new` in folder or `ver new -n [nameofservice]`

For rollback `ver rollback` or forward `ver forward`. You can set an index of rollback `ver rb --set 0`. For rollback with delete the current version `ver rollback --delete` or `ver rb -d`

## Still to do
- [x] Simply do what i expect for the moment
- [ ] Implementation of file (bash or js)
- [ ] Get all versions of service
- [ ] Setup service or ver globals 
- [ ] Redefine init with questions
- [ ] Many other features

## Contribute
Offer me some features and I will try to implement them. Or improve my code.

## License
Ver is available under [MIT](https://choosealicense.com/licenses/mit/) license.
