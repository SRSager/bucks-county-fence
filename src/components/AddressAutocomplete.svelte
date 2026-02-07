<script lang="ts">
  /// <reference types="google.maps" />
  import { onMount, onDestroy } from 'svelte';

  export let streetValue = '';
  export let cityValue = '';
  export let zipValue = '';
  export let onAddressSelect: (street: string, city: string, zip: string) => void;

  let containerElement: HTMLDivElement;
  let isApiLoaded = false;
  let errorMessage = '';
  let isLoading = false;

  onMount(async () => {
    await loadGooglePlacesApi();
  });

  onDestroy(() => {
    // Cleanup is handled automatically by the web component
  });

  async function loadGooglePlacesApi(): Promise<void> {
    try {
      isLoading = true;

      // Check if already loaded
      if (typeof google !== 'undefined' && google.maps?.places) {
        console.log('Google Places API already loaded');
        initializeAutocomplete();
        return;
      }

      // Load the Google Maps Places API with new Place Autocomplete Element
      const apiKey = import.meta.env.PUBLIC_GOOGLE_PLACES_API_KEY || '';

      if (!apiKey) {
        errorMessage = 'Google Places API key not configured';
        console.error('No API key found');
        return;
      }

      console.log('Loading Google Places API with PlaceAutocompleteElement...');

      // Load the main Google Maps API - PlaceAutocompleteElement is included
      await new Promise<void>((resolve, reject) => {
        const apiKey = import.meta.env.PUBLIC_GOOGLE_PLACES_API_KEY || '';
        console.log('API Key present:', apiKey ? 'yes (' + apiKey.substring(0, 10) + '...)' : 'no');
        
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          console.log('Google Places API script loaded, waiting for Places module...');
          // Wait for Places library to be available (it loads asynchronously)
          const checkPlaces = () => {
            if (window.google?.maps?.places) {
              console.log('Places module now available');
              resolve();
            } else {
              setTimeout(checkPlaces, 100);
            }
          };
          checkPlaces();
        };
        script.onerror = () => {
          console.error('Failed to load Google Places API script');
          reject(new Error('Failed to load Google Places API'));
        };
        document.head.appendChild(script);
      });

      isApiLoaded = true;
      initializeAutocomplete();
    } catch (error) {
      console.error('Error loading Google Places API:', error);
      errorMessage = 'Failed to load address suggestions';
    } finally {
      isLoading = false;
    }
  }

  function initializeAutocomplete(): void {
    if (!containerElement) {
      console.error('Container element not found');
      return;
    }

    console.log('Checking Google availability...');
    console.log('google:', typeof google, google);
    console.log('google.maps:', typeof google?.maps, google?.maps);
    console.log('google.maps.places:', typeof google?.maps?.places, google?.maps?.places);

    if (!window.google?.maps?.places) {
      console.error('Google Places not available');
      console.error('Available google.maps:', google?.maps ? Object.keys(google.maps) : 'undefined');
      errorMessage = 'Address suggestions unavailable';
      return;
    }

    try {
      console.log('Initializing PlaceAutocompleteElement...');
      console.log('customElements available:', customElements);

      // Check if PlaceAutocompleteElement is available
      if (!customElements.get('place-autocomplete-element')) {
        console.warn('PlaceAutocompleteElement not registered, falling back to legacy Autocomplete');
        // Fall back to legacy Autocomplete
        initializeLegacyAutocomplete();
        return;
      }

      // Create the Place Autocomplete Element
      const autocompleteElement = document.createElement('place-autocomplete-element') as google.maps.places.PlaceAutocompleteElement;
      
      // Configure options
      autocompleteElement.setAttribute('options', JSON.stringify({
        types: ['address'],
        componentRestrictions: {
          country: 'us',
        },
        fields: ['address_components', 'formatted_address'],
      }));

      // Listen for place changes
      autocompleteElement.addEventListener('place-changed', () => {
        const place = autocompleteElement.place as google.maps.places.PlaceResult;
        
        if (!place.address_components || place.address_components.length === 0) {
          console.warn('No address components in selected place');
          return;
        }

        let street = '';
        let city = '';
        let zip = '';

        for (const component of place.address_components) {
          const types = component.types;

          if (types.includes('street_number')) {
            street = component.long_name + ' ' + street;
          }

          if (types.includes('route')) {
            street += component.long_name;
          }

          if (types.includes('locality')) {
            city = component.long_name;
          }

          if (types.includes('postal_code')) {
            zip = component.long_name;
          }
        }

        street = street.trim();
        streetValue = street;
        cityValue = city;
        zipValue = zip;

        console.log('Address parsed:', { street, city, zip });
        onAddressSelect(street, city, zip);
      });

      // Clear container and append new element
      containerElement.innerHTML = '';
      containerElement.appendChild(autocompleteElement);

      isApiLoaded = true;
      errorMessage = '';
      console.log('PlaceAutocompleteElement initialized successfully');
    } catch (error) {
      console.error('Error initializing autocomplete:', error);
      errorMessage = 'Address suggestions unavailable';
    }
  }

  function initializeLegacyAutocomplete(): void {
    if (!containerElement) {
      console.error('Container element not found');
      return;
    }

    if (!window.google?.maps?.places) {
      console.error('Google Places not available');
      errorMessage = 'Address suggestions unavailable';
      return;
    }

    try {
      console.log('Initializing legacy Autocomplete...');

      // Create a regular input element
      const inputElement = document.createElement('input');
      inputElement.type = 'text';
      inputElement.className = 'w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500';
      inputElement.placeholder = '123 Main Street';
      inputElement.autocomplete = 'off';

      // Clear container and append input
      containerElement.innerHTML = '';
      containerElement.appendChild(inputElement);

      // Create legacy Autocomplete
      const autocomplete = new google.maps.places.Autocomplete(inputElement, {
        types: ['address'],
        componentRestrictions: {
          country: 'us',
        },
        fields: ['address_components', 'formatted_address'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();

        if (!place.address_components || place.address_components.length === 0) {
          console.warn('No address components in selected place');
          return;
        }

        let street = '';
        let city = '';
        let zip = '';

        for (const component of place.address_components) {
          const types = component.types;

          if (types.includes('street_number')) {
            street = component.long_name + ' ' + street;
          }

          if (types.includes('route')) {
            street += component.long_name;
          }

          if (types.includes('locality')) {
            city = component.long_name;
          }

          if (types.includes('postal_code')) {
            zip = component.long_name;
          }
        }

        street = street.trim();
        streetValue = street;
        cityValue = city;
        zipValue = zip;

        console.log('Address parsed:', { street, city, zip });
        onAddressSelect(street, city, zip);
      });

      isApiLoaded = true;
      errorMessage = '';
      console.log('Legacy Autocomplete initialized successfully');
    } catch (error) {
      console.error('Error initializing legacy autocomplete:', error);
      errorMessage = 'Address suggestions unavailable';
    }
  }

  function handleInput(e: Event): void {
    const target = e.target as HTMLInputElement;
    streetValue = target.value;
    onAddressSelect(streetValue, cityValue, zipValue);
  }
</script>

<style>
  :global(place-autocomplete-element) {
    width: 100%;
  }

  :global(place-autocomplete-element input) {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #cbd5e1;
    border-radius: 0.5rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #1e293b;
    background-color: #fff;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }

  :global(place-autocomplete-element input:focus) {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
  }

  :global(place-autocomplete-element input::placeholder) {
    color: #94a3b8;
  }
</style>

<div class="relative">
  <!-- Place Autocomplete Element container -->
  <div
    bind:this={containerElement}
    class="w-full"
  ></div>

  {#if isLoading}
    <div class="absolute right-3 top-1/2 -translate-y-1/2">
      <svg class="w-5 h-5 text-amber-500 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  {:else if isApiLoaded}
    <div class="absolute right-3 top-1/2 -translate-y-1/2">
      <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </div>
  {/if}
  {#if errorMessage}
    <p class="text-amber-600 text-xs mt-1">{errorMessage}</p>
  {/if}
</div>