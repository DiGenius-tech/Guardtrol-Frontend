import React from 'react';

interface RegistrationStepsProps {
  currentStep: number;
}

const RegistrationSteps: React.FC<RegistrationStepsProps> = ({ currentStep }) => {
  const steps = [
    {
      number: 1,
      title: 'Basic Details',
      description: 'Organization & Owner Info'
    },
    {
      number: 2,
      title: 'Contact Info',
      description: 'Address & Communication'
    },
    {
      number: 3,
      title: 'Social & Branding',
      description: 'Online Presence & Identity'
    },
    {
      number: 4,
      title: 'Additional Contacts',
      description: 'Team Members & Departments'
    }
  ];

  return (
    <div className="flex items-center justify-between max-w-4xl mx-auto">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          {/* Step Circle */}
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                currentStep >= step.number
                  ? 'bg-blue-600 text-white'
                  : currentStep === step.number - 1
                  ? 'bg-blue-100 text-blue-600 border-2 border-blue-600'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {currentStep > step.number ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                step.number
              )}
            </div>
            
            {/* Step Info */}
            <div className="mt-3 text-center">
              <p
                className={`text-sm font-semibold ${
                  currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                {step.title}
              </p>
              <p
                className={`text-xs mt-1 ${
                  currentStep >= step.number ? 'text-gray-600' : 'text-gray-400'
                }`}
              >
                {step.description}
              </p>
            </div>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={`hidden md:block w-24 h-1 mx-4 transition-all duration-300 ${
                currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default RegistrationSteps;