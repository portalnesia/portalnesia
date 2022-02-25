import { Options } from './slugify';
import { Options as TransliterateOption } from './transliterate';
export type { Options as SlugifyOptions } from './slugify';
export type { Options as TransliterateOption } from './transliterate';
export declare type Without<T, K> = {
    [L in Exclude<keyof T, K>]: T[L];
};
/**
 * Clean text format
 * @param {string} text: text to clean
 * @returns {string} string
 */
export declare const clean: (text: string) => string;
/**
 * Check is object empty?
 * @param {object} obj object to check
 * @returns {boolean} boolean
 */
export declare const isEmptyObj: (obj: object) => boolean;
export declare const monthNames: string[];
export declare const monthNamesEn: string[];
/**
 * Escape HTML string (& to &amp;)
 * @param {string} text HTML to escape
 * @param {boolean} withQuote if true, quote or double quote not escaped
 * @returns escaped string
 */
export declare const escapeHTML: (text: string, withQuote: boolean) => string;
export declare const stripHTML: (text?: string) => string;
/**
 * Convert special characters to HTML entities
 * @param {string} text String being converted
 * @returns {string} string
 */
export declare const specialHTML: (text: string) => string;
export declare const parseURL: (url: string) => string;
/**
 * Uppercase the first character of each word in a string
 * @param {string} text Input string
 * @returns {string} string
 */
export declare const ucwords: (text: string) => string;
/**
 * convertTextToJsStyles
 * @param {string} text
 * @returns {string} string
 */
export declare const jsStyles: (text: string) => string;
/**
 * Get first characters of each word
 * @param {string} text
 * @param {number} number max word
 * @returns {string} string
 */
export declare const firstLetter: (text: string, number?: number) => string;
/**
 * Convert URL to only domain
 * @param {string} url
 * @returns {string} string
 */
export declare const urlToDomain: (url: string) => string;
export declare const replaceAt: (text: string, index: number, replacement: string) => string;
/**
 * Truncate string
 * @param {string} text string being truncated
 * @param {number} num maximum character
 * @param {string} limit Limit characters
 * @returns {string} string
 */
export declare const truncate: (text: string, num: number, limit?: string) => string;
export declare const splice: (text: string, idx: number, rem: number, str: string) => string;
/**
 * Convert string to slug-url-format
 * @param {string} text
 * @param {?boolean} lowercase
 * @param {?Options} option
 * @returns {string} Slugify format
 */
export declare const slugFormat: (text: string, lowercase?: boolean, option?: Partial<Without<Options, 'lowercase'>>) => string;
export declare function copyTextBrowser(text: string): Promise<void>;
export declare const toBlob: (b64Data: string, contentType: string, sliceSize?: number) => Blob;
/**
 * Convert byte to kilobyte, megabyte, ...
 * @param {number|null} bytes
 * @param {number} precision
 * @returns {string} string
 */
export declare const number_size: (bytes: number | null | undefined, precision?: number) => string;
/**
 * Generate random string
 * @param {number} number maximum string being generated
 * @returns {string} string
 */
export declare const generateRandom: (number?: number, lowercase_only?: boolean) => string;
export declare const numberFormat: (angka: string, separate?: string) => string;
/**
 * Convert second to "time ago" format
 * @param {number} seconds
 * @returns {string} string
 */
export declare const time_ago: (seconds: number) => string;
export declare const insertElementAfter: (newNode: HTMLElement, referenceNode: HTMLElement) => void;
export declare const acronym: (text: string, len?: number) => string;
export declare const separateNumber: (angka: number) => string;
export declare const addslashes: (str: string) => string;
export declare const adddesc: (str: string) => string;
export declare function listToMatrix(list: never[], elementsPerSubArray: number): any[];
export declare const extractMeta: (file: string) => {
    name: string;
    match: RegExpExecArray;
};
export declare const randomInt: (total?: number) => number;
export declare const isURL: (url: string) => boolean;
export declare const isTwitterURL: (url: string) => boolean;
export declare function firstToUpper(text: string): string;
export declare function number_format_short<D = {
    number: number;
    format: string;
}>(n: number, precision?: number, onlyNumber?: boolean): D;
export declare function validateEmail(email: string): boolean;
export declare function transliterate(string: string, options: TransliterateOption): string;
export declare function stripslashes(string: string): string;
export declare function uuid(text?: string): string;
export declare function isTrue(whatToCheck: unknown): boolean;
