import {collect} from 'content-structure'
import {join} from 'path'

await collect({
    rooturl:join(import.meta.url,"../.."),
    rel_outdir:"../../gen"
})
