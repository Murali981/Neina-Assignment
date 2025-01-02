/* eslint-disable  */

import BookingForm from "@/components/BookingForm";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Restaurant Table Booking
        </h1>
        <BookingForm />
      </div>
    </main>
  );
}
