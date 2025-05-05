import Amenity from './amenity.model.js';
import Hotel from '../hotel/hotel.model.js';

export const register = async (req, res) => {
    try {
        const data = req.body;
        const existingAmenity = await Amenity.findOne({ name: data.name });

        if (existingAmenity) {
            return res.status(400).json({
            msg: 'This amenity already exists'
            });
        }

        const newAmenity = new Amenity(data);
        await newAmenity.save();

        res.status(201).json({
        msg: 'Amenity created successfully',
        newAmenity
        });
    } catch (err) {
        res.status(500).json({
        msg: 'Error creating amenity',
        error: err.message
        });
    }
};

export const update = async (req, res) => {
    try {
        const { aid } = req.params;
        const data = req.body;
        
        const existingAmenity = await Amenity.findOne({ name: data.name });
        
        if (existingAmenity && existingAmenity._id.toString() !== aid) {
            return res.status(400).json({
            msg: 'This amenity name is already in use'
        });
    }

    const amenity = await Amenity.findByIdAndUpdate(aid, data, { new: true });

        return res.status(200).json({
            success: true,
            message: 'Amenity updated successfully',
            amenity
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error updating amenity',
            error: err.message
        });
    }
};

export const deleteA = async (req, res) => {
    try {
        const { aid } = req.params;

        const amenity = await Amenity.findByIdAndDelete(aid);
        if (!amenity) {
            return res.status(404).json({
                success: false,
                message: 'Amenity not found'
            });
        }

        await Hotel.updateMany(
            { amenities: aid },
            { $pull: { amenities: aid } }
        );

        return res.status(200).json({
            success: true,
            message: 'Amenity deleted successfully and removed from hotels',
            amenity
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting amenity',
            error: err.message
        });
    }
};



export const getA = async (req, res) => {
    try {
        const { limit = 10, from = 0 } = req.query;

        const [total, amenities] = await Promise.all([
            Amenity.countDocuments(),
            Amenity.find()
            .skip(Number(from))
            .limit(Number(limit))
        ]);

        return res.status(200).json({
            success: true,
            total,
            amenities
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error getting amenities',
            error: err.message
        });
    }
};
