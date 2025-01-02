"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Users, Mail, Phone, User } from "lucide-react";
import { useRouter } from "next/navigation";

const BookingSummaryPage = ({ searchParams }) => {
  const router = useRouter();
  const booking = searchParams;

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center space-x-4 py-3 border-b border-gray-100">
      <Icon className="w-5 h-5 text-primary" />
      <span className="font-medium">{label}:</span>
      <span className="text-gray-600">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-primary text-white px-6 py-4">
          <h1 className="text-2xl font-bold">Booking Confirmation</h1>
          <p className="text-primary-foreground/80">
            Thank you for your reservation!
          </p>
        </div>

        <div className="p-6 space-y-4">
          <InfoRow
            icon={CalendarDays}
            label="Date"
            value={new Date(booking.date).toLocaleDateString()}
          />
          <InfoRow icon={Clock} label="Time" value={booking.time} />
          <InfoRow icon={Users} label="Guests" value={booking.guests} />
          <InfoRow icon={User} label="Name" value={booking.name} />
          <InfoRow icon={Mail} label="Email" value={booking.email} />
          <InfoRow icon={Phone} label="Phone" value={booking.phone} />

          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => router.push("/")}
              className="bg-primary hover:bg-primary/90"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BookingSummaryPage;
