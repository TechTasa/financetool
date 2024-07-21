const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');


const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const managementRoutes = require('./routes/managementRoutes');
const leadsRoutes = require('./routes/leadsRoutes');
const jobRoutes = require('./routes/jobRoutes');
const careerRoutes = require('./routes/careerRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const blogRoutes = require('./routes/blogRoutes');
const blogPageRoutes = require('./routes/blogPageRoutes');


const { connect} = require('./config/db');
const bodyParser = require('body-parser');
const { log } = require('console');

require('dotenv').config();

const app = express();


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));


// Connect Database
connect();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
  });

  app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: false,
    store: store
  }));
  
  app.use('/auth', authRoutes);
  app.use('/loan', leadRoutes);
  app.use('/dashboard', dashboardRoutes);
  app.use('/dashboard/management', managementRoutes);
  app.use('/dashboard/leads', leadsRoutes);
  app.use('/dashboard/jobs',jobRoutes);
  app.use('/dashboard/resume', resumeRoutes);
  app.use('/dashboard/blog', blogRoutes);
  app.use('/career',careerRoutes);
  app.use('/blog', blogPageRoutes);


  app.get('/', (req, res) => {
    const loggedin=req.session.user;
    res.render("home",{loggedin})
  })
  
  app.get('/services', (req, res) => {
    const loggedin=req.session.user;
    res.render("services",{loggedin})
    // res.sendFile(path.join(__dirname, 'public','html', 'services.html'));
  })
  app.get('/services/creditcard', (req, res) => {
    const loggedin=req.session.user;
    res.render("creditcard",{loggedin})
    // res.sendFile(path.join(__dirname, 'public','html', 'services.html'));
  })
  app.get('/services/personal', (req, res) => {
    const loggedin=req.session.user;
    res.render("personal",{loggedin})
    // res.sendFile(path.join(__dirname, 'public','html', 'services.html'));
  })
  app.get('/services/business', (req, res) => {
    const loggedin=req.session.user;
    res.render("business",{loggedin})
    // res.sendFile(path.join(__dirname, 'public','html', 'services.html'));
  })
  app.get('/services/micro', (req, res) => {
    const loggedin=req.session.user;
    res.render("micro",{loggedin})
    // res.sendFile(path.join(__dirname, 'public','html', 'services.html'));
  })
  app.get('/services/home', (req, res) => {
    const loggedin=req.session.user;
    res.render("homeloan",{loggedin})
    // res.sendFile(path.join(__dirname, 'public','html', 'services.html'));
  })
  app.get('/contact', (req, res) => {
    const loggedin=req.session.user;
    res.render("contact",{loggedin})
    // res.sendFile(path.join(__dirname, 'public','html', 'contact.html'));
  })

  
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port http://localhost:${PORT}`));
