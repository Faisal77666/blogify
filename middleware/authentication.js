const User = require("../models/user");
const { validateToken } = require("../service/auth");

function checkForAuthenticationCookie(cookieName) {
  return async (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      return next();
    }
    try {
      const userPayload = validateToken(tokenCookieValue);
      
      // fetch full user from DB
      const user = await User.findById(userPayload._id); 
      if (user) {
        req.user = user;  // ✅ attach full user
      }
    } catch (error) {
      console.error(error);
    }
    return next();
  };
}

module.exports = { checkForAuthenticationCookie };
