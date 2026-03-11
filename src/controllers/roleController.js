const Role = require('../models/Role');
const User = require('../models/User');

// Create
exports.createRole = async (req, res) => {
    try {
        const role = new Role(req.body);
        await role.save();
        res.status(201).json(role);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Read All (excluding soft-deleted)
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find({ isDeleted: false });
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Read by ID
exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
        if (!role) return res.status(404).json({ message: 'Role not found' });
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update
exports.updateRole = async (req, res) => {
    try {
        const role = await Role.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true, runValidators: true }
        );
        if (!role) return res.status(404).json({ message: 'Role not found' });
        res.status(200).json(role);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete (Soft Delete)
exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (!role) return res.status(404).json({ message: 'Role not found' });
        res.status(200).json({ message: 'Role deleted successfully (soft delete)', role });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all users for a specific role based on request /roles/:id/users
exports.getUsersByRole = async (req, res) => {
    try {
        const roleId = req.params.id;
        const role = await Role.findOne({ _id: roleId, isDeleted: false });

        if (!role) return res.status(404).json({ message: 'Role not found' });

        const users = await User.find({ role: roleId, isDeleted: false });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
