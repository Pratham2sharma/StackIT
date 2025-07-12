
import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
import client from "../lib/redis.js";

const generateToken = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "24h",
    })

    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    })
    return { accessToken, refreshToken }
}

const storeRefreshToken = async (userId, refreshToken) => {
    await client.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60);
}

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true, // prevent xss attacks
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", //prevent cross site scripting attacks
        maxAge: 15 * 60 * 1000,
    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // prevent xss attacks
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", //prevent cross site scripting attacks
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

export const signup = async (req, res) => {
    const { email, password, name , role} = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).send("User already exists");
        }

        if (userExists && userExists.isBanned) {
            return res.status(403).json({ message: 'User is banned' });
        }

        const user = await User.create({ name, email, password , role})

        //authenicate
        const { accessToken, refreshToken } = generateToken(user._id);
        await storeRefreshToken(user._id, refreshToken);

        setCookies(res, accessToken, refreshToken);

        res.status(201).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }, message: "User created successfully"
        });
    }
    catch (error) {
        console.log("Error in Signup Controller", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && user.isBanned) {
            return res.status(403).json({ message: 'User is banned' });
        }

        if (user && (await user.comparePassword(password))) {
            const { accessToken, refreshToken } = generateToken(user._id);

            await storeRefreshToken(user._id, refreshToken);
            setCookies(res, accessToken, refreshToken);

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken: accessToken
            });
        }
        else {
            res.status(401).json({ message: "Invalid Email or Password" });
        }
    }
    catch (error) {
        console.log("Error in Login Controller", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            await client.del(`refresh_token:${decoded.userId}`);
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.json({ message: "Logged Out Successfully" });
    }
    catch (error) {
        console.log("Error in Logout Controller", error.message);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}

//this will refresh the access token
export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedToken = await client.get(`refresh_token:${decoded.userId}`);

        if (storedToken !== refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "24h" });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.set("Authorization", `Bearer ${accessToken}`);

        res.json({ 
            message: "Token refreshed successfully",
            accessToken: accessToken
        });
    } catch (error) {
        console.log("Error in refreshToken controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getProfile = async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const banUser = async (req, res) => {
    const { userId, adminId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Cannot ban an admin' });
        }
        const admin = await User.findById(adminId);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can ban users' });
        }
        user.isBanned = true;
        await user.save();
        res.json({ message: 'User banned successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error banning user' });
    }
};
