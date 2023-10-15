import {glob} from 'glob'
import { join, sep, basename, dirname, parse } from 'path';
import {promises as fs} from 'fs';
import { check_dir_create,save_json,title_slug } from './utils.js';
import {config} from '../../config.js'
import matter from 'gray-matter';

function get_type(data){
    if(Object.hasOwn("type")){
        return data.type
    }else{
        return "generic"
    }
}

function get_slug(data,path,url_type){
    if(Object.hasOwn(data,"slug")){
        return data.slug
    }else if(Object.hasOwn(data,"title")){
        return title_slug(data.title)
    }else if(url_type == "dir"){
        return basename(dirname(path))
    }else{
        return parse(path).name
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

function get_url(slug,type){
    let url = type === "generic" ? slug : `${type}/${slug}`
    if(!content_urls.has(type)){
        content_urls.set(type,[url])    //create new list
    }else{
        url = get_next_url(url,content_urls.get(type))
        content_urls.get(type).push(url)
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
    let content_entries = []
    for(const file_path  of files_paths){
        const url_type = (file_path.endsWith("readme.md")?"dir":"file")
        const abs_file_path = join(config.rootdir,"content",file_path)
        const text = await fs.readFile(abs_file_path,'utf-8')
        const {content, data} = matter(text)
        const slug = get_slug(data,file_path,url_type)
        let entry       = {
            ...data,
            url_type:   url_type,
            type:       get_type(data),
            slug:       slug,                   //not unique
            url:        get_url(slug,url_type), //unique, fallback appending -1, -2,...
            path:       file_path
        }

        content_entries.push(entry)
    }
    await check_dir_create("gen")
    await save_json(content_entries,"gen/content.json")
}

await save_files()
