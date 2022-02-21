# Dayjs Plugins

This is custom dayjs plugins for Portalnesia.

## API

### time_ago

Get time_ago format of date and returns object of time_ago format and unix timestamp

```ts
{
  time_ago: string
  timestamp: number
}
```

> This function requires `relativeTime` plugins

Example

```js
const date = dayjs('2021-12-20');
const time_ago = date.time_ago();

console.log(time_ago);

/**
 * {
 *    format: 'Dec 20',
 *    timestamp: 1639933200 
 * }
 * /
```

### pn_format

Get custom format

Format type:

- minimal (*default*) &mdash; Jan 01, 2022
- fulldate &mdash; January 01, 2022
- full &mdash; January 01, 2022, 10:30
- time  &mdash; 10:30

Example

```js
const date = dayjs('2022-02-20');
const format = date.pn_format('fulldate');

console.log(format);

/**
 * February 20, 2022
 * /
```

### range_format

Get range format from current date and argument's date
(Indonesia Locale)

> This function requires id locale `dayjs/locale/id`

Example

```js
const a = dayjs('2022-02-20');
const b = dayjs('2022-01-15');
const c = dayjs('2021-12-18');
const b = dayjs('2022-02-27');

const range = a.range_format(d);
const range2 = b.range_format(d);
const range3 = c.range_format(d);

console.log(range)

/**
 * 20 - 27 Februari 2022
 * 15 Januari - 27 Februari 2022
 * 18 Desember 2021 - 27 Februari 2022
 * /
```