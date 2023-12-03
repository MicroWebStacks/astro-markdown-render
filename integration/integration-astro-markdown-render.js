import {set_render_config} from 'astro-markdown-render'

let render_config = {}

async function config_setup({ updateConfig, config, addPageExtension, command }) {
	set_render_config(render_config)
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
