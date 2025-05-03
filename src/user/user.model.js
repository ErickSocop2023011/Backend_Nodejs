import {Schema, model} from 'mongoose';

const userSchema = Schema({
    name:{
        type: String,
        required: [true, "Name is required"],
        maxLength: [25, "Name cannot exceed 25 characters"]
    },
    surname:{
        type: String,
        required: [true, "Surname is required"],
        maxLength: [25, "Surname cannot exceed 25 characters"]
    },
    username:{
        type: String,
        required: true,
        unique:true
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password:{
        type: String,
        required: [true, "Password is required"]
    },
    role:{
        type: String,
        required: true,
        enum: ["ADMIN_ROLE", "USER_ROLE", "ADMIN_PLATFORM_ROLE"],
        default: "USER_ROLE"
        
    },
    reservationHistory:
    [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Reservation'
    }],
    status:{
        type: Boolean,
        default: true
    }
},
{
    versionKey: false,
    timeStamps: true
})

userSchema.methods.toJSON = function(){
    const {password, _id, ...user} = this.toObject()
    user.uid = _id
    return user
}

export default model("User", userSchema)