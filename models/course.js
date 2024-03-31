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
        releaseYear: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
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
