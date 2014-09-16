# biojs-io-annots

[![Build Status](https://secure.travis-ci.org/greenify/biojs-io-annots.png?branch=master)](http://travis-ci.org/greenify/biojs-io-annots)
[![NPM version](https://badge-me.herokuapp.com/api/npm/biojs-io-annots.png)](http://badges.enytc.com/for/npm/biojs-io-annots) 

> Parser for annotation files from Jalview

[Official spec](http://www.jalview.org/builds/latest/help/html/features/annotationsFormat.html)

## Getting Started
Install the module with: `npm install biojs-io-annots`

```javascript
var annots= require('biojs-io-annots');
annots.read(<url to annot file>); // return JSON representation
```

## Documentation

#### .parse(name)

**Parameter**: `file`
**Type**: `String`
**Example**: (see `test/dummy.annot`)

[Example result](https://github.com/greenify/biojs-io-annots/blob/master/test/dummy.json).

#### .read(url)

**Parameter**: `url`
**Type**: `String`
**Example**: `https://raw.githubusercontent.com/greenify/biojs-io-annots/master/test/dummy.annot`

## Contributing

Please submit all issues and pull requests to the [greenify/biojs-io-annots](http://github.com/greenify/biojs-io-annots) repository!

## Support
If you have any problem or suggestion please open an issue [here](https://github.com/greenify/biojs-io-annots/issues).

## License 


This software is licensed under the Apache 2 license, quoted below.

Copyright (c) 2014, greenify

Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
