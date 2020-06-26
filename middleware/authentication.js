const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.get("Authorization");

    if (!authHeader) {
        res.status(401).json({
            message: "Tidak ada token.",
        });
    }
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, "passwordsangatrahasia");
    } catch (err) {
        res.status(500).json({ message: err });
    }
    if (!decodedToken) {
        res.status(400).json({
            message: "Tidak terauthentikasi.",
        });
    }
    req.userId = decodedToken.userId;
    next();
};