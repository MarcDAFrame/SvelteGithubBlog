import { BLOGREPO, REPOBRANCH } from 'src/constants'
import { writable } from 'svelte/store'


type state_t = "unloaded" | "loading" | "loaded" | "error" | "ratelimit"


export const fetchStore = (url) => {
    const state = writable<state_t>('unloaded')
    const data = writable([])

    const get = async () => {
        state.set('loading')
        try {
            const response = await fetch(url)
            data.set(await response.json())
        } catch (e) {
            state.set('error')
        }
        state.set("loaded")
    }

    get()

    return {
        data, state, get
    }
}


export const getBlogs = () => {
    const data = writable([])
    const state = writable<state_t>('unloaded')
    const rateLimitTime = writable(0)

    const get = async () => {
        const res = await fetch(`https://api.github.com/repos/${BLOGREPO}/git/trees/${REPOBRANCH}?recursive=1`)
        const resData = await res.json();
        if (res.status >= 200 && res.status < 300) {
            state.set("loaded");
            let tmpFiles = []
            for (const node of resData.tree) {
                if (node.path.includes(".md")) {
                    tmpFiles.push(node.path);
                }
            }

            let result = [];
            let level = { result };

            tmpFiles.forEach((path) => {
                path.split("/").reduce((r, label, i, a) => {
                    if (!r[label]) {
                        r[label] = { result: [], link: path };
                        let tmp: any = { label: label.replace(".md", "") };
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

            data.set(result)
        } else if (res.status === 403) {
            state.set("ratelimit");
            rateLimitTime.set(Math.round(
                (Number(res.headers.get("x-ratelimit-reset")) * 1000 -
                    new Date().getTime()) /
                1000 /
                60
            ))
        }
    }
    get()


    return { data, state, rateLimitTime, get}
}


export const blogs = getBlogs()

export const getBlog = () => {
    const data = writable("")
    const state = writable<state_t>('unloaded')
    const rateLimitTime = writable(0)
    const get = async (file) => {
        try {
            const res = await fetch(
                `https://api.github.com/repos/${BLOGREPO}/contents/${file}`
            );
            if (res.status >= 200 && res.status < 300) {
                let tmp = await res.json();
                let r2 = await fetch(tmp.download_url);
                const resData = await r2.text();
                data.set(resData)
                state.set("loaded");
            }
            if (res.status === 403) {
                state.set("ratelimit");
                rateLimitTime.set(Math.round(
                    (Number(res.headers.get("x-ratelimit-reset")) * 1000 -
                        new Date().getTime()) /
                        1000 /
                        60
                ))
            }
        } catch (e) {
            console.error(e);
            state.set("error");
        }
    };

    return {data, state, rateLimitTime, get}
}