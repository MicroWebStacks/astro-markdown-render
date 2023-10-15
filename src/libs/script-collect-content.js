import {glob} from 'glob'
import { join, sep, basename, dirname, parse } from 'path';
import {promises as fs} from 'fs';
import { check_dir_create,save_json,title_slug } from './utils.js';
import {config} from '../../config.js'
import matter from 'gray-matter';

function get_type(entry){
    if(Object.hasOwn("type")){
        return entry.type
    }else{
        return "generic"
    }
}

function get_slug(entry){
    if(Object.hasOwn(entry,"slug")){
        return entry.slug
    }else if(Object.hasOwn(entry,"title")){
        return title_slug(entry.title)
    }else if(entry.url_type == "dir"){
        return basename(dirname(entry.path))
    }else{
        return parse(entry.path).name
    }
}

function get_next_url(url,url_list){
    let counter = 1;
    let newUrl = url;
    
    while (url_list.includes(newUrl)) {
        counter++;
        newUrl = `${url}-${counter}`;
    }

    return newUrl;
}

let content_urls = new Map()

function get_url(entry){
    let url = entry.type === "generic" ? entry.slug : `${entry.type}/${entry.slug}`
    if(!content_urls.has(entry.type)){
        content_urls.set(entry.type,[url])    //create new list
    }else{
        url = get_next_url(url,content_urls.get(entry.type))
        content_urls.get(entry.type).push(url)
    }
    return url
}


async function get_all_md_files(){
    const content_dir = join(config.rootdir,'content');
    process.chdir(content_dir)
    const results = await glob(content_dir+"/**/*.md")
    const files = results.map((file)=>(file.split(sep).join('/')))
    return files
}

async function save_files(){
    const files_paths = await get_all_md_files()
    console.log(files_paths)
    console.log(`files_paths.length = ${files_paths.length}`)
    let content_entries = []
    let content_entries_map = {}
    for(let id=0;id<files_paths.length;id++){
        const file_path = files_paths[id]
        const abs_file_path = join(config.rootdir,"content",file_path)
        console.log("----")
        console.log(id+1)
        console.log(file_path)
        console.log(abs_file_path)
        const text = await fs.readFile(abs_file_path,'utf-8')
        const {content, data} = matter(text)
        let entry       = data
        entry.id        = id+1
        entry.url_type  = (file_path.endsWith("readme.md")?"dir":"file")
        entry.type      = get_type(entry)
        entry.slug      = get_slug(entry)   //not unique
        console.log(`slug = ${entry.slug}`)
        entry.url       = get_url(entry)    //unique, fallback appending -1, -2,...
        console.log(`url = ${entry.url}`)
        entry.path      = file_path
        console.log(`path = ${entry.path}`)
        content_entries.push(entry)
        console.log(entry)
        content_entries_map[id+1] = entry
    }
    console.log(content_entries.length)
    await check_dir_create("gen")
    await save_json(content_entries,"gen/content.json")
    await save_json(content_entries_map,"gen/content_map.json")
}

await save_files()
