import deburr from 'lodash.deburr';
import escapeStringRegexp from './escape-string-regexp';
import builtinReplacements from './slugifyReplacement';

export interface Options {
	/**
	Add your own custom replacements.

	The replacements are run on the original string before any other transformations.

	This only overrides a default replacement if you set an item with the same key.

	@default []

	@example
	```
	import transliterate from '@sindresorhus/transliterate';

	transliterate('Я люблю единорогов', {
		customReplacements: [
			['единорогов', '🦄']
		]
	})
	//=> 'Ya lyublyu 🦄'
	```
	*/
	readonly customReplacements?: ReadonlyArray<[string, string]>;
}

const doCustomReplacements = (string: string, replacements: string[][]) => {
	for (const [key, value] of replacements) {
		// TODO: Use `String#replaceAll()` when targeting Node.js 16.
		string = string.replace(new RegExp(escapeStringRegexp(key), 'g'), value);
	}

	return string;
};

export default function transliterate(string: string, options: Options) {
	if (typeof string !== 'string') {
		throw new TypeError(`Expected a string, got \`${typeof string}\``);
	}

	options = {
		customReplacements: [],
		...options
	};

	const customReplacements = [
		...builtinReplacements,
		...options.customReplacements
	];

	string = string.normalize();
	string = doCustomReplacements(string, customReplacements);
	string = deburr(string);

	return string;
}
