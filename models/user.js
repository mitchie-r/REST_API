'use strict';
const { Model, DataTypes } = require('sequelize');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

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
            allowNull: false
        },
        emailAddress: {
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
            type: DataTypes.STRING,
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
            }
          }, { sequelize });
        // Hook for hashing the password
        User.beforeCreate(async (user, options) => {
            const hashedPassword = await bcrypt.hashSync(user.password, 10);
            user.password = hashedPassword; 
});
        
        User.associate = (models) => {
            User.hasMany(models.Course, {
                as: 'class', // alias
                foreignKey: {
                    fieldName: 'userId',
                    allowNull: false,
                },
            });
        }
    return User;
};
