/*
Name: Kendall Beam
Assignment: Term Project 3
Description: Load sample volcano chart data into a MongoDB
Filename: seed-volcano.jsx (npm run seed, or npm run seed:volcano)
Date: May 2 2026

AI Use:
-- using updateOne {upsert: true} to not create excess documents if run multiple times
*/
import 'dotenv/config';
import process from 'node:process';
import mongoose from 'mongoose';
import { readFile } from 'node:fs/promises';
import Volcano from '../models/volcanoSchema.js';

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const fileUrl = new URL('../docs/kilauea.json', import.meta.url);
    const rawData = await readFile(fileUrl, 'utf8');
    const volcanoData = JSON.parse(rawData);

    let insertedCount = 0;

    for (const eruption of volcanoData) {
      const result = await Volcano.updateOne(
        { id: eruption.id },
        { $setOnInsert: eruption },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        insertedCount += 1;
      }
    }

    console.log(`Seed complete. Inserted ${insertedCount} volcano records.`);
  } catch (err) {
    console.error('Volcano seeding failed:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();