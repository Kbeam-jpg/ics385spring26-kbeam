/*
Name: Kendall Beam
# Assignment: Mongoose Schema and MongoDB
# Description: <#short desc of file#>
# Filename: customerModel.js
# Date: 4/2/26
#
# Additions:
#   amenitiesSchema subdocument
#   hotelSchema
#   Hotel model export (for collection called "HotelAndAmenities")
#
# AI usage: module.exports returning an object of model objs
*/

const mongoose = require('mongoose');

// Define the customer schema
const customerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  // Add any other fields as needed
});

// Define amenity schema/model
const amenitiesSchema = new mongoose.Schema({
  pool: { type: Boolean },
  lawn: { type: Boolean },
  BBQ: { type: Boolean },
  laundry: { type: Boolean }
});

// Define hotel schema/model
const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  location: { type: String, required: true },
  amenities: [amenitiesSchema], // <= subdocuments
  description: { type: String }
});

// Create models
const Customer = mongoose.model('Customer', customerSchema);
const Hotel = mongoose.model('HotelAndAmenities', hotelSchema);


module.exports = {
  Customer,
  Hotel
};
