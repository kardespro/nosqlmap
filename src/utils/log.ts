import fs from 'fs-extra' 
import path from 'path' 
const output_dir = "output"
interface ISaveLogOptions{
    hostname: String;
    log_text: String;
}

export async function saveLog(options: ISaveLogOptions){
   if(!options.hostname) throw new Error("Hostname invalid")
   return await fs.outputFile(process.cwd() + `/${output_dir}/${options?.hostname}/log.txt`, `\n${options?.log_text}`)
}