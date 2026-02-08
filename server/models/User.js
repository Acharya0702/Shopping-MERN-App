import { Schema, model } from "mongoose";
import { genSalt, hash, compare } from "bcryptjs";

const userSchema = new Schema(
    {
        name:{
            type: String,
            required: true,
            trim: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
            trim: true,
            match: [/.+\@.+\..+/, "Please enter a valid email address"],
        },
        password:{
            type: String,
            required: true,
            minlength: 6,
        },
        role:{
            type: String,
            enum: ["customer","admin"],
            default: "customer",
        },
    },
    { timestamps: true }
);

//password hash middlewear
userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
    next();
})

// Match user entered password to hashed password
userSchema.methods.matchPassword = async function(enteredPassword){
    return await compare(enteredPassword, this.password);
};

export default model("User", userSchema);