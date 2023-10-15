import {fromMarkdown} from 'mdast-util-from-markdown'
import {gfmTable} from 'micromark-extension-gfm-table'
import {gfmTableFromMarkdown} from 'mdast-util-gfm-table'
import slugify from 'slugify'
import { get_next_uid } from './utils.js'

function extractText(node){
    const text_list = [];
    
    function traverse(node) {
        if(node.type == "text"){
            text_list.push(node.value)
        }
        if (node.children) {
            for (const child of node.children) {
                traverse(child);
            }
        }
    }
    traverse(node)
    return text_list;
}


function title_slug(title){
  const slug = slugify(title,{lower:true})
  return slug
}

function node_slug(node){
    let text_list = extractText(node);
    text_list = text_list.map((text)=>(text.trim()))
    const text_string = text_list.join('-')
    const slug = slugify(text_string,{lower:true})
    return slug
}

function node_text(node){
  let text_list = extractText(node);
  text_list = text_list.map((text)=>(text.trim()))
  return text_list.join(' ')
}

function md_tree(content){
    const tree = fromMarkdown(content,{
        extensions: [gfmTable()],
        mdastExtensions: [gfmTableFromMarkdown()]
    })
    return tree
}

function extract_headings(node){
    let headings_list = []
    let heading_slug_list = []
    function recursive_headings(node) {
        if (node.type === 'heading') {
            const heading_text = node_text(node)
            const heading_slug = title_slug(heading_text)
            const unique_heading_slug = get_next_uid(heading_slug,heading_slug_list)
            heading_slug_list.push(unique_heading_slug)
            headings_list.push({
                text:heading_text,
                slug:unique_heading_slug,
                depth:node.depth,
                line:node.position.start.line
            })
        }
        if (node.children) {
            for (const child of node.children) {
                recursive_headings(child);
            }
        }
    }
    recursive_headings(node)
    return headings_list
}

export{
    md_tree,
    extract_headings,
    extractText,
    node_slug,
    title_slug,
    node_text
}
