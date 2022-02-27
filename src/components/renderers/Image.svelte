<script>
    import { page } from "$app/stores";
    import { resolveURL } from "src/components/renderers/ResolveURL";

    export let href = "";
    export let title = undefined;
    export let text = "";

    let file = $page.url.searchParams.get("file");
    const href2 = resolveURL(href, file)
</script>

<img src={href2} {title} alt={text} />
