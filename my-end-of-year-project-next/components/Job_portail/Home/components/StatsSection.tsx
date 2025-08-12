export function StatsSection() {
  const stats = [
    {
      number: "50,000+",
      label: "Active Jobs",
      description: "Available positions"
    },
    {
      number: "25,000+",
      label: "Companies",
      description: "Trusted employers"
    },
    {
      number: "1M+",
      label: "Job Seekers",
      description: "Monthly active users"
    },
    {
      number: "95%",
      label: "Success Rate",
      description: "Job placement rate"
    }
  ];

  return (
    <section className="py-16 bg-[var(--color-lamaSkyLight)]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Join millions of professionals who have found their dream jobs through our platform
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center bg-[var(--color-bg-primary)] p-6 rounded-xl shadow-sm border border-[var(--color-border-light)]"
            >
              <div className="text-4xl font-bold text-[var(--color-lamaSkyDark)] mb-2">
                {stat.number}
              </div>
              <div className="text-lg font-medium text-[var(--color-text-primary)] mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-[var(--color-text-secondary)]">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}