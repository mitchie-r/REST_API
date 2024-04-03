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
        },
        materialsNeeded: {
            type: Sequelize.STRING,
        },
        }, { sequelize });

    Course.associate = (models) => {
        Course.belongsTo(models.User, {
            as: 'class', // alias
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            },
        });
    };

    return Course;
};
