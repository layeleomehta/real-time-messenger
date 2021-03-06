const Yup = require("yup"); 

const formSchema = Yup.object({
    username: Yup.string()
                 .required("Username is required!")
                 .min(6, "Username too short!")
                 .max(30, "Username exceeds the maximum length allowed"), 
    password: Yup.string()
                 .required("Password is required!")
                 .min(6, "Password too short!")
                 .max(30, "Password exceeds the maximum length allowed")
}); 

const validateForm = async (req, res, next) => {
    const formData = req.body; 
    try {
        const result = await formSchema.validate(formData); 
        if(result){
            console.log("Form is good")
            next(); 
        } else{
            console.log("form is not good!"); 
            res.status(422).json("Form validation error"); 
        }
    } catch (err) {
        console.error(err.message); 
        res.status(422).json("Form validation error"); 
    }
}

module.exports = validateForm; 