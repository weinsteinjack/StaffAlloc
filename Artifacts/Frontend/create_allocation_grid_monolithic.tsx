import { Fragment, useRef, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { XMarkIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

// --- PROPS & FORM TYPES ---

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type ProjectFormData = z.infer<typeof projectSchema>;

// --- VALIDATION SCHEMA ---

const projectSchema = z.object({
  projectCode: z
    .string()
    .min(1, 'Project code is required.')
    .regex(/^[A-Z0-9-]{4,10}$/, 'Must be 4-10 uppercase letters, numbers, or hyphens.'),
  projectName: z
    .string()
    .min(3, 'Project name must be at least 3 characters.'),
  client: z
    .string()
    .min(2, 'Client name is required.'),
  startDate: z
    .string()
    .min(1, 'Start date is required.')
    .refine((date) => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0)), {
      message: 'Start date cannot be in the past.',
    }),
  sprintCount: z
    .coerce // Coerce string from input to number
    .number({ invalid_type_error: 'Must be a number.' })
    .int('Must be a whole number.')
    .min(1, 'Must be at least 1 sprint.')
    .max(52, 'Cannot exceed 52 sprints.'),
});


// --- COMPONENT ---

export default function CreateProjectModal({ isOpen, onClose, onSuccess }: CreateProjectModalProps) {
  const [apiError, setApiError] = useState<string | null>(null);
  const firstInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
        // Set default start date to today
        startDate: new Date().toISOString().split('T')[0],
        sprintCount: 12,
    }
  });

  const handleClose = () => {
    if (isSubmitting) return;
    reset();
    setApiError(null);
    onClose();
  };
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        startDate: new Date().toISOString().split('T')[0],
        sprintCount: 12,
        projectCode: '',
        projectName: '',
        client: '',
      });
      setApiError(null);
    }
  }, [isOpen, reset]);

  const onSubmit: SubmitHandler<ProjectFormData> = async (data) => {
    setApiError(null);
    try {
      // --- FAKE API CALL ---
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Example of checking for a specific error from the backend
      if (data.projectCode === 'EXIST-01') {
          throw new Error('Project code EXIST-01 already exists.');
      }
      // const response = await fetch('/api/v1/projects', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // if (!response.ok) {
      //     const errorData = await response.json();
      //     throw new Error(errorData.message || 'Failed to create project.');
      // }
      // ---------------------

      onSuccess(); // Callback for parent component (e.g., to refetch data)
      handleClose();

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
      setApiError(message);
      console.error('Project creation failed:', error);
    }
  };
  
  const getInputClass = (fieldName: keyof ProjectFormData) => 
    `block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ${
      errors[fieldName] 
        ? 'ring-red-400 focus:ring-red-500' 
        : 'ring-gray-300 focus:ring-indigo-600'
    }`;


  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" initialFocus={firstInputRef} onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-start justify-between">
                  <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                    Create New Project
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={handleClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                    {/* Project Code */}
                    <div>
                      <label htmlFor="projectCode" className="block text-sm font-medium leading-6 text-gray-900">
                        Project Code <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          id="projectCode"
                          type="text"
                          {...register('projectCode')}
                          ref={firstInputRef}
                          className={getInputClass('projectCode')}
                          placeholder="ACME-01"
                        />
                        {errors.projectCode && <p className="mt-2 text-sm text-red-600">{errors.projectCode.message}</p>}
                      </div>
                    </div>

                    {/* Project Name */}
                    <div>
                      <label htmlFor="projectName" className="block text-sm font-medium leading-6 text-gray-900">
                        Project Name <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          id="projectName"
                          type="text"
                          {...register('projectName')}
                          className={getInputClass('projectName')}
                          placeholder="e.g., Customer Portal Redesign"
                        />
                        {errors.projectName && <p className="mt-2 text-sm text-red-600">{errors.projectName.message}</p>}
                      </div>
                    </div>
                    
                    {/* Client */}
                    <div className="sm:col-span-2">
                      <label htmlFor="client" className="block text-sm font-medium leading-6 text-gray-900">
                        Client <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          id="client"
                          type="text"
                          {...register('client')}
                          className={getInputClass('client')}
                          placeholder="e.g., Acme Corporation"
                        />
                        {errors.client && <p className="mt-2 text-sm text-red-600">{errors.client.message}</p>}
                      </div>
                    </div>

                    {/* Start Date */}
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium leading-6 text-gray-900">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          id="startDate"
                          type="date"
                          {...register('startDate')}
                          className={getInputClass('startDate')}
                        />
                        {errors.startDate && <p className="mt-2 text-sm text-red-600">{errors.startDate.message}</p>}
                      </div>
                    </div>
                    
                    {/* Number of Sprints */}
                    <div>
                      <label htmlFor="sprintCount" className="block text-sm font-medium leading-6 text-gray-900">
                        Number of Sprints <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          id="sprintCount"
                          type="number"
                          {...register('sprintCount')}
                          className={getInputClass('sprintCount')}
                          placeholder="e.g., 12"
                        />
                        {errors.sprintCount && <p className="mt-2 text-sm text-red-600">{errors.sprintCount.message}</p>}
                      </div>
                    </div>
                  </div>

                  {/* API Error Message */}
                  {apiError && (
                    <div className="mt-4 rounded-md bg-red-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">{apiError}</h3>
                            </div>
                        </div>
                    </div>
                  )}

                  <div className="mt-8 border-t border-gray-200 pt-5 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={isSubmitting}
                      className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex justify-center rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Creating Project...' : 'Create Project'}
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