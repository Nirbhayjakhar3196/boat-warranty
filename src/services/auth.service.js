
import bcrypt from "bcryptjs"
import { generateToken } from "@/utils/jwt";

import { findUserByEmail, createUser } from "@/repositories/auth.repository"
import { use } from "react";


export async function registerUser(userData){

    const {name , email , password} = userData

    const existingUser = await findUserByEmail(email);

    if(existingUser){
        throw new Error("User already registered")
    }

    const hashedPassword = await bcrypt.hash(password , 10);

    const user = await createUser({
        name,
        email,
        password: hashedPassword
    })

    return{
        id: user.id,
        name:user.name,
        email:user.email,
    }

}

export async function loginUser(userData){

    const {email , password} = userData

    const user = await findUserByEmail(email)

    if(!user){
        throw new Error("Invalid Email and password")
    }

    const IsPasswordMatch = await bcrypt.compare(
        password,
        user.password
    )

    if(!IsPasswordMatch){
        throw new Error("Invalid Email and password")
    }

    const token = generateToken({
        id:user.id,
        email:user.email,
        role:user.role
    })

    return {
        token , 
        user :{
            id: user.id,
            email: user.email,
            name: user.name,
            role:user.role
        }
    }
}