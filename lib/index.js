'use strict';

var Sequelize = require('sequelize');
var _ = require('lodash');
var helpers = require('./helpers');

exports.init = function (sequelize, optionsArg) {
  // console.log(message); // eslint-disable-line

  var defaultOptions = {
    debug: false,
    log: console.log,
    author: 'author',
    revisionAttribute: 'revision',
    commentModel: 'comment',
    UUID: false,
    underscored: false, // underscored created and updated attributes
    userModel: false, // To track the user that made the changes
    documentId: 'documentId',
    revisionId: 'revisionId',
    authorId: 'authorId',
    userId: 'userId',
  };

  var options = Object.assign({}, defaultOptions, optionsArg);

  // enable debug logging
  var debug = options.debug;
  var log = options.log;

  // show the current sequelize and options objects
  if (debug) {
    // log('sequelize object:');
    // log(sequelize);
    log('options object:');
    log(options);
  }

  // order in which sequelize processes the hooks
  // (1)
  // beforeBulkCreate(instances, options, fn)
  // beforeBulkDestroy(instances, options, fn)
  // beforeBulkUpdate(instances, options, fn)
  // (2)
  // beforeValidate(instance, options, fn)
  // (-)
  // validate
  // (3)
  // afterValidate(instance, options, fn)
  // - or -
  // validationFailed(instance, options, error, fn)
  // (4)
  // beforeCreate(instance, options, fn)
  // beforeDestroy(instance, options, fn)
  // beforeUpdate(instance, options, fn)
  // (-)
  // create
  // destroy
  // update
  // (5)
  // afterCreate(instance, options, fn)
  // afterDestroy(instance, options, fn)
  // afterUpdate(instance, options, fn)
  // (6)
  // afterBulkCreate(instances, options, fn)
  // afterBulkDestroy(instances, options, fn)
  // afterBulkUpdate(instances, options, fn)

  // Extend model prototype with "enableModelComments" function
  // Call model.enableModelComments() to enable comments for model
  _.extend(sequelize.Model, {
    enableModelComments: function enableModelComments() {
      if (debug) {
        log('Enabling model comments on', this.name);
      }

      this.addHook("beforeCreate", beforeHook);
      this.addHook("beforeUpdate", beforeHook);
      this.addHook("afterCreate", afterHook);
      this.addHook("afterUpdate", afterHook);

      // create association
      this.hasMany(sequelize.models[options.commentModel], {
        foreignKey: options.documentId,
        constraints: false,
        scope: {
          model: this.name
        }
      });

      return this;
    }
  });

  var beforeHook = function beforeHook(instance, opt) {
    if (debug) {
      log('beforeHook called');
      log('instance:');
      log(instance);
      log('opt:');
      log(opt);
    }

    // Get comment field
    var comment = instance.dataValues.comment;

    if (debug) {
      log('comment:');
      log(comment);
    }

    if (comment && comment.length > 0) {
      if (!instance.context) {
        instance.context = {};
      }
      instance.context.comment = comment;
    }

    if (debug) {
      log('end of beforeHook');
    }
  };

  var afterHook = function afterHook(instance, opt) {
    if (debug) {
      log('afterHook called');
      log('instance:', instance);
      log('opt:', opt);
    }

    if (instance.context && instance.context.comment && instance.context.comment.length > 0) {
      var Comment = sequelize.model(options.commentModel);

      // Build comment
      var comment = Comment.build({
        comment: instance.context.comment,
        model: this.name,
        documentId: instance.id,
        authorId: opt.userId,
      });

      if (instance.get(options.userId)) {
        comment[options.userId] = instance.get(options.userId);
      }

      if (this.name === options.userModel) {
        comment[options.userId] = instance.get(options.id);
      }

      comment[options.revisionAttribute] = instance.get(options.revisionAttribute);

      // Save comment
      return comment.save().then(function (comment) {
        return null;
      }).catch(function (err) {
        log('Somment save error');
        log(err);
        throw err;
      });
    }

    if (debug) {
      log('end of afterHook');
    }
  };

  return {
    // Return defineModels()
    defineModels: function defineModels(db) {
      var attributes = {
        comment: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        model: {
          type: Sequelize.TEXT,
          allowNull: false
        },
      };

      if (options.mysql) {
        attributes.document.type = Sequelize.TEXT('MEDIUMTEXT');
      }

      attributes[options.documentId] = {
        type: Sequelize.INTEGER,
        allowNull: false
      };

      attributes[options.revisionAttribute] = {
        type: Sequelize.INTEGER,
        allowNull: true
      };

      if (debug) {
        log('attributes');
        log(attributes);
      }
      if (options.UUID) {
        attributes.id = {
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4
        };
        attributes.documentId.type = Sequelize.UUID;
      }
      // Comment model
      var Comment = sequelize.define(options.commentModel, attributes, {
        classMethods: {
          associate: function associate(models) {
            Comment.belongsTo(sequelize.model(options.userModel), {
              as: options.author,
              foreignKey: { field: options.authorId },
              constraints: false,
            });

            Comment.belongsTo(sequelize.model(options.userModel), {
              foreignKey: { field: options.userId },
              constraints: false,
            });
          }
        },
        underscored: options.underscored
      });

      db[Comment.name] = Comment;

      if (options.userModel) {
        Comment.belongsTo(sequelize.model(options.userModel), {
          as: options.author,
          foreignKey: { field: options.authorId },
          constraints: false,
        });

        Comment.belongsTo(sequelize.model(options.userModel), {
          foreignKey: { field: options.userId },
          constraints: false,
        });
      }
      return Comment;
    }
  };
};

module.exports = exports;
