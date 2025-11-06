jsx
// src/components/CreateProjectModal.jsx

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { XIcon } from '@heroicons/react/solid'; // Example icon library

// 1. Define the validation schema with Zod
const projectSchema = z.object({
  projectName: z.string().min(3, 'Name must be at least 3 characters.'),
  projectCode: z.string().regex(/^[A-Z0-9-]{4,8}$/, 'Must be 4-8 uppercase alphanumeric characters.'),
  client: z.string().min(2, 'Client name is required.'),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'A valid start date is required.'),
  sprintCount: z.coerce.number().int().min(1, 'Must be at least 1 sprint.'),
});

// 2. Define the component
export default function CreateProjectModal({ isOpen, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(projectSchema),
  });

  const handleClose = () => {
    reset(); // Reset form state on close
    onClose();
  };

  // 3. API integration point
  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/v1/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create project.');
      // Handle success (e.g., show toast, refetch data)
      handleClose();
    } catch (error) {
      // Handle API error (e.g., show error message)
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    // Modal Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" role="dialog" aria-modal="true">
      {/* Modal Container */}
      <div className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-bold text-gray-800" id="modal-title">Create New Project</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          {/* Project Name */}
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">Project Name <span className="text-red-500">*</span></label>
            <input
              id="projectName"
              type="text"
              {...register('projectName')}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.projectName ? 'border-red-500' : ''}`}
              placeholder="e.g., Customer Portal Redesign"
            />
            {errors.projectName && <p className="mt-1 text-xs text-red-600">{errors.projectName.message}</p>}
          </div>

          {/* ... Other form fields structured similarly ... */}
          {/* Project Code, Client, Start Date, Number of Sprints */}

          {/* Footer */}
          <div className="flex justify-end pt-4 space-x-3">
            <button type="button" onClick={handleClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 disabled:bg-blue-300">
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}