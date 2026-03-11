const User = require('../models/User');

// Create
exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Read All
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ isDeleted: false }).populate('role');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Read by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true, runValidators: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete (Soft Delete)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully (soft delete)', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Enable User Status
// POST /users/enable using body: email, username
exports.enableUser = async (req, res) => {
    try {
        const { email, username } = req.body;
        if (!email || !username) {
            return res.status(400).json({ message: 'Email and username are required' });
        }

        const user = await User.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User with provided email and username not found' });
        }
        res.status(200).json({ message: 'User status enabled successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Disable User Status
// POST /users/disable using body: email, username
exports.disableUser = async (req, res) => {
    try {
        const { email, username } = req.body;
        if (!email || !username) {
            return res.status(400).json({ message: 'Email and username are required' });
        }

        const user = await User.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: false },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User with provided email and username not found' });
        }
        res.status(200).json({ message: 'User status disabled successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
