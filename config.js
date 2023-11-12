import { fileURLToPath } from 'url';
import {dirname, join} from 'path'

const __filename = fileURLToPath(import.meta.url);
let __dirname = dirname(__filename);
let content_out = "public"
if(import.meta.env?.MODE == "production"){
	__dirname = join(__dirname,'../../..')
    content_out = "dist"
}

const config = {
    rootdir: __dirname,
    outDir: "dist",
    content: "content",
    content_out: "public",
    plantuml_server: "https://www.plantuml.com/plantuml/svg",
    kroki_server: "https://kroki.io",
    hashed_assets:true,
    copy_astro:true
}

console.log(config)

export {
    config
}
