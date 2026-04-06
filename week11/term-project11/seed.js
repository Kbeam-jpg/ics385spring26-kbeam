/*
Name: Kendall Beam
# Assignment: Term Project 3 wk11
# Description: script to populate MongoDB instance w/ sample data
# Filename: seed.js
# Date: 4/5/26
#
# AI usage: generating sample data for reviews subSchema
*/

import mongoose from 'mongoose';
import Property from './models/propertySchema.js';
import 'dotenv/config';

await mongoose.connect(process.env.MONGO_URI);

await Property.deleteMany({}); // Clear existing records

await Property.insertMany([
    {
        name: 'Wailea Beach Villas',
        island: 'Maui',
        type: 'vacation rental',
        description: 'Luxury ocean-front villas near Wailea.',
        amenities: ['pool', 'wifi', 'ocean view', 'parking'],
        targetSegment: 'Honeymoon',
        imageURL: '/images/wailea.jpg',
        reviews: [
            {
                guestName: 'Weebo',
                rating: 5,
                comment: 'Clean, quiet, and beach.'
            }
        ]
    },
    {
        name: 'Grand Hyatt Kauai',
        island: 'Kauai',
        type: 'hotel',
        description: 'Large resort with easy access to the coast.',
        amenities: ['spa', 'golf', 'beach', 'restaurant'],
        targetSegment: 'Family',
        imageURL: '/images/kauai.jpg',
        reviews: [
            {
                guestName: 'Whittle',
                rating: 4,
                comment: 'Great amenities.'
            }
        ]
    },
    {
        name: 'Volcano House',
        island: 'Hawaii Island',
        type: 'hotel',
        description: 'Simple stay near Hawaii Volcanoes National Park.',
        amenities: ['volcano view', 'restaurant', 'guided tours'],
        targetSegment: 'Eco-tourist',
        imageURL: '/images/volcano.jpg',
        reviews: []
    },
    {
        name: 'Surfer Shack HNL',
        island: 'Oahu',
        type: 'vacation rental',
        description: 'Casual rental near the surf and city.',
        amenities: ['surfboard rental', 'wifi', 'kitchen'],
        targetSegment: 'Adventure seekers',
        imageURL: '/images/hnl.jpg',
        reviews: [
            {
                guestName: 'Dude',
                rating: 4.5,
                comment: 'Perfect for a weekend.'
            }
        ]
    },
    {
        name: 'Lanai Cat Refuge B&B',
        island: 'Lanai',
        type: 'vacation rental',
        description: 'Quiet stay with a small cat sanctuary on site.',
        amenities: ['quiet', 'garden', 'cat sanctuary'],
        targetSegment: 'Repeat visitors',
        imageURL: '/images/lanai.jpg',
        reviews: [
            {
                guestName: 'Dudette',
                rating: 3.5,
                comment: 'Relaxing place with a good vibe.'
            },
            {
                guestName: 'Whittle',
                rating: 4,
                comment: 'Great amenities.'
            }
        ]
    },
]);
console.log('Seed complete — 5 properties inserted.');

await mongoose.disconnect();