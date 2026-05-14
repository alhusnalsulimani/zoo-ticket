import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneno: { type: String, required: true },
    password: { type: String, required: true },
    role:{type:String,default:"customer"}
  },
  { timestamps: true },
);

const UserModel = mongoose.model("users", userSchema);
export default UserModel;