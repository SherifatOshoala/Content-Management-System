const messages = require("../messages")

const landing = (req, res) => {
    res.status(200).json({
      success: true,
      message: messages.landing,
    })
  }


  module.exports = landing










