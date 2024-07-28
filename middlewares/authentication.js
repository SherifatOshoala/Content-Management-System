const authentication = (req, res, next) => {
    let auth = true;
    if (auth) next();
    else {
      res.status(401).json({
        success: false,
        message: "user is unauthorized!",
      });
    }
  };

  module.exports = authentication