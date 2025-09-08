import React, { useState } from 'react';
import { InputLabel, TextInput, TextArea, RadioGroup, SingleSelect, Button } from './index';

/**
 * Example component demonstrating the usage of all form input components.
 * This component showcases best practices for form implementation with accessibility,
 * validation, and user experience considerations.
 */
const FormExample: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    experience: '',
    bio: '',
    notifications: '',
    skills: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const roleOptions = [
    { value: 'developer', label: 'Developer', description: 'Software development role' },
    { value: 'designer', label: 'Designer', description: 'UI/UX design role' },
    { value: 'manager', label: 'Manager', description: 'Team management role' },
    { value: 'analyst', label: 'Analyst', description: 'Data analysis role' },
  ];

  const experienceOptions = [
    { value: 'junior', label: 'Junior (0-2 years)' },
    { value: 'mid', label: 'Mid-level (3-5 years)' },
    { value: 'senior', label: 'Senior (6-10 years)' },
    { value: 'lead', label: 'Lead (10+ years)' },
  ];

  const notificationOptions = [
    { value: 'email', label: 'Email notifications', description: 'Receive updates via email' },
    { value: 'push', label: 'Push notifications', description: 'Get instant browser notifications' },
    { value: 'sms', label: 'SMS notifications', description: 'Text message updates' },
    { value: 'none', label: 'No notifications', description: 'Opt out of all notifications' },
  ];

  const skillOptions = [
    { value: 'react', label: 'React' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'node', label: 'Node.js' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    if (!formData.experience) {
      newErrors.experience = 'Please select your experience level';
    }

    if (!formData.notifications) {
      newErrors.notifications = 'Please select notification preferences';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // Handle form submission here
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      role: '',
      experience: '',
      bio: '',
      notifications: '',
      skills: '',
    });
    setErrors({});
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Form Components Example</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Text Input Example */}
        <div>
          <InputLabel
            htmlFor="name"
            required
            error={!!errors.name}
            description="Enter your full name as it appears on official documents"
          >
            Full Name
          </InputLabel>
          <TextInput
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter your full name"
            error={!!errors.name}
            ariaDescribedBy={errors.name ? 'name-error' : 'name-description'}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-sm text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        {/* Text Input with Icon Example */}
        <div>
          <InputLabel
            htmlFor="email"
            required
            error={!!errors.email}
            description="We'll use this to send you important updates"
          >
            Email Address
          </InputLabel>
          <TextInput
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email address"
            error={!!errors.email}
            ariaDescribedBy={errors.email ? 'email-error' : 'email-description'}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        {/* Single Select Example */}
        <div>
          <InputLabel
            htmlFor="role"
            required
            error={!!errors.role}
            description="Select the role that best describes your position"
          >
            Role
          </InputLabel>
          <SingleSelect
            id="role"
            options={roleOptions}
            value={formData.role}
            onChange={(value) => handleInputChange('role', value)}
            placeholder="Select your role"
            error={!!errors.role}
            searchable
            clearable
            ariaDescribedBy={errors.role ? 'role-error' : 'role-description'}
          />
          {errors.role && (
            <p id="role-error" className="mt-1 text-sm text-red-600">
              {errors.role}
            </p>
          )}
        </div>

        {/* Radio Group Example */}
        <div>
          <InputLabel
            required
            error={!!errors.experience}
            description="Select your level of professional experience"
            aria-labelledby="experience-label"
          >
            Experience Level
          </InputLabel>
          <RadioGroup
            name="experience"
            options={experienceOptions}
            value={formData.experience}
            onChange={(value) => handleInputChange('experience', value)}
            error={!!errors.experience}
            aria-labelledby="experience-label"
            ariaDescribedBy={errors.experience ? 'experience-error' : 'experience-description'}
          />
          {errors.experience && (
            <p id="experience-error" className="mt-1 text-sm text-red-600">
              {errors.experience}
            </p>
          )}
        </div>

        {/* Text Area Example */}
        <div>
          <InputLabel
            htmlFor="bio"
            description="Tell us about yourself, your background, and what you're passionate about"
          >
            Bio
          </InputLabel>
          <TextArea
            id="bio"
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Write a brief bio about yourself..."
            autoResize
            minRows={3}
            maxRows={8}
            ariaDescribedBy="bio-description"
          />
        </div>

        {/* Radio Group with Descriptions Example */}
        <div>
          <InputLabel
            required
            error={!!errors.notifications}
            description="Choose how you'd like to receive notifications"
            aria-labelledby="notifications-label"
          >
            Notification Preferences
          </InputLabel>
          <RadioGroup
            name="notifications"
            options={notificationOptions}
            value={formData.notifications}
            onChange={(value) => handleInputChange('notifications', value)}
            error={!!errors.notifications}
            aria-labelledby="notifications-label"
            ariaDescribedBy={errors.notifications ? 'notifications-error' : 'notifications-description'}
          />
          {errors.notifications && (
            <p id="notifications-error" className="mt-1 text-sm text-red-600">
              {errors.notifications}
            </p>
          )}
        </div>

        {/* Single Select with Search Example */}
        <div>
          <InputLabel
            htmlFor="skills"
            description="Select your primary programming language or technology"
          >
            Primary Skill
          </InputLabel>
          <SingleSelect
            id="skills"
            options={skillOptions}
            value={formData.skills}
            onChange={(value) => handleInputChange('skills', value)}
            placeholder="Select your primary skill"
            searchable
            clearable
            ariaDescribedBy="skills-description"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            type="submit"
            variant="primary"
          >
            Submit Form
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FormExample;
