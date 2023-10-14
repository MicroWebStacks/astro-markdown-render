import slugify from 'slugify'

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



function node_slug(node){
    let text_list = extractText(node);
    text_list = text_list.map((text)=>(text.trim()))
    const text_string = text_list.join('-')
    const slug = slugify(text_string,{lower:true})
    return slug
}

export{
    extractText,
    node_slug
}
