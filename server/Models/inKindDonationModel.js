const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InKindDonationSchema = new Schema({
  donor_id: {
    type: Schema.Types.ObjectId,
    // ref: "Donor",
    required: true,
  },
  title: {
    type: String, // Assuming title is a string
    required: true,
  },

  item_type: {
    type: String,
    required: true,
  },
  donor_type: {
    type: String,
    required:true,
  },
  // quantity: {
  //   type: Number,
  //   required: true,
  // },
  description: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
//   beneficiary_id: {
//     type: Schema.Types.ObjectId,
//     ref: "Beneficiary", // If applicable
//   },
  status: {
    type: String,
    default: "Pending",
  },
  image:{
    type: String,
    required: true,
  }
});

const InKindDonation = mongoose.model("InKindDonation", InKindDonationSchema);

module.exports = InKindDonation;
