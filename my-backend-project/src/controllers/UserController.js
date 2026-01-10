const UserService = require('../services/UserService')


const register = async(req,res) =>{
    try{
        const {username,email,password} = req.body;
        if(!username ||!email||!password){
            return res.status(400).json({message: 'Please fill in the form completely'})
        }
        const newUser = await UserService.registerUser({ username, email, password })
        res.status(200).json({message:'Succefully registered', user : newUser})
    }
    catch(error){
        return res.status(400).json({ message: error.message });
    }
} 
const login = async (req,res)=>{
    try{
        const {email, password} =req.body;
        if(!email||!password){
            return res.status(400).json({message: 'Please fill in the form completely'})
        }
        const result = await UserService.loginUser({email,password});
        res.status(200).json({message:'Succefully login', user : result})

    }
    catch(error){
        return res.status(400).json({ message: error.message });
    }
}

module.exports = { register, login}