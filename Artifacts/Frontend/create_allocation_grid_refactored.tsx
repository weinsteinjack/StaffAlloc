import { Fragment, useRef, useState, useEffect, forwardRef, InputHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm, SubmitHandler, UseFormRegisterReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { XMarkIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

// --- TYPES, INTERFACES & VALIDATION SCHEMA ---

// Props for the main modal component
interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Inferred form data type from Zod schema
type ProjectFormData = z.infer<typeof projectSchema>;

// Zod validation schema for the project form
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
    .coerce
    .number({ invalid_type_error: 'Must be a number.' })
    .int('Must be a whole number.')
    .min(1, 'Must be at least 1 sprint.')
    .max(52, 'Cannot exceed 52 sprints.'),
});

// Props for individual form field components
interface FormFieldProps {
  label: string;
  name: keyof ProjectFormData;
  error?: { message?: string };
  required?: boolean;
  children: ReactNode;
}

// Props for input components, extending standard HTML attributes
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

// Props for the Button component
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    isLoading?: boolean;
}

// --- HELPER & UI COMPONENTS ---

const Button = ({ children, variant = 'primary', isLoading = false, disabled, ...props }: ButtonProps) => {
    const primaryClasses = 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600 disabled:bg-indigo-300';
    const secondaryClasses = 'bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50';
    const baseClasses = 'inline-flex justify-center rounded-md px-3.5 py-2.5 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-75 disabled:cursor-not-allowed';

    const classes = `${baseClasses} ${variant === 'primary' ? primaryClasses : secondaryClasses}`;

    return (
        <button className={classes} disabled={disabled || isLoading} {...props}>
            {isLoading ? 'Loading...' : children}
        </button>
    );
};

const ApiErrorMessage = ({ message }: { message: string | null }) => {
    if (!message) return null;

    return (
        <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
                <div className="flex-shrink-0">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{message}</h3>
                </div>
            </div>
        </div>
    );
};


// --- REUSABLE FORM COMPONENTS ---

const getInputClass = (hasError?: boolean) =>
    `block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ${
      hasError
        ? 'ring-red-400 focus:ring-red-500'
        : 'ring-gray-300 focus:ring-indigo-600'
    }`;

const TextInput = forwardRef<HTMLInputElement, InputProps>(
  ({ hasError, ...props }, ref) => (
    <input type="text" ref={ref} className={getInputClass(hasError)} {...props} />
  )
);
TextInput.displayName = 'TextInput';

const DateInput = forwardRef<HTMLInputElement, InputProps>(
  ({ hasError, ...props }, ref) => (
    <input type="date" ref={ref} className={getInputClass(hasError)} {...props} />
  )
);
DateInput.displayName = 'DateInput';

const NumberInput = forwardRef<HTMLInputElement, InputProps>(
  ({ hasError, ...props }, ref) => (
    <input type="number" ref={ref} className={getInputClass(hasError)} {...props} />
  )
);
NumberInput.displayName = 'NumberInput';

const FormField = ({ label, name, error, required, children }: FormFieldProps) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="mt-2">
      {children}
      {error && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
    </div>
  </div>
);


// --- REUSABLE MODAL LAYOUT COMPONENTS ---

const ModalHeader = ({ title, onClose }: { title: string; onClose: () => void }) => (
    <div className="flex items-start justify-between">
        <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
            {title}
        </Dialog.Title>
        <button
            type="button"
            className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={onClose}
        >
            <span className="sr-only">Close</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
        </button>
    </div>
);

const ModalFooter = ({ onCancel, submitText, isSubmitting }: { onCancel: () => void, submitText: string, isSubmitting: boolean }) => (
    <div className="mt-8 border-t border-gray-200 pt-5 flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : submitText}
        </Button>
    </div>
);


// --- MAIN COMPONENT ---

export default function CreateProjectModal({ isOpen, onClose, onSuccess }: CreateProjectModalProps) {
  const [apiError, setApiError] = useState<string | null>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
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
      await new Promise(resolve => setTimeout(resolve, 1500)); // Fake API call
      if (data.projectCode === 'EXIST-01') {
          throw new Error('Project code EXIST-01 already exists.');
      }
      onSuccess();
      handleClose();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setApiError(message);
    }
  };
  
  // Destructure register to manually merge refs for initialFocus
  const { ref: projectCodeRef, ...projectCodeRest } = register('projectCode');

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" initialFocus={firstInputRef} onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <ModalHeader title="Create New Project" onClose={handleClose} />
                
                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                    <FormField label="Project Code" name="projectCode" error={errors.projectCode} required>
                      <TextInput
                        id="projectCode"
                        placeholder="ACME-01"
                        hasError={!!errors.projectCode}
                        {...projectCodeRest}
                        ref={(e) => {
                            projectCodeRef(e); // From react-hook-form
                            if (firstInputRef) { // From local ref for initialFocus
                                firstInputRef.current = e;
                            }
                        }}
                      />
                    </FormField>

                    <FormField label="Project Name" name="projectName" error={errors.projectName} required>
                      <TextInput
                        id="projectName"
                        placeholder="e.g., Customer Portal Redesign"
                        hasError={!!errors.projectName}
                        {...register('projectName')}
                      />
                    </FormField>
                    
                    <div className="sm:col-span-2">
                        <FormField label="Client" name="client" error={errors.client} required>
                            <TextInput
                                id="client"
                                placeholder="e.g., Acme Corporation"
                                hasError={!!errors.client}
                                {...register('client')}
                            />
                        </FormField>
                    </div>

                    <FormField label="Start Date" name="startDate" error={errors.startDate} required>
                      <DateInput
                        id="startDate"
                        hasError={!!errors.startDate}
                        {...register('startDate')}
                      />
                    </FormField>
                    
                    <FormField label="Number of Sprints" name="sprintCount" error={errors.sprintCount} required>
                      <NumberInput
                        id="sprintCount"
                        placeholder="e.g., 12"
                        hasError={!!errors.sprintCount}
                        {...register('sprintCount')}
                      />
                    </FormField>
                  </div>

                  <ApiErrorMessage message={apiError} />
                  
                  <ModalFooter 
                    onCancel={handleClose} 
                    submitText="Create Project" 
                    isSubmitting={isSubmitting} 
                  />
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}