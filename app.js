
import createError from 'http-errors';

import express from 'express';
import session from 'express-session';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';


import adminRouter from './routes/admins';
import announcementRouter from './routes/announcements';
import authRouter from './routes/auth';
import faqRouter from './routes/faq';
import indexRouter from './routes/index';
import eventRouter from './routes/events';
import paymentRouter from './routes/payments';
import publicCallbackRouter from './routes/public_callbacks';
import settingRouter from './routes/settings';
import talentRouter from './routes/talents';
import userRouter from './routes/users';

import models from './models';

import { SESSION_SECRET } from './config/auth';

import { passportAuthenticate } from './helpers/passport'

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/announcements', passportAuthenticate, announcementRouter);
app.use('/api/faq', passportAuthenticate, faqRouter);
app.use('/api/admins', passportAuthenticate,adminRouter);
app.use('/api/events', passportAuthenticate,eventRouter);
app.use('/api/payments', passportAuthenticate,paymentRouter);
app.use('/api/talents', passportAuthenticate,talentRouter);
app.use('/api/users', passportAuthenticate,userRouter);
app.use('/api/settings',settingRouter);
app.use('/callback', publicCallbackRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

models.sequelize.sync({ alter:true });

module.exports = app;
