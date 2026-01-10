import React, { useState } from 'react';

interface SocialMediaLinks {
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  youtube: string;
  tiktok: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface AdditionalContact {
  name: string;
  title: string;
  email: string;
  phone: string;
  department: string;
  isPrimary: boolean;
  notes: string;
}

interface Branding {
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
}

interface OrganizationFormData {
  organizationName: string;
  organizationType: string;
  industry: string;
  companySize: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  address: Address;
  socialMedia: SocialMediaLinks;
  additionalContacts: AdditionalContact[];
  ownerName: string;
  ownerEmail: string;
  ownerPassword: string;
  ownerPhone: string;
  registrationNumber: string;
  taxId: string;
  branding: Branding;
}

interface RegistrationFormProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ currentStep, setCurrentStep }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<OrganizationFormData>({
    organizationName: '',
    organizationType: 'corporation',
    industry: 'other',
    companySize: '1-10',
    description: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: 'Nigeria',
      postalCode: ''
    },
    socialMedia: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
      youtube: '',
      tiktok: ''
    },
    additionalContacts: [],
    ownerName: '',
    ownerEmail: '',
    ownerPassword: '',
    ownerPhone: '',
    registrationNumber: '',
    taxId: '',
    branding: {
      primaryColor: '#2563eb',
      secondaryColor: '#64748b',
      logoUrl: ''
    }
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

 const updateNestedFormData = (section: string, field: string, value: any) => {
  setFormData(prev => {
    switch (section) {
      case 'address':
        return {
          ...prev,
          address: {
            ...prev.address,
            [field]: value
          }
        };
      case 'socialMedia':
        return {
          ...prev,
          socialMedia: {
            ...prev.socialMedia,
            [field]: value
          }
        };
      case 'branding':
        return {
          ...prev,
          branding: {
            ...prev.branding,
            [field]: value
          }
        };
      default:
        return prev;
    }
  });
};

  const addAdditionalContact = () => {
    const newContact: AdditionalContact = {
      name: '',
      title: '',
      email: '',
      phone: '',
      department: '',
      isPrimary: false,
      notes: ''
    };
    setFormData(prev => ({
      ...prev,
      additionalContacts: [...prev.additionalContacts, newContact]
    }));
  };

  const updateAdditionalContact = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      additionalContacts: prev.additionalContacts.map((contact, i) =>
        i === index ? { ...contact, [field]: value } : contact
      )
    }));
  };

  const removeAdditionalContact = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalContacts: prev.additionalContacts.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.organizationName && formData.organizationType && 
                 formData.ownerName && formData.ownerEmail && formData.ownerPassword);
      case 2:
      case 3:
      case 4:
        return true; // Optional steps
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, 4));
      setError(null);
    } else {
      setError('Please fill in all required fields');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
    setError(null);
  };

  const handleSubmit = async () => {
    if (!validateStep(1)) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register-organization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Store token if needed
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        // Redirect after success
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Organization Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.organizationName}
              onChange={(e) => updateFormData('organizationName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter organization name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.organizationType}
              onChange={(e) => updateFormData('organizationType', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="corporation">Corporation</option>
              <option value="llc">LLC</option>
              <option value="partnership">Partnership</option>
              <option value="sole_proprietorship">Sole Proprietorship</option>
              <option value="non_profit">Non Profit</option>
              <option value="government">Government</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            <select
              value={formData.industry}
              onChange={(e) => updateFormData('industry', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="technology">Technology</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Finance</option>
              <option value="education">Education</option>
              <option value="retail">Retail</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="construction">Construction</option>
              <option value="hospitality">Hospitality</option>
              <option value="transportation">Transportation</option>
              <option value="government">Government</option>
              <option value="non_profit">Non Profit</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
            <select
              value={formData.companySize}
              onChange={(e) => updateFormData('companySize', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="500+">500+ employees</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => updateFormData('description', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Brief description of your organization (optional)"
          />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Owner Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Owner Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.ownerName}
              onChange={(e) => updateFormData('ownerName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Owner Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.ownerEmail}
              onChange={(e) => updateFormData('ownerEmail', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="owner@company.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Owner Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={formData.ownerPassword}
              onChange={(e) => updateFormData('ownerPassword', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Secure password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Owner Phone</label>
            <input
              type="tel"
              value={formData.ownerPhone}
              onChange={(e) => updateFormData('ownerPhone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+234-xxx-xxx-xxxx"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => updateFormData('contactEmail', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="contact@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => updateFormData('contactPhone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+234-xxx-xxx-xxxx"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => updateFormData('website', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://www.company.com"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
            <input
              type="text"
              value={formData.address.street}
              onChange={(e) => updateNestedFormData('address', 'street', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="123 Main Street"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              value={formData.address.city}
              onChange={(e) => updateNestedFormData('address', 'city', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Lagos"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <input
              type="text"
              value={formData.address.state}
              onChange={(e) => updateNestedFormData('address', 'state', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Lagos State"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <input
              type="text"
              value={formData.address.country}
              onChange={(e) => updateNestedFormData('address', 'country', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nigeria"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
            <input
              type="text"
              value={formData.address.postalCode}
              onChange={(e) => updateNestedFormData('address', 'postalCode', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="101001"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Social Media & Branding</h2>
        
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Social Media Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(formData.socialMedia).map(([platform, url]) => (
              <div key={platform}>
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  {platform}
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => updateNestedFormData('socialMedia', platform, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`https://${platform}.com/yourcompany`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Branding</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
            <input
              type="url"
              value={formData.branding.logoUrl}
              onChange={(e) => updateNestedFormData('branding', 'logoUrl', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://company.com/logo.png"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={formData.branding.primaryColor}
                onChange={(e) => updateNestedFormData('branding', 'primaryColor', e.target.value)}
                className="w-16 h-12 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={formData.branding.primaryColor}
                onChange={(e) => updateNestedFormData('branding', 'primaryColor', e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="#2563eb"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={formData.branding.secondaryColor}
                onChange={(e) => updateNestedFormData('branding', 'secondaryColor', e.target.value)}
                className="w-16 h-12 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={formData.branding.secondaryColor}
                onChange={(e) => updateNestedFormData('branding', 'secondaryColor', e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="#64748b"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Registration Details (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
            <input
              type="text"
              value={formData.registrationNumber}
              onChange={(e) => updateFormData('registrationNumber', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="RC-1234567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
            <input
              type="text"
              value={formData.taxId}
              onChange={(e) => updateFormData('taxId', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="TAX-98765432"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Contacts</h2>
      
      <div className="space-y-6">
        {formData.additionalContacts.map((contact, index) => (
          <div key={index} className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-gray-900">Contact {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeAdditionalContact(index)}
                className="text-red-600 hover:text-red-800 px-3 py-1 rounded-md border border-red-300 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) => updateAdditionalContact(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={contact.title}
                  onChange={(e) => updateAdditionalContact(index, 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Job title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => updateAdditionalContact(index, 'email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="contact@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => updateAdditionalContact(index, 'phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+234-xxx-xxx-xxxx"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  value={contact.department}
                  onChange={(e) => updateAdditionalContact(index, 'department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Sales, HR, Technology"
                />
              </div>

              <div className="flex items-center pt-6">
                <input
                  type="checkbox"
                  checked={contact.isPrimary}
                  onChange={(e) => updateAdditionalContact(index, 'isPrimary', e.target.checked)}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700">Primary Contact</label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={contact.notes}
                  onChange={(e) => updateAdditionalContact(index, 'notes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Additional notes about this contact"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addAdditionalContact}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors bg-gray-50 hover:bg-blue-50"
        >
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Additional Contact
          </div>
        </button>
      </div>
    </div>
  );

  const renderSuccessPage = () => (
    <div className="text-center space-y-6 py-12">
      <div className="text-green-600 text-6xl">✓</div>
      <h2 className="text-3xl font-bold text-gray-900">Organization Registered Successfully!</h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Your organization has been created and you're now logged in. We're redirecting you to your dashboard.
      </p>
      <div className="bg-blue-50 rounded-lg p-6 max-w-md mx-auto">
        <p className="text-sm text-gray-700 mb-2">
          <strong>Organization:</strong> {formData.organizationName}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Owner:</strong> {formData.ownerName}
        </p>
      </div>
    </div>
  );

  if (success) {
    return renderSuccessPage();
  }

  return (
    <div className="p-8">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="mb-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        <div className="space-x-4">
          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {loading ? 'Creating Organization...' : 'Register Organization'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;