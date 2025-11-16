<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/askmaster.css';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/neobrutalismcss@0.6.2/style.min.css" />
	<!-- Fonts: Space Grotesk (headings) and Inter (body) - fallbacks provided -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
</svelte:head>

<slot />
