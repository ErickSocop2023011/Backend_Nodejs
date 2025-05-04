import Hotel from "./hotel.model.js";

export const register = async (req, res) => {
    try{
        const data = req.body;

        const existingHotel = await Hotel.findOne({$or:[{email: data.email}, {name: data.name}]});
        if (existingHotel) {
            return res.status(400).json({
                msg: "The credentials are already in use"
            });
        }


        const newHotel = new Hotel(data);
        await newHotel.save();

        res.status(201).json({
            msg: "Successfully created hotel",
            newHotel
        });
    } catch (err) {
        res.status(500).json({ 
            msg: "Error creating hotel",
            error: err.message 
        });
    }
}

export const getHotels = async (req, res) => {
    try{
        const { limit = 10, from = 0 } = req.query;
        const query = { status: true };
        const [total, hotels] = await Promise.all([
            Hotel.countDocuments(query),
            Hotel.find(query)
                .skip(Number(from))
                .limit(Number(limit))
                // .populate([
                //     {path: "amenities", select: "name"},
                //     {path: "services", select: "name"},
                //     {path: "rooms", select: "name"},
                //     {path: "events", select: "name"}
                // ])
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
        // .populate([
        //         {path: "amenities", select: "name"},
        //         {path: "services", select: "name"},
        //         {path: "rooms", select: "name"},
        //         {path: "events", select: "name"}
        //         ])

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
        const filter = {};

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

        if (name) {
            filter.name = new RegExp(name, 'i');
        }

        if (location) {
            filter.location = new RegExp(location, 'i');
        }

        if (phone) {
            filter.phone = new RegExp(phone, 'i');
        }

        if (category) {
            filter.category = category;
        }

        if (starRating) {
            const [min, max] = starRating.split(',').map(v => v.trim());
            filter.starRating = min && max
                ? { $gte: +min, $lte: +max }
                : min
                    ? { $eq: +min }
                    : max
                        ? { $eq: +max }
                        : undefined;
        }

        if (amenities) {
            const amenitiesArray = Array.isArray(amenities) ? amenities : amenities.split(',');
            // filter.amenities = { $all: amenitiesArray }; // ← habilitar si el modelo Amenity ya está listo
        }

        if (services) {
            const servicesArray = Array.isArray(services) ? services : services.split(',');
            // filter.services = { $all: servicesArray };
        }

        if (rooms) {
            const roomsArray = Array.isArray(rooms) ? rooms : rooms.split(',');
            // filter.rooms = { $all: roomsArray };
        }

        if (events) {
            const eventsArray = Array.isArray(events) ? events : events.split(',');
            // filter.events = { $all: eventsArray };
        }

        const hotels = await Hotel.find(filter)
            // .populate('amenities', 'name') // ← descomenta cuando los modelos estén completos
            // .populate('services', 'name')
            // .populate('rooms', 'name')
            // .populate('events', 'name');

        res.status(200).json({
            success: true,
            total: hotels.length,
            hotels
        });

    } catch (error) {
        console.error('Error filtering hotels:', error);
        res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
};


export const updateHotel = async (req, res) => {
    try{
        const { hid } = req.params
        const data = req.body

        const existingHotel = await Hotel.findOne({$or:[{email: data.email}, {name: data.name}, {location: data.location}, {phone: data.phone}]});
        if (existingHotel && existingHotel._id.toString() !== hid) {
            return res.status(400).json({
                msg: "The credentials are already in use"
            });
        }

        const hotel = await Hotel.findByIdAndUpdate(hid, data, {new: true, runValidators: true})
        
        return res.status(200).json({
            success: true,
            message: "Hotel updated successfully",
            hotel
        });
    } catch(err){
        return res.status(500).json({
            success: false,
            message: "Error updating hotel",
            error: err.message
        })
    }
}

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

