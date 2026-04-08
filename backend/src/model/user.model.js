import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["buyer", "seller"],
        default: "buyer"
    },
    contact: {
        type: String,
        required: true
    }
})
// ✅ FIXED pre-save hook
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return 

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    
});


// ✅ Compare password
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("user", userSchema)
export default userModel