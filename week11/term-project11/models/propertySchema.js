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
    type: { type: String, enum: ['hotel','vacation rental'], required: true },
    description: { type: String, maxlength: 500 },
    amenities: [String],
    targetSegment: String,
    imageURL: String,
    reviews: [reviewSchema]
}, { timestamps: true }); // Adds createdAt / updatedAt automatically

export default mongoose.model('Property', propertySchema);