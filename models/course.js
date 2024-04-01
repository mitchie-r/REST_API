'use strict';
const { Model, DataTypes } = require('sequelize');
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Course extends Sequelize.Model { }
    Course.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        estimatedTime: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        materialsNeeded: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false, // Cannot have a course without a user
            references: { 
                model: 'Users', // Reference the name of your User model 
                key: 'id' 
            } 
          }
        }, { sequelize });

    Course.associate = (models) => {
        Course.belongsTo(models.User, {
            as: 'class', // alias
            foreignKey: {
                fieldName: 'classUserId',
                allowNull: false,
            },
        });
    };

    return Course;
};
