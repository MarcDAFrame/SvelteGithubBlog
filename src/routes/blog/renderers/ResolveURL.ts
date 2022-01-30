import { page } from "$app/stores";
import { BLOGREPO, REPOBRANCH } from "src/constants";

const join = (...args: string[]) => {
    // Split the inputs into a list of path commands.
    var parts = [];
    for (var i = 0, l = args.length; i < l; i++) {
      parts = parts.concat(args[i].split("/"));
    }
    // Interpret the path commands to get the new resolved path.
    var newParts = [];
    for (i = 0, l = parts.length; i < l; i++) {
      var part = parts[i];
      // Remove leading and trailing slashes
      // Also remove "." segments
      if (!part || part === ".") continue;
      // Interpret ".." to pop the last segment
      if (part === "..") newParts.pop();
      // Push new path segments.
      else newParts.push(part);
    }
    // Preserve the initial slash if there was one.
    if (parts[0] === "") newParts.unshift("");
    // Turn back into a single string path.
    return newParts.join("/") || (newParts.length ? "/" : ".");
  }

export const resolveURL = (href: string, file: string) => {
    let href2 = ''
    if(href.includes('http')){
        href2 = href
    }else{
        let base = file.split('/').slice(0, -1).join('/')
        let url = `https://raw.githubusercontent.com/${BLOGREPO}/${REPOBRANCH}/${base}/`
        href2 = new URL(href, url).href
    }
    return href2
}

export const resolvePath = (href: string, file: string) => {
    let href2 = ''
    if(href.includes('http')){
        href2 = href
    }else{
        let base = file.split('/').slice(0, -1).join('/')
        href2 = `${join(base, href)}`
    }
    return href2.slice(1)
}