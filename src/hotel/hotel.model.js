import { Schema, model } from 'mongoose';

const HotelSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        enum: ['Luxury', 'Boutique', 'Business', 'Budget', 'Family', 'Romantic', 'Eco-Friendly'],
        required: true,
        default: 'Budget'
    },
    starRating: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        required: true,
        default: 1
    },
    totalRooms: {
        type: Number,
        required: true
    },
    amenities: [{
        type: Schema.Types.ObjectId,
        ref: 'Amenity'
    }],
    services: [{
        type: Schema.Types.ObjectId,
        ref: 'Service'
    }],
    rooms: [{
        type: Schema.Types.ObjectId,
        ref: 'Room'
    }],
    events: [{
        type: Schema.Types.ObjectId,
        ref: 'Event'
    }],
    status: {
        type: Boolean,
        default: true
    }
}, 
{
    timestamps: true,
    versionKey: false
});

HotelSchema.methods.toJSON = function () {
    const { __v, _id, ...hotel } = this.toObject();
    hotel.hid = _id;
    return hotel;
}

export default model('Hotel', HotelSchema);
