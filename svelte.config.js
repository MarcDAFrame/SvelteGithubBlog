import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import path from 'path'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		prerender: {
			entries: [
			],
		},
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false
		}),
		vite: {
			resolve: {
				alias: {
					"src" : path.resolve('./src')
				}
			}
		},
		// hydrate the <div id="svelte"> element in src/app.html
		// target: '#svelte'
	}
};

export default config;
