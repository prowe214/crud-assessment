var express = require('express');
var router = express.Router();
var moment = require('moment');
var db = require('monk')('localhost/assessments');
var jobs = db.get('jobs');

router.get('/', function(req, res, next) {
  jobs.find({$query: {}, $orderby: {date: -1}}, function (err, docs) {
    res.render('index', {jobs: docs});
  });
});

router.post('/', function(req, res, next) {
  jobs.insert({
    title: req.body.title,
    company: req.body.company,
    shortDescription: req.body.shortDescription,
    details: req.body.details,
    date: moment().format('l'),
    open: true,
    applicants: []
  });
  res.redirect('/');
});

router.get('/new', function (req, res, next) {
  res.render('new');
});

router.get('/:id', function (req, res, next) {
  jobs.find({_id: req.params.id}, function (err, doc) {
    res.render('show', {job: doc});
  });
});

router.post('/:id/apply', function (req, res, next) {
  console.log(req.body);
  jobs.update({_id: req.params.id}, {$push: {
    applicants: {
      applicantId: Math.floor(Math.random() * 10000000),
      name: req.body.name,
      email: req.body.email,
      resume: req.body.resume
    }
  }});
  res.redirect('/' + req.params.id);
});

router.get('/:id/edit', function (req, res, next) {
  jobs.find({_id: req.params.id}, function (err, doc) {
    res.render('edit', {job: doc});
  });
});

router.post('/:id/edit', function(req, res, next) {
  if (req.body.open === "true") req.body.open = true;
  if (req.body.open === "false") req.body.open = false;
  jobs.update({_id: req.params.id}, { $set: {
    title: req.body.title,
    company: req.body.company,
    shortDescription: req.body.shortDescription,
    details: req.body.details,
    open: req.body.open
  }});
  res.redirect('/' + req.params.id);
});

router.get('/jobs/:id/delete/:applicantId', function (req, res, next) {
  jobs.update({}, {$pull: {
    applicants: { _id: req.params.applicantId }
  }});
  res.redirect('/');
});

router.get('/:id/delete', function (req, res, next) {
  jobs.remove({_id: req.params.id});
  res.redirect('/');
});

router.get('/:id/apply', function (req, res, next) {
  jobs.find({_id: req.params.id}, function (err, doc) {
    res.render('apply', {job: doc});
  });
});

module.exports = router;
