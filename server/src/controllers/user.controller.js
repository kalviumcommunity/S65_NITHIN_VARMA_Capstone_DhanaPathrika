import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const register = async (req, res) => {
    try {
        const { MobileNumber, Email, Password } = req.body;

        if (!MobileNumber || !Email || !Password) {
            return res.status(400).send({ "message": "All Fields are required" });
        }

        const existedUser = await User.findOne({ $or: [{ MobileNumber }, { Email }] });

        if (existedUser) {
            return res.status(409).send({ "message": "User with email or MobileNumber already exists" });
        }

        const hashedPassword = await bcrypt.hash(Password, 10);

        const newUser = new User({
            MobileNumber,
            Email,
            Password: hashedPassword
        });

        // console.log("newUser", newUser);

        await newUser.save();

        let token;
        try {
            token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '10d' });
        } catch (err) {
            return res.status(500).send({ message: "Error generating token" });
        }

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).send({ "message": "User created successfully" });

    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).send({ "message": "Internal Server Error" });
    }
};

const login = async (req, res) => {
    try {
        const { NumberOrEmail, Password } = req.body;

        if (!NumberOrEmail || !Password) {
            return res.status(400).send({ "message": "All Fields are required" });
        }

        const isMobile = /^[0-9]{10}$/.test(NumberOrEmail);
        const query = isMobile ? { MobileNumber: NumberOrEmail } : { Email: NumberOrEmail };

        // console.log(query);

        const user = await User.findOne(query);
        // console.log("user", user);
        if (!user) {
            return res.status(404).send({ "message": "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(Password, user.Password);
        if (!isPasswordValid) {
            return res.status(401).send({ "message": "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '10d' });
        // console.log("token", token);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).send({ "message": "Login successful", user });

    } catch (error) {
        console.error("Error in login", error);
        return res.status(500).send({ "message": "Internal Server Error" });
    }
};

const logout = (req, res) => {
    try {
        if (!req.cookies.token) {
            return res.status(400).send({ "message": "No cookie is present" });
        }

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.status(200).send({ "message": "Logout successful" });
    } catch (error) {
        console.error("Error in logout", error);
        return res.status(500).send({ "message": "Internal Server Error" });
    }
};


export { register, login, logout };

