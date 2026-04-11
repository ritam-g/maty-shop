import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: false, },
    password: {
        type: String,
        required: function () {
            return !this.googleId
        }
    },
    role: {
        type: String,
        enum: ["buyer", "seller"],
        default: "buyer"
    },
    contact: {
        type: String,
        required: false
    },
    googleId: {
        type: String
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

// index
userSchema.index({ email: 1, googleId: 1 }, { unique: true })


const userModel = mongoose.model("user", userSchema)
export default userModel