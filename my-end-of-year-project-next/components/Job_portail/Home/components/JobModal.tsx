// components/JobModal.tsx
'use client';

import { useState, useEffect } from 'react';
// import { useJobModal } from '@/contexts/JobModalContext';
import { useJobModal } from "@/components/Job_portail/Home/context/JobModalContext";
import { X, Plus, Check, ChevronDown } from 'lucide-react';

const BASE_URL = 'http://localhost:8088';

type Skill = {
  skillId: number;
  skillName: string;
};

type Category = {
  id: number;
  name: string;
};

type JobFormData = {
  title: string;
  description: string;
  type: string;
  salaryMin: string;
  salaryMax: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  categoryId: string;
  skills: { skillId: number; required: boolean }[];
};

export default function JobModal() {
  const { isOpen, closeModal } = useJobModal();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    type: 'FULL_TIME',
    salaryMin: '',
    salaryMax: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
    categoryId: '',
    skills: []
  });

  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [skillRequired, setSkillRequired] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchSkillsAndCategories();
    }
  }, [isOpen]);

  const fetchSkillsAndCategories = async () => {
    setIsLoading(true);
    try {
      const [skillsRes, categoriesRes] = await Promise.all([
        fetch(`${BASE_URL}/api/v1/auth/skills`),
        fetch(`${BASE_URL}/api/v1/auth/job-categories`)
      ]);

      const skillsData = await skillsRes.json();
      const categoriesData = await categoriesRes.json();

      setSkills(skillsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load required data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (selectedSkill && !formData.skills.some(s => s.skillId === selectedSkill.skillId)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, { skillId: selectedSkill.skillId, required: skillRequired }]
      }));
      setSelectedSkill(null);
    }
  };

  const handleRemoveSkill = (skillId: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.skillId !== skillId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/api/v1/auth/jobs/create/personalemployer/1`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          salaryMin: parseFloat(formData.salaryMin),
          salaryMax: parseFloat(formData.salaryMax),
          categoryId: parseInt(formData.categoryId)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create job');
      }

      // Success - close modal and reset form
      closeModal();
      setFormData({
        title: '',
        description: '',
        type: 'FULL_TIME',
        salaryMin: '',
        salaryMax: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'USA',
        categoryId: '',
        skills: []
      });
    } catch (err) {
      console.error('Error creating job:', err);
      setError('Failed to create job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    // <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Post New Job</h2>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-[var(--color-border-medium)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-lamaSky)]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
                Job Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-[var(--color-border-medium)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-lamaSky)]"
              >
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
                <option value="CONTRACT">Contract</option>
                <option value="TEMPORARY">Temporary</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-[var(--color-border-medium)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-lamaSky)]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
                Minimum Salary ($)
              </label>
              <input
                type="number"
                name="salaryMin"
                value={formData.salaryMin}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[var(--color-border-medium)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-lamaSky)]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
                Maximum Salary ($)
              </label>
              <input
                type="number"
                name="salaryMax"
                value={formData.salaryMax}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[var(--color-border-medium)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-lamaSky)]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
              Category *
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-[var(--color-border-medium)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-lamaSky)] text-[var(--color-text-primary)]"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
              Required Skills
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.skills.map(skill => {
                const skillName = skills.find(s => s.skillId === skill.skillId)?.skillName || 'Unknown';
                return (
                  <div key={skill.skillId} className="flex items-center bg-[var(--color-lamaSkyLight)] px-3 py-1 rounded-full">
                    <span className="text-sm text-[var(--color-text-primary)]">{skillName}</span>
                    <span className="ml-1 text-xs text-[var(--color-text-secondary)]">
                      ({skill.required ? 'required' : 'optional'})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill.skillId)}
                      className="ml-2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="relative">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <button
                    type="button"
                    onClick={() => setShowSkillsDropdown(!showSkillsDropdown)}
                    className="w-full flex justify-between items-center px-3 py-2 border border-[var(--color-border-medium)] rounded-md"
                  >
                    <span>{selectedSkill ? selectedSkill.skillName : 'Select a skill'}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {showSkillsDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-[var(--color-border-medium)] rounded-md shadow-lg max-h-60 overflow-auto text-black">
                      {skills
                        .filter(skill => !formData.skills.some(s => s.skillId === skill.skillId))
                        .map(skill => (
                          <div
                            key={skill.skillId}
                            className="px-4 py-2 hover:bg-[var(--color-bg-secondary)] cursor-pointer text-black"
                            onClick={() => {
                              setSelectedSkill(skill);
                              setShowSkillsDropdown(false);
                            }}
                          >
                            {skill.skillName}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  disabled={!selectedSkill}
                  className="px-3 py-2 bg-[var(--color-lamaSky)] text-black rounded-md disabled:opacity-50"
                //   className="px-3 py-2 bg-[var(--color-lamaSky)] text-white rounded-md disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {selectedSkill && (
                <div className="mt-2 flex items-center text-black">
                {/* <div className="mt-2 flex items-center"> */}
                  <label className="inline-flex items-center text-black">
                  {/* <label className="inline-flex items-center"> */}
                    <input
                      type="checkbox"
                      checked={skillRequired}
                      onChange={() => setSkillRequired(!skillRequired)}
                      className="rounded border-[var(--color-border-medium)] text-black focus:ring-[var(--color-lamaSky)]"
                    //   className="rounded border-[var(--color-border-medium)] text-[var(--color-lamaSky)] focus:ring-[var(--color-lamaSky)]"
                    />
                    <span className="ml-2 text-sm text-[var(--color-text-secondary)]">Required skill</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
                Address Line 1
              </label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[var(--color-border-medium)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-lamaSky)]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
                Address Line 2
              </label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[var(--color-border-medium)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-lamaSky)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[var(--color-border-medium)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-lamaSky)]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[var(--color-border-medium)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-lamaSky)]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[var(--color-border-medium)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-lamaSky)]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[var(--color-border-medium)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-lamaSky)]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-[var(--color-border-medium)] rounded-md text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[var(--color-lamaSkyDark)] text-white rounded-md hover:bg-[var(--color-lamaSky)] disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? 'Posting...' : 'Post Job'}
              {!isSubmitting && <Check className="h-4 w-4" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}