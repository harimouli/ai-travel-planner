


const mongoose = require("mongoose");



// writing subschemas bcoz readalbilty 


const ActivitySchema = new Mongoose.Schema({

    title: {
        type: String ,
        required: true,
        trim: true,
    }
    ,
    description: {
        type: Number, 
        trim: true, 
        default: ''
    },
    estimatedCostUSD: {
        type: Number,
        default: 0, 
        min: 0
    }, timeOfDay :{
        type: String,
        enum: ["Morning", "Afternoon", "Evening"],
        default: 'Afternoon'
    }
});

// trip day schema 

const ItineraryDaySchema = new Mongoose.Schema( {

    dayNumber: {
        type: Number, 
        required: true, 
        min: 1
    }, 
    activities:[ActivitySchema],
});



const HotelSchema = new Mongoose.Schema({
    name: {
        type: String, 
        required: true,
        trim: true,
    },
    tier: {
        type: String, trim:true,
    }
    ,
    estimatedCostNightUSD:{
        type: Number, 
        min: 0,
        default: 0,
    },
    rating: {
        type: String, 
        trim: true
    }
});


const PackingItemSchema = new Mongoose.Schema({
    item: {
        type: String,
        required: true,
        trim: true
    }, category:{
        type: String,
        enum: ['Documents', 'Clothing', 'Gear', 'Other' ],
        default:'Other'
    },
    isPacked: {type: Boolean, default: false}
});




const BudgetSchema = new Mongoose.Schema({

    accommodation: {type: Number, default: 0},
    food: {type: Number, default: 0},
    activities: {
        type: Number,
        default: 0
    }
    ,transport: {
        type:Number,
        default: 0
    },
    total: {
            type: Number, default: 0,
    }
    },
    {_id: false} //bcoz fixed and flat
);


// here we can add a pre-save middleware to calculate the total budget before saving the document. 
// This ensures that the total is always up-to-date based on the individual budget components.
//that simple 
BudgetSchema.pre('save', function(next) {
    this.total = this.accommodation + this.food + this.activities + this.transport;
    next();
});




const TripSchema = new Mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // Speeds up Trip.find({ userId }) queries
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    durationDays: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 day'],
      max: [30, 'Duration cannot exceed 30 days'],
    },
    budgetTier: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      required: [true, 'Budget tier is required'],
    },
    interests: [{ type: String, trim: true }],
    itinerary: [ItineraryDaySchema],
    hotels: [HotelSchema],
    estimatedBudget: { type: BudgetSchema, default: () => ({}) },
    packingList: [PackingItemSchema],
  },
  { timestamps: true }
);
 

TripSchema.index({ userId: 1, createdAt: -1 });
 
module.exports = mongoose.model('Trip', TripSchema);



