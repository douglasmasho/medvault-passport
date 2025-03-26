import React, { useState } from 'react';

const HealthQuestionnaire = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    email: '',
    phoneNumber: '',

    // Medical History
    medicalConditions: [],
    surgicalHistory: '',
    familyMedicalHistory: '',
    medications: '',
    allergies: '',

    // Lifestyle
    smoking: '',
    alcoholConsumption: '',
    exerciseFrequency: '',
    diet: '',
    stressLevel: '',

    // Health Metrics
    height: '',
    weight: '',
    bloodPressure: '',
    heartRate: '',
    bloodSugar: '',
    cholesterolLevel: '',

    // Mental Health
    sleepQuality: '',
    mentalHealthConcerns: [],
    stressManagement: '',

    // Additional Health Concerns
    primaryHealthConcern: '',
    additionalComments: ''
  });

  const sections = [
    {
      title: 'Personal Information',
      fields: [
        { name: 'firstName', label: 'First Name', type: 'text', required: true },
        { name: 'lastName', label: 'Last Name', type: 'text', required: true },
        { name: 'age', label: 'Age', type: 'number', required: true },
        { 
          name: 'gender', 
          label: 'Gender', 
          type: 'select', 
          options: ['', 'Male', 'Female', ],
          required: true 
        },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'phoneNumber', label: 'Phone Number', type: 'tel', required: true }
      ]
    },
    {
      title: 'Medical History',
      fields: [
        { 
          name: 'medicalConditions', 
          label: 'Current Medical Conditions', 
          type: 'multiselect', 
          options: [
            'Diabetes', 'Hypertension', 'Heart Disease', 
            'Asthma', 'Arthritis', 'Cancer', 'Other'
          ]
        },
        { 
          name: 'surgicalHistory', 
          label: 'Surgical History', 
          type: 'textarea', 
          placeholder: 'List any previous surgeries' 
        },
        { 
          name: 'familyMedicalHistory', 
          label: 'Family Medical History', 
          type: 'textarea', 
          placeholder: 'Significant medical conditions in your family' 
        },
        { 
          name: 'medications', 
          label: 'Current Medications', 
          type: 'textarea', 
          placeholder: 'List all current medications' 
        },
        { 
          name: 'allergies', 
          label: 'Allergies', 
          type: 'textarea', 
          placeholder: 'List any known allergies' 
        }
      ]
    },
    {
      title: 'Lifestyle Assessment',
      fields: [
        { 
          name: 'smoking', 
          label: 'Smoking Habits', 
          type: 'select', 
          options: ['', 'Non-Smoker', 'Current Smoker', 'Former Smoker'],
          required: true 
        },
        { 
          name: 'alcoholConsumption', 
          label: 'Alcohol Consumption', 
          type: 'select', 
          options: ['', 'Non-Drinker', 'Occasional', 'Moderate', 'Heavy'],
          required: true 
        },
        { 
          name: 'exerciseFrequency', 
          label: 'Exercise Frequency', 
          type: 'select', 
          options: ['', 'Daily', '3-5 times/week', '1-2 times/week', 'Rarely', 'Never'],
          required: true 
        },
        { 
          name: 'diet', 
          label: 'Diet Type', 
          type: 'select', 
          options: ['', 'Balanced', 'Vegetarian', 'Vegan', 'High Protein', 'Other'],
          required: true 
        },
        { 
          name: 'stressLevel', 
          label: 'Stress Level', 
          type: 'select', 
          options: ['', 'Low', 'Moderate', 'High', 'Very High'],
          required: true 
        }
      ]
    },
    {
      title: 'Health Metrics',
      fields: [
        { name: 'height', label: 'Height (cm)', type: 'number', required: true },
        { name: 'weight', label: 'Weight (kg)', type: 'number', required: true },
        { 
          name: 'bloodPressure', 
          label: 'Blood Pressure (e.g. 120/80)', 
          type: 'text', 
          placeholder: 'Systolic/Diastolic' 
        },
        { name: 'heartRate', label: 'Resting Heart Rate', type: 'number' },
        { 
          name: 'bloodSugar', 
          label: 'Blood Sugar Level', 
          type: 'number', 
          placeholder: 'mg/dL' 
        },
        { 
          name: 'cholesterolLevel', 
          label: 'Cholesterol Level', 
          type: 'number', 
          placeholder: 'Total Cholesterol' 
        }
      ]
    },
    {
      title: 'Mental Health',
      fields: [
        { 
          name: 'sleepQuality', 
          label: 'Sleep Quality', 
          type: 'select', 
          options: ['', 'Excellent', 'Good', 'Fair', 'Poor'],
          required: true 
        },
        { 
          name: 'mentalHealthConcerns', 
          label: 'Mental Health Concerns', 
          type: 'multiselect', 
          options: [
            'Anxiety', 'Depression', 'Stress', 
            'Sleep Disorders', 'Mood Swings', 'None'
          ]
        },
        { 
          name: 'stressManagement', 
          label: 'Stress Management Techniques', 
          type: 'multiselect', 
          options: [
            'Meditation', 'Exercise', 'Therapy', 
            'Journaling', 'None', 'Other'
          ]
        }
      ]
    },
    {
      title: 'Additional Health Concerns',
      fields: [
        { 
          name: 'primaryHealthConcern', 
          label: 'Primary Health Concern', 
          type: 'textarea', 
          placeholder: 'Describe your main health concern' 
        },
        { 
          name: 'additionalComments', 
          label: 'Additional Comments', 
          type: 'textarea', 
          placeholder: 'Any additional information you\'d like to share' 
        }
      ]
    }
  ];

  const handleChange = (e) => {
    const { name, value, type, options } = e.target;

    // Handle multi-select
    if (type === 'select-multiple') {
      const selectedValues = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
      
      setFormData(prevData => ({
        ...prevData,
        [name]: selectedValues
      }));
      return;
    }

    // Regular input handling
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate form data
    const requiredFields = sections.flatMap(section => 
      section.fields.filter(field => field.required).map(field => field.name)
    );

    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Submit logic (e.g., API call)
    console.log('Submitted Health Questionnaire:', formData);
    // You might want to send this to a backend service
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const renderField = (field) => {
    const commonProps = {
      name: field.name,
      className: "w-full mt-1 p-2 border rounded bg-gray-100 dark:bg-gray-700",
      value: formData[field.name],
      onChange: handleChange,
      required: field.required
    };

    switch (field.type) {
      case 'text':
      case 'number':
      case 'email':
      case 'tel':
        return (
          <input 
            {...commonProps} 
            type={field.type} 
            placeholder={field.placeholder}
          />
        );
      
      case 'textarea':
        return (
          <textarea 
            {...commonProps} 
            placeholder={field.placeholder}
            rows="3"
          />
        );
      
      case 'select':
        return (
          <select {...commonProps}>
            {field.options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'multiselect':
        return (
          <select 
            {...commonProps} 
            multiple 
            className="w-full mt-1 p-2 border rounded bg-gray-100 dark:bg-gray-700 h-24"
          >
            {field.options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg rounded-lg p-6 max-w-2xl w-full mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Comprehensive Health Questionnaire
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-xl font-semibold mb-2 text-center">
          {sections[currentSection].title}
        </h3>

        {sections[currentSection].fields.map(field => (
          <div key={field.name}>
            <label className="block font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderField(field)}
          </div>
        ))}

        <div className="flex justify-between items-center mt-6">
          {currentSection > 0 && (
            <button 
              type="button" 
              onClick={prevSection} 
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
            >
              Previous
            </button>
          )}

          {currentSection < sections.length - 1 ? (
            <button 
              type="button" 
              onClick={nextSection} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded ml-auto"
            >
              Next
            </button>
          ) : (
            <button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded ml-auto"
            >
              Submit Questionnaire
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default HealthQuestionnaire;