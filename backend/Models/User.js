

const mongoose = require("mongoose");

const bcrypt = require("bcryptjs"); 

// user schema here 

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        maxlength: [50, "Name cannot exceed 50 characters"],
        trim: true ,
       
    },
   email: {
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    index:true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
   }, 
   password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters"],
    match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?\/~]).{8,}$/,
        "Password must contain lowercase, uppercase, number, and special character"
    ],
}
  
})


// hashing midfleware
UserSchema.pre("save", async function(next) {

    if(!this.isModified("password")) {
        return next();
    }

    const salt  = await bcrypt.genSalt(12);

    this.password = await bcrypt.hash(this.password, salt);

    next();
});


// method to compare passwords
UserSchema.methods.comparePassword = async (plaintext)=> {
    return bcrypt.compare(plaintext, this.password);
};





module.exports = mongoose.model('User', UserSchema);

