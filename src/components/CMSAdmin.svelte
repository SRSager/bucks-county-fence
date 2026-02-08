<script lang="ts">
  import { onMount } from 'svelte';
  
  let CMSComponent: any = null;
  let error = '';
  
  onMount(async () => {
    try {
      // Try to load Svelte component version
      const mod = await import('https://unpkg.com/@sveltia/cms@0.130.0/dist/svelte-cms.js');
      CMSComponent = mod.default;
    } catch (e) {
      // Fallback to manual initialization
      error = 'CMS component not available';
      console.error(e);
    }
  });
</script>

<div class="cms-container">
  {#if error}
    <div class="error">
      <p>{error}</p>
      <p>Try visiting the admin page directly or check console for errors.</p>
    </div>
  {:else if CMSComponent}
    <svelte:component this={CMSComponent} 
      backend={{ name: 'github', repo: 'SRSager/bucks-county-fence', branch: 'main' }}
      config={{ media_folder: 'public/uploads', public_folder: '/uploads' }}
    />
  {:else}
    <div class="loading">Loading CMS...</div>
  {/if}
</div>

<style>
  .cms-container {
    min-height: 400px;
  }
  .loading {
    text-align: center;
    padding: 2rem;
    color: #666;
  }
  .error {
    color: #666;
    padding: 2rem;
    text-align: center;
  }
</style>