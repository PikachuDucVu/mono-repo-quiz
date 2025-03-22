import mongoose, { Schema, InferSchemaType } from "mongoose";

const FlightSchema = new Schema({
  departure: { type: String, required: true },
  arrival: { type: String, required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  price: { type: Number, required: true },
  seatsAvailable: { type: Number, required: true },
  passengers: [
    {
      name: { type: String },
      phoneNumber: { type: String },
      seatNumber: { type: String },
      bookingDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  default: [],
});

export type Flight = InferSchemaType<typeof FlightSchema>;
export default mongoose.model<Flight>("Flight", FlightSchema);
