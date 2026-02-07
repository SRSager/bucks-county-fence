import { writable, derived } from 'svelte/store';
import { z } from 'zod';

// Define the form schema with Zod
export const leadFormSchema = z.object({
  // Step 1: Project Type
  projectType: z.enum(['new_fence', 'fence_repair', 'fence_replacement', 'gate_installation', 'other']),
  
  // Step 2: Fence Material
  fenceMaterial: z.enum(['wood', 'vinyl', 'aluminum', 'chain_link', 'wrought_iron', 'not_sure']),
  
  // Step 3: Project Timeline
  timeline: z.enum(['asap', 'within_week', 'within_month', '1_3_months', '3_plus_months', 'just_researching']),
  
  // Step 4: Property Type
  propertyType: z.enum(['single_family', 'townhouse', 'condo', 'apartment', 'commercial', 'other']),
  
  // Step 5: Fence Purpose
  fencePurpose: z.array(z.enum(['privacy', 'security', 'decorative', 'pet_containment', 'pool_safety', 'property_boundary', 'noise_reduction', 'other'])).min(1, 'Select at least one purpose'),
  
  // Step 6: Approximate Length
  fenceLength: z.enum(['under_50', '50_100', '100_200', '200_plus', 'not_sure']),
  
  // Step 7: Contact Information
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  
  // Step 8: Property Address
  streetAddress: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Valid ZIP code is required'),
  
  // Step 9: Additional Details
  additionalDetails: z.string().optional(),
  
  // Marketing consent
  marketingConsent: z.boolean().default(false),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

// Initial form state
const initialState: Partial<LeadFormData> = {
  projectType: undefined,
  fenceMaterial: undefined,
  timeline: undefined,
  propertyType: undefined,
  fencePurpose: [],
  fenceLength: undefined,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  streetAddress: '',
  city: '',
  zipCode: '',
  additionalDetails: '',
  marketingConsent: false,
};

// Create the store
function createLeadFormStore() {
  const { subscribe, set, update } = writable({
    data: initialState,
    currentStep: 1,
    totalSteps: 9,
    errors: {} as Record<string, string>,
    isSubmitting: false,
    isComplete: false,
  });

  return {
    subscribe,
    
    // Update a field value
    setField: (field: keyof LeadFormData, value: any) => {
      update(state => ({
        ...state,
        data: { ...state.data, [field]: value },
        errors: { ...state.errors, [field]: '' }, // Clear error when field is updated
      }));
    },
    
    // Toggle array values (for checkboxes)
    toggleArrayField: (field: 'fencePurpose', value: string) => {
      update(state => {
        const currentArray = (state.data[field] || []) as string[];
        const newArray = currentArray.includes(value)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value];
        return {
          ...state,
          data: { ...state.data, [field]: newArray },
          errors: { ...state.errors, [field]: '' },
        };
      });
    },
    
    // Validate current step
    validateStep: (step: number): boolean => {
      let isValid = true;
      const errors: Record<string, string> = {};
      
      const state = { ...initialState }; // Get current state
      
      // Step-specific validation
      switch (step) {
        case 1:
          if (!state.projectType) {
            errors.projectType = 'Please select a project type';
            isValid = false;
          }
          break;
        case 2:
          if (!state.fenceMaterial) {
            errors.fenceMaterial = 'Please select a fence material';
            isValid = false;
          }
          break;
        case 3:
          if (!state.timeline) {
            errors.timeline = 'Please select a timeline';
            isValid = false;
          }
          break;
        case 4:
          if (!state.propertyType) {
            errors.propertyType = 'Please select a property type';
            isValid = false;
          }
          break;
        case 5:
          if (!state.fencePurpose || state.fencePurpose.length === 0) {
            errors.fencePurpose = 'Please select at least one purpose';
            isValid = false;
          }
          break;
        case 6:
          if (!state.fenceLength) {
            errors.fenceLength = 'Please select approximate length';
            isValid = false;
          }
          break;
        case 7:
          if (!state.firstName || state.firstName.length < 2) {
            errors.firstName = 'First name is required';
            isValid = false;
          }
          if (!state.lastName || state.lastName.length < 2) {
            errors.lastName = 'Last name is required';
            isValid = false;
          }
          if (!state.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
            errors.email = 'Valid email is required';
            isValid = false;
          }
          if (!state.phone || state.phone.length < 10) {
            errors.phone = 'Valid phone number is required';
            isValid = false;
          }
          break;
        case 8:
          if (!state.streetAddress || state.streetAddress.length < 5) {
            errors.streetAddress = 'Street address is required';
            isValid = false;
          }
          if (!state.city || state.city.length < 2) {
            errors.city = 'City is required';
            isValid = false;
          }
          if (!state.zipCode || !/^\d{5}(-\d{4})?$/.test(state.zipCode)) {
            errors.zipCode = 'Valid ZIP code is required';
            isValid = false;
          }
          break;
      }
      
      update(s => ({ ...s, errors }));
      return isValid;
    },
    
    // Navigate to next step
    nextStep: () => {
      update(state => {
        if (state.currentStep < state.totalSteps) {
          return { ...state, currentStep: state.currentStep + 1 };
        }
        return state;
      });
    },
    
    // Navigate to previous step
    prevStep: () => {
      update(state => {
        if (state.currentStep > 1) {
          return { ...state, currentStep: state.currentStep - 1 };
        }
        return state;
      });
    },
    
    // Set submitting state
    setSubmitting: (isSubmitting: boolean) => {
      update(state => ({ ...state, isSubmitting }));
    },
    
    // Mark form as complete
    setComplete: () => {
      update(state => ({ ...state, isComplete: true, isSubmitting: false }));
    },
    
    // Reset form
    reset: () => {
      set({
        data: initialState,
        currentStep: 1,
        totalSteps: 9,
        errors: {},
        isSubmitting: false,
        isComplete: false,
      });
    },
    
    // Get current data
    getData: () => {
      let data = initialState;
      subscribe(state => { data = state.data as LeadFormData; })();
      return data;
    },
  };
}

export const leadFormStore = createLeadFormStore();

// Progress percentage derived store
export const formProgress = derived(
  leadFormStore,
  $store => Math.round((($store.currentStep - 1) / $store.totalSteps) * 100)
);
