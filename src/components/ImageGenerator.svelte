<script lang="ts">
  let prompt = '';
  let loading = false;
  let error = '';
  let generatedImage: string | null = null;
  let savedImages: string[] = [];

  async function generateImage() {
    if (!prompt.trim()) {
      error = 'Please enter a description';
      return;
    }

    loading = true;
    error = '';
    generatedImage = null;

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          width: 1024,
          height: 1024 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      generatedImage = `data:${data.mimeType};base64,${data.imageData}`;
    } catch (err) {
      error = err instanceof Error ? err.message : 'An error occurred';
    } finally {
      loading = false;
    }
  }

  function saveImage() {
    if (generatedImage) {
      savedImages = [...savedImages, generatedImage];
      // Clear current to generate another
      generatedImage = null;
      prompt = '';
    }
  }

  function downloadImage(dataUrl: string, filename: string) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
  }
</script>

<div class="card bg-base-100 shadow-xl max-w-4xl mx-auto">
  <div class="card-body">
    <h2 class="card-title text-2xl mb-4">AI Image Generator</h2>
    <p class="text-muted-foreground mb-6">
      Generate custom fence images using Google Gemini 3 Pro
    </p>

    <div class="form-control mb-4">
      <label class="label" for="prompt">
        <span class="label-text">Image Description</span>
      </label>
      <textarea
        id="prompt"
        bind:value={prompt}
        class="textarea textarea-bordered h-24"
        placeholder="e.g., Beautiful cedar privacy fence in a suburban backyard with green grass and trees"
      ></textarea>
      <label class="label">
        <span class="label-text-alt">Be specific about style, setting, and details</span>
      </label>
    </div>

    {#if error}
      <div class="alert alert-error mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    {/if}

    <button
      class="btn btn-primary w-full"
      on:click={generateImage}
      disabled={loading}
    >
      {#if loading}
        <span class="loading loading-spinner"></span>
        Generating...
      {:else}
        Generate Image
      {/if}
    </button>

    {#if generatedImage}
      <div class="mt-6">
        <h3 class="font-semibold mb-2">Generated Image:</h3>
        <img 
          src={generatedImage} 
          alt="Generated fence" 
          class="w-full rounded-lg shadow-lg"
        />
        <div class="flex gap-2 mt-4">
          <button class="btn btn-secondary" on:click={saveImage}>
            Save & Generate Another
          </button>
          <button 
            class="btn btn-outline" 
            on:click={() => downloadImage(generatedImage!, 'fence-image.png')}
          >
            Download
          </button>
        </div>
      </div>
    {/if}

    {#if savedImages.length > 0}
      <div class="mt-8">
        <h3 class="font-semibold mb-4">Saved Images ({savedImages.length})</h3>
        <div class="grid grid-cols-2 gap-4">
          {#each savedImages as img, i}
            <div class="relative">
              <img 
                src={img} 
                alt={`Saved fence ${i + 1}`} 
                class="w-full rounded-lg"
              />
              <button 
                class="btn btn-sm btn-primary absolute bottom-2 right-2"
                on:click={() => downloadImage(img, `fence-image-${i + 1}.png`)}
              >
                Download
              </button>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>
