<script lang="ts">
    import Tree from './Tree.svelte'

    export let tree: tree_i[]
</script>

{#each tree as t}
    <Tree tree={t}/>
{/each}

