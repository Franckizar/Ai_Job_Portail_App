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
    console.log('Fetched skills:', skills);
    return skills;
  }

  async fetchCategories(): Promise<Category[]> {
    const response = await fetch(`${BASE_URL}/api/v1/auth/job-categories`);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
    }
    const categories = await response.json();
    console.log('Fetched categories:', categories);
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

  async createJob(formData: JobFormData): Promise<void> {
    // Get user role and ID from localStorage
    const userRole = localStorage.getItem('user_role');
    let employerId: number | null = null;
    let endpoint: string;

    if (userRole === 'ENTERPRISE') {
      const enterpriseId = localStorage.getItem('enterprise_id');
      if (!enterpriseId) {
        throw new Error('Enterprise ID not found. Please log in again.');
      }
      employerId = parseInt(enterpriseId);
      endpoint = `${BASE_URL}/api/v1/auth/jobs/create/enterprise/${employerId}`;
    } else if (userRole === 'PERSONAL_EMPLOYER') {
      const personalEmployerId = localStorage.getItem('personal_employer_id');
      if (!personalEmployerId) {
        throw new Error('Personal Employer ID not found. Please log in again.');
      }
      employerId = parseInt(personalEmployerId);
      endpoint = `${BASE_URL}/api/v1/auth/jobs/create/personalemployer/${employerId}`;
    } else {
      throw new Error(`User role '${userRole}' is not authorized to create jobs`);
    }

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

    // Get JWT token from localStorage
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || 'Failed to create job' };
      }
      throw new Error(errorData.message || 'Failed to create job');
    }
  }
}

export const jobService = new JobService();