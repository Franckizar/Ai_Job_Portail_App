'use client';
import { Shield, FileText, Lock, Mail } from 'lucide-react';

export default function TermsPage() {
  const sections = [
    {
      title: "Acceptance of Terms",
      icon: Shield,
      content: "By accessing and using our job portal, you accept and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services."
    },
    {
      title: "User Responsibilities",
      icon: FileText,
      content: "You agree to provide accurate information in your profile and applications. Misrepresentation may result in account termination. You are responsible for maintaining the confidentiality of your account credentials."
    },
    {
      title: "Privacy Policy",
      icon: Lock,
      content: "Our Privacy Policy explains how we collect, use, and protect your personal data. By using our services, you consent to such processing and you warrant that all data provided by you is accurate."
    },
    {
      title: "Contact Information",
      icon: Mail,
      content: "For any questions regarding these Terms and Conditions, please contact us at legal@jobportal.com. We typically respond to inquiries within 2 business days."
    }
  ];

  return (
    <div className="bg-[var(--color-bg-primary)] py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            Terms & Conditions
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-12">
          {sections.map((section, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="bg-[var(--color-lamaSkyLight)] w-16 h-16 rounded-lg flex items-center justify-center">
                  <section.icon className="h-8 w-8 text-[var(--color-lamaSkyDark)]" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
                  {section.title}
                </h2>
                <p className="text-[var(--color-text-secondary)]">
                  {section.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-[var(--color-bg-secondary)] rounded-xl">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
            Changes to Terms
          </h2>
          <p className="text-[var(--color-text-secondary)]">
            We may revise these Terms at any time without notice. By continuing to access or use our services after revisions become effective, you agree to be bound by the updated terms. We encourage you to review the Terms periodically.
          </p>
        </div>
      </div>
    </div>
  );
}