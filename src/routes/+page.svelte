<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Map from '../components/Map.svelte';
  import { writable } from 'svelte/store';
  import type { SelectedCountry } from '../lib/models';

  const selectedCountry = writable<SelectedCountry>({ name: null });
</script>

<Map />