module.exports = async function (context, req) {
    if (process.env["RedirectRules"] === undefined) {
        context.log.info("Functions.Http301Redirect: No redirect rules found.");
    } else {
        try {
            var disguisedHost = req.headers["disguised-host"];
            if (disguisedHost === undefined) {
                disguisedHost = "localhost";
            }

            var redirectRules = JSON.parse(process.env["RedirectRules"]);
            var redirectRule = redirectRules[disguisedHost];
            if (redirectRule === undefined && disguisedHost.startsWith("www.")) {
                redirectRule = redirectRules[disguisedHost.substring(4)];
            }
            if (redirectRule === undefined) {
                context.log.info("Functions.Http301Redirect: No redirect rules found for " + disguisedHost + ".");
            } else {
                context.log.info("Functions.Http301Redirect: Redirecting " + disguisedHost + " to " + redirectRule);
                context.res = {
                    status: 301,
                    headers: {
                        "Location": redirectRule
                    }
                };
            }
        } catch (e) {
            context.log.error(e)
        }
    }
};
