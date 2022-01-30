<script>
    import { page } from "$app/stores";
    import SvelteMarkdown from "svelte-markdown";
    import Image from "./renderers/Image.svelte";
    import { BLOGREPO } from "src/constants";
    import Link from "src/routes/blog/renderers/Link.svelte";
    $: file = $page.url.searchParams.get("file");

    $: state = "unloaded";
    $: data = undefined;
    $: rateLimitTime = 0;
    const load = async (file) => {
        try {
            const res = await fetch(
                `https://api.github.com/repos/${BLOGREPO}/contents/${file}`
            );
            if (res.status >= 200 && res.status < 300) {
                let tmp = await res.json();
                let r2 = await fetch(tmp.download_url);
                data = await r2.text();
                state = "loaded";
            }
            if (res.status === 403) {
                state = "ratelimit";
                rateLimitTime = Math.round(
                    (Number(res.headers.get("x-ratelimit-reset")) * 1000 -
                        new Date().getTime()) /
                        1000 /
                        60
                );
            }
        } catch (e) {
            console.error(e);
            state = "error";
        }
    };
    $: load(file);
</script>

<div class="margins">
    {#if state === "ratelimit"}
        <h1>
            You have hit a github rate limit, try again in a {rateLimitTime} minutes
        </h1>
    {/if}
    <div class="markdown">
        <SvelteMarkdown
            source={data}
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
