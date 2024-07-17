import fs from 'fs' 
import path from 'path' 
const output_dir = "output"
interface ISaveLogOptions{
    hostname: String;
    log_text: String;
}

export async function saveLog(options: ISaveLogOptions){
   if(!options.hostname) throw new Error("Hostname invalid")
   return await fs.appendFileSync(process.cwd() + `/${output_dir}/${options?.hostname}/log.txt`, `${options?.log_text}`)
}