// Middleware

//Checks if the User already signed;
exports.requireNoSignature = function requireNoSignature(req, res, next) {
    if (req.session.cookieId) {
        res.redirect("/thankyou");
    } else {
        next();
    }
};

exports.requireSignature = function(req, res, next) {
    if (!req.session.cookieId) {
        return res.redirect("/petition");
    }
    next();
};
//Checks if the User is Registered;
exports.requireNoRegistration = function requireNoRegistration(req, res, next) {
    if (req.session.userId) {
        res.redirect("/petition");
    } else {
        next();
    }
};

exports.requireRegistration = function requireRegistration(req, res, next) {
    if (!req.session.userId) {
        return res.redirect("/registration");
    }
    next();
};
