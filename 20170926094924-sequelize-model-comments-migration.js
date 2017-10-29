'use strict';
var sequelizePaperTrailOptions = require('config').get('sequelizePaperTrailOptions');

module.exports = {
  up: function (queryInterface, Sequelize) {
    // Load default options.
    sequelizePaperTrailOptions.defaultAttributes = {
      documentId: 'documentId',
      revisionId: 'revisionId',
      revisionAttribute: 'revision',
      commentModel: 'Comment',
    };

    // Comment model
    var attributes = {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      model: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    };
    attributes[sequelizePaperTrailOptions.defaultAttributes.documentId] = {
      type: Sequelize.INTEGER,
      allowNull: false
    };
    attributes[sequelizePaperTrailOptions.revisionAttribute] = {
      type: Sequelize.INTEGER,
      allowNull: false
    };

    queryInterface.createTable(sequelizePaperTrailOptions.commentModel, attributes);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable(sequelizePaperTrailOptions.commentModel);
  }
};
