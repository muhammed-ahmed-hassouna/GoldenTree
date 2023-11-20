 const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AreasWillAfforestedSchema = new Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
    required: false,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: false,
  },
  placeName: {
    type: String,
    required: true,
  },
  areasLocation: {
    type: String,
    required: true,
  },
  treesPlanted: {
    type: Number,
    required: true,
  },
  datePlanted: {
    type: String,
    required: true,
  },
  willAfforestedAreaImageName: {
    type: String,
    allowNull: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const WillAfforested = mongoose.model("WillAfforested", AreasWillAfforestedSchema);
module.exports = WillAfforested;
