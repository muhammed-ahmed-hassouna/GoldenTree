const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DonorsOrganizedSchema = new Schema({
  role: {
    type: String,
    required: true,
    default: "Org",
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

const Donor = mongoose.model("Donor", DonorsOrganizedSchema);

module.exports = Donor;
