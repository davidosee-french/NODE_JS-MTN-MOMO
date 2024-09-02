const NotFound = (req, res, next) => {
    const error = new Error('Route not found');
    error.status = 404;
    next(error); // error status + msg
};
  
  export default NotFound;