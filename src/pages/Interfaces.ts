interface GistCardInterface{
    
    name:string,
    time:string,
    dp:string,
    image:string,
    id:string,
   
}

export interface GistInterface{
    name:string,
    time:string,
    dp:string,
    image:string,
    id:string,
    message:any
}

export interface commentInterface{
    name:string,
    time:string,
    dp:string,
    message:any,
    id:string
}

export interface gistExpressionsInterface{
   
      likes:number,
      funny:number,
      hates:number,
      comments:commentInterface[]
    
}
export default  GistCardInterface ;