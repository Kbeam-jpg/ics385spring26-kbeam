/*
Name: Kendall Beam
# Assignment: Mongoose Schema and MongoDB
# Description: mongoose script to insert Customer, Hotel data, query each
# Filename: index.js
# Date: 4/2/26
# 
# Additions: 
#   connection string using process.env.ATLAS_URI (comment out one not in use)
#   makeSampleHotels() for making Hotel objs
#   insert and 2 queries within //### ###// block
#
# AI usage: multi-export for mongoose.model's
*/

const mongoose = require('mongoose');
const { Customer, Hotel } = require('./customerModel');

require("dotenv").config();

/**                 |
 * comment out one  \/
 */
// const connectionString = "mongodb://127.0.0.1:27017/ics385_week11";
const connectionString = process.env.ATLAS_URI;

/**
 * for HotelAndAmenities collection
 * @returns {[Hotel]} list of Hotels
 */
function makeSampleHotels() {
  const hotel = new Hotel(
  {
  name: "Da hotel",
  rating: 4,
  location: "Da drive down there",
  amenities: {
    pool: true,
    BBQ: true
  },
  description: "Just a place down the road"
  }
);
const hotel2 = new Hotel(
  {
  name: "Da other hotel",
  rating: 3,
  location: "Da street over there",
  amenities: {
    lawn: true,
    BBQ: true,
    laundry: true
  },
  description: "one big hotel on the street"
  }
);
const hotel3 = new Hotel(
  {
  name: "Da other hotel",
  rating: 4.5,
  location: "Da place somewhere else",
  amenities: {
    pool: true,
    laundry: true
  },
  description: "some small place in another town"
  }
);
return [hotel, hotel2, hotel3]
}


mongoose.connect(connectionString, { useNewUrlParser: true})
  .then(async () => {
    console.log('Connected to MongoDB.');

    // Insert three records into the Customer model
    const customersToInsert = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '555-123-4567'
      },
      {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        phone: '555-987-6543'
      },
      {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@example.com',
        phone: '555-555-1234'
      }
    ];

    // Delete all documents in the Customers collection and HotelAndAmenities
    try {
      const result = await Customer.deleteMany({});
      const result2 = await Hotel.deleteMany({});

      console.log(`Deleted ${result.deletedCount} customers.`);
      console.log(`Deleted ${result2.deletedCount} hotels.`);
    } catch (error) {
      console.error('Error deleting customers or hotels:', error);
    }
    
    // Insert Array of CustomersToInsert into Customers Collection
    try {
      const insertedCustomers = await Customer.insertMany(customersToInsert);
      console.log('Inserted customers:', insertedCustomers);
    } catch (error) {
      console.error('Error inserting customers:', error);
    }

    // Find all the documents with the last name 'Doe'
    try {
      const lastNameToFind = 'Doe';
      const customer = await Customer.find({ lastName: lastNameToFind });

      if (customer) {
        console.log(`Found customer(s) with last name '${lastNameToFind}':`, customer);
      } else {
        console.log(`No customer found with last name '${lastNameToFind}'`);
      }
    } catch (error) {
      console.error('Error finding customer:', error);
    }

    // ###
    // ###
    // Insert Array of Hotels into HotelsAndAmenities Collection
    try {
      const insertedHotels = await Hotel.insertMany(makeSampleHotels());
      console.log('Inserted Hotels:', insertedHotels);
    } catch (error) {
      console.error('Error inserting Hotels:', error);
    }

    // query for a specific name
    try {
      const query = "Da hotel";
      const found = await Hotel.find({ name: query});
      if (found) {
        console.log(`Found Hotel(s) with name '${query}':`, found);
      } else {
        console.log(`No Hotel found with name '${query}'`);
      }
    } catch (error) {
      console.error('Error finding hotel:', error);
    }

    // query for a specific amenity              
    try {
      const found = await Hotel.find({amenities: {$elemMatch: {pool: true}}}); //could have also used dot notation, but oh well
      if (found) {
        console.log(`Found Hotel(s) with a pool: `, found);
      } else {
        console.log(`No Hotels found with a pool`);
      }
    } catch (error) {
      console.error('Error finding hotel:', error);
    }
    // ###
    // ###
    
    // Close the MongoDB connection after finishing the operations
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });