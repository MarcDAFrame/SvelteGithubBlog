<script>
    import Treeview from "src/components/Treeview/index.svelte";
    import { blogs } from "src/stores";

    const {data, rateLimitTime, state, get} = blogs
</script>

<div class="margins">
    {#if $state === "ratelimit"}
        <h1>
            You have hit a github rate limit, try again in a {rateLimitTime} minutes
        </h1>
    {/if}
    {#if $state === "loaded"}
        <Treeview tree={$data} />
    {/if}
</div>

<style lang="scss">
    .margins {
        margin-left: 5%;
        margin-right: 5%;
        margin-top: 5%;
    }
</style>
