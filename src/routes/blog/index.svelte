<script>
    import { page } from "$app/stores";
    import SvelteMarkdown from "svelte-markdown";
    import Image from "./renderers/Image.svelte";
    import Link from "src/routes/blog/renderers/Link.svelte";
    import { getBlog } from "src/stores";
    $: file = $page.url.searchParams.get("file");
    const { data, state, rateLimitTime, get } = getBlog();
    $: get(file)
</script>

<div class="margins">
    {#if $state === "ratelimit"}
        <h1>
            You have hit a github rate limit, try again in a {$rateLimitTime} minutes
        </h1>
    {/if}
    <div class="markdown">
        <SvelteMarkdown
            source={$data}
            renderers={{
                image: Image,
                link: Link,
            }}
        />
    </div>
</div>

<style lang="scss">
    .margins {
        margin-left: 5%;
        margin-right: 5%;
        margin-top: 5%;
    }
    :global(*) {
        font-family: "Open Sans";
    }
    :global(img) {
        max-width: 100%;
    }
</style>
