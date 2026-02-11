import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        // Verify Google Token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const { sub, name, email, picture } = payload;

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                googleId: sub,
                picture,
            });
        }

        // Create JWT
        const appToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Google login successful",
            token: appToken,
            user,
        });

    } catch (error) {
        res.status(400).json({ message: "Invalid Google token" });
    }
};