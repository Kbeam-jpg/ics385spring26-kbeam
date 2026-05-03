/*
Name: Kendall Beam
# Assignment: Term Project 3 wk11
# Description: mongoose schema for properties with reviews subdocument
# Filename: propertySchema.js
# Date: 4/5/26
#
# Additions:
#   review subdocument (guestname, rating, comment, date)
#
# AI usage: none
*/
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    guestName: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
    date: { type: Date, default: Date.now }
});

const propertySchema = new mongoose.Schema({
    name: { type: String, required: true },
    island: { type: String, required: true, enum: ['Maui','Oahu','Hawaii Island','Kauai','Molokai','Lanai'] },
    description: { type: String, maxlength: 500 },
    tagline: String,
    amenities: [{
        name: String,
        location: String,
        description: String
    }],
    targetSegment: String,
    imageURL: String,
    contactEmail: String,
    contactImg: String,
    heroImages: [String],
    reviews: [reviewSchema]
}, { timestamps: true }); // Adds createdAt / updatedAt automatically

export default mongoose.model('Property', propertySchema);


/**
 * Sample property object to seed::
const property = {
  name: "Hilo Eco-Vacation Rental",
  island: "Big Island",
  tagline: "A rock's throw from both Kīlauea and Coconut Island",
  description: `A humble 2-bed 2-bath abode located on Hawaii's windward coast. Located in Hilo, it stands as a great launch pad for sightseeing lava fountains at Hawai'i Volcanoes National Park (or just taking a laissez-faire day at the beach!)`,
  amenities: [
    {name: "Wifi", location: "Residence", description: "Fast Wifi is included at no additional cost."}, 
    {name: "2 Beds", location: "Residence", description: "Two queen sized beds with memory foam, perfect for a good night's sleep."},
    {name: "2 Full Baths", location: "Residence", description: "One full bathroom on the ground floor, another attached to the master bedroom."},
    {name: "Parking space", location: "Residence", description: "One parking space is available at the residence."},
    {name: "Local Resturants", location: "Hilo", description: "Ask us about local recomendations!"},
    {name: "Beaches", location: "Hilo", description: "Our favorites include Mokuola (Coconut Island) and Chalk's Beach."},
    {name: "Rainbow Falls", location: "Hilo", description: "The town's scenic waterfall that's only a 6 minute (2 mi / 3.4 km) drive away."},
    {name: "Hawaii Volcanoes National Park", location: "Kilauea", description: "Located less than an hour away by car, bus, or shuttle."},
  ],
  contactEmail: "fillerEmail@voidandnull.com.dontuse",
  contactImg: "https://picsum.photos/300/200?random=2",
  heroImages: [
    "/marc-szeglat-Aduh0KXCI1w-unsplash.jpg",
    "/abigail-lynn-9JrBiphz0e0-unsplash.jpg",
    "/chloe-leis-qUVov_XcAc0-unsplash.jpg",
    "/hari-nandakumar-VX88azaKEno-unsplash.jpg",
  ],
};
 */