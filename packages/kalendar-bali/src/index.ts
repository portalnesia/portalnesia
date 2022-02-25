import dayjs, { Dayjs } from 'dayjs'

type IPivots={
  date: dayjs.Dayjs,
  noWuku:number,
  angkaWuku: number,
  tahunSaka:number,
  noSasih:number,
  penanggal: number,
  isPangelong: boolean,
  noNgunaratri: number,
  isNgunaratri: boolean
}

const noWukuObj = {
  1:7, //SINTA
  2:1, //LANDEP
  3:4, //UKIR
  4:6, //KULANTIR
  5:5, //TOLU
  6:8, //GUMBREG
  7:9, //WARIGA
  8:3, //WARIGADEAN
  9:7, //JULUNGWANGI
  10:1, //SUNGSANG
  11:4, //DUNGULAN
  12:6, //KUNINGAN
  13:5, //LANGKIR
  14:8, //MEDANGSIA
  15:9, //PUJUT
  16:3, //PAHANG
  17:7, //KRULUT
  18:1, //MERAKIH
  19:4, //TAMBIR
  20:6, //MENDANGKUNGAN
  21:5, //MATAL
  22:8, //UYE
  23:9, //MENAIL
  24:3, //PERANGBAKAT
  25:7, //BALA
  26:1, //UGU
  27:4, //WAYANG
  28:6, //KELAWU
  29:5, //DUKUT
  30:8 //WATUGUNUNG
}

class CalendarBali {
  angkaWuku: number;
  noWuku: number;
  uripWuku: number;
  uripPancawara: number;
  uripSaptawara: number;
  noEkawara: number;
  noDwiwara: number;
  noTriwara: number;
  noCaturwara: number;
  noPancawara: number;
  noSadwara: number;
  noSaptawara: number;
  noAstawara: number;
  noSangawara: number;
  noDasawara: number;

  tahunSaka: number;
  penanggal: number;
  isPangelong: boolean=false;
  isNgunaratri: boolean=false;
  noNgunaratri: number;
  noSasih: number;
  isNampih: boolean=false;
  pivot: IPivots;
  jejapan: number;
  watekAlit: number;
  watekMadya: number;
  ekaJalaRsi: number;
  lintang: number;
  pancasuda: number;
  pangarasan: number;
  rakam: number;
  zodiak: number;
  tgl: dayjs.Dayjs;

  constructor(date: string) {
    this.tgl = dayjs(date);
    
  }

  private pivotFunction(pivots: IPivots[],date: string,noWuku: IPivots['noWuku'],angkaWuku: IPivots['angkaWuku'],tahunSaka: IPivots['tahunSaka'],noSasih: IPivots['noSasih'],penanggal: IPivots['penanggal'], isPangelong: IPivots['isPangelong'],noNgunaratri: IPivots['noNgunaratri'],isNgunaratri: IPivots['isNgunaratri']) {
    pivots.push({
      date: dayjs(date),
      noWuku,
      angkaWuku,
      tahunSaka,
      noSasih,
      penanggal,
      isPangelong,
      noNgunaratri,
      isNgunaratri
    })

    return pivots;
  }

  private setPivot() {
    let pivots: IPivots[]=[];

    pivots = this.pivotFunction(pivots,'1991-01-01',1,143,1,1,15,false,916,false);
    
    pivots = this.pivotFunction(pivots,'1991-1-1',21,1912,7,1,15,false,916,false);

    pivots = this.pivotFunction(pivots,'1992-1-1',13,88,1913,7,11,true,1281,false);

    pivots = this.pivotFunction(pivots,'2000-1-1',10,70,1921,7,10,true,424,false);

    pivots = this.pivotFunction(pivots,'2002-1-1',25,171,1923,7,3,true,1155,false);

    pivots = this.pivotFunction(pivots,'2003-1-1',17,116,1924,7,14,true,1520,false);
    
    pivots = this.pivotFunction(pivots,'2012-6-17',1,1,1934,12,13,true,1195,false);

    pivots = this.pivotFunction(pivots,'2101-1-1',30,210,2022,7,1,false,1404,false);

    let pivotTerdekat: IPivots|null;
    const thisYear = this.tgl.year();

    pivots.forEach(p=>{
      const year = p.date.year()
      let closestYear: undefined|number
      
      if(pivotTerdekat===null || closestYear &&  Math.abs(thisYear - closestYear) > Math.abs(year - thisYear)) {
        pivotTerdekat = p;
        closestYear = year;
      }
    })

    this.pivot = pivotTerdekat as IPivots;
  }

