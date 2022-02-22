import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime);

export type IPNFormat = 'minimal'|'fulldate'|'full'|'time'
export type UnknownDate = string | number | Date | dayjs.Dayjs

declare module 'dayjs' {
  export interface Dayjs {
    /**
     * Get `time_ago` date from now
     * @template D {format: string,timestamp: number}
     * @requires relativeTime plugins
     * @returns {D} {format: string,timestamp: number}
     * @example
     *  ```json
     *  {
     *    "format":"20 minutes ago",
     *    "timestamp": 12516125125
     *  }
     *  ```
     */
    time_ago<D={format: string,timestamp: number}>(): D

    /**
     * Get portalnesia custom format
     * @param {IPNFormat} type type format
     * @example
     *  - minimal: 01 Jan 2022
     *  - fulldate: 01 January 2022
     *  - full: 01 January 2022, 10:30
     *  - time: 10:30
     */
    pn_format(type?:IPNFormat): string

    /**
     * Get range format from current date and argument's date
     * @param {dayjs.Dayjs} date
     * @returns {string} Range string
     */
    range_format(date: dayjs.Dayjs): string
  }
}

const portalnesiaDayjs: dayjs.PluginFunc = (o,c,d)=>{
  const p = c.prototype

  p.time_ago = function<D={format: string,timestamp: number}>() {
    try {
      const datetime = this;
      if(typeof datetime.fromNow !== 'function') throw new Error('Please extends relativeTime plugins');
      
      let format = datetime.fromNow();
  
      if(/months? ago$/.test(format)) {
          format = datetime.format("DD MMM");
      } else if(/years? ago$/.test(format)) {
          format = datetime.format("DD MMM YYYY");
      }
      return {
          format,
          timestamp: datetime.unix(),
      } as unknown as D
    } catch(e) {
      return null as unknown as D
    }
  }

  p.pn_format = function(type: IPNFormat='minimal') {
    let format: string;
    if(type == 'minimal') {
      format="DD MMM YYYY"
    } else if(type === 'fulldate') {
      format = "DD MMMM YYYY"
    } else if(type == 'time') {
      format = "HH:mm";
    } else {
      format = "DD MMMM YYYY, HH:mm"
    }
    return this.format(format);
  }

  p.range_format = function(date: dayjs.Dayjs) {
    const tanggal1 = this.format('YYYY-MM-DD');
    const tanggal2 = date.format('YYYY-MM-DD');
    const waktu1 = this.format('HH:mm');
    const waktu2 = date.format('HH:mm');
    const tgl1 = this.date();
    const tgl2 = date.date();
    const bln1 = this.month();
    const bln2 = date.month();
    const thn1 = this.year();
    const thn2 = date.year();

    if(tanggal1 == tanggal2 && waktu1!=waktu2) {
      return `${waktu1} - ${waktu2}, ${this.format('DD MMMM YYYY')}`
    }

    if(thn1 != thn2) {
      return `${this.format('DD MMMM YYYY')} - ${date.format('DD MMMM YYYY')}`
    }
    else if(bln1 != bln2) {
      return `${this.format('DD MMMM')} - ${date.format('DD MMMM')} ${thn1}`
    }
    else {
      return `${this.format('DD')} - ${date.format('DD')} ${this.format('MMMM YYYY')}`
    }
  }
}

export default portalnesiaDayjs;