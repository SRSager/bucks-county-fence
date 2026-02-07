<script lang="ts">
  import { leadFormStore, formProgress } from '../stores/leadFormStore';
  import { fade, slide } from 'svelte/transition';
  import AddressAutocomplete from './AddressAutocomplete.svelte';
  
  // Step titles
  const stepTitles = [
    'What type of project do you need?',
    'What fence material are you considering?',
    'When do you need this project completed?',
    'What type of property is this?',
    'What is the primary purpose of your fence?',
    'Approximate fence length?',
    'Your Contact Information',
    'Property Address',
    'Additional Details',
  ];
  
  // Step 1 options: Project Type
  const projectTypes = [
    { value: 'new_fence', label: 'New Fence Installation' },
    { value: 'fence_repair', label: 'Fence Repair' },
    { value: 'fence_replacement', label: 'Fence Replacement' },
    { value: 'gate_installation', label: 'Gate Installation/Repair' },
  ];
  
  // Step 2 options: Fence Material
  const fenceMaterials = [
    { value: 'wood', label: 'Wood', description: 'Classic & versatile' },
    { value: 'vinyl', label: 'Vinyl', description: 'Low maintenance' },
    { value: 'aluminum', label: 'Aluminum', description: 'Elegant & durable' },
    { value: 'chain_link', label: 'Chain Link', description: 'Affordable security' },
    { value: 'wrought_iron', label: 'Wrought Iron', description: 'Ornamental beauty' },
    { value: 'not_sure', label: 'Not Sure Yet', description: 'Need guidance' },
  ];
  
  // Step 3 options: Timeline
  const timelines = [
    { value: 'asap', label: 'As Soon As Possible', description: 'Ready to start immediately' },
    { value: 'within_week', label: 'Within 1 Week', description: 'Urgent project' },
    { value: 'within_month', label: 'Within 1 Month', description: 'Planning ahead' },
    { value: '1_3_months', label: '1-3 Months', description: 'Future planning' },
    { value: '3_plus_months', label: '3+ Months', description: 'Early research' },
    { value: 'just_researching', label: 'Just Researching', description: 'Getting ideas' },
  ];
  
  // Step 4 options: Property Type
  const propertyTypes = [
    { value: 'single_family', label: 'Single Family Home' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'condo', label: 'Condominium' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'commercial', label: 'Commercial Property' },
    { value: 'other', label: 'Other' },
  ];
  
  // Step 5 options: Fence Purpose (multi-select)
  const fencePurposes = [
    { value: 'privacy', label: 'Privacy' },
    { value: 'security', label: 'Security' },
    { value: 'decorative', label: 'Decorative' },
    { value: 'pet_containment', label: 'Pet Containment' },
    { value: 'pool_safety', label: 'Pool Safety' },
    { value: 'property_boundary', label: 'Property Boundary' },
    { value: 'noise_reduction', label: 'Noise Reduction' },
    { value: 'other', label: 'Other' },
  ];
  
  // Step 6 options: Fence Length
  const fenceLengths = [
    { value: 'under_50', label: 'Under 50 ft', description: 'Small yard or section' },
    { value: '50_100', label: '50-100 ft', description: 'Average yard' },
    { value: '100_200', label: '100-200 ft', description: 'Large yard' },
    { value: '200_plus', label: '200+ ft', description: 'Very large property' },
    { value: 'not_sure', label: 'Not Sure', description: 'Need measurement' },
  ];
  
  let formElement: HTMLFormElement;
  
  function handleNext() {
    // Validate step 7 (contact info) and step 8 (address) before proceeding
    if ($leadFormStore.currentStep === 7 || $leadFormStore.currentStep === 8) {
      const isValid = leadFormStore.validateStep($leadFormStore.currentStep, $leadFormStore.data);
      if (!isValid) {
        return; // Stop if validation fails
      }
    }
    
    if ($leadFormStore.currentStep === 9) {
      submitForm();
    } else {
      leadFormStore.nextStep();
    }
  }
  
  function handleBack() {
    leadFormStore.prevStep();
  }
  
  async function submitForm() {
    leadFormStore.setSubmitting(true);
    
    try {
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify($leadFormStore.data),
      });
      
      if (response.ok) {
        leadFormStore.setComplete();
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      alert('There was an error submitting your request. Please try again.');
      leadFormStore.setSubmitting(false);
    }
  }
  
  function formatPhone(value: string): string {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
    return value;
  }
  
  function handlePhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const formatted = formatPhone(input.value);
    leadFormStore.setField('phone', formatted);
  }

  function handleInput(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    leadFormStore.setField(field, input.value);
  }
