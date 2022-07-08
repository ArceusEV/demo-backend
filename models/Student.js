const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define collection and schema
// TODO:Schema needs redefined.
let Student = new Schema(
    {
        username: {
            type: String,
            unique: true,
        },
        password: {
            type: String,
        },
        name: {
            type: String,
        },
        surname: {
            type: String,
        },
        birthdate: {
            type: Date,
        },
        gender: {
            type: String,
        },
        email: {
            type: String,
        },
        isAdmin: {
            type: Boolean,
        },
    },
    {
        collection: "students",
    }
);

module.exports = mongoose.model("Student", Student);
