<script>
    import Treeview from "src/components/Treeview/index.svelte";
    import { BLOGREPO, REPOBRANCH } from "src/constants";

    $: data = undefined;
    $: mdfiles = [];
    $: tree = [];
    $: state = "unloaded";
    $: rateLimitTime = 0;
    const load = async () => {
        try {
            const res = await fetch(
                `https://api.github.com/repos/${BLOGREPO}/git/trees/${REPOBRANCH}?recursive=1`
            );
            data = await res.json();
            if (res.status >= 200 && res.status < 300) {
                state = "loaded";
                for (const node of data.tree) {
                    if (node.path.includes(".md")) {
                        mdfiles.push(node.path);
                    }
                }

                let result = [];
                let level = { result };

                mdfiles.forEach((path) => {
                    path.split("/").reduce((r, label, i, a) => {
                        if (!r[label]) {
                            r[label] = { result: [], link: path };
                            let tmp = { label: label.replace(".md", "") };
                            if (i == a.length - 1) {
                                tmp.link = path;
                            } else {
                                tmp.children = r[label].result;
                            }
                            r.result.push(tmp);
                        }
                        return r[label];
                    }, level);
                });

                tree = result;
            } else if (res.status === 403) {
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
    load();
</script>

<div class="margins">
    {#if state === "ratelimit"}
        <h1>
            You have hit a github rate limit, try again in a {rateLimitTime} minutes
        </h1>
    {/if}
    {#if state === "loaded"}
        <Treeview {tree} />
    {/if}
</div>

<style lang="scss">
    .margins {
        margin-left: 5%;
        margin-right: 5%;
        margin-top: 5%;
    }
</style>
