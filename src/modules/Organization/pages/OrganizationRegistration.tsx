import React, { useState } from 'react';
import RegistrationForm from '../components/RegistrationForm';
import RegistrationSteps from '../components/RegistrationSteps';

const OrganizationRegistration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Register Your Organization
          </h1>
          <p className="text-xl text-gray-600">
            Join thousands of organizations managing their staff with Stafftrol
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <RegistrationSteps currentStep={currentStep} />
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <RegistrationForm 
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-500">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrganizationRegistration;