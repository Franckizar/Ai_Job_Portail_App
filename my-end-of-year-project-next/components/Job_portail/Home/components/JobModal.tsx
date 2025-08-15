// components/JobModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useJobModal } from "@/components/Job_portail/Home/context/JobModalContext";
import { X, Plus, Check, ChevronDown } from 'lucide-react';
import { jobService, type Skill, type Category, type JobFormData } from '@/components/Job_portail/Home/context/jobService';

const INITIAL_FORM_DATA: JobFormData = {
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
};

export default function JobModal() {
  const { isOpen, closeModal, refreshJobs } = useJobModal();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<JobFormData>(INITIAL_FORM_DATA);
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [skillRequired, setSkillRequired] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      resetForm();
      loadInitialData();
    }
  }, [isOpen]);

  const loadInitialData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { skills, categories } = await jobService.fetchSkillsAndCategories();
      console.log('Loaded skills:', skills, 'Loaded categories:', categories);
      console.log('Current form skills:', formData.skills);
      setSkills(skills);
      setCategories(categories);
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
    if (selectedSkill && selectedSkill.id && !formData.skills.some(s => s.skillId === selectedSkill.id)) {
      console.log('Adding skill:', selectedSkill);
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, { skillId: selectedSkill.id, required: skillRequired }]
      }));
      setSelectedSkill(null);
      setSkillRequired(true);
    } else {
      console.log('Cannot add skill:', selectedSkill, 'Already exists or invalid');
    }
  };

  const handleRemoveSkill = (skillId: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.skillId !== skillId)
    }));
  };

  const resetForm = () => {
    console.log('Resetting form'); // Debug log
    setFormData(INITIAL_FORM_DATA);
    setSelectedSkill(null);
    setSkillRequired(true);
    setError(null);
    setShowSkillsDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await jobService.createJob(formData);
      
      // Success - close modal, reset form, and refresh jobs list
      closeModal();
      resetForm();
      
      if (refreshJobs) {
        refreshJobs();
      }
    } catch (err) {
      console.error('Error creating job:', err);
      setError(err instanceof Error ? err.message : 'Failed to create job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      closeModal();
      resetForm();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-bold text-gray-900">Post New Job</h2>
          <button 
            onClick={handleClose} 
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
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
              <label className="block text-sm font-medium text-gray-700">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Job Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Minimum Salary ($)
              </label>
              <input
                type="number"
                name="salaryMin"
                value={formData.salaryMin}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Maximum Salary ($)
              </label>
              <input
                type="number"
                name="salaryMax"
                value={formData.salaryMax}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-gray-700">
              Required Skills
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.skills
                .filter(skill => skill.skillId !== undefined)
                .map(skill => {
                  const skillName = skills.find(s => s.id === skill.skillId)?.name || 'Unknown';
                  console.log('Rendering skill:', skill, 'Found name:', skillName);
                  return (
                    <div key={skill.skillId} className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                      <span className="text-sm text-gray-800">{skillName}</span>
                      <span className="ml-1 text-xs text-gray-500">
                        ({skill.required ? 'required' : 'optional'})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill.skillId)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                        disabled={isSubmitting}
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
                    disabled={isSubmitting}
                    className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-md text-left"
                  >
                    <span>{selectedSkill ? selectedSkill.name : 'Select a skill'}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {showSkillsDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {/* Debug info */}
                      {process.env.NODE_ENV === 'development' && (
                        <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500">
                          Total skills: {skills.length}, Available: {skills.filter(skill => !formData.skills.some(s => s.skillId === skill.skillId)).length}
                          <br />Form skills IDs: {formData.skills.map(s => s.skillId).join(', ')}
                        </div>
                      )}
                      
                      {skills.length === 0 ? (
                        <div className="px-4 py-2 text-gray-900 text-sm">No skills available</div>
                      ) : skills.filter(skill => !formData.skills.some(s => s.skillId === skill.skillId)).length === 0 ? (
                        <div className="px-4 py-2 text-gray-900 text-sm">All skills already selected</div>
                      ) : (
                        skills
                          .filter(skill => {
                            const isAlreadySelected = formData.skills.some(s => s.skillId === skill.id);
                            console.log(`Skill ${skill.name} (${skill.id}) - Already selected:`, isAlreadySelected);
                            return !isAlreadySelected;
                          })
                          .map(skill => (
                            <div
                              key={skill.id}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-900"
                              onClick={() => {
                                console.log('Selected skill:', skill);
                                setSelectedSkill(skill);
                                setShowSkillsDropdown(false);
                              }}
                            >
                              {skill.name}
                            </div>
                          ))
                      )}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  disabled={!selectedSkill || isSubmitting}
                  className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {selectedSkill && (
                <div className="mt-2 flex items-center">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={skillRequired}
                      onChange={() => setSkillRequired(!skillRequired)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                    <span className="ml-2 text-sm text-gray-700">Required skill</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Address Line 1
              </label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Address Line 2
              </label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
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