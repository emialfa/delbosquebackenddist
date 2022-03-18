import User from "../../models/user";
const bcrypt = require("bcryptjs");
const {getToken} = require("../../authenticate")

const initialUser = {
  name: "testUser",
  email: "test@test.com",
  passwordHash: bcrypt.hashSync("test123", 10),
  phone: "1234567",
  document: "1234567",
  isAdmin: true,
  street: "test 123",
  apartment: "test 123",
  zip: "1234",
  city: "test",
  country: "test",
  cart: "",
  shippingAdress: "",
  activation: true,
  favorites: [],
};

export const createUserTest = async () => {
  await User.deleteMany({});
  const newUser = new User(initialUser);
  const token = getToken({ _id: newUser?._id })
  await newUser.save();
  return token ;
};
