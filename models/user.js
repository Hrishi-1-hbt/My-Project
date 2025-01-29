const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    // New profile fields
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    profilePhoto: {
        type: String,
        default: "/images/default-avatar.jpg"
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    bio: {
        type: String,
        trim: true,
        maxlength: 500
    },
    // Relationships
    listings: [{
        type: Schema.Types.ObjectId,
        ref: "Listing"
    }],
    bookings: [{
        type: Schema.Types.ObjectId,
        ref: "Booking"
    }]
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: "email" // Use email as username
});

module.exports = mongoose.model('User', userSchema);