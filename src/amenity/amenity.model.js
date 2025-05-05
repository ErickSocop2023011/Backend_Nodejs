import { Schema, model } from 'mongoose';

const AmenitySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    }
},
{
    timestamps: true,
    versionKey: false
});

AmenitySchema.methods.toJSON = function() {
    const { __v, _id, ...amenity } = this.toObject();
    amenity.aid = _id;
    return amenity;
}

export default model('Amenity', AmenitySchema);