  /**
   * Menghitung perbedaan hari antara 2 Saka Calendar
   * @param {dayjs.Dayjs} d1 Date 1
   * @param {dayjs.Dayjs} d2 Date 2
   * @returns {number} different
   */
  getDateDiff(d1: dayjs.Dayjs,d2:dayjs.Dayjs) {
    return d1.diff(d2,'day');
  }

  /**
   * MENGHITUNG PAWUKON
   */
  hitungWuku() {
    const pivot = this.pivot;
    const tgl = this.tgl;
    const bedaHari = this.getDateDiff(pivot.date,tgl);

    if(bedaHari >= 0) {
      this.angkaWuku = (pivot.angkaWuku + bedaHari) % 210;
    } else {
      this.angkaWuku = 210 - ((-(pivot.angkaWuku + bedaHari)) % 210);
    }

    if(this.angkaWuku == 0) this.angkaWuku = 210;
    
    this.noWuku = Math.ceil(this.angkaWuku/7);
    if(this.noWuku > 30) this.noWuku%=30;
    if(this.noWuku === 0) this.noWuku = 30;

    this.uripWuku = noWukuObj[this.noWuku];
  }

  /**
   * MENGHITUNG WEWARAN
   */
  hitungWewaran() {
    const pivot = this.pivot;
    const tgl = this.tgl;

    /**
     * Perhitungan saptawara, hanya mengecek dayofweek
     */
    switch(tgl.day()) {
      case 0: //Redite
        this.noSaptawara = 0;
        this.uripSaptawara = 5;
        break;
      case 1: //Soma
        this.noSaptawara = 0;
        this.uripSaptawara = 5;
        break;
      case 2: //Anggara
        this.noSaptawara = 0;
        this.uripSaptawara = 5;
        break;
      case 3: //Buda
        this.noSaptawara = 0;
        this.uripSaptawara = 5;
        break;
      case 4: //Wrespati
        this.noSaptawara = 0;
        this.uripSaptawara = 5;
        break;
      case 5: //Redite
        this.noSaptawara = 0;
        this.uripSaptawara = 5;
        break;
      case 6: //Sukra
        this.noSaptawara = 0;
        this.uripSaptawara = 5;
        break;
      default:
        break;
    }

    /**
     * Perhitungan pancawara
     * Menggunakan rumus babadbali.com: "Murni aritmatika, modulus 5 angka dari pawukon menghasilkan 0=Umanis,1=Paing,2=Pon,3=Wage,4=Kliwon"
     * Pada CalendarBalu menjadi:
     * 0 + 0 = 1 Umanis
     * 1 + 1 = 2 Paing
     * 2 + 1 = 3 Pon
     * 3 + 1 = 4 Wage
     * 4 + 1 = 5 Kliwon
     */
    let hasil = (this.angkaWuku % 5) + 1;
    this.noPancawara = hasil;

    switch(hasil) {
      case 1:
        this.uripPancawara = 5;
        break;
      case 2:
        this.uripPancawara = 9;
        break;
      case 3:
        this.uripPancawara = 7;
        break;
      case 4:
        this.uripPancawara = 4;
        break;
      case 5:
        this.uripPancawara = 8;
        break;
      default:
        break;
    }

    /*
		* Perhitungan triwara
		* Menggunakan rumus dari babadbali.com : "Perhitungan triwara murni aritmatika, berdaur dari ketiganya. Angka Pawukon dibagi 3, jika sisanya (modulus) 1 adalah Pasah, 2 adalah Beteng, 0 adalah Kajeng"
		* Pada CalendarBali menjadi : 
		* 1 Pasah
		* 2 Beteng
		* 0 -> 3 kajeng
		*/
    hasil = this.angkaWuku % 3;
    if(hasil === 0) hasil = 3;
    this.noTriwara = hasil;

    /*
		* Perhitungan ekawara
		* Pada SakaCalendar : 
		* 1 Luang
		* 2 Bukan luang (kosong)
		*/
    hasil = (this.uripPancawara + this.uripSaptawara) % 2;
    if(hasil != 0) {
      this.noEkawara = 1; //Jika tidak habis dibagi 2 maka luang
    } else {
      this.noEkawara = 0; //Jika habis dibagi 2 maka bukan luang
    }

    /*
		* Perhitungan dwiwara
		* Pada SakaCalendar : 
		* 1 Menga
		* 2 Pepet
		*/
    hasil = (this.uripPancawara + this.uripSaptawara) % 2;
    if(hasil == 0) {
      this.noDwiwara = 1;
    } else {
      this.noDwiwara = 2;
    }

     /*
		* Perhitungan caturwara
		* Pada wuku dengan angka wuku 71,72,73 caturwara tetap jaya yang disebut dengan Jayatiga
		* Pada SakaCalendar : 
		* 1 Sri
		* 2 Laba
		* 3 Jaya
		* 0 -> Menala
		*/
    if(this.angkaWuku == 71 || this.angkaWuku == 72 || this.angkaWuku == 73) {
      hasil = 3;
    } else if(this.angkaWuku <= 70) {
      hasil = this.angkaWuku % 4;
    } else {
      hasil = (this.angkaWuku + 2) % 4;
    }
    if(hasil == 0) hasil = 4;
    this.noCaturwara = hasil;


    /*
		* Perhitungan sadwara
		* Pada SakaCalendar : 
		* 1 Tungleh
		* 2 Aryang
		* 3 Urukung
		* 4 Paniron
		* 5 Was
		* 0 -> 6 Maulu
		*/
    hasil = this.angkaWuku % 6;
    if(hasil == 0) hasil = 6;
    this.noSadwara = hasil;

    /*
		* Perhitungan astawara
		* Pada wuku dengan angka wuku 71,72,73 astawara tetap kala yang disebut dengan Kalatiga
		* Pada SakaCalendar : 
		* 1 Sri
		* 2 Indra
		* 3 Guru
		* 4 Yama
		* 5 Ludra
		* 6 Brahma
		* 7 kala
		* 0 -> 8 Uma
		*/
    if(this.angkaWuku == 71 || this.angkaWuku == 72 || this.angkaWuku == 73) {
      hasil = 7;
    } else if(this.angkaWuku <= 70) {
      hasil = this.angkaWuku % 8;
    } else {
      hasil = (this.angkaWuku + 6) % 8;
    }
    if(hasil == 0) hasil = 8;
    this.noAstawara = hasil

    /*
		* Perhitungan sangawara
		* Pada wuku dengan angka wuku 1-4 sangawara tetap dangu yang disebut dengan Caturdangu
		* Pada SakaCalendar : 
		* 1 Dangu
		* 2 Jangur
		* 3 Gigis
		* 4 Nohan
		* 5 Ogan
		* 6 Erangan
		* 7 Urungan
		* 8 Tulus
		* 0 -> 9 Dadi
		*/
    if(this.angkaWuku <= 4) {
      hasil = 1;
    } else {
      hasil = (this.angkaWuku + 6) % 9
    }
    if(hasil == 0) hasil = 9;
    this.noSangawara = hasil;


    /*
		* Perhitungan dasawara 
		* Pada SakaCalendar menjadi : 
		* 0 + 1 = 1 Pandita
		* 1 + 1 = 2 Pati
		* 2 + 1 = 3 Suka
		* 3 + 1 = 4 Duka	
		* 4 + 1 = 5 Sri
		* 5 + 1 = 6 Manuh
		* 6 + 1 = 7 Manusa
		* 7 + 1 = 8 Raja
		* 8 + 1 = 9 Dewa
		* 9 + 1 = 10 Raksasa
		*/
    hasil = (((this.uripPancawara + this.uripSaptawara) % 10) + 1);
    this.noSadwara = hasil;
  }

  /**
   * MENGHITUNG JEJAPAN
   */
  hitungJejapan() {

  }
}