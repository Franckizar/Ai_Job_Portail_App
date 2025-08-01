// components/FeaturedCompanies.tsx
'use client';

const companies = [
  { name: 'Microsoft', logo: '/logos/microsoft.png' },
  { name: 'Tesla', logo: '/logos/tesla.png' },
  { name: 'Netflix', logo: '/logos/netflix.png' },
];

export default function FeaturedCompanies() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Top Hiring Companies</h2>
        <div className="flex justify-center flex-wrap gap-10">
          {companies.map((company, i) => (
            <div key={i} className="w-40 h-24 flex items-center justify-center bg-white border rounded shadow-sm">
              <img src={company.logo} alt={company.name} className="max-h-12 object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
