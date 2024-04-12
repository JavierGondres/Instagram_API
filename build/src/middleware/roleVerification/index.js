export const roleVerification = (roles) => (req, res, next) => {
    if (!req.decodedUserRole)
        return res.status(404).json({
            error: true,
            message: "Missing auth",
        });
    const userHasValidRole = roles.some((role) => { var _a; return ((_a = req.decodedUserRole) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === role.toLowerCase(); });
    if (userHasValidRole) {
        return next();
    }
    else {
        return res.status(403).send({
            message: `User is not authorized`,
        });
    }
};
