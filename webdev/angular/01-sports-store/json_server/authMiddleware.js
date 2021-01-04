/**
 * Simple authentication middleware for json-server used only
 * for testing purposes.
 */
const jwt = require("jsonwebtoken");

const APP_SECRET = "sports_store_app_secret";
const USERNAME = "admin";
const PASSWORD = "nimda";

module.exports =(req, res, next) => {
  if ((req.url === "/api/login" || req.url === "/login") && req.method === "POST") {
    // The user is attempting to gain administrator privileges
    if (req.body != null && req.body.name === USERNAME && req.body.password === PASSWORD) {
      // Create a signed JWT token and return it to the client
      const token = jwt.sign({ data: USERNAME, expiresIn: "1h"}, APP_SECRET);
      res.json({ success: true, token: token });
    }
    else {
      res.json({ success: false });
      res.end();
      return;
    }
  }
  else if (((req.url.indexOf("/api/products") !== -1 || req.url.indexOf("/products") !== -1 ||
            req.url === "/api/categories" || req.url === "/categories") && req.method !== "GET") ||
           (req.url.startsWith("/orders") && req.method !== "POST")) {
    // This is either:
    // 1) A request that attempts to update the products or categories or create a new product
    // 2) or a request that attempts to update existing orders (as opposed
    //    to registering a new order)
    //
    // both of which require admin access rights. Hence, try fetching the
    // JWT token from the headers and verify it
    let token = req.headers["authorization"];
    if (token != null && token.startsWith("Bearer<")) {
      token = token.substring(7, token.length - 1);
      try {
        // Exception is thrown if token cannot be verified
        jwt.verify(token, APP_SECRET);
        next();
        return;
      }
      catch(err) {}

      // JWT verification failed, report 401 Unauthorized error
      res.statusCode = 401;
      res.end();
      return;
    }
  }

  // Proceed to next middleware
  next();
};
