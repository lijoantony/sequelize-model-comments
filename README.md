# Sequelize Model Comments

> Comments support for your sequelize models. Record the user who created the comment. When used along with sequelize-paper-trail, annotates revisions with a user supplied comment.


<!-- [![NPM](https://nodei.co/npm/sequelize-model-comments.png?downloads=true)](https://nodei.co/npm/sequelize-model-comments/) -->

[![node-version](https://img.shields.io/node/v/sequelize-model-comments.svg)](https://www.npmjs.org/package/sequelize-model-comments)
[![npm-version](https://img.shields.io/npm/v/sequelize-model-comments.svg)](https://www.npmjs.org/package/sequelize-model-comments)
[![David](https://img.shields.io/david/lijoantony/sequelize-model-comments.svg?maxAge=3600)]()
[![David](https://img.shields.io/david/dev/lijoantony/sequelize-model-comments.svg?maxAge=3600)]()

[![GitHub release](https://img.shields.io/github/release/lijoantony/sequelize-model-comments.svg)](https://www.npmjs.org/package/sequelize-model-comments)
[![GitHub tag](https://img.shields.io/github/tag/lijoantony/sequelize-model-comments.svg)](https://www.npmjs.org/package/sequelize-model-comments)
[![GitHub commits](https://img.shields.io/github/commits-since/lijoantony/sequelize-model-comments/1.2.0.svg)]()
[![npm-downloads](https://img.shields.io/npm/dt/sequelize-model-comments.svg)](https://www.npmjs.org/package/sequelize-model-comments)

[![license](https://img.shields.io/github/license/lijoantony/sequelize-model-comments.svg)](https://github.com/lijoantony/sequelize-model-comments/blob/master/LICENSE)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Example](#example)
- [User Tracking](#user-tracking)
- [Options](#options)
  - [Default options](#default-options)
  - [Options documentation](#options-documentation)
- [Support](#support)
- [Contributing](#contributing)
- [Author](#author)
- [Thanks](#thanks)
- [Links](#links)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

```bash
npm install --save sequelize-model-comments
```

*Note: the current test suite is very limited in coverage.*

## Usage

Sequelize Model Comments assumes that you already set up your Sequelize connection, for example, like this:
```javascript
var Sequelize = require('sequelize');
var sequelize = new Sequelize('database', 'username', 'password');
```

then adding Sequelize Model Comments is as easy as:

```javascript
var ModelComments = require('sequelize-model-comments').init(sequelize, options);
ModelComments.defineModels({});
```

which loads the Model Comments library, and the `defineModels()` method sets up a `Comments` table.

*Note: If you pass `userModel` option to `init` in order to enable user tracking, `userModel` should be setup before `defineModels()` is called.*

Then for each model that you want to keep a model comments you simply add:

```javascript
Model.enableModelComments();
```

### Example

```javascript
var Sequelize = require('sequelize');
var sequelize = new Sequelize('database', 'username', 'password');

var ModelComments = require('sequelize-model-comments').init(sequelize, options || {});
ModelComments.defineModels();

var Post = sequelize.define('Post, {
  title: Sequelize.STRING,
  content: Sequelize.STRING,
});

Post.enableModelComments();
```

## User Tracking

There are 2 steps to enable user tracking, ie, recording the user who created a particular revision.
1. Enable user tracking by passing `userModel` option to `init`, with the name of the model which stores users in your application as the value.

```javascript
var options = {
  /* ... */
  userModel: 'users',
};
```
2. Pass the id of the user who is responsible for a database operation to `sequelize-model-comments` by sequelize options.

```javascript
Post.update({
  /* ... */
  comment: 'This attribute will be used to create a comment which annotates the revision'
}, {
  userId: user.id
}).then(() {
  /* ... */
});
```

## Options

Model Comments supports various options that can be passed into the initialization. The following are the default options:

### Default options

```javascript
// Default options
var options = {
  revisionAttribute: 'revision',
  commentModel: 'Comment,
  UUID: false,
  underscored: false,
  underscoredAttributes: false,
  defaultAttributes: {
    documentId: 'documentId',
    revisionId: 'revisionId'
  },
  enableMigration: false,
};
```

### Options documentation

| Option | Type | Default Value | Description |
|-------------------------|---------|-----------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [debug] | Boolean | false | Enables logging to the console. |
| [revisionAttribute] | String | 'revision' | Name of the attribute in the table that corresponds to the current revision. |
| [commentModel] | String | 'Comment | Name of the model that keeps the revision models. |
| [UUID] | Boolean | false | The [revisionModel] has id attribute of type UUID for postgresql. |
| [underscored] | Boolean | false | The [revisionModel] and [revisionChangeModel] have 'createdAt' and 'updatedAt' attributes, by default, setting this option to true changes it to 'created_at' and 'updated_at'. |
| [underscoredAttributes] | Boolean | false | The [revisionModel] has a [defaultAttribute] 'documentId', and the [revisionChangeModel] has a  [defaultAttribute] 'revisionId, by default, setting this option to true changes it to 'document_id' and 'revision_id'. |
| [defaultAttributes] | Object | { documentId: 'documentId', revisionId: 'revisionId' } |  |
| [userModel] | String | | Name of the model that stores users in your. |
| [enableMigration] | Boolean | false | Automatically adds the [revisionAttribute] via a migration to the models that have model commentss enabled. |


## Support

Please use:
* GitHub's [issue tracker](https://github.com/lijoantony/sequelize-model-comments/issues)
* Tweet directly to ``

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Added some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## Author

© [Lijo Antony](https://lijoantony.com) – [@lijo_](https://twitter.com/lijo_) – lijozom@gmail.com
Distributed under the MIT license. See ``LICENSE`` for more information.
[https://github.com/lijoantony/sequelize-model-comments](https://github.com/lijoantony/)

## Thanks

This project was inspired by and derived from:
* [Sequelize Paper Trail](https://github.com/nielsgl/sequelize-paper-trail)

## Links
