'use strict';

const express = require('express');
const User = require('./models').User;
const Course = require('./models').Course;
const { authenticateUser } = require('./middleware/auth-user');
const { asyncHandler } = require('./middleware/async-handler.js');


// Construct a router instance.
const router = express.Router();

// Route that returns a list of users.
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
  const { firstName, lastName, emailAddress } = req.currentUser;
  res.status(200).json( { firstName, lastName, emailAddress } );
}));

// Route that creates a new user and catches SequelizeUniqueConstraint Error
router.post('/users', asyncHandler(async (req, res) => {
  try {
    await User.create(req.body);
    res.location('/');
    res.status(201).json({ message: "Account successfully created!" });

  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ message: 'That email address is already in use.' });
    } else {
      throw error;
    }
  }
}));

// Route to return all Courses
router.get('/courses', asyncHandler(async (req, res) => {
  let courses = await Course.findAll();
  res.json(courses);
}));
// Route to return course with specific id
router.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (course) {
    res.json(course);
  } else {
    const error = new Error();
    error.status = 404;
  }
}));

// Route to create a new course
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
  const newCourse = await Course.create(req.body)
  // Construct the Location header
  const courseUri = `/api/courses/${newCourse.id}`;
  res.location(courseUri);
  res.status(201).end();
}));

// Route to update a course using PUT with express validator to send an error if the title or description do not exist
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {// Error handling if there are any errors
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }
  const course = await Course.findByPk(req.params.id);
  if (course) {
    if (course.userId === req.currentUser.id) {
    await course.update(req.body);
    res.json(course);
    } else {
      res.status(403).json({ message: 'You are not authorized to update this course.' });
    }
  } else {
    const error = new Error();
    error.status = 404;
  }
}));

// Route to delete a course
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);

  if (course) {
    // Checks for matching userId that created the course and the user that's deleting it
    if (course.userId === req.currentUser.id) {
      await course.destroy();
      res.status(204).end();
    } else {
      res.status(403).json({ message: 'You are not authorized to delete this course.' });
    }
  } else {
    res.status(404).json({ message: 'Course not found.' });
  }
}));




module.exports = router;
