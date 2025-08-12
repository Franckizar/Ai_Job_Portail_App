import { Facebook, Twitter, Linkedin, Instagram, Mail, MapPin, Phone, Briefcase } from "lucide-react";

export function Footer() {
  return (
    // <footer className="bg-[var(--color-bg-secondary)] border-t border-[var(--color-border-light)]">
    <footer className="bg-[var(--color-bg-primary)] border-t border-[var(--color-border-light)]">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--color-lamaSkyDark)] rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[var(--color-text-primary)]">JobLama</span>
            </div>
            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
              Your gateway to finding the perfect job. Connect with top employers and discover opportunities that match your skills.
            </p>
            <div className="flex gap-4">
              <Facebook className="h-5 w-5 text-[var(--color-text-secondary)] hover:text-[var(--color-lamaSkyDark)] cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-[var(--color-text-secondary)] hover:text-[var(--color-lamaSkyDark)] cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-[var(--color-text-secondary)] hover:text-[var(--color-lamaSkyDark)] cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-[var(--color-text-secondary)] hover:text-[var(--color-lamaSkyDark)] cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Job Seekers Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">For Job Seekers</h3>
            <ul className="space-y-3">
              {['Browse Jobs', 'Career Resources', 'Resume Builder', 'Salary Guide', 'Job Alerts'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-lamaSkyDark)] transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-[var(--color-lamaSkyDark)] rounded-full"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Employers Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">For Employers</h3>
            <ul className="space-y-3">
              {['Post a Job', 'Talent Solutions', 'Employer Resources', 'Pricing', 'Recruitment Tools'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-lamaSkyDark)] transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-[var(--color-lamaSkyDark)] rounded-full"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Contact Us</h3>
            <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-[var(--color-lamaSkyDark)] flex-shrink-0" />
                <p>123 Job Street, Tech City, TC 10001</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[var(--color-lamaSkyDark)]" />
                <a href="mailto:info@joblama.com" className="hover:text-[var(--color-lamaSkyDark)] transition-colors">
                  info@joblama.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[var(--color-lamaSkyDark)]" />
                <a href="tel:+1234567890" className="hover:text-[var(--color-lamaSkyDark)] transition-colors">
                  +1 (234) 567-890
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-[var(--color-border-light)] mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[var(--color-text-secondary)]">
              &copy; {new Date().getFullYear()} JobLama. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-lamaSkyDark)] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-lamaSkyDark)] transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-lamaSkyDark)] transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}