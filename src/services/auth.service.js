
import bcrypt from "bcryptjs"

import { findUserByEmail, createUser } from "@/repositories/auth.repository"


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