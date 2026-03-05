const errorHandler = (error, req, res, next) => {
  console.log(`Error: ${error.message}`);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
  });
};

export default errorHandler;
