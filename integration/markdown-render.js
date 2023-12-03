import {set_config} from '../config.js'

let render_config = {}

async function config_setup({ updateConfig, config, addPageExtension, command }) {
	console.log(`markdown-render integration> ${command}`)
	set_config(render_config)
}

function markdown_render(options){
	render_config = options
	return {
		name: 'generate_menu',
		hooks: {
			'astro:config:setup': config_setup
		},
	};
}

export{
	markdown_render
}
