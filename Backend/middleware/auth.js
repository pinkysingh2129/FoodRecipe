const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
    let token = req.headers["authorization"];

    if (token) {
        token = token.split(" ")[1]; // Remove "Bearer" prefix
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(400).json({ message: "Invalid token" });
            }
            console.log("decoded",decoded);
            req.user = decoded;
            next(); // ✅ Call next only after successful verification
        });
    } else {
        return res.status(400).json({ message: "Token not found" });
    }
};

module.exports = verifyToken;
