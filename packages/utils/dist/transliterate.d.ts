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
export default function transliterate(string: string, options: Options): string;