</script>

<div class="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
  {#if $leadFormStore.isComplete}
    <!-- Success State -->
    <div class="p-8 text-center" in:fade>
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h3 class="text-2xl font-bold text-slate-900 mb-2">Thank You!</h3>
      <p class="text-slate-600 mb-4">
        Your request has been submitted successfully. Our team will review your project details and contact you within 24 hours.
      </p>
      <button 
        on:click={() => leadFormStore.reset()}
        class="text-blue-600 hover:text-blue-700 font-medium"
      >
        Submit Another Request →
      </button>
    </div>
  {:else}
    <!-- Form Header with Progress -->
    <div class="bg-slate-50 px-6 py-4 border-b border-slate-200">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-slate-600">
          Step {$leadFormStore.currentStep} of {$leadFormStore.totalSteps}
        </span>
        <span class="text-sm font-medium text-blue-600">
          {$formProgress}%
        </span>
      </div>
      <div class="w-full bg-slate-200 rounded-full h-2">
        <div 
          class="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style="width: {$formProgress}%"
        ></div>
      </div>
    </div>
    
    <!-- Form Content -->
    <div class="p-6">
      <h2 class="text-xl font-bold text-slate-900 mb-6">
        {stepTitles[$leadFormStore.currentStep - 1]}
      </h2>
      
      <form bind:this={formElement} on:submit|preventDefault={handleNext}>
        <!-- Step 1: Project Type -->
        {#if $leadFormStore.currentStep === 1}
          <div class="grid gap-3" in:slide>
            {#each projectTypes as type}
              {@const isSelected = $leadFormStore.data.projectType === type.value}
              <label 
                class="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all"
                class:border-amber-500={isSelected}
                class:bg-amber-50={isSelected}
                class:ring-2={isSelected}
                class:ring-amber-500={isSelected}
                class:border-slate-200={!isSelected}
                class:hover:border-amber-300={!isSelected}
                class:hover:bg-amber-50={!isSelected}
              >
                <input 
                  type="radio" 
                  name="projectType" 
                  value={type.value}
                  checked={isSelected}
                  on:change={() => leadFormStore.setField('projectType', type.value)}
                  class="sr-only"
                />
                <span class="font-medium" class:text-amber-900={isSelected} class:text-slate-900={!isSelected}>{type.label}</span>
                {#if isSelected}
                  <svg class="w-5 h-5 text-amber-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                {/if}
              </label>
            {/each}
          </div>
        {/if}
        
        <!-- Step 2: Fence Material -->
        {#if $leadFormStore.currentStep === 2}
          <div class="grid gap-3" in:slide>
            {#each fenceMaterials as material}
              {@const isSelected = $leadFormStore.data.fenceMaterial === material.value}
              <label 
                class="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all"
                class:border-amber-500={isSelected}
                class:bg-amber-50={isSelected}
                class:ring-2={isSelected}
                class:ring-amber-500={isSelected}
                class:border-slate-200={!isSelected}
                class:hover:border-amber-300={!isSelected}
                class:hover:bg-amber-50={!isSelected}
              >
                <input 
                  type="radio" 
                  name="fenceMaterial" 
                  value={material.value}
                  checked={isSelected}
                  on:change={() => leadFormStore.setField('fenceMaterial', material.value)}
                  class="sr-only"
                />
                <div class="flex-1">
                  <span class="font-medium block" class:text-amber-900={isSelected} class:text-slate-900={!isSelected}>{material.label}</span>
                  <span class="text-sm" class:text-amber-700={isSelected} class:text-slate-500={!isSelected}>{material.description}</span>
                </div>
                {#if isSelected}
                  <svg class="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                {/if}
              </label>
            {/each}
          </div>
        {/if}
        
        <!-- Step 3: Timeline -->
        {#if $leadFormStore.currentStep === 3}
          <div class="grid gap-3" in:slide>
            {#each timelines as timeline}
              {@const isSelected = $leadFormStore.data.timeline === timeline.value}
              <label 
                class="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all"
                class:border-amber-500={isSelected}
                class:bg-amber-50={isSelected}
                class:ring-2={isSelected}
                class:ring-amber-500={isSelected}
                class:border-slate-200={!isSelected}
                class:hover:border-amber-300={!isSelected}
                class:hover:bg-amber-50={!isSelected}
              >
                <input 
                  type="radio" 
                  name="timeline" 
                  value={timeline.value}
                  checked={isSelected}
                  on:change={() => leadFormStore.setField('timeline', timeline.value)}
                  class="sr-only"
                />
                <div class="flex-1">
                  <span class="font-medium block" class:text-amber-900={isSelected} class:text-slate-900={!isSelected}>{timeline.label}</span>
                  <span class="text-sm" class:text-amber-700={isSelected} class:text-slate-500={!isSelected}>{timeline.description}</span>
                </div>
                {#if isSelected}
                  <svg class="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                {/if}
              </label>
            {/each}
          </div>
        {/if}
        
        <!-- Step 4: Property Type -->
        {#if $leadFormStore.currentStep === 4}
          <div class="grid grid-cols-2 gap-3" in:slide>
            {#each propertyTypes as property}
              {@const isSelected = $leadFormStore.data.propertyType === property.value}
              <label 
                class="flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all text-center h-24"
                class:border-amber-500={isSelected}
                class:bg-amber-50={isSelected}
                class:ring-2={isSelected}
                class:ring-amber-500={isSelected}
                class:border-slate-200={!isSelected}
                class:hover:border-amber-300={!isSelected}
                class:hover:bg-amber-50={!isSelected}
              >
                <input 
                  type="radio" 
                  name="propertyType" 
                  value={property.value}
                  checked={isSelected}
                  on:change={() => leadFormStore.setField('propertyType', property.value)}
                  class="sr-only"
                />
                <span class="font-medium" class:text-amber-900={isSelected} class:text-slate-900={!isSelected}>{property.label}</span>
                {#if isSelected}
                  <svg class="w-5 h-5 text-amber-600 mt-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                {/if}
              </label>
            {/each}
          </div>
        {/if}
        
        <!-- Step 5: Fence Purpose (Multi-select) -->
        {#if $leadFormStore.currentStep === 5}
          <div class="grid grid-cols-2 gap-3" in:slide>
            {#each fencePurposes as purpose}
              {@const isSelected = $leadFormStore.data.fencePurpose?.includes(purpose.value)}
              <label 
                class="flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all text-center h-24"
                class:border-amber-500={isSelected}
                class:bg-amber-50={isSelected}
                class:ring-2={isSelected}
                class:ring-amber-500={isSelected}
                class:border-slate-200={!isSelected}
                class:hover:border-amber-300={!isSelected}
                class:hover:bg-amber-50={!isSelected}
              >
                <input 
                  type="checkbox" 
                  value={purpose.value}
                  checked={isSelected}
                  on:change={() => leadFormStore.toggleArrayField('fencePurpose', purpose.value)}
                  class="sr-only"
                />
                <span class="font-medium" class:text-amber-900={isSelected} class:text-slate-900={!isSelected}>{purpose.label}</span>
                {#if isSelected}
                  <svg class="w-5 h-5 text-amber-600 mt-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                {/if}
              </label>
            {/each}
          </div>
          {#if $leadFormStore.errors.fencePurpose}
            <p class="text-red-500 text-sm mt-2">{$leadFormStore.errors.fencePurpose}</p>
          {/if}
        {/if}
        
        <!-- Step 6: Fence Length -->
        {#if $leadFormStore.currentStep === 6}
          <div class="grid gap-3" in:slide>
            {#each fenceLengths as length}
              {@const isSelected = $leadFormStore.data.fenceLength === length.value}
              <label 
                class="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all"
                class:border-amber-500={isSelected}
                class:bg-amber-50={isSelected}
                class:ring-2={isSelected}
                class:ring-amber-500={isSelected}
                class:border-slate-200={!isSelected}
                class:hover:border-amber-300={!isSelected}
                class:hover:bg-amber-50={!isSelected}
              >
                <input 
                  type="radio" 
                  name="fenceLength" 
                  value={length.value}
                  checked={isSelected}
                  on:change={() => leadFormStore.setField('fenceLength', length.value)}
                  class="sr-only"
                />
                <div class="flex-1">
                  <span class="font-medium block" class:text-amber-900={isSelected} class:text-slate-900={!isSelected}>{length.label}</span>
                  <span class="text-sm" class:text-amber-700={isSelected} class:text-slate-500={!isSelected}>{length.description}</span>
                </div>
                {#if isSelected}
                  <svg class="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                {/if}
              </label>
            {/each}
          </div>
        {/if}
        
        <!-- Step 7: Contact Information -->
        {#if $leadFormStore.currentStep === 7}
          <div class="space-y-4" in:slide>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">First Name *</label>
                <input 
                  type="text" 
                  value={$leadFormStore.data.firstName || ''}
                  on:input={(e) => handleInput(e, 'firstName')}
                  class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John"
                />
                {#if $leadFormStore.errors.firstName}
                  <p class="text-red-500 text-sm mt-1">{$leadFormStore.errors.firstName}</p>
                {/if}
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Last Name *</label>
                <input 
                  type="text" 
                  value={$leadFormStore.data.lastName || ''}
                  on:input={(e) => handleInput(e, 'lastName')}
                  class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Doe"
                />
                {#if $leadFormStore.errors.lastName}
                  <p class="text-red-500 text-sm mt-1">{$leadFormStore.errors.lastName}</p>
                {/if}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
              <input 
                type="email" 
                value={$leadFormStore.data.email || ''}
                on:input={(e) => handleInput(e, 'email')}
                class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="john@example.com"
              />
              {#if $leadFormStore.errors.email}
                <p class="text-red-500 text-sm mt-1">{$leadFormStore.errors.email}</p>
              {/if}
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
              <input 
                type="tel" 
                value={$leadFormStore.data.phone}
                on:input={handlePhoneInput}
                class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="(215) 555-0123"
              />
              {#if $leadFormStore.errors.phone}
                <p class="text-red-500 text-sm mt-1">{$leadFormStore.errors.phone}</p>
              {/if}
            </div>
          </div>
        {/if}
        
        <!-- Step 8: Property Address -->
        {#if $leadFormStore.currentStep === 8}
          <div class="space-y-4" in:slide>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Street Address *</label>
              <AddressAutocomplete
                streetValue={$leadFormStore.data.streetAddress || ''}
                cityValue={$leadFormStore.data.city || ''}
                zipValue={$leadFormStore.data.zipCode || ''}
                onAddressSelect={(street, city, zip) => {
                  leadFormStore.setField('streetAddress', street);
                  leadFormStore.setField('city', city);
                  leadFormStore.setField('zipCode', zip);
                }}
              />
              {#if $leadFormStore.errors.streetAddress}
                <p class="text-red-500 text-sm mt-1">{$leadFormStore.errors.streetAddress}</p>
              {/if}
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">City *</label>
                <input 
                  type="text" 
                  value={$leadFormStore.data.city || ''}
                  on:input={(e) => handleInput(e, 'city')}
                  class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Doylestown"
                />
                {#if $leadFormStore.errors.city}
                  <p class="text-red-500 text-sm mt-1">{$leadFormStore.errors.city}</p>
                {/if}
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">ZIP Code *</label>
                <input 
                  type="text" 
                  value={$leadFormStore.data.zipCode || ''}
                  on:input={(e) => handleInput(e, 'zipCode')}
                  class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="18901"
                />
                {#if $leadFormStore.errors.zipCode}
                  <p class="text-red-500 text-sm mt-1">{$leadFormStore.errors.zipCode}</p>
                {/if}
              </div>
            </div>
          </div>
        {/if}
        
        <!-- Step 9: Additional Details -->
        {#if $leadFormStore.currentStep === 9}
          <div class="space-y-4" in:slide>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Additional Details (Optional)
              </label>
              <textarea 
                value={$leadFormStore.data.additionalDetails || ''}
                on:input={(e) => handleInput(e, 'additionalDetails')}
                rows="4"
                class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell us more about your project, special requirements, or any questions you have..."
              ></textarea>
            </div>
            <label class="flex items-start gap-3">
              <input 
                type="checkbox" 
                checked={$leadFormStore.data.marketingConsent || false}
                on:change={(e) => leadFormStore.setField('marketingConsent', (e.target as HTMLInputElement).checked)}
                class="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span class="text-sm text-slate-600">
                I agree to receive marketing communications about fencing services and promotions. You can unsubscribe at any time.
              </span>
            </label>
          </div>
        {/if}
        
        <!-- Navigation Buttons -->
        <div class="flex gap-3 mt-8">
          {#if $leadFormStore.currentStep > 1}
            <button 
              type="button"
              on:click={handleBack}
              class="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              Back
            </button>
          {/if}
          <button 
            type="submit"
            disabled={$leadFormStore.isSubmitting}
            class="flex-1 px-6 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {#if $leadFormStore.isSubmitting}
              <span class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            {:else if $leadFormStore.currentStep === 9}
              Submit Request
            {:else}
              Continue
            {/if}
          </button>
        </div>
      </form>
    </div>
  {/if}
</div>