function asyncWrapper(controller) {
  return async function (req, res, next) {
    try {
      // invoke route handler
      await controller(req, res);
    } catch (error) {
      // forward error to errorHandler middleware
      next(error);
    }
  };
}

export default asyncWrapper;
