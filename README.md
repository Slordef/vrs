# Ver - App Versioning Manager
Automatically manage application version, installation, version selection, forward and rollback
For the moment, simple in design.
Creation of symbolic links to redirect on the application folder and of a "versions" folder for the various versions available.

Definition of the number of versions kept in order to allow the rollback in the fastest way.
Creation of logs for each version installed and registered.

Based on nodejs, required.

## Installation
Use the package manager [NPM](https://www.npmjs.com/) for install `ver`
```bash
npm install -g ver
```

## Usage
Init a ver service with `ver init` in the folder and answer questions.
For a setup auto, type `ver init -y` (without any, repo, installing and other features)

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

You can modify the `ver.config.json` as you want with these params :
```json
{
  "config": "ver.config.json", // only .json file
  "conserve": 3,
  "name": "ver-tests", // unique
  "path": "PATH_TO_THE_FOLDER",
  "repo": { // object, null
    "build": true,
    "copyFolder": "./dist",
    "path": "./repo",
    "script": "build"
  },
  "useFile": "js", // none, bash, js
  "file": "exec.js", // not required if useFile is to "none"
  "versions": [ // set by ver for kept tracking
    {
      "current": false,
      "dir": "20210809204707"
    },
    {
      "current": true,
      "dir": "20210809222146"
    }
  ]
}
```
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
