const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async (req, res) => {
    try {
        let {email, fullname, password} = req.body;

        let user = await userModel.findOne({email: email});
        if(user) return res.status(401).send("User already exists!");
        else{
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, async (err, hash) => {
                    if(err) return res.send(err.message)
                    else {
                    let user = await userModel.create({
                        email,
                        fullname,
                        password: hash
                    });
                    let token = generateToken(user);
                    res.cookie("token", token);
                    res.redirect("/shop");
                    }
                })
            })
        }

        
    } catch (err) {
        res.send(err.message);
    }

}

module.exports.loginUser = async (req, res) => {
    try {
        let {email, password} = req.body;
        let user = await userModel.findOne({email: email});
        if(!user) return res.status(401).send("Email or Password incorrect!");
        
        bcrypt.compare(password, user.password, function(err, result) {
            if(result){
                let token = generateToken(user);
                res.cookie("token", token);
                res.redirect("/shop");
            }
            else{
                res.send("Email or Password incorrect!");
            }
        });
        
    } catch (err) {
        res.send(err.message);
    }
}

module.exports.logout = async (req, res) => {
    res.cookie("token", "");
    res.redirect("/");
}