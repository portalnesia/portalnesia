# Dayjs Plugins

Custom dayjs plugins for Portalnesia.

## Quick start

First, install the build from npm or yarn

```bash 
npm install --save @portalnesia/dayjs-plugins
```

Import and extends your dayjs

```js
import dayjs from 'dayjs'
import plugins from '@portalnesia/dayjs-plugins'

dayjs.extend(plugins);
```

## API

### time_ago

Get time_ago format of date and returns object of time_ago format and unix timestamp

```ts
{
  /* Time ago string */
  time_ago: string
  /* Unix timestamp (in second) */
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
 *    format: '3 weeks ago',
 *    timestamp: 1639933200 
 * }
 * /
```

### pn_format

Get custom format

Format type:

- minimal (*default*) &mdash; 01 Jan 2022
- fulldate &mdash; 01 January 2022
- full &mdash; 01 January 2022, 10:30
- time  &mdash; 10:30

Example

```js
const date = dayjs('2022-02-20');
const format = date.pn_format('fulldate');

console.log(format);

/**
 * 20 February 2022
 * /
```

### range_format

Get range format from current date and argument's date

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
 * 20 - 27 February 2022
 * 15 January - 27 February 2022
 * 18 December 2021 - 27 February 2022
 * /
```