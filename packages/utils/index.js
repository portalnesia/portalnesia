"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTwitterURL = exports.isURL = exports.randomInt = exports.extractMeta = exports.listToMatrix = exports.adddesc = exports.addslashes = exports.separateNumber = exports.acronym = exports.insertElementAfter = exports.time_ago = exports.numberFormat = exports.generateRandom = exports.number_size = exports.toBlob = exports.copyTextBrowser = exports.slugFormat = exports.splice = exports.truncate = exports.replaceAt = exports.urlToDomain = exports.firstLetter = exports.jsStyles = exports.ucwords = exports.parseURL = exports.specialHTML = exports.stripHTML = exports.escapeHTML = exports.monthNamesEn = exports.monthNames = exports.isEmptyObj = exports.clean = void 0;
/**
 * Clean text format
 * @param text: text to clean
 * @returns string
 */
const clean = (text) => {
    if (typeof text !== 'string')
        return '';
    text = text.replace(/<script[^>]*>([\s\S]*?)<\/script[^>]*>/i, '').replace(/(<([^>]+)>)/ig, "");
    return text;
};
exports.clean = clean;
/**
 * Check is object empty?
 * @param obj objeck to check
 * @returns boolean
 */
const isEmptyObj = (obj) => {
    for (let key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
};
exports.isEmptyObj = isEmptyObj;
exports.monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];
exports.monthNamesEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
/**
 * Escape HTML string (& to &amp;)
 * @param text HTML to escape
 * @param withQuote if true, quote or double quote not escaped
 * @returns escaped string
 */
const escapeHTML = (text, withQuote) => {
    if (typeof text !== 'string' || text.match(/\S/) === null)
        return '';
    let map;
    const quote = withQuote || true;
    if (quote) {
        map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
    }
    else {
        map = {
            '&': '&',
            '<': '&lt;',
            '>': '&gt;',
            '"': '"',
            "'": "'"
        };
    }
    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
};
exports.escapeHTML = escapeHTML;
const stripHTML = (text = '') => {
    if (typeof text !== 'string' || text.match(/\S/) === null)
        return '';
    return text.replace(/<[^>]*>?/gm, '').replace(/\&\#xA0\;/gm, ' ');
};
exports.stripHTML = stripHTML;
/**
 * Convert special characters to HTML entities
 * @param text String being converted
 * @returns string
 */
const specialHTML = (text) => {
    if (typeof text !== 'string' || text.match(/\S/) === null)
        return '';
    const map = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        "&#039;": "'",
        "&nbsp;": " "
    };
    return text.replace(/(\&amp\;|\&lt\;|\&gt\;|\&quot\;|\&\#039\;|\&nbsp\;)/g, function (m) { return map[m]; });
};
exports.specialHTML = specialHTML;
const parseURL = (url) => {
    if (typeof url !== 'string')
        return '';
    const parser = new URL((url.match(/http(s)?/) ? url : `http://${url}`));
    const parserr = `${parser.hostname}${parser.pathname}${parser.search}`;
    return parserr.replace("www.", "");
};
exports.parseURL = parseURL;
/**
 * Uppercase the first character of each word in a string
 * @param text Input string
 * @param func if set, invoke function after text being converted
 * @returns string|void
 */
const ucwords = function (text, func) {
    if (typeof text !== 'string')
        return '';
    const str = text.toLowerCase().replace(/\b[a-z]/g, function (letter) {
        return letter.toUpperCase();
    });
    if (typeof func === 'function')
        return func(str);
    else
        return str;
};
exports.ucwords = ucwords;
/**
 * convertTextToJsStyles
 * @param text
 * @param func if set, invoke function after text being converted
 * @returns string|void
 */
const jsStyles = function (text, func) {
    if (typeof text !== 'string')
        return '';
    let str = text.toLowerCase();
    const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;-";
    const to = "aaaaeeeeiiiioooouuuunc       ";
    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    str = str.replace(/\./g, " ");
    str = str.replace(/\b[a-z]/g, function (p1) {
        return p1.toUpperCase();
    });
    str = str.replace(/^\b[A-Z]/g, function (p1) {
        return p1.toLowerCase();
    });
    str = str.replace(/\s/g, "");
    if (typeof func === 'function')
        return func(str);
    else
        return str;
};
exports.jsStyles = jsStyles;
/**
 * Get first characters of each word
 * @param text
 * @param number max word
 * @param func
 * @returns
 */
const firstLetter = function (text, number, func) {
    if (typeof text !== 'string')
        return '';
    let str = text.toLowerCase().replace(/\b([a-z])(\S*)/g, function (a, b) {
        return b.toUpperCase();
    }).replace(/\s/g, "");
    if (typeof number === 'number')
        str = str.substring(0, number);
    if (typeof func === 'function')
        return func(str);
    else
        return str;
};
exports.firstLetter = firstLetter;
/**
 * Convert URL to only domain
 * @param url
 * @returns
 */
const urlToDomain = function (url) {
    let parser = new URL((url.match(/http(s)?/) ? url : `http://${url}`));
    const parserr = parser.hostname;
    return parserr.replace("www.", "");
};
exports.urlToDomain = urlToDomain;
const replaceAt = function (text, index, replacement) {
    return text.substr(0, index) + replacement + text.substr(index + replacement.length);
};
exports.replaceAt = replaceAt;
/**
 * Truncate string
 * @param text string being truncated
 * @param num maximum character
 * @returns string
 */
const truncate = function (text, num) {
    if (typeof text !== 'string')
        return '';
    return (text.length <= num) ? text : text.slice(0, num) + '...';
};
exports.truncate = truncate;
const splice = function (text, idx, rem, str) {
    if (typeof text !== 'string')
        return '';
    return text.slice(0, idx) + str + text.slice(idx + Math.abs(rem));
};
exports.splice = splice;
/**
 * Convert string to slug-url-format
 * @param text
 * @param func
 * @param lowercase
 * @returns
 */
const slugFormat = function (text, func, lowercase) {
    if (typeof text !== 'string')
        return '';
    lowercase = typeof lowercase === 'boolean' && lowercase === true;
    let str, t = text;
    str = lowercase ? t.toLowerCase() : t;
    const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    const to = "aaaaeeeeiiiioooouuuunc------";
    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    const res = str.replace(/^(-|\s| )]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
    if (typeof func === 'function')
        return func(res);
    else
        return res;
};
exports.slugFormat = slugFormat;
function copyTextBrowser(text) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof window !== 'undefined') {
            const el = document.createElement('textarea');
            el.setAttribute('readonly', '');
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            document.body.appendChild(el);
            el.value = text.toString();
            el.textContent = text.toString();
            el.select();
            const sel = window.getSelection();
            const range = document.createRange();
            range.selectNode(el);
            if (sel !== null) {
                sel.removeAllRanges();
                sel.addRange(range);
                if (document.execCommand('copy')) {
                    document.body.removeChild(el);
                    return Promise.resolve();
                }
            }
            throw new Error("Window.getSelection error");
        }
    });
}
exports.copyTextBrowser = copyTextBrowser;
;
const toBlob = (b64Data, contentType, sliceSize = 512) => {
    contentType = contentType || '';
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
};
exports.toBlob = toBlob;
/**
 * Convert byte to kilobyte, megabyte, ...
 * @param bytes
 * @param precision
 * @returns
 */
