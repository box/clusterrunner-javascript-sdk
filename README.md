[![Project Status](http://opensource.box.com/badges/active.svg)](http://opensource.box.com/badges)
[![Build Status](https://travis-ci.org/box/clusterrunner-javascript-sdk.svg)](https://travis-ci.org/box/clusterrunner-javascript-sdk)

ClusterRunner Javascript SDK
-------------------

This is ClusterRunner javascript SDK that works both in node(v4.0.0+) and browsers.

Installing
------------------
```bash
npm install clusterrunner-javascript-sdk
```

Usage
------------------
#### Get ClusterRunner Build
```javascript
var ClusterRunner = require('clusterrunner-javascript-sdk');
var client = new ClusterRunner('cluster-master-url.com');
var buildPromise = client.getBuild(1);
```

#### Get Build Subjobs
```javascript
buildPromise.then(function(build) {
  var subjobsPromise = build.subjobs();
});
```

#### Get Subjob Atoms
```javascript
var atomPromise = subjob.atoms();
```

#### Get Atom's console output
```javascript
var consoleOutputPromise = atom.consoleOutput();
```

Contributing
-----------------------

#### Developer Setup
```bash
npm install
```

#### Testing
```bash
gulp unit-test
# You can also run `gulp test` which also runs functional test, which only works on POSIX systems for now
# gulp test
```


## Support

Need to contact us directly? Email oss@box.com and be sure to include the name of this project in the subject.

## Copyright and License

Copyright 2015 Box, Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
