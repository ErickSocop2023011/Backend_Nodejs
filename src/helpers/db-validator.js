import User from "../user/user.model.js";
import Hotel from "../hotel/hotel.model.js";
import Amenity from "../amenity/amenity.model.js";
/*import Room from "../room/room.model.js";
import Event from "../event/event.model.js";
import Service from "../service/service.model.js";*/

export const emailExists = async (email = "") => {
    const existe = await User.findOne({email})
    if(existe){
        throw new Error(`The email ${email} is already registered`)
    }
}

export const usernameExists = async (username = "") => {
    const existe = await User.findOne({username})
    if(existe){
        throw new Error(`The username ${username} is already registered`)
    }
}

export const userExists = async (uid = " ") => {
    const existe = await User.findById(uid)
    console.log(existe)
    if(!existe){
        throw new Error("The user does not exist")
    }
}

export const hotelExists = async (hid = " ") => {
    const existe = await Hotel.findById(hid)
    if(!existe){
        throw new Error("The hotel does not exist")
    }
}

export const amenityExistsById = async (id) => {
    const exists = await Amenity.findById(id);
        if (!exists) {
        throw new Error(`Amenity with ID ${id} does not exist`);
    }
};

export const amenityNameExists = async (name) => {
    const exists = await Amenity.findOne({ name });
        if (exists) {
        throw new Error(`Amenity with name "${name}" already exists`);
    }
};


/*export const roomExists = async (rid = " ") => {
    const existe = await Room.findById(rid)
    if(!existe){
        throw new Error("The room does not exist")
    }
}

export const eventExists = async (eid = " ") => {
    const existe = await Event.findById(eid)
    if(!existe){
        throw new Error("The event does not exist")
    }
}

export const serviceExists = async (sid = " ") => {
    const existe = await Service.findById(sid)
    if(!existe){
        throw new Error("The service does not exist")
    }
}*/
