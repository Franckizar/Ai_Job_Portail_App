'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/Job_portail/Dashboard/ui/button';
import { Input } from '@/components/Job_portail/Dashboard/ui/input';
import { Select } from '@/components/Job_portail/Dashboard/ui/select';
import { useJobModal } from '@/components/Job_portail/Home/context/JobModalContext';
import { X, Plus, Check, ChevronDown } from 'lucide-react';
import { jobService, type Skill, type Category, type JobFormData } from '@/components/Job_portail/Home/context/jobService';

interface JobModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  job?: any;
  onSave: (jobData: any) => void;
}

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
  skills: [],
  status: 'ACTIVE',
};

export function JobModal({ isOpen: propIsOpen, onClose: propOnClose, job, onSave }: JobModalProps) {
  // Use context modal state if available, otherwise use props
  const jobModalContext = useJobModal();
  const isOpen = propIsOpen !== undefined ? propIsOpen : jobModalContext?.isOpen || false;
  const closeModal = propOnClose || jobModalContext?.closeModal || (() => {});

  const [formData, setFormData] = useState<JobFormData>(INITIAL_FORM_DATA);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [skillRequired, setSkillRequired] = useState(true);

  useEffect(() => {
    if (isOpen) {
      resetForm();
      if (job) {
        populateFormWithJobData(job);
      }
      loadInitialData();
    }
  }, [isOpen, job]);

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setSelectedSkill(null);
    setSkillRequired(true);
    setError(null);
    setShowSkillsDropdown(false);
  };

  const populateFormWithJobData = (jobData: any) => {
    setFormData({
      title: jobData.title || '',
      description: jobData.description || '',
      type: jobData.type || 'FULL_TIME',
      salaryMin: jobData.salaryMin?.toString() || '',
      salaryMax: jobData.salaryMax?.toString() || '',
      addressLine1: jobData.addressLine1 || '',
      addressLine2: jobData.addressLine2 || '',
      city: jobData.city || '',
      state: jobData.state || '',
      postalCode: jobData.postalCode || '',
      country: jobData.country || 'USA',
      categoryId: jobData.category?.id?.toString() || jobData.categoryId?.toString() || '',
      skills: jobData.skills || [],
      status: jobData.status || 'ACTIVE',
    });
  };

  const loadInitialData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { skills: fetchedSkills, categories: fetchedCategories } = await jobService.fetchSkillsAndCategories();
      setSkills(fetchedSkills);
      setCategories(fetchedCategories);
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
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, { skillId: selectedSkill.id, required: skillRequired }]
      }));
      setSelectedSkill(null);
      setSkillRequired(true);
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
      const jobData = {
        ...formData,
        salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : 0,
        salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : 0,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
      };

      if (job?.id) {
        await jobService.updateJob(job.id, jobData);
      } else {
        await jobService.createJob(jobData);
      }

      // Call the onSave callback
      onSave(jobData);

      // Close modal and reset form
      closeModal();
      resetForm();

      // Refresh jobs if available in context
      if (jobModalContext?.refreshJobs) {
        jobModalContext.refreshJobs();
      }
    } catch (err) {
      console.error('Error saving job:', err);
      setError(err instanceof Error ? err.message : 'Failed to save job. Please try again.');
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {job ? 'Edit Job' : 'Create New Job'}
            </h2>
            <button 
              onClick={handleClose} 
              className="text-gray-500 hover:text-gray-700"
              disabled={isSubmitting}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type *
                </label>
                <Select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  options={[
                    { value: 'FULL_TIME', label: 'Full Time' },
                    { value: 'PART_TIME', label: 'Part Time' },
                    { value: 'CONTRACT', label: 'Contract' },
                    { value: 'TEMPORARY', label: 'Temporary' },
                    { value: 'INTERNSHIP', label: 'Internship' },
                  ]}
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Salary ($)
                </label>
                <Input
                  id="salaryMin"
                  name="salaryMin"
                  type="number"
                  value={formData.salaryMin}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Salary ($)
                </label>
                <Input
                  id="salaryMax"
                  name="salaryMax"
                  type="number"
                  value={formData.salaryMax}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <Select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                options={[
                  { value: '', label: 'Select a category' },
                  ...categories.map(category => ({
                    value: category.id.toString(),
                    label: category.name
                  }))
                ]}
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.skills
                  .filter(skill => skill.skillId !== undefined)
                  .map(skill => {
                    const skillName = skills.find(s => s.id === skill.skillId)?.name || 'Unknown';
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
                      disabled={isSubmitting || isLoading}
                      className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-md text-left hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <span className="text-gray-700">
                        {selectedSkill ? selectedSkill.name : 'Select a skill'}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </button>
                    {showSkillsDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {skills.length === 0 ? (
                          <div className="px-4 py-2 text-gray-900 text-sm">No skills available</div>
                        ) : skills.filter(skill => !formData.skills.some(s => s.skillId === skill.id)).length === 0 ? (
                          <div className="px-4 py-2 text-gray-900 text-sm">All skills already selected</div>
                        ) : (
                          skills
                            .filter(skill => !formData.skills.some(s => s.skillId === skill.id))
                            .map(skill => (
                              <div
                                key={skill.id}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-900"
                                onClick={() => {
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 1
                </label>
                <Input
                  id="addressLine1"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 2
                </label>
                <Input
                  id="addressLine2"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code
                </label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <Select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                options={[
                  { value: 'ACTIVE', label: 'Active' },
                  { value: 'INACTIVE', label: 'Inactive' },
                  { value: 'DRAFT', label: 'Draft' },
                ]}
              />
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                {isSubmitting ? (
                  job ? 'Updating...' : 'Creating...'
                ) : (
                  job ? 'Update Job' : 'Create Job'
                )}
                {!isSubmitting && <Check className="h-4 w-4" />}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}