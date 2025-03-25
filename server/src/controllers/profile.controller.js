import { User } from "../models/user.model.js";

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const userProfile = await User.findById(userId);

        if (!userProfile) {
            return res.status(404).send({ "message": "User not found" });
        }

        return res.status(200).send({ "message": "User profile retrived successfully", profile: userProfile });
    } catch (error) {
        console.error("Error retrieving user data", error);
        return res.status(500).send({ "message": "Internal Server Error" });
    }
};

export {getProfile}