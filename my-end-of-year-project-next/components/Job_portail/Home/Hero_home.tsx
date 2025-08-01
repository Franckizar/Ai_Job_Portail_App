// components/Hero.tsx
'use client';

export default function Hero() {
  return (
    <section className="bg-blue-50 py-16">
      <div className="max-w-7xl mx-auto text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          Find your <span className="text-blue-600">Dream Job</span> Today
        </h1>
        <p className="mt-4 text-lg text-gray-600">Search thousands of job listings from top companies.</p>
        <div className="mt-8 flex justify-center gap-4">
          <input type="text" placeholder="Job title or keyword" className="px-4 py-3 rounded-md border w-64" />
          <input type="text" placeholder="Location" className="px-4 py-3 rounded-md border w-48" />
          <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">Search</button>
        </div>
      </div>
    </section>
  );
}
