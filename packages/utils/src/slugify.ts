import escapeStringRegexp from './escape-string-regexp';
import transliterate from './transliterate';


const builtinOverridableReplacements: [string,string][] = [
	['&', ' and '],
	['🦄', ' unicorn '],
	['♥', ' love ']
];

export interface Options {
	/**
	@default '-'

	@example
	```
	import slugify from '@sindresorhus/slugify';

	slugify('BAR and baz');
	//=> 'bar-and-baz'

	slugify('BAR and baz', {separator: '_'});
	//=> 'bar_and_baz'

	slugify('BAR and baz', {separator: ''});
	//=> 'barandbaz'
	```
	*/
	readonly separator?: string;

	/**
	Make the slug lowercase.

	@default true

	@example
	```
	import slugify from '@sindresorhus/slugify';

	slugify('Déjà Vu!');
	//=> 'deja-vu'

	slugify('Déjà Vu!', {lowercase: false});
	//=> 'Deja-Vu'
	```
	*/
	readonly lowercase?: boolean;

	/**
	Convert camelcase to separate words. Internally it does `fooBar` → `foo bar`.

	@default true

	@example
	```
	import slugify from '@sindresorhus/slugify';

	slugify('fooBar');
	//=> 'foo-bar'

	slugify('fooBar', {decamelize: false});
	//=> 'foobar'
	```
	*/
	readonly decamelize?: boolean;

	/**
	Add your own custom replacements.

	The replacements are run on the original string before any other transformations.

	This only overrides a default replacement if you set an item with the same key, like `&`.

	Add a leading and trailing space to the replacement to have it separated by dashes.

	@default [ ['&', ' and '], ['🦄', ' unicorn '], ['♥', ' love '] ]

	@example
	```
	import slugify from '@sindresorhus/slugify';

	slugify('Foo@unicorn', {
		customReplacements: [
			['@', 'at']
		]
	});
	//=> 'fooatunicorn'

	slugify('foo@unicorn', {
		customReplacements: [
			['@', ' at ']
		]
	});
	//=> 'foo-at-unicorn'

	slugify('I love 🐶', {
		customReplacements: [
			['🐶', 'dogs']
		]
	});
	//=> 'i-love-dogs'
	```
	*/
	readonly customReplacements?: ReadonlyArray<[string, string]>;

	/**
	If your string starts with an underscore, it will be preserved in the slugified string.

	Sometimes leading underscores are intentional, for example, filenames representing hidden paths on a website.

	@default false

	@example
	```
	import slugify from '@sindresorhus/slugify';

	slugify('_foo_bar');
	//=> 'foo-bar'

	slugify('_foo_bar', {preserveLeadingUnderscore: true});
	//=> '_foo-bar'
	```
	*/
	readonly preserveLeadingUnderscore?: boolean;

	/**
	If your string ends with a dash, it will be preserved in the slugified string.

	For example, using slugify on an input field would allow for validation while not preventing the user from writing a slug.

	@default false

	@example
	```
	import slugify from '@sindresorhus/slugify';

	slugify('foo-bar-');
	//=> 'foo-bar'

	slugify('foo-bar-', {preserveTrailingDash: true});
	//=> 'foo-bar-'
	```
	 */
	readonly preserveTrailingDash?: boolean;
}

const decamelize = (string: string) => {
	return string
		// Separate capitalized words.
		.replace(/([A-Z]{2,})(\d+)/g, '$1 $2')
		.replace(/([a-z\d]+)([A-Z]{2,})/g, '$1 $2')

		.replace(/([a-z\d])([A-Z])/g, '$1 $2')
		.replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1 $2');
};

const removeMootSeparators = (string: string, separator: string) => {
	const escapedSeparator = escapeStringRegexp(separator);

	return string
		.replace(new RegExp(`${escapedSeparator}{2,}`, 'g'), separator)
		.replace(new RegExp(`^${escapedSeparator}|${escapedSeparator}$`, 'g'), '');
};

export default function slugify(string: string, options: Options) {
	if (typeof string !== 'string') {
		throw new TypeError(`Expected a string, got \`${typeof string}\``);
	}

	options = {
		separator: '-',
		lowercase: true,
		decamelize: true,
		customReplacements: [],
		preserveLeadingUnderscore: false,
		preserveTrailingDash: false,
		...options
	};

	const shouldPrependUnderscore = options.preserveLeadingUnderscore && string.startsWith('_');
	const shouldAppendDash = options.preserveTrailingDash && string.endsWith('-');

	const customReplacements = [
		...builtinOverridableReplacements,
		...options.customReplacements
	];

	string = transliterate(string, {customReplacements});

	if (options.decamelize) {
		string = decamelize(string);
	}

	let patternSlug = /[^a-zA-Z\d]+/g;

	if (options.lowercase) {
		string = string.toLowerCase();
		patternSlug = /[^a-z\d]+/g;
	}

	string = string.replace(patternSlug, options.separator);
	string = string.replace(/\\/g, '');
	if (options.separator) {
		string = removeMootSeparators(string, options.separator);
	}

	if (shouldPrependUnderscore) {
		string = `_${string}`;
	}

	if (shouldAppendDash) {
		string = `${string}-`;
	}

	return string;
}

export function slugifyWithCounter() {
	const occurrences = new Map();

	const countable = (string: string, options: Options) => {
		string = slugify(string, options);

		if (!string) {
			return '';
		}

		const stringLower = string.toLowerCase();
		const numberless = occurrences.get(stringLower.replace(/(?:-\d+?)+?$/, '')) || 0;
		const counter = occurrences.get(stringLower);
		occurrences.set(stringLower, typeof counter === 'number' ? counter + 1 : 1);
		const newCounter = occurrences.get(stringLower) || 2;
		if (newCounter >= 2 || numberless > 2) {
			string = `${string}-${newCounter}`;
		}

		return string;
	};

	countable.reset = () => {
		occurrences.clear();
	};

	return countable;
}
