/**
 * Sets up various security related middleware.
 */
const enforceTLS = require("express-enforces-ssl");
const helmet = require("helmet");
const ms = require("ms");

// Export a function that can be used to register security middleware on
// Express app (or router)
module.exports.registerSecurityMiddleware = app => {
    // Add middleware that redirects to HTTPS URL whenever an HTTP
    // request is received.
    app.use(enforceTLS());

    // Use HSTS to instruct client to stay on HTTPS for 2 years
    app.use(helmet.hsts({
        maxAge: ms("2 years"),
        includeSubDomains: true
    }));

    // Use helmet to add the X-XSS-Protection HTTP header to request which can help
    // mitigate reflected XSS attacks in older browsers
    app.use(helmet.xssFilter());

    // Define CSP policy
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [
              "'self'", "'unsafe-inline'", "jquery.com", "*.jquery.com", "cloudflare.com", "*.cloudflare.com",
              "bootstrapcdn.com", "*.bootstrapcdn.com"
            ],
            imgSrc: ["'self'", "blob:"],
            objectSrc: ["'none'"],
            frameAncestors: ["'self'"]
        }
    }));

    // Configure Referer policy
    app.use(helmet.referrerPolicy({
        policy: "strict-origin-when-cross-origin"
    }));

    // Prevent express from advertising itself
    app.disable("x-powered-by");

    // Set X-Frame-Options to prevent other sites from embedding this site
    app.use(helmet.frameguard({ action: 'sameorigin' }));

    // Prevent Flash and Acrobat from loading data from our site by setting the
    // X-Permitted-Cross-Domain-Policies header to 'none'
    app.use(helmet.permittedCrossDomainPolicies());

    // Prevent browsers from trying to sniff the received file type by setting
    // the X-ContentType-Options header to 'nosniff'
    app.use(helmet.noSniff());

    // Disable DNS pre-fetching by setting the X-DNS-Prefetch-Control to 'off'
    app.use(helmet.dnsPrefetchControl());

    // Prevent old IE browsers from executing downloads in our site's context
    // by setting X-Download-Options to 'noopen'
    app.use(helmet.ieNoOpen());
};
