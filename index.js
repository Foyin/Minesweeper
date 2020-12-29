// Setup basic express server
var favicon = require('serve-favicon');
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d\n', port);
  console.log('Go to http://localhost:3000');
});
 
// Make your Express server:
app.use(express.static(path.join(__dirname, 'public')));

// Add favicon
app.use(favicon(path.join(__dirname, 'public', 'images/mine.png')));

/* catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
*/
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {

    app.locals.pretty = true;  // made Jade HTML pretty
  
    app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
	    message: err.message,
	    error: err
	});
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


