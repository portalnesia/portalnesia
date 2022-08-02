import slugify,{Options} from './slugify'
import slugTransliterate,{Options as TransliterateOption} from './transliterate'
export type {Options as SlugifyOptions} from './slugify'
export type {Options as TransliterateOption} from './transliterate'
import { nanoid as nanoidOri } from 'nanoid'

export type Without<T,K> = {
    [L in Exclude<keyof T,K>]: T[L]
}
/**
 * Clean text format
 * @param {string} text: text to clean
 * @returns {string} string
 */
export const clean=(text: string): string=>{
    if(typeof text!=='string') return '';
    text=text.replace(/<script[^>]*>([\s\S]*?)<\/script[^>]*>/i, '').replace(/(<([^>]+)>)/ig,""); 
    return text;
}

/**
 * Check is object empty?
 * @param {object} obj object to check
 * @returns {boolean} boolean
 */
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

/**
 * Escape HTML string (& to &amp;)
 * @param {string} text HTML to escape
 * @param {boolean} withQuote if true, quote or double quote not escaped
 * @returns escaped string
 */
export const escapeHTML=(text: string,withQuote: boolean = true): string=>{
    if(typeof text!=='string' || text.match(/\S/) === null) return '';
    let map: {[key: string]: string};
    if(withQuote) {
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

export const stripHTML=(text='')=>{
    if(typeof text!=='string' || text.match(/\S/) === null) return '';
    return text.replace(/<[^>]*>?/gm,'').replace(/\&\#xA0\;/gm,' ');
}

/**
 * Convert special characters to HTML entities
 * @param {string} text String being converted
 * @returns {string} string
 */
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

/**
 * Uppercase the first character of each word in a string
 * @param {string} text Input string
 * @returns {string} string
 */
export const ucwords=function(text: string){
    if(typeof text!=='string') return '';
    const str=text.toLowerCase().replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
    });
    return str;
}

/**
 * convertTextToJsStyles
 * @param {string} text
 * @returns {string} string
 */
export const jsStyles=function(text: string){
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
    return str;
} 

/**
 * Get first characters of each word
 * @param {string} text 
 * @param {number} number max word
 * @returns {string} string
 */
export const firstLetter=function(text: string,number?: number){
    if(typeof text!=='string') return '';
    let str=text.toLowerCase().replace(/\b([a-z])(\S*)/g, function(a,b) {
        return b.toUpperCase();
    }).replace(/\s/g,"");
    if(typeof number==='number') return str.substring(0,number);
    else return str;
} 

/**
 * Convert URL to only domain
 * @param {string} url
 * @returns {string} string
 */
export const urlToDomain=function(url: string): string{
    let parser=new URL((url.match(/http(s)?/)?url:`http://${url}`));
    const parserr=parser.hostname;
    return parserr.replace("www.", "");
}


export const replaceAt=function(text: string,index: number, replacement: string): string {
    return text.substr(0, index) + replacement+ text.substr(index + replacement.length);
};

/**
 * Truncate string
 * @param {string} text string being truncated
 * @param {number} num maximum character
 * @param {string} limit Limit characters
 * @returns {string} string
 */
export const truncate=function(text: string,num: number,limit: string='...'): string {
    if(typeof text!=='string') return '';
    return (text.length <= num)?text:text.slice(0, num) + limit;
};
  
export const splice = function(text: string,idx: number, rem: number, str: string): string {
    if(typeof text!=='string') return '';
    return text.slice(0, idx) + str + text.slice(idx + Math.abs(rem));
};

/**
 * Convert string to slug-url-format
 * @param {string} text 
 * @param {?boolean} lowercase
 * @param {?Options} option 
 * @returns {string} Slugify format
 */
export const slugFormat = function (text: string,lowercase?: boolean,option?: Partial<Without<Options,'lowercase'>>): string {
    const opt: Options = {
        lowercase:lowercase||true,
        ...option
    }
    return slugify(text,opt);
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
  
export const toBlob=(b64Data: string, contentType: string, sliceSize=512): Blob=>{
    contentType = contentType || '';
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

/**
 * Convert byte to kilobyte, megabyte, ...
 * @param {number|null} bytes 
 * @param {number} precision 
 * @returns {string} string
 */
export const number_size=(bytes: number|null|undefined,precision=2): string=>{
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
  
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const SMALL_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Generate random string
 * @param {number} number maximum string being generated
 * @returns {string} string
 */
export const generateRandom=(number=10,lowercase_only=false): string =>{
    let result='';
    const charLength = CHARS.length;
    for (let i = 0; i < number; i++) {
        if(lowercase_only) result += SMALL_CHARS.charAt(Math.floor(Math.random() * charLength))
        else result += CHARS.charAt(Math.floor(Math.random() * charLength))
    }
    return result;
}

export const numberFormat = (angka: string,separate="."): string=>{
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separate);
};

/**
 * Convert second to "time ago" format
 * @param {number} seconds 
 * @returns {string} string
 */
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

export function firstToUpper(text:string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function number_format_short<D={number: number,format: string}>(n: number,precision=1,onlyNumber=false) {
    let number: string="0";
    let suffix: string="";
    // 0 - 900
    if(n < 900) {
        number = n.toString();
    }
    // 0.9k-850k
    else if(n < 900000) {
        number = (n/1000).toFixed(precision);
        suffix = " K"
    }
    // 0.9m-850m
    else if(n < 900000000) {
        number = (n/1000000).toFixed(precision);
        suffix = " M"
    }
    // 0.9b-850b
    else if(n < 900000000000) {
        number = (n/1000000000).toFixed(precision);
        suffix = " B"
    }
    // 0.9t+
    else {
        number = (n/1000000000000).toFixed(precision);
        suffix = " T"
    }
    let result: unknown;
    if(!onlyNumber) {
        result={number:n,format:`${number}${suffix}`}
        return  result as D;
    } else {
        result = number
        return result as D;
    }
}

export function validateEmail(email: string) {
    const regexp=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(regexp.test(email)) return true;
    return false;
}

export function transliterate(string: string, options: TransliterateOption) {
    return slugTransliterate(string,options);
}
export function stripslashes(string: string) {
    return string.replace(/\\/gim,'');
}
/**
 * @deprecated Use {@link nanoid | nanoid} instead
 * @param {String?} text UUID v4
 * @returns {string} UUID
 */
export function uuid(text?: string): string {
  return nanoid();
}
/**
 * Generate UUID
 * @returns {string} UUID
 */
export function nanoid(): string {
  return nanoidOri();
}
export function isTrue(whatToCheck: unknown) {
    if(typeof whatToCheck === 'string' && ['true','1'].indexOf(whatToCheck) > -1) return true;
    if(typeof whatToCheck === 'boolean' && whatToCheck === true) return true;
    if(typeof whatToCheck === 'number' && whatToCheck === 1) return true;
    return false;
}