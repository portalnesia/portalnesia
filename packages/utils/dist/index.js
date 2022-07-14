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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTrue = exports.nanoid = exports.uuid = exports.stripslashes = exports.transliterate = exports.validateEmail = exports.number_format_short = exports.firstToUpper = exports.isTwitterURL = exports.isURL = exports.randomInt = exports.extractMeta = exports.listToMatrix = exports.adddesc = exports.addslashes = exports.separateNumber = exports.acronym = exports.insertElementAfter = exports.time_ago = exports.numberFormat = exports.generateRandom = exports.number_size = exports.toBlob = exports.copyTextBrowser = exports.slugFormat = exports.splice = exports.truncate = exports.replaceAt = exports.urlToDomain = exports.firstLetter = exports.jsStyles = exports.ucwords = exports.parseURL = exports.specialHTML = exports.stripHTML = exports.escapeHTML = exports.monthNamesEn = exports.monthNames = exports.isEmptyObj = exports.clean = void 0;
const slugify_1 = __importDefault(require("./slugify"));
const transliterate_1 = __importDefault(require("./transliterate"));
const nanoid_1 = require("nanoid");
/**
 * Clean text format
 * @param {string} text: text to clean
 * @returns {string} string
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
 * @param {object} obj object to check
 * @returns {boolean} boolean
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
 * @param {string} text HTML to escape
 * @param {boolean} withQuote if true, quote or double quote not escaped
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
 * @param {string} text String being converted
 * @returns {string} string
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
 * @param {string} text Input string
 * @returns {string} string
 */
const ucwords = function (text) {
    if (typeof text !== 'string')
        return '';
    const str = text.toLowerCase().replace(/\b[a-z]/g, function (letter) {
        return letter.toUpperCase();
    });
    return str;
};
exports.ucwords = ucwords;
/**
 * convertTextToJsStyles
 * @param {string} text
 * @returns {string} string
 */
const jsStyles = function (text) {
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
    return str;
};
exports.jsStyles = jsStyles;
/**
 * Get first characters of each word
 * @param {string} text
 * @param {number} number max word
 * @returns {string} string
 */
const firstLetter = function (text, number) {
    if (typeof text !== 'string')
        return '';
    let str = text.toLowerCase().replace(/\b([a-z])(\S*)/g, function (a, b) {
        return b.toUpperCase();
    }).replace(/\s/g, "");
    if (typeof number === 'number')
        str = str.substring(0, number);
    else
        return str;
};
exports.firstLetter = firstLetter;
/**
 * Convert URL to only domain
 * @param {string} url
 * @returns {string} string
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
 * @param {string} text string being truncated
 * @param {number} num maximum character
 * @param {string} limit Limit characters
 * @returns {string} string
 */
const truncate = function (text, num, limit = '...') {
    if (typeof text !== 'string')
        return '';
    return (text.length <= num) ? text : text.slice(0, num) + limit;
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
 * @param {string} text
 * @param {?boolean} lowercase
 * @param {?Options} option
 * @returns {string} Slugify format
 */
const slugFormat = function (text, lowercase, option) {
    const opt = Object.assign({ lowercase: lowercase || true }, option);
    return (0, slugify_1.default)(text, opt);
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
 * @param {number|null} bytes
 * @param {number} precision
 * @returns {string} string
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
const SMALL_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";
/**
 * Generate random string
 * @param {number} number maximum string being generated
 * @returns {string} string
 */
const generateRandom = (number = 10, lowercase_only = false) => {
    let result = '';
    const charLength = CHARS.length;
    for (let i = 0; i < number; i++) {
        if (lowercase_only)
            result += SMALL_CHARS.charAt(Math.floor(Math.random() * charLength));
        else
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
 * @param {number} seconds
 * @returns {string} string
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
function firstToUpper(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
exports.firstToUpper = firstToUpper;
function number_format_short(n, precision = 1, onlyNumber = false) {
    let number = "0";
    let suffix = "";
    // 0 - 900
    if (n < 900) {
        number = n.toString();
    }
    // 0.9k-850k
    else if (n < 900000) {
        number = (n / 1000).toFixed(precision);
        suffix = " K";
    }
    // 0.9m-850m
    else if (n < 900000000) {
        number = (n / 1000000).toFixed(precision);
        suffix = " M";
    }
    // 0.9b-850b
    else if (n < 900000000000) {
        number = (n / 1000000000).toFixed(precision);
        suffix = " B";
    }
    // 0.9t+
    else {
        number = (n / 1000000000000).toFixed(precision);
        suffix = " T";
    }
    let result;
    if (!onlyNumber) {
        result = { number: n, format: `${number}${suffix}` };
        return result;
    }
    else {
        result = number;
        return result;
    }
}
exports.number_format_short = number_format_short;
function validateEmail(email) {
    const regexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (regexp.test(email))
        return true;
    return false;
}
exports.validateEmail = validateEmail;
function transliterate(string, options) {
    return (0, transliterate_1.default)(string, options);
}
exports.transliterate = transliterate;
function stripslashes(string) {
    return string.replace(/\\/gim, '');
}
exports.stripslashes = stripslashes;
/**
 * @deprecated Use {@link nanoid | nanoid} instead
 * @param {String?} text UUID v4
 * @returns {string} UUID
 */
function uuid(text) {
    return nanoid();
}
exports.uuid = uuid;
/**
 * Generate UUID
 * @returns {string} UUID
 */
function nanoid() {
    return (0, nanoid_1.nanoid)();
}
exports.nanoid = nanoid;
function isTrue(whatToCheck) {
    if (typeof whatToCheck === 'string' && ['true', '1'].indexOf(whatToCheck) > -1)
        return true;
    if (typeof whatToCheck === 'boolean' && whatToCheck === true)
        return true;
    if (typeof whatToCheck === 'number' && whatToCheck === 1)
        return true;
    return false;
}
exports.isTrue = isTrue;
