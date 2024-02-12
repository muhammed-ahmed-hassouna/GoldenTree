// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const ContactUsSchema = new Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     lowercase: true,
//   },
//   message: {
//     type: String,
//     required: true,
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now,
//   },
//   replies: [
//     {
//       fromAdmin: {
//         type: Boolean,
//         default: false,
//       },
//       message: String,
//       timestamp: {
//         type: Date,
//         default: Date.now,
//       },
//     },
//   ],
//   isRead: {
//     type: Boolean,
//     default: false,
//   },
//   notification: {
//     status: {
//       type: Boolean,
//       default: false,
//     },
//     notificationId: {
//       type: String,
//       default: null,
//     },
    
//   },
// });

// const ContactUs = mongoose.model("ContactUs", ContactUsSchema);

// module.exports = ContactUs;
