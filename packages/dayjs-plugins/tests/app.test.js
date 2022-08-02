const dayjs = require('dayjs')
const relativePlugin = require('dayjs/plugin/relativeTime')
require('dayjs/locale/id');
const dayjsPlugin = require('../dist/index').default;
dayjs.extend(relativePlugin);
dayjs.extend(dayjsPlugin);

describe("Dayjs Plugin Tests",()=>{
  it("time_ago",()=>{
    const a = dayjs().subtract(10,'minutes');
    expect(a.time_ago().format).toBe('10 minutes ago')
  })

  it("pn_format",()=>{
    const a = dayjs();
    expect(a.pn_format('full')).toBe(a.format("DD MMMM YYYY, HH:mm"))
    expect(a.pn_format('db')).toBe(a.format("YYYY-MM-DD HH:mm:ss"))
    expect(a.pn_format('fulldate')).toBe(a.format("DD MMMM YYYY"))
    expect(a.pn_format('minimal')).toBe(a.format("DD MMM YYYY"))
    expect(a.pn_format('time')).toBe(a.format("HH:mm"))
  })

  it("range_format",()=>{
    const a = dayjs('2021-12-20');
    const b = dayjs('2022-02-27');
    const range = a.range_format(b);
    expect(range).toBe('20 December 2021 - 27 February 2022')
  })
})