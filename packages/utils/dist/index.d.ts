import { Options } from './slugify';
import { Options as TransliterateOption } from './transliterate';
export type { Options as SlugifyOptions } from './slugify';
export type { Options as TransliterateOption } from './transliterate';
export declare type Without<T, K> = {
    [L in Exclude<keyof T, K>]: T[L];
};
/**
 * Clean text format
 * @param text: text to clean
 * @returns string
 */
export declare const clean: (text: string) => string;
/**
 * Check is object empty?
 * @param obj objeck to check
 * @returns boolean
 */
export declare const isEmptyObj: (obj: object) => boolean;
export declare const monthNames: string[];
export declare const monthNamesEn: string[];
/**
 * Escape HTML string (& to &amp;)
 * @param text HTML to escape
 * @param withQuote if true, quote or double quote not escaped
 * @returns escaped string
 */
export declare const escapeHTML: (text: string, withQuote: boolean) => string;
export declare const stripHTML: (text?: string) => string;
/**
 * Convert special characters to HTML entities
 * @param text String being converted
 * @returns string
 */
export declare const specialHTML: (text: string) => string;
export declare const parseURL: (url: string) => string;
/**
 * Uppercase the first character of each word in a string
 * @param text Input string
 * @param func if set, invoke function after text being converted
 * @returns string|void
 */
export declare const ucwords: (text: string) => string;
/**
 * convertTextToJsStyles
 * @param text
 * @param func if set, invoke function after text being converted
 * @returns string|void
 */
export declare const jsStyles: (text: string) => string;
/**
 * Get first characters of each word
 * @param text
 * @param number max word
 * @param func
 * @returns
 */
export declare const firstLetter: (text: string, number?: number) => string;
/**
 * Convert URL to only domain
 * @param url
 * @returns
 */
export declare const urlToDomain: (url: string) => string;
export declare const replaceAt: (text: string, index: number, replacement: string) => string;
/**
 * Truncate string
 * @param text string being truncated
 * @param num maximum character
 * @returns string
 */
export declare const truncate: (text: string, num: number) => string;
export declare const splice: (text: string, idx: number, rem: number, str: string) => string;
/**
 * Convert string to slug-url-format
 * @param text
 * @param func
 * @param lowercase
 * @returns
 */
export declare const slugFormat: (text: string, lowercase?: boolean, option?: Partial<Without<Options, 'lowercase'>>) => string;
export declare function copyTextBrowser(text: string): Promise<void>;
export declare const toBlob: (b64Data: string, contentType: string, sliceSize?: number) => Blob;
/**
 * Convert byte to kilobyte, megabyte, ...
 * @param bytes
 * @param precision
 * @returns
 */
export declare const number_size: (bytes: number | null | undefined, precision?: number) => string;
/**
 * Generate random string
 * @param number maximum string being generated
 * @returns
 */
export declare const generateRandom: (number?: number, lowercase_only?: boolean) => string;
export declare const numberFormat: (angka: string, separate?: string) => string;
/**
 * Convert second to "time ago" format
 * @param seconds
 * @returns
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
