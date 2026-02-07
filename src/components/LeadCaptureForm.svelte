<script lang="ts">
  import { leadFormStore, formProgress } from '../stores/leadFormStore';
  import { fade, slide } from 'svelte/transition';
  
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
    { value: 'gate_installation', label: 'Gate Installation' },
    { value: 'other', label: 'Other' },
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
              <label 
                class="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50"
                class:border-blue-600={$leadFormStore.data.projectType === type.value}
                class:bg-blue-50={$leadFormStore.data.projectType === type.value}
                class:border-slate-200={$leadFormStore.data.projectType !== type.value}
              >
                <input 
                  type="radio" 
                  name="projectType" 
                  value={type.value}
                  bind:group={$leadFormStore.data.projectType}
                  class="sr-only"
                />
                <span class="font-medium text-slate-900">{type.label}</span>
              </label>
            {/each}
          </div>
        {/if}
        
        <!-- Step 2: Fence Material -->
        {#if $leadFormStore.currentStep === 2}
          <div class="grid gap-3" in:slide>
            {#each fenceMaterials as material}
              <label 
                class="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50"
                class:border-blue-600={$leadFormStore.data.fenceMaterial === material.value}
                class:bg-blue-50={$leadFormStore.data.fenceMaterial === material.value}
                class:border-slate-200={$leadFormStore.data.fenceMaterial !== material.value}
              >
                <input 
                  type="radio" 
                  name="fenceMaterial" 
                  value={material.value}
                  bind:group={$leadFormStore.data.fenceMaterial}
                  class="sr-only"
                />
                <div>
                  <span class="font-medium text-slate-900 block">{material.label}</span>
                  <span class="text-sm text-slate-500">{material.description}</span>
                </div>
              </label>
            {/each}
          </div>
        {/if}
        
        <!-- Step 3: Timeline -->
        {#if $leadFormStore.currentStep === 3}
          <div class="grid gap-3" in:slide>
            {#each timelines as timeline}
              <label 
                class="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50"
                class:border-blue-600={$leadFormStore.data.timeline === timeline.value}
                class:bg-blue-50={$leadFormStore.data.timeline === timeline.value}
                class:border-slate-200={$leadFormStore.data.timeline !== timeline.value}
              >
                <input 
                  type="radio" 
                  name="timeline" 
                  value={timeline.value}
                  bind:group={$leadFormStore.data.timeline}
                  class="sr-only"
                />
                <div>
                  <span class="font-medium text-slate-900 block">{timeline.label}</span>
                  <span class="text-sm text-slate-500">{timeline.description}</span>
                </div>
              </label>
            {/each}
          </div>
        {/if}
        
        <!-- Step 4: Property Type -->
        {#if $leadFormStore.currentStep === 4}
          <div class="grid grid-cols-2 gap-3" in:slide>
            {#each propertyTypes as property}
              <label 
                class="flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50 text-center h-24"
                class:border-blue-600={$leadFormStore.data.propertyType === property.value}
                class:bg-blue-50={$leadFormStore.data.propertyType === property.value}
                class:border-slate-200={$leadFormStore.data.propertyType !== property.value}
              >
                <input 
                  type="radio" 
                  name="propertyType" 
                  value={property.value}
                  bind:group={$leadFormStore.data.propertyType}
                  class="sr-only"
                />
                <span class="font-medium text-slate-900">{property.label}</span>
              </label>
            {/each}
          </div>
        {/if}
        
        <!-- Step 5: Fence Purpose (Multi-select) -->
        {#if $leadFormStore.currentStep === 5}
          <div class="grid grid-cols-2 gap-3" in:slide>
            {#each fencePurposes as purpose}
              <label 
                class="flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50 text-center h-24"
                class:border-blue-600={$leadFormStore.data.fencePurpose?.includes(purpose.value)}
                class:bg-blue-50={$leadFormStore.data.fencePurpose?.includes(purpose.value)}
                class:border-slate-200={!$leadFormStore.data.fencePurpose?.includes(purpose.value)}
              >
                <input 
                  type="checkbox" 
                  value={purpose.value}
                  checked={$leadFormStore.data.fencePurpose?.includes(purpose.value)}
                  on:change={() => leadFormStore.toggleArrayField('fencePurpose', purpose.value)}
                  class="sr-only"
                />
                <span class="font-medium text-slate-900">{purpose.label}</span>
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
              <label 
                class="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50"
                class:border-blue-600={$leadFormStore.data.fenceLength === length.value}
                class:bg-blue-50={$leadFormStore.data.fenceLength === length.value}
                class:border-slate-200={$leadFormStore.data.fenceLength !== length.value}
              >
                <input 
                  type="radio" 
                  name="fenceLength" 
                  value={length.value}
                  bind:group={$leadFormStore.data.fenceLength}
                  class="sr-only"
                />
                <div>
                  <span class="font-medium text-slate-900 block">{length.label}</span>
                  <span class="text-sm text-slate-500">{length.description}</span>
                </div>
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
                  bind:value={$leadFormStore.data.firstName}
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
                  bind:value={$leadFormStore.data.lastName}
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
                bind:value={$leadFormStore.data.email}
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
              <input 
                type="text" 
                bind:value={$leadFormStore.data.streetAddress}
                class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="123 Main Street"
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
                  bind:value={$leadFormStore.data.city}
                  class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  bind:value={$leadFormStore.data.zipCode}
                  class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                bind:value={$leadFormStore.data.additionalDetails}
                rows="4"
                class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell us more about your project, special requirements, or any questions you have..."
              ></textarea>
            </div>
            <label class="flex items-start gap-3">
              <input 
                type="checkbox" 
                bind:checked={$leadFormStore.data.marketingConsent}
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
            class="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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