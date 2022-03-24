const library = [{
  name:"Portalnesia",
  output:"index.d.ts",
  path:"/index.ts",
  lib:""
},{
  name:"PNBlog",
  output:"blog.d.ts",
  path:"/api/blog/index.ts",
  lib:"/blog"
}]

module.exports = {
  compilationOptions:{
    preferredConfigPath:"./tsconfig.json"
  },
  entries: library.map(function(l){
    return {
      filePath:"./src"+l.path,
      outFile:"./dist/"+l.output,
      output:{
        inlineDeclareGlobals:false,
        sortNodes:true,
        umdModuleName:l.name,
        noBanner:true
      }
    }
  })
}