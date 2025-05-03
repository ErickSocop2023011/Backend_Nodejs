import {hash, verify} from 'argon2';
import User from './user.model.js';


export const updatePassword = async (req, res) => {
    try{
        const { user } = req
        const { password, newPassword } = req.body;

        if(!user || user.status === false){
            return res.status(400).json({
                success: false,
                message: "Previously deactivated user"
            })
        }

        if(!password){
            return res.status(400).json({
                success: false,
                msg: "Old password is required"
            })
        }

        const oldPassword = await verify(user.password, password)

        if(!oldPassword){
            return res.status(400).json({
                success: false,
                msg: "Old password does not match"
            })
        }

        const isSamePassword = await verify(user.password, newPassword);
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                msg: "The new password cannot be the same as the previous one"
            });
        }

        const encryptedPassword = await hash(newPassword)

        await User.findByIdAndUpdate(user._id, {password: encryptedPassword}, {new: true})

        return res.status(200).json({
            success: true,
            msg: "Password updated successfully",
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
        const { user } = req
        const data = req.body
        
        if(!user || user.status === false){
            return res.status(400).json({
                success: false,
                message: "Previously deactivated user"
            })
        }

        const updatedUser = await User.findByIdAndUpdate(user._id, data, { new: true })

        res.status(200).json({
            success: true,
            msg: "User updated successfully",
            user: updatedUser 
        })

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
        const requester  = await User.findById(uid)

        if(requester.status === false){
            return res.status(400).json({
                success: false,
                message: "Previously deactivated user"
            })
        }

        const targetUser  = await User.findById(uid)
        if (!targetUser) {
            return res.status(400).json({
                success: false,
                msg: "User not found",
            })
        }

        if (targetUser.role === "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                msg: "You cannot modify another admin",
            })
        }

        const existingCredentials = await User.findOne({$or:[{email: data.email}, {username: data.username}]})

        if (existingCredentials && existingCredentials._id.toString() !== uid) {
            return res.status(400).json({
                success: false,
                msg: "The credentials are already in use",
            })
        }

        const updatedUser = await User.findByIdAndUpdate(uid, data, { new: true })

        res.status(200).json({
            success: true,
            msg: "User updated successfully",
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
        const { user } = req

        if(!user || user.status === false){
            return res.status(400).json({
                success: false,
                message: "Previously deactivated user"
            })
        }

        await User.findByIdAndUpdate(user, {status: false}, {new: true})

        return res.status(200).json({
            success: true,
            message: "User deactivated successfully"

        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error deactivating user",
            error: err.message
        })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { uid } = req.params
        const requester = await User.findById(uid)

        if(!requester || requester.status === false){
            return res.status(400).json({
                success: false,
                message: "Previously deactivated user"
            })
        }

        const targetUser = await User.findById(uid)
        if (!targetUser) {
            return res.status(400).json({
                success: false,
                msg: "User not found",
            })
        }

        if (targetUser.role === "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                msg: "You cannot delete another admin",
            })
        }

        await User.findByIdAndUpdate(uid, { status: false }, { new: true })

        return res.status(200).json({
            success: true,
            msg: "User deactivated successfully" 
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: "Error deleting user",
            error: err.message,
        })
    }
} 