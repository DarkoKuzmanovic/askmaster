<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/askmaster.css';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/neobrutalismcss@0.6.2/style.min.css" />
	<!-- Fonts: Funnel Sans (headings) and Google Sans Code (body) - fallbacks provided -->
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Funnel+Sans:wght@700&family=Google+Sans+Code:wght@400;700&display=swap" rel="stylesheet">

</svelte:head>

<slot />
