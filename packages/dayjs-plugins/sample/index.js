const dayjs = require('dayjs')
const relativePlugin = require('dayjs/plugin/relativeTime')
require('dayjs/locale/id');
const dayjsPlugin = require('@portalnesia/dayjs-plugins').default;
dayjs.extend(relativePlugin);
dayjs.extend(dayjsPlugin);

const a = dayjs('2021-12-20');
const b = dayjs('2022-02-27');

const time_ago = a.time_ago();
console.log(time_ago)

const format = b.pn_format('full');
console.log(format);

const range = a.range_format(b);
console.log(range);