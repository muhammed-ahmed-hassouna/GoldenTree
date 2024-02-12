const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BenOrgSchema = new Schema({
  orgId: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "BenOrg",
  },
  orgName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    allowNull: true,
  },
  imageName: {
    type: String,
    allowNull: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const Organization = mongoose.model("Organization", BenOrgSchema);
module.exports = Organization;
