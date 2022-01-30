<script context="module">
	// retain module scoped expansion state for each tree node
	const _expansionState = {
		/* treeNodeId: expanded <boolean> */
	};
</script>

<script lang="ts">
	//	import { slide } from 'svelte/transition'

	export let tree: tree_i;
	const { label, children, link } = tree;

	let expanded = _expansionState[label] || false;
	const toggleExpansion = () => {
		expanded = _expansionState[label] = !expanded;
	};
	$: arrowDown = expanded;
</script>

<ul>
	<!-- transition:slide -->
	<li>
		{#if children && children.length > 0}
			<span on:click={toggleExpansion}>
				<!-- <span class="arrow" class:arrowDown>&#x25b6</span> -->
				<img class="arrow" class:arrowDown src="res/icons/arrow.svg"/>
				{label}
			</span>
			{#if expanded}
				{#each children as child}
					<svelte:self tree={child} />
				{/each}
			{/if}
		{:else}
			<a href={`/blog?file=${link}`}>
				<span class="no-arrow" />
				{label}
			</a>
		{/if}
	</li>
</ul>

<style lang="scss">
	ul, a{
		font-size: clamp(10px, 10vw, 60px);
		color: black;
	}
	ul {
		font-family: "Open Sans";
		margin: 0;
		padding-left: clamp(40px, 10vw, 60px);
		list-style: none;
		user-select: none;
		opacity: 1;
		animation-name: fadeInOpacity;
		animation-timing-function: ease-in;
		animation-duration: 0.5s;
	}

	@keyframes fadeInOpacity {
		0% {
			opacity: 0.4;
			transform: translateY(-10px);
		}
		100% {
			opacity: 1;
			transform: translateY(0px);
		}
	}
	// .no-arrow { padding-left: 1.0rem; }
	.arrow {
		height: clamp(10px, 10vw, 45px);
	
		cursor: pointer;
		display: inline-block;
		/* transition: transform 200ms; */
		-webkit-transition: all 0.3s linear;
		-moz-transition: all 0.3s linear;
		-o-transition: all 0.3s linear;
		transition: all 0.3s linear;
		&:hover {
			// font-weight: bold;
			background-color: rgb(243, 240, 240);
			border-radius: 16px;
		}
	}
	.arrowDown {
		transform: rotate(90deg);
	}
	a {
		width: 100%;
		display: block;
		text-decoration: none;
		padding-left: 5px;
		border-radius: 16px;
		&:hover {
			// font-weight: bold;
			background-color: rgb(243, 240, 240);
		}
		&:visited {
			color: black;
		}
	}
</style>
