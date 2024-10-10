<!-- src/components/Map.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { loadAndParseGeojson } from '../lib/geojson_handler';
  import { renderMap } from '../lib/map_renderer';
  import type { Country, VisitStatus } from '../lib/models';
  
  let countries = writable<Country[]>([]);
  let selectedCountry: Country | null = null;
  
  onMount(async () => {
    try {
      const loadedCountries = await loadAndParseGeojson();
      const storedVisitStatuses = JSON.parse(localStorage.getItem('visitStatuses') || '{}');
      
      loadedCountries.forEach(country => {
        country.visitStatus = storedVisitStatuses[country.name] || 'None';
      });
      
      countries.set(loadedCountries);
    } catch (e) {
      console.error("Error loading countries:", e);
    }
  });
  
  function handleCountrySelection(countryName: string) {
    selectedCountry = $countries.find(c => c.name === countryName) || null;
  }
  
  function updateVisitStatus(countryName: string, newStatus: VisitStatus) {
    countries.update(currentCountries => {
      const updatedCountries = currentCountries.map(country => {
        if (country.name === countryName) {
          return { ...country, visitStatus: newStatus };
        }
        return country;
      });
      
      // Update local storage
      const storedVisitStatuses = JSON.parse(localStorage.getItem('visitStatuses') || '{}');
      storedVisitStatuses[countryName] = newStatus;
      localStorage.setItem('visitStatuses', JSON.stringify(storedVisitStatuses));
      
      return updatedCountries;
    });
  }
  
  $: {
    if (selectedCountry) {
      selectedCountry = $countries.find(c => c.name === selectedCountry?.name) || null;
    }
  }
  </script>
  
  <div class="map-container">
    <div class="country-info">
      {#if selectedCountry}
        <h2>{selectedCountry.name}</h2>
        <p>Region: {selectedCountry.region}</p>
        <p>Subregion: {selectedCountry.subregion}</p>
        <div class="visit-status-toggle">
          <button
            class={selectedCountry.visitStatus === 'Been' ? 'active' : ''}
            on:click={() => (selectedCountry) ? updateVisitStatus(selectedCountry.name, 'Been') : ''}
          >
            Been
          </button>
          <button
            class={selectedCountry.visitStatus === 'Want' ? 'active' : ''}
            on:click={() => (selectedCountry) ? updateVisitStatus(selectedCountry.name, 'Want') : ''}
          >
            Want
          </button>
          <button
            class={selectedCountry.visitStatus === 'Lived' ? 'active' : ''}
            on:click={() => (selectedCountry) ? updateVisitStatus(selectedCountry.name, 'Lived'): ''}
          >
            Lived
          </button>
          <button
            class={selectedCountry.visitStatus === 'None' ? 'active' : ''}
            on:click={() => (selectedCountry) ? updateVisitStatus(selectedCountry.name, 'None') : ''}
          >
            None
          </button>
        </div>
      {:else}
        <p>Select a country on the map</p>
      {/if}
    </div>
  
    <div class="map" aria-label="Interactive map of countries">
      {@html renderMap($countries, selectedCountry, handleCountrySelection)}
    </div>
  </div>
  
  <style>
    .map-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
    }
  
    .country-info {
      background-color: var(--bg-secondary);
      border-radius: 10px;
      padding: 1rem;
      margin-bottom: 1rem;
      width: 100%;
      box-shadow: 0 0 10px rgba(15, 52, 96, 0.5);
    }
  
    .country-info h2 {
      color: var(--accent-1);
      margin-bottom: 0.5rem;
    }
  
    .country-info p {
      color: var(--text-secondary);
      margin: 0.25rem 0;
    }
  
    .visit-status-toggle {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
    }
  
    .visit-status-toggle button {
      padding: 5px 10px;
      border: 1px solid #ccc;
      background-color: #f0f0f0;
      cursor: pointer;
      transition: background-color 0.3s, color 0.3s;
    }
  
    .visit-status-toggle button.active {
      background-color: #007bff;
      color: white;
    }
  
    .map {
      width: 100%;
      height: 600px;
      background-color: var(--bg-secondary);
      border-radius: 15px;
      box-shadow: 0 0 20px rgba(233, 69, 96, 0.2);
      overflow: hidden;
    }
  
    :global(svg) {
      width: 100%;
      height: 100%;
    }
  
    :global(path) {
      transition: fill 0.3s ease;
    }
  
    :global(path:hover) {
      fill: var(--color-primary) !important;
      cursor: pointer;
    }
  
    :global(path.selected) {
      stroke: var(--accent-1);
      stroke-width: 2px;
    }
  </style>