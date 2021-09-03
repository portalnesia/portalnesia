export const clean=(text: string): string=>{
    if(typeof text!=='string') return '';
    text=text.replace(/<script[^>]*>([\s\S]*?)<\/script[^>]*>/i, '').replace(/(<([^>]+)>)/ig,""); 
    return text;
}
  
export const isEmptyObj=(obj: object): boolean=>{
    for(let key in obj) {
        if(obj.hasOwnProperty(key)) return false;
    }
    return true;
}
  
export const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
]
  
export const monthNamesEn=["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
export const escapeHTML=(text: string,withQuote: boolean): string=>{
    if(typeof text!=='string' || text.match(/\S/) === null) return '';
    let map: {[key: string]: string};
    const quote=withQuote||true;
    if(quote) {
      map  = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
    } else {
      map  = {
        '&': '&',
        '<': '&lt;',
        '>': '&gt;',
        '"': '"',
        "'": "'"
      };
    }
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
  
export const specialHTML=(text: string): string=>{
    if(typeof text!=='string' || text.match(/\S/) === null) return '';
    const map: {[key: string]: string} = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      "&#039;": "'",
      "&nbsp;":" "
    };
    return text.replace(/(\&amp\;|\&lt\;|\&gt\;|\&quot\;|\&\#039\;|\&nbsp\;)/g, function(m){return map[m]});
}
  
export const parseURL=(url: string): string=>{
    if(typeof url!=='string') return '';
    const parser=new URL((url.match(/http(s)?/)?url:`http://${url}`));
    const parserr=`${parser.hostname}${parser.pathname}${parser.search}`;
    return parserr.replace("www.", "");
}
  
export const ucwords=function(text: string,func?: (str: string)=>void){
    if(typeof text!=='string') return '';
    const str=text.toLowerCase().replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
    });
    if(typeof func === 'function') return func(str);
    else return str;
}
  
export const jsStyles=function(text: string,func?: (str: string)=>void){
    if(typeof text!=='string') return '';
    let str=text.toLowerCase();
    const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;-";
    const to   = "aaaaeeeeiiiioooouuuunc       ";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    str = str.replace(/\./g," ")
    str=str.replace(/\b[a-z]/g, function(p1) {
        return p1.toUpperCase()
    });
    str=str.replace(/^\b[A-Z]/g, function(p1) {
        return p1.toLowerCase()
    });
    str=str.replace(/\s/g,"")
    if(typeof func === 'function') return func(str);
    else return str;
} 
  
export const firstLetter=function(text: string,number?: number,func?: (str: string)=>void){
    if(typeof text!=='string') return '';
    let str=text.toLowerCase().replace(/\b([a-z])(\S*)/g, function(a,b) {
        return b.toUpperCase();
    }).replace(/\s/g,"");
    if(typeof number==='number') str=str.substring(0,number);
    if(typeof func === 'function') return func(str);
    else return str;
} 
  
export const urlToDomain=function(url: string): string{
    let parser=new URL((url.match(/http(s)?/)?url:`http://${url}`));
    const parserr=parser.hostname;
    return parserr.replace("www.", "");
}
  
export const replaceAt=function(text: string,index: number, replacement: string): string {
    return text.substr(0, index) + replacement+ text.substr(index + replacement.length);
};
  
export const truncate=function(text: string,num: number): string {
    if(typeof text!=='string') return '';
    return (text.length <= num)?text:text.slice(0, num) + '...';
};
  
export const splice = function(text: string,idx: number, rem: number, str: string): string {
    if(typeof text!=='string') return '';
    return text.slice(0, idx) + str + text.slice(idx + Math.abs(rem));
};
  
export const slugFormat = function (text: string,func?: (result: string)=>void,lowercase?: boolean): string|void {
    if(typeof text!=='string') return '';
    lowercase=typeof lowercase==='boolean'&&lowercase===true;
    let str: string,t=text;
    str = lowercase ? t.toLowerCase() : t;
        
    const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    const to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    const res=str.replace(/^(-|\s| )]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
    if(typeof func === 'function') return func(res);
    else return res
};
  
export async function copyTextBrowser(text: string){
    if(typeof window !== 'undefined') {
        const el = document.createElement('textarea');
        el.setAttribute('readonly', '');
        el.style.position='absolute';
        el.style.left='-9999px';
        document.body.appendChild(el);
        el.value = text.toString();
        el.textContent = text.toString();
        el.select();
        const sel = window.getSelection();
        const range = document.createRange();
        range.selectNode(el);
        if(sel!==null) {
            sel.removeAllRanges();
            sel.addRange(range);
            if(document.execCommand('copy')){
                document.body.removeChild(el);
                return Promise.resolve();
            }
        }
        throw new Error("Window.getSelection error");
    }
};
  
export const toBlob=(b64Data: string, contentType: string, sliceSize?: number): Blob=>{
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    const byteCharacters = atob(b64Data);
    const byteArrays: Array<Uint8Array> = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
};
  
export const number_size=(bytes: number|null|undefined,precision: number): string=>{
    precision = precision || 2;
    if(typeof bytes !== 'number' || bytes===0 || bytes===null) return '-';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    bytes=Math.max(bytes,0);
    let pow = Math.floor((bytes ? Math.log(bytes) : 0) / Math.log(1024));
    pow = Math.min(pow, units.length - 1);
    bytes /= Math.pow(1024, pow);
    const factorOfTen = Math.pow(10, precision)
    const parsed=Math.round(bytes * factorOfTen) / factorOfTen
    //const parsed=Number(Math.round(bytes + "e" + decimalPlaces) + "e-" + precision)
    return parsed+' '+units[pow];
}
  
export const generateRandom=(): string=>{
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
  
export const numberFormat = (angka: string,separate: string): string=>{
    separate=separate||".";
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separate);
};
  
export const time_ago=(seconds: number): string=>{
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
        return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes ago";
    }
    return "less minutes ago";
}
  