const number_size = (bytes, precision = 2) => {
    if (typeof bytes !== 'number' || bytes === 0 || bytes === null)
        return '-';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    bytes = Math.max(bytes, 0);
    let pow = Math.floor((bytes ? Math.log(bytes) : 0) / Math.log(1024));
    pow = Math.min(pow, units.length - 1);
    bytes /= Math.pow(1024, pow);
    const factorOfTen = Math.pow(10, precision);
    const parsed = Math.round(bytes * factorOfTen) / factorOfTen;
    //const parsed=Number(Math.round(bytes + "e" + decimalPlaces) + "e-" + precision)
    return parsed + ' ' + units[pow];
};
exports.number_size = number_size;
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
/**
 * Generate random string
 * @param number maximum string being generated
 * @returns
 */
const generateRandom = (number = 10) => {
    let result = '';
    const charLength = CHARS.length;
    for (let i = 0; i < number; i++) {
        result += CHARS.charAt(Math.floor(Math.random() * charLength));
    }
    return result;
};
exports.generateRandom = generateRandom;
const numberFormat = (angka, separate = ".") => {
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separate);
};
exports.numberFormat = numberFormat;
/**
 * Convert second to "time ago" format
 * @param seconds
 * @returns
 */
const time_ago = (seconds) => {
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
};
exports.time_ago = time_ago;
const insertElementAfter = (newNode, referenceNode) => {
    var _a;
    (_a = referenceNode.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(newNode, referenceNode.nextSibling);
};
exports.insertElementAfter = insertElementAfter;
const acronym = (text, len = 2) => {
    let a = '';
    const aa = text.split(/\s/);
    for (let i = 0; i < aa.length && i < len; i++) {
        a += aa[i].charAt(0).toUpperCase();
    }
    return a;
};
exports.acronym = acronym;
const separateNumber = (angka) => {
    try {
        if (angka == 0)
            return '0';
        const num = angka.toString().split(".");
        num[0] = num[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return num.join(".");
    }
    catch (err) {
        return '0';
    }
};
exports.separateNumber = separateNumber;
const addslashes = (str) => {
    return (str + '')
        .replace(/[\\"']/g, '\\$&')
        .replace(/\u0000/g, '\\0');
};
exports.addslashes = addslashes;
const adddesc = (str) => str.replace(/\s+/, ' ').replace('"', '\"');
exports.adddesc = adddesc;
function listToMatrix(list, elementsPerSubArray) {
    var matrix = [], i, k;
    for (i = 0, k = -1; i < list.length; i++) {
        if (i % elementsPerSubArray === 0) {
            k++;
            matrix[k] = [];
        }
        matrix[k].push(list[i]);
    }
    return matrix;
}
exports.listToMatrix = listToMatrix;
const extractMeta = (file) => {
    const fileName = file.split("/").pop();
    const files = fileName || file;
    const match = /\.(\w+)$/.exec(files);
    return { name: fileName, match };
};
exports.extractMeta = extractMeta;
const randomInt = (total = 2) => Math.floor(Math.random() * total);
exports.randomInt = randomInt;
const isURL = (url) => {
    const exp = /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/ig;
    return (url.match(exp) !== null);
};
exports.isURL = isURL;
const isTwitterURL = (url) => {
    return (url.trim().match(/twitter\.com/) !== null);
};
exports.isTwitterURL = isTwitterURL;
//# sourceMappingURL=index.js.map