import { fileURLToPath } from 'url';
import {dirname} from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
    rootdir: __dirname,
    rel_outdir: "dist",
    outDir: "dist",
    plantuml_server: "https://www.plantuml.com/plantuml/svg"
}

export {
    config
}
