import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        // console.log("token", token)

        if (!token) {
            return res.status(401).send({"message": "Token is required"});
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("decoded token", decodedToken);
        

        if (!decodedToken) {
            return res.status(401).send({"message": "decoded token is required"});
        }

        const user = await User.findById(decodedToken.id).select("-Password");
        // console.log("user", user.id);

        if (!user) {
            return res.status(404).send({"message": "User not found"});
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("error in authontication", error);
        return res.status(500).send({"message": "Internal Server Error"});
    }
}

export {authenticate};