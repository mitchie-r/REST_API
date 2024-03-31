'use strict';
const { Model, DataTypes } = require('sequelize');
const Sequelize = require('sequelize');


module.exports = (sequelize) => {
    class User extends Sequelize.Model { }
    User.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A first name is required'
                },
                notEmpty: {
                    msg: 'Please provide a first name'
                }
            }
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'The email you entered already exists'
            },
            validate: {
                notNull: {
                    msg: 'An email is required'
                },
                isEmail: {
                    msg: 'Please provide a valid email'
                }
            }
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
              notNull: {
                msg: 'A password is required'
              },
              notEmpty: {
                msg: 'Please provide a password'
              },
              len: {
                args: [8, 20],
                msg: "The password should be between 8 and 20 characters in length"
              }
            }
          },
    }, { sequelize });

    User.associate = (models) => {
        User.hasMany(models.Course, {
            as: 'class', // alias
            foreignKey: {
                fieldName: 'classUserId',
                allowNull: false,
            },
        });
    };

    return User;
};
