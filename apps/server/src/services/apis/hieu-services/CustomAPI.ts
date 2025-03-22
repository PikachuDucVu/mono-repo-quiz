import { Hono } from "hono";
import FlightSchema, { Flight } from "./schemas/FlightSchema";

export const CustomAPI = (app: Hono, currentServerTime: string) => {
  app.get("/getAllFlights", async (c) => {
    const flights = await FlightSchema.find();
    return c.json(flights);
  });

  app.post("/addFlight", async (c) => {
    const body = (await c.req.json()) as Flight;
    const flight = await FlightSchema.create(body);
    return c.json({ messages: "Flight created successfully", flight });
  });

  app.post("/bookingFlight/:id", async (c) => {
    const id = c.req.param("id");
    const { name, phoneNumber } = await c.req.json();
    const flight = await FlightSchema.findById(id);
    if (!flight) {
      return c.json({ message: "Flight not found" }, 404);
    }

    const updatedFlight = await FlightSchema.findByIdAndUpdate(
      id,
      {
        $push: {
          passengers: {
            name,
            phoneNumber,
            seatNumber: `A${Math.floor(Math.random() * 100 + 1)}`, // Ensure seat number starts from 1
          },
        },
        $inc: {
          seatsAvailable: -1,
        },
      },
      { new: true }
    );

    return c.json({ message: "Booking successful", flight: updatedFlight });
  });

  app.get("/getFlight/:id", async (c) => {
    const id = c.req.param("id");
    const flight = await FlightSchema.findById(id);
    return c.json(flight);
  });

  app.delete("/deleteFlight/:id", async (c) => {
    const id = c.req.param("id");
    const flight = await FlightSchema.findByIdAndDelete(id);
    return c.json(flight);
  });
};
