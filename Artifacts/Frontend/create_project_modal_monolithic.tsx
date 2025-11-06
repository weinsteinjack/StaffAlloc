import { Fragment, useRef, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Calendar, Loader2 } from 'lucide-react';

// Props Interface for the component
interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newProject: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
}

// Zod validation schema
const projectSchema = z.object({
  projectCode: z
    .string()
    .min(1, 'Project Code is required')
    .regex(/^[A-Z0-9-]+$/, 'Only uppercase letters, numbers, and hyphens allowed'),
  projectName: z.string().min(1, 'Project Name is required'),
  clientName: z.string().min(1, 'Client Name is required'),
  startDate: z.string().refine((date) => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0)), {
    message: 'Start date cannot be in the past',
  }),
  sprints: z.coerce
    .number({ invalid_type_error: 'Must be a number'})
    .int('Must be a whole number')
    .min(1, 'Must be at least 1 sprint')
    .max(52, 'Cannot exceed 52 sprints'),
});

// TypeScript type inferred from the Zod schema
type ProjectFormData = z.infer<typeof projectSchema>;

export default function CreateProjectModal({ isOpen, onClose, onSuccess }: CreateProjectModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });
  
  const [apiError, setApiError] = useState<string | null>(null);
  const projectCodeInputRef = useRef(null);

  // Reset form and API error when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        reset();
        setApiError(null);
      }, 300); // Wait for closing transition to finish
    }
  }, [isOpen, reset]);

  const onSubmit: SubmitHandler<ProjectFormData> = async (data) => {
    setApiError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Example of a failing API call
      // if (data.projectCode === 'FAIL') {
      //   throw new Error('A project with this code already exists.');
      // }

      const response = await fetch('/api/v1/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create the project.');
      }

      const newProject = await response.json();

      onSuccess(newProject);
      onClose();

    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError('An unexpected error occurred. Please try again.');
      }
    }
  };
  
  const InputField = ({ name, label, helperText, children } : { name: keyof ProjectFormData, label: string, helperText?: string, children: React.ReactNode}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
            {label} <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 relative">
            {children}
        </div>
        {errors[name] ? (
            <p className="mt-1 text-sm text-red-600">{errors[name]?.message}</p>
        ) : helperText ? (
            <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        ) : null}
    </div>
  )

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" initialFocus={projectCodeInputRef} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-8 text-left align-middle shadow-xl transition-all">
                <div className="flex items-start justify-between">
                    <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900">
                        Create New Project
                    </Dialog.Title>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <span className="sr-only">Close</span>
                        <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
                  <InputField name="projectCode" label="Project Code" helperText="Unique identifier for this project">
                     <input
                        id="projectCode"
                        type="text"
                        placeholder="e.g., PROJ-2025-001"
                        {...register('projectCode')}
                        ref={projectCodeInputRef}
                        className={`block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors.projectCode ? 'ring-red-500 focus:ring-red-600' : 'ring-gray-300 focus:ring-blue-600'
                        } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                        aria-invalid={errors.projectCode ? "true" : "false"}
                      />
                  </InputField>
                  
                  <InputField name="projectName" label="Project Name">
                     <input
                        id="projectName"
                        type="text"
                        placeholder="e.g., Customer Portal Redesign"
                        {...register('projectName')}
                        className={`block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors.projectName ? 'ring-red-500 focus:ring-red-600' : 'ring-gray-300 focus:ring-blue-600'
                        } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                        aria-invalid={errors.projectName ? "true" : "false"}
                      />
                  </InputField>

                  <InputField name="clientName" label="Client Name">
                     <input
                        id="clientName"
                        type="text"
                        placeholder="e.g., Acme Corporation"
                        {...register('clientName')}
                        className={`block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors.clientName ? 'ring-red-500 focus:ring-red-600' : 'ring-gray-300 focus:ring-blue-600'
                        } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                        aria-invalid={errors.clientName ? "true" : "false"}
                      />
                  </InputField>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <InputField name="startDate" label="Start Date">
                        <div className="relative">
                            <input
                                id="startDate"
                                type="date"
                                {...register('startDate')}
                                className={`block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                                    errors.startDate ? 'ring-red-500 focus:ring-red-600' : 'ring-gray-300 focus:ring-blue-600'
                                } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 pr-10`}
                                aria-invalid={errors.startDate ? "true" : "false"}
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <Calendar className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                        </div>
                    </InputField>

                    <InputField name="sprints" label="Number of Sprints" helperText="Each sprint is 2 weeks.">
                        <input
                            id="sprints"
                            type="number"
                            placeholder="e.g., 18"
                            {...register('sprints')}
                            className={`block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                                errors.sprints ? 'ring-red-500 focus:ring-red-600' : 'ring-gray-300 focus:ring-blue-600'
                            } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                            aria-invalid={errors.sprints ? "true" : "false"}
                        />
                    </InputField>
                  </div>

                  {apiError && (
                    <div className="rounded-md bg-red-50 p-4">
                      <p className="text-sm font-medium text-red-800">{apiError}</p>
                    </div>
                  )}

                  <div className="mt-8 flex justify-end space-x-4">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex justify-center items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isSubmitting ? 'Creating...' : 'Create Project'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}