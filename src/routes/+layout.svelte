<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/askmaster.css';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<!-- Cyberpunk Academic Fonts -->
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=IBM+Plex+Mono:wght@400;700&family=Bebas+Neue&family=Orbitron:wght@400;700&family=Russo+One&display=swap" rel="stylesheet">
</svelte:head>

<slot />
