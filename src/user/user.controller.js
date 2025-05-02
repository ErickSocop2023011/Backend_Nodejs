import {hash, verify} from 'argon2';
import User from './user.model.js';


export const updatePassword = async (req, res) => {
    try{
        const { usuario } = req
        const { password } = req.body
        const { newPassword } = req.body

        const oldPassword = await verify(usuario.password, password)


        if(!oldPassword){
            return res.status(400).json({
                success: false,
                msg: "Old password does not match"
            })
        }

        const user = await User.findById(usuario._id)

        const matchOldAndNewPassword = await verify(user.password, newPassword)

        if(matchOldAndNewPassword){
            return res.status(400).json({
                success: false,
                msg: "The new password cannot be the same as the previous one"
            })
        }

        const encryptedPassword = await hash(newPassword)

        await User.findByIdAndUpdate(usuario._id, {password: encryptedPassword}, {new: true})

        return res.status(200).json({
            success: true,
            msg: "Updated password",
        })

    }catch(err){
        return res.status(500).json({
            success: false,
            msg: "Error updating password",
            error: err.message
        })
    }
}

export const updateMe = async (req, res) => {
    try {
        const { usuario } = req
        const data = req.body

        const user = await User.findByIdAndUpdate(usuario._id, data, { new: true })

        res.status(200).json({
            success: true,
            msg: "Updated user",
            user: user
        })

        console.log(user)
    }catch(err){
        res.status(500).json({
            success: false,
            msg: "Error updating user",
            error: err.message
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const { uid } = req.params 
        const data = req.body 

        const user = await User.findById(uid)

        if (!user) {
            return res.status(400).json({
                success: false,
                msg: "User not found",
            })
        }

        if (user.role === "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                msg: "You cannot modify another admin",
            })
        }

        const updatedUser = await User.findByIdAndUpdate(uid, data, { new: true })

        res.status(200).json({
            success: true,
            msg: "Updated user",
            user: updatedUser,
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: "Error updating user",
            error: err.message,
        })
    }
}

export const deleteMe = async (req, res) => {
    try{
        const { usuario } = req

        await User.findByIdAndUpdate(usuario, {status: false}, {new: true})

        return res.status(200).json({
            success: true,
            message: "Deleted User"

        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error deleting User",
            error: err.message
        })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { uid } = req.params

        const user = await User.findById(uid)
        if (!user) {
            return res.status(400).json({
                success: false,
                msg: "User not found",
            })
        }

        if (user.role === "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                msg: "You cannot delete another admin",
            })
        }

        await User.findByIdAndUpdate(uid, { status: false }, { new: true })

        return res.status(200).json({
            success: true,
            msg: "User deleted" 
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: "Error deleting user",
            error: err.message,
        })
    }
} 