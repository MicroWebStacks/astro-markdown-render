import { defineConfig } from 'astro/config';
import {config} from './config'

export default defineConfig({
    outDir: config.outdir,
});
