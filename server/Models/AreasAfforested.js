const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AreasAfforestedSchema = new Schema({
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
    required: false,
  },
  areasLocation: {
    type: String,
    required: false,
  },
  descriptionAfforested: {
    type: String,
    required: false,
  },
  treesPlanted: {
    type: Number,
    required: false,
  },
  datePlanted: {
    type: String,
    required: false,
  },
  afforestedAreaImageName: {
    type: String,
    allowNull: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  DonationAmount: {
    type: Number,
    allowNull: true,
    default: 0,
  },
  Date: {
    type: Schema.Types.Date, 
    allowNull: true,
  },
  isCompleted: {
    type: Boolean,
    allowNull: true,
    default: false,
  },
  InWork: {
    type: Boolean,
    allowNull: true,
    default: false,
  },
  maxDonationAmount: {
    type: Number,
    allowNull: true,
    required: false,
    default: 2000,
  },
  currentDonationAmount: {
    type: Number,
    default: 0,
  },
  expirationTime: {
    type: Date,
    allowNull: true,
    required: false,
  },
  views: {
    type: Boolean,
    allowNull: false,
    default: false,
  },
});



const Afforested = mongoose.model("Afforested", AreasAfforestedSchema);
module.exports = Afforested;
