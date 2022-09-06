const bcrypt = require('bcrypt');
const User = require('../models/User');
const validator = require('validator');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    
    var {name, email, password, confirm_password} = req.body;

    let errors = [];
    if (!name) {
        errors.push({ name: "required" });
    }
    if (!email) {
        errors.push({ email: "required" });
    }
    if (email && !validator.isEmail(email)) {
        errors.push({ email: "invalid" });
    }
    if (!password) {
        errors.push({ password: "required" });
    }
    if (!confirm_password) {
        errors.push({confirm_password: "required"});
    }
    if (password && confirm_password && password != confirm_password) {
        errors.push({ password: "mismatch" });
    }
    if (errors.length > 0) {
        return res.status(422).json({ errors: errors });
    }

    User.findOne({email: email})
   .then(exists=>{
      if(exists){
         return res.status(422).json({ errors: [{ exists: "email already exists" }] });
      }
      (async ()=>{const user = {
        name: name,
        email: email,
        password: password    
        };
        try{
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            user.password = hashPassword;
        }
        catch(error){
            return res.status(500).json({
                errors: [{ error: err }]
            });
        }

        try {
            const id = await User.create(user);
            user.id = id;
            delete user.password;
            return res.send(user);
        }
        catch (err){
            return res.status(500).send(err);
        }
     })(); 

    }).catch(error => {
        return res.status.json({errors:error})
    });

    // console.log("Still Running!");
       
}

exports.signin = async (req,res)=>{
    try {
        // Check user exist
        const user = await User.findOne({email:req.body.email});
        if (user) {
            console.log('user',user);
            const validPass = await bcrypt.compare(req.body.password, user.password);
            console.log('validpass=',validPass);
            if (!validPass) return res.status(400).send("Email or Password is wrong");

            // Create and assign token
            const token = jwt.sign({id: user.id,email:user.email}, process.env.TOKEN_SECRET, {
                expiresIn: 3600,
                });
            return res.header("auth-token", token).send({"token": token});
            // res.send("Logged IN");
        }
    }
    catch (err) {
        let error_data = {
            entity: 'User',
            model_obj: {param: req.params, body: req.body},
            error_obj: err,
            error_msg: err.message
        };
        res.status(500).send("Error retrieving User");
    }   
    
};

exports.canvas = async(req,res)=>{
    return res.json({"message":"Hurray Canvas Page"});
};