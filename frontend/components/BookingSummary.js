"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BookingSummary = ({ booking }) => {
  if (!booking) return null;

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Booking Confirmation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <span className="font-medium">Date:</span>
          <span>{booking.date?.toLocaleDateString()}</span>

          <span className="font-medium">Time:</span>
          <span>{booking.time}</span>

          <span className="font-medium">Guests:</span>
          <span>{booking.guests}</span>

          <span className="font-medium">Name:</span>
          <span>{booking.name}</span>

          <span className="font-medium">Email:</span>
          <span>{booking.email}</span>

          <span className="font-medium">Phone:</span>
          <span>{booking.phone}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingSummary;
