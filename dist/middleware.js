import 'dotenv/config';
import Jwt from "jsonwebtoken";
export const userMiddleware = (req, res, next) => {
    const header = req.headers["authorization"];
    const decoded = Jwt.verify(header, process.env.JWT_SECRET);
    if (decoded) {
        // @ts-ignore
        req.userId = decoded.id;
        next();
    }
    else {
        res.status(403).json({
            message: "You are not loggeg in"
        });
    }
};
//# sourceMappingURL=middleware.js.map