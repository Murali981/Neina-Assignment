"use client";

import React, { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

const BookingForm = () => {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    date: null,
    time: "",
    guests: 1,
    name: "",
    email: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 10; hour <= 22; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    return slots;
  };

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!formData.date) return;

      try {
        const response = await fetch("http://localhost:3001/api/bookings");
        const bookings = await response.json();

        const selectedDate = formData.date.toISOString().split("T")[0];
        const bookedTimes = bookings
          .filter(
            (booking) =>
              new Date(booking.date).toISOString().split("T")[0] ===
              selectedDate
          )
          .map((booking) => booking.time);

        setAvailableSlots(
          generateTimeSlots().filter((slot) => !bookedTimes.includes(slot))
        );
      } catch (err) {
        setError("Failed to fetch available slots");
      }
    };

    if (mounted && formData.date) {
      fetchBookedSlots();
    }
  }, [formData.date, mounted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mounted) return;

    try {
      const response = await fetch("http://localhost:3001/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Booking failed");
      }

      const bookingData = await response.json();
      setSuccess(true);
      setError("");
      setConfirmedBooking(formData);
      setFormData({
        date: null,
        time: "",
        guests: 1,
        name: "",
        email: "",
        phone: "",
      });

      if (response.ok) {
        const searchParams = new URLSearchParams({
          ...formData,
          date: formData.date.toISOString(),
        });
        router.push(`/booking-summary?${searchParams}`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="grid  gap-8">
      <div className="max-w-md mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Calendar
            mode="single"
            selected={formData.date}
            onSelect={(date) => setFormData((prev) => ({ ...prev, date }))}
            className="rounded-md border"
            disabled={(date) => date < new Date()}
          />

          {formData.date && (
            <Select
              value={formData.time}
              onValueChange={(time) =>
                setFormData((prev) => ({ ...prev, time }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {availableSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Input
            type="number"
            min="1"
            max="10"
            value={formData.guests}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                guests: parseInt(e.target.value),
              }))
            }
            placeholder="Number of guests"
            className="w-full"
            required
          />

          <Input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Your name"
            className="w-full"
            required
          />

          <Input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="Email"
            className="w-full"
            required
          />

          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            placeholder="Phone number"
            className="w-full"
            required
          />

          <Button type="submit" className="w-full" disabled={!formData.time}>
            Book Table
          </Button>
        </form>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mt-4">
            <AlertDescription>Booking confirmed!</AlertDescription>
          </Alert>
        )}
      </div>

      {/* {confirmedBooking && <BookingSummary booking={confirmedBooking} />} */}
    </div>
  );
};

export default BookingForm;
