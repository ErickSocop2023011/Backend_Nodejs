import Hotel from "./hotel.model.js";
import Amenity from '../amenity/amenity.model.js';
// import Event from '../event/event.model.js';
// import Room from '../room/room.event.js';
// import Service from '../service/service.model.js';

export const register = async (req, res) => {
    try {
        const data = req.body;

        const existingHotel = await Hotel.findOne({ 
            $or: [{ email: data.email }, { name: data.name }] 
        });
        if (existingHotel) {
            return res.status(400).json({
                msg: "The credentials are already in use"
            });
        }

        const checkIds = async (Model, ids, fieldName) => {
            if (!Array.isArray(ids)) return;

            for (const id of ids) {
                const doc = await Model.findById(id);
                if (!doc) {
                    return res.status(400).json({
                        msg: `Does not exist ${fieldName} with the provided ID: ${id}`
                    });
                }
            }
        };

        await checkIds(Amenity, data.amenities, 'amenity');
        //await checkIds(Event, data.events, 'event');
        //await checkIds(Room, data.rooms, 'room');
        //await checkIds(Service, data.services, 'service');

        const newHotel = new Hotel(data);
        await newHotel.save();

        return res.status(201).json({
            msg: "Successfully created hotel",
            newHotel
        });

    } catch (err) {
        return res.status(500).json({
            msg: "Error creating hotel",
            error: err.message
        });
    }
};

export const getHotels = async (req, res) => {
    try{
        const { limit = 10, from = 0 } = req.query;
        const query = { status: true };
        const [total, hotels] = await Promise.all([
            Hotel.countDocuments(query),
            Hotel.find(query)
                .skip(Number(from))
                .limit(Number(limit))
                .populate([
                    {path: "amenities", select: "name"}//,
                //     {path: "services", select: "name"},
                //     {path: "rooms", select: "name"},
                //     {path: "events", select: "name"}
                ])
        ]);

        return res.status(500).json({
            success: true,
            total,
            hotels
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error getting hotels",
            error: err.message
        })
    }
}

export const getHotel = async (req, res) => {
    try{
        const { hid } = req.params
        const hotel = await Hotel.findOne({ _id: hid, status: true})
        .populate([
                {path: "amenities", select: "name"},
        //         {path: "services", select: "name"},
        //         {path: "rooms", select: "name"},
        //         {path: "events", select: "name"}
                ])

        if(!hotel){
            return res.status(400).json({
                success: false,
                message: "Hotel not found"
            })
        }

        return res.status(200).json({
            success: true,
            hotel
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Error getting hotel",
            error: err.message
        })
    }
}

export const filterHotels = async (req, res) => {
    try {
        const {
            name,
            location,
            phone,
            category,
            starRating,
            amenities,
            services,
            rooms,
            events
        } = req.query;

        const filter = {
            ...(name ? { name: new RegExp(name, 'i') } : {}),
            ...(location ? { location: new RegExp(location, 'i') } : {}),
            ...(phone ? { phone: new RegExp(phone, 'i') } : {}),
            ...(category ? { category } : {}),
            ...(starRating ? (() => {
                const [min, max] = starRating.split(',').map(v => v.trim());
                return min && max
                    ? { starRating: { $gte: +min, $lte: +max } }
                    : min
                        ? { starRating: { $eq: +min } }
                        : max
                            ? { starRating: { $eq: +max } }
                            : {};
            })() : {}),
            ...(amenities ? { amenities: { $all: Array.isArray(amenities) ? amenities : amenities.split(',') } } : {}),
            // ...(services ? { services: { $all: Array.isArray(services) ? services : services.split(',') } } : {}),
            // ...(rooms ? { rooms: { $all: Array.isArray(rooms) ? rooms : rooms.split(',') } } : {}),
            // ...(events ? { events: { $all: Array.isArray(events) ? events : events.split(',') } } : {})
        };

        const hotels = await Hotel.find(filter)
            // .populate('amenities', 'name')
            // .populate('services', 'name')
            // .populate('rooms', 'name')
            // .populate('events', 'name');

        return res.status(200).json({
            success: true,
            total: hotels.length,
            hotels
        });

    } catch (error) {
        console.error('Error filtering hotels:', error);
        return res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
};

export const updateHotel = async (req, res) => {
    try {
        const { hid } = req.params;
        const data = req.body;

        const existingHotel = await Hotel.findOne({ 
            $or: [
                { email: data.email },
                { name: data.name },
                { location: data.location },
                { phone: data.phone }
            ] 
        });

        if (existingHotel && existingHotel._id.toString() !== hid) {
            return res.status(400).json({
                msg: "The credentials are already in use"
            });
        }

        const checkIds = async (Model, ids, fieldName) => {
            if (!Array.isArray(ids)) return;

            for (const id of ids) {
                const doc = await Model.findById(id);
                if (!doc) {
                    return res.status(400).json({
                        msg: `Does not exist ${fieldName} with the provided ID: ${id}`
                    });
                }
            }
        };

        await checkIds(Amenity, data.amenities, 'amenity');
        //await checkIds(Event, data.events, 'event');
        //await checkIds(Room, data.rooms, 'room');
        //await checkIds(Service, data.services, 'service');
        const hotel = await Hotel.findByIdAndUpdate(hid, data, { new: true });

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Hotel updated successfully",
            hotel
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error updating hotel",
            error: err.message
        });
    }
};


export const deleteHotel = async (req, res) => {
    try{
        const { hid } = req.params
        const hotel = await Hotel.findById(hid)

        if(!hotel || hotel.status === false){
            return res.status(400).json({
                success: false,
                message: "Hotel previously deactivated"
            })
        }

        await Hotel.findByIdAndUpdate(hid, { status: false }, { new: true })
        
        return res.status(200).json({
            success: true,
            message: "Hotel deleted successfully",
            hotel
        });
    } catch(err){
        return res.status(500).json({
            success: false,
            message: "Error deleting hotel",
            error: err.message
        })
    }
}

