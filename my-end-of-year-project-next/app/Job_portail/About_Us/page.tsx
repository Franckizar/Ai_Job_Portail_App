'use client';
import { Briefcase, Users, Globe, Award, Heart } from 'lucide-react';
import { Button } from "@/components/Job_portail/Home/components/ui/button";

export default function AboutUsPage() {
  const stats = [
    { value: "50,000+", label: "Jobs Posted", icon: Briefcase },
    { value: "25,000+", label: "Companies", icon: Users },
    { value: "100+", label: "Countries", icon: Globe },
    { value: "95%", label: "Satisfaction", icon: Heart }
  ];

  return (
    <div className="bg-[var(--color-bg-primary)]">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-[var(--color-lamaSkyLight)] to-[var(--color-lamaPurpleLight)]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-6">
            Connecting Talent with Opportunity
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            Our mission is to revolutionize the job search experience through innovative technology and personalized career matching.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[var(--color-bg-primary)]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-[var(--color-bg-secondary)] rounded-xl">
                <div className="flex justify-center mb-4">
                  <stat.icon className="h-10 w-10 text-[var(--color-lamaSkyDark)]" />
                </div>
                <div className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                  {stat.value}
                </div>
                <div className="text-[var(--color-text-secondary)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-[var(--color-bg-secondary)]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6">
                Our Story
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-4">
                Founded in 2020, our platform began as a small team of recruiters and technologists who saw the need for a better way to connect job seekers with employers.
              </p>
              <p className="text-[var(--color-text-secondary)] mb-6">
                Today, we've grown into one of the fastest-growing job platforms, serving millions of users across the globe while maintaining our commitment to personalized service.
              </p>
              <Button className="bg-[var(--color-lamaSkyDark)] hover:bg-[var(--color-lamaSky)]">
                Join Our Team
              </Button>
            </div>
            <div className="md:w-1/2 bg-[var(--color-lamaSkyLight)] h-64 rounded-xl flex items-center justify-center">
              <span className="text-[var(--color-text-secondary)]">Company Image/Illustration</span>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-[var(--color-bg-primary)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[var(--color-text-primary)] mb-12">
            Meet Our Leadership
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-[var(--color-bg-secondary)] rounded-xl overflow-hidden shadow-sm">
                <div className="bg-[var(--color-lamaSkyLight)] h-48 flex items-center justify-center">
                  <span className="text-[var(--color-text-secondary)]">Team Member</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">John Doe</h3>
                  <p className="text-[var(--color-lamaSkyDark)] mb-4">CEO & Founder</p>
                  <p className="text-[var(--color-text-secondary)]">
                    Visionary leader with 15+ years in the recruitment industry.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
