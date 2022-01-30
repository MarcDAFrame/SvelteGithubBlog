<script>
    import { page } from "$app/stores";

    import { resolvePath } from "src/routes/blog/renderers/ResolveURL";

    export let href = "";
    export let title = undefined;

    let file = $page.url.searchParams.get("file");
    const href2 = `/blog?file=${resolvePath(href, file)}`;
</script>

<a href={href2} {title}><slot /></a>