export const insertElementAfter=(newNode: HTMLElement,referenceNode: HTMLElement)=>{
    referenceNode.parentNode?.insertBefore(newNode,referenceNode.nextSibling)
}
  
export const acronym=(text: string,len: number = 2)=>{
    let a: string='';
    const aa = text.split(/\s/);
    for(let i=0;i< aa.length && i<len;i++){
        a+=aa[i].charAt(0).toUpperCase();
    }
    return a;
}
  
export const separateNumber=(angka: number)=>{
    try {
        if(angka==0) return '0';
        const num = angka.toString().split(".")
        num[0] = num[0].replace(/\B(?=(\d{3})+(?!\d))/g,",")
        return num.join(".")
    } catch(err) {
        return '0';
    }
}
  
export const addslashes=(str:string)=>{
    return (str + '')
    .replace(/[\\"']/g, '\\$&')
    .replace(/\u0000/g, '\\0')
}
  
export const adddesc=(str:string)=>str.replace(/\s+/,' ').replace('"','\"')

export function listToMatrix(list: never[], elementsPerSubArray: number) {
    var matrix: any[] = [], i, k;

    for (i = 0, k = -1; i < list.length; i++) {
        if (i % elementsPerSubArray === 0) {
            k++;
            matrix[k] = [];
        }

        matrix[k].push(list[i]);
    }

    return matrix;
}

export const extractMeta=(file: string)=>{
    const fileName = file.split("/").pop();
    const files = fileName||file
    const match = /\.(\w+)$/.exec(files);
    return {name:fileName,match}
}

export const randomInt=(total=2)=>Math.floor(Math.random() * total);

export const isURL=(url:string)=>{
    const exp = /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/ig
    return (url.match(exp) !== null);
}
export const isTwitterURL=(url:string)=>{
    return (url.trim().match(/twitter\.com/)!==null);
}