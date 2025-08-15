// services/jobService.ts
const BASE_URL = 'http://localhost:8088';

export type Skill = {
  skillId: number;
  skillName: string;
};

export type Category = {
  id: number;
  name: string;
};

export type JobFormData = {
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

export type CreateJobPayload = {
  title: string;
  description: string;
  type: string;
  salaryMin: number | null;
  salaryMax: number | null;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  categoryId: number;
  skills: { skillId: number; required: boolean }[];
};

class JobService {
  async fetchSkills(): Promise<Skill[]> {
    const response = await fetch(`${BASE_URL}/api/v1/auth/skills`);
    if (!response.ok) {
      throw new Error(`Failed to fetch skills: ${response.status} ${response.statusText}`);
    }
    const skills = await response.json();
    console.log('Fetched skills:', skills); // Debug log
    return skills;
  }

  async fetchCategories(): Promise<Category[]> {
    const response = await fetch(`${BASE_URL}/api/v1/auth/job-categories`);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
    }
    const categories = await response.json();
    console.log('Fetched categories:', categories); // Debug log
    return categories;
  }

  async fetchSkillsAndCategories(): Promise<{ skills: Skill[]; categories: Category[] }> {
    const [skillsRes, categoriesRes] = await Promise.all([
      this.fetchSkills(),
      this.fetchCategories()
    ]);
    
    return {
      skills: skillsRes,
      categories: categoriesRes
    };
  }

  async createJob(formData: JobFormData, employerId: number = 1): Promise<void> {
    // Validate required fields
    if (!formData.title || !formData.description || !formData.categoryId) {
      throw new Error('Please fill all required fields');
    }

    const payload: CreateJobPayload = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : null,
      salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : null,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
      country: formData.country,
      categoryId: parseInt(formData.categoryId),
      skills: formData.skills
    };

    const response = await fetch(`${BASE_URL}/api/v1/auth/jobs/create/personalemployer/${employerId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create job');
    }
  }
}

export const jobService = new JobService();