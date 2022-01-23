import mongoose from "mongoose";
const Schema = mongoose.Schema;

//create User model for users to register
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
});

//keep user information in database
const User = mongoose.model("User", UserSchema);

export default User;
