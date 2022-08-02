const portalnesia = require('../dist/index');

describe('Utils Testing',()=>{
  it('clean()',()=>{
    const html = "<p>Hello World</p>";
    const clean = portalnesia.clean(html);
    expect(clean).toBe("Hello World")
  })

  describe("isEmptyObj()",()=>{
    it("Should return true",()=>{
      const obj = portalnesia.isEmptyObj({});
      expect(obj).toBe(true);
    })

    it("Should return false",()=>{
      const obj = portalnesia.isEmptyObj({hello:'world'});
      expect(obj).toBe(false);
    })
  })

  describe("escapeHTML()",()=>{
    it("With quote",()=>{
      const html = "<p>Hello World & From Testing</p>";
      const escaped = portalnesia.escapeHTML(html,true);
      expect(escaped).toBe("&lt;p&gt;Hello World &amp; From Testing&lt;/p&gt;");
    })

    it("Without quote",()=>{
      const html = "<p>Hello World & From Testing</p>";
      const escaped = portalnesia.escapeHTML(html,false);
      expect(escaped).toBe("&lt;p&gt;Hello World & From Testing&lt;/p&gt;");
    })
  })

  it("specialHTML()",()=>{
    const html = "&lt;p&gt;Hello World &amp; From Testing&lt;/p&gt;";
    const escaped = portalnesia.specialHTML(html);
    expect(escaped).toBe("<p>Hello World & From Testing</p>");
  })

  it("parseURL()",()=>{
    const url = "https://portalnesia.com/pages/privacy-policy";
    const output = portalnesia.parseURL(url);
    expect(output).toBe("portalnesia.com/pages/privacy-policy");
  })

  it("ucwords()",()=>{
    const input = "Hello world from testing";
    const output = portalnesia.ucwords(input);
    expect(output).toBe("Hello World From Testing");
  })

  it("jsStyles()",()=>{
    const input = "Hello world from testing";
    const output = portalnesia.jsStyles(input);
    expect(output).toBe("helloWorldFromTesting");
  })

  describe("firstLetter()",()=>{
    it("With number limit",()=>{
      const input = "Hello world from testing";
      const output = portalnesia.firstLetter(input,2);
      expect(output).toBe("HW");
    })

    it("Without number limit",()=>{
      const input = "Hello world from testing";
      const output = portalnesia.firstLetter(input);
      expect(output).toBe("HWFT");
    })
  })

  it("urlToDomain()",()=>{
    const url = "https://portalnesia.com/pages/privacy-policy";
    const output = portalnesia.urlToDomain(url);
    expect(output).toBe("portalnesia.com");
  })

  it("replaceAt()",()=>{
    const input = "Hello world from testing";
    const output = portalnesia.replaceAt(input,6,"dunia");
    expect(output).toBe("Hello dunia from testing");
  })

  it("truncate()",()=>{
    const input = "Hello world from testing";
    const output = portalnesia.truncate(input,11);
    expect(output).toBe("Hello world...");
  })

  it("slugFormat()",()=>{
    const input = "Hello world from testing";
    const output = portalnesia.slugFormat(input);
    expect(output).toBe("hello-world-from-testing");
  })

  it("number_size()",()=>{
    const input = 1279262;
    const output = portalnesia.number_size(input);
    expect(output).toBe("1.22 MB");
  })

  it("numberFormat()",()=>{
    const input = 1279262;
    const output = portalnesia.numberFormat(input);
    expect(output).toBe("1.279.262");
  })

  it("time_ago()",()=>{
    const input = 60 * 10
    const output = portalnesia.time_ago(input);
    expect(output).toBe("10 minutes ago");
  })

  it("acronym()",()=>{
    const input = "Hello world from testing";
    const output = portalnesia.acronym(input);
    expect(output).toBe("HW");
  })

  describe('isURL()',()=>{
    it("should return false",()=>{
      const input = "Hello world from testing";
      const output = portalnesia.isURL(input);
      expect(output).toBe(false);
    })
    it("should return true",()=>{
      const input = "https://portalnesia.com";
      const output = portalnesia.isURL(input);
      expect(output).toBe(true);
    })
  })

  describe('isTwitterURL()',()=>{
    it("should return true",()=>{
      const input = "https://twitter.com/Portalnesia1";
      const output = portalnesia.isTwitterURL(input);
      expect(output).toBe(true);
    })
    it("should return false",()=>{
      const input = "https://portalnesia.com";
      const output = portalnesia.isTwitterURL(input);
      expect(output).toBe(false);
    })
  })

  it("firstToUpper()",()=>{
    const input = "Hello world from testing";
    const output = portalnesia.firstToUpper(input);
    expect(output).toBe("Hello world from testing");
  })

  it("number_format_short()",()=>{
    const input = 1024;
    const output = portalnesia.number_format_short(input);
    expect(output.format).toBe("1.0 K");
  })

  describe('validateEmail()',()=>{
    it("should return true",()=>{
      const input = "support@portalnesia.com";
      const output = portalnesia.validateEmail(input);
      expect(output).toBe(true);
    })
    it("should return false",()=>{
      const input = "https://portalnesia.com";
      const output = portalnesia.validateEmail(input);
      expect(output).toBe(false);
    })
  })

  describe('isTrue()',()=>{
    it("should return true",()=>{
      const input = "true";
      const output = portalnesia.isTrue(input);
      expect(output).toBe(true);
    })
    it("should return true",()=>{
      const input = 1;
      const output = portalnesia.isTrue(input);
      expect(output).toBe(true);
    })
    it("should return false",()=>{
      const input = "https://portalnesia.com";
      const output = portalnesia.isTrue(input);
      expect(output).toBe(false);
    })
  })
})