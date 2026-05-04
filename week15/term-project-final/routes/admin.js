import express from 'express';
import Property from '../models/propertySchema.js';
import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();

router.get('/dashboard', isAdmin, (req, res) => {
    return res.status(200).json({
        adminEmail: req.user.email,
        message: 'Admin dashboard'
    });
});


router.get('/dashboard/data', isAdmin, async (req, res) => {
    try {
        const properties = await Property.find().sort({ createdAt: -1 }).lean();

        return res.status(200).json({
            adminEmail: req.user.email,
            propertyName: properties[0]?.name || 'your property',
            properties
        });

    } catch (err) {
        console.log("admin.js dashboard/data err", err);
        return res.status(500).send('Server error, uh oh');
        
    } 
});

export default router;