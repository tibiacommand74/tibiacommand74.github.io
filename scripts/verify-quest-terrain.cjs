'use strict';
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib'),assert=require('node:assert/strict');
// The published minimaps are non-interlaced, 8-bit indexed PNGs. Decode their
// actual terrain colors so a route crossing a wall cannot silently return.
function readIndexedPng(file){
 const data=fs.readFileSync(file);assert.equal(data.subarray(1,4).toString(),'PNG');let offset=8,width,height,palette,parts=[];
 while(offset<data.length){const n=data.readUInt32BE(offset),type=data.toString('ascii',offset+4,offset+8),chunk=data.subarray(offset+8,offset+8+n);offset+=n+12;
  if(type==='IHDR'){width=chunk.readUInt32BE(0);height=chunk.readUInt32BE(4);assert.equal(chunk[8],8);assert.equal(chunk[9],3);assert.equal(chunk[12],0);}
  else if(type==='PLTE')palette=chunk;else if(type==='IDAT')parts.push(chunk);
 }
 const raw=zlib.inflateSync(Buffer.concat(parts)),pixels=Buffer.alloc(width*height);assert.equal(raw.length,(width+1)*height);
 const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
 for(let y=0;y<height;y++){const filter=raw[y*(width+1)];assert(filter<=4);
  for(let x=0;x<width;x++){const index=y*width+x,left=x?pixels[index-1]:0,above=y?pixels[index-width]:0,upperLeft=x&&y?pixels[index-width-1]:0;
   const predictor=[0,left,above,Math.floor((left+above)/2),paeth(left,above,upperLeft)][filter];pixels[index]=(raw[y*(width+1)+x+1]+predictor)&255;
  }
 }
 return{x:width,y:height,color:(x,y)=>{assert(x>=0&&y>=0&&x<width&&y<height);const i=pixels[y*width+x]*3;return palette.subarray(i,i+3).toString('hex');}};
}
module.exports=function verifyQuestTerrain(routes,assetRoot){const floors=new Map();let samples=0;
 for(const [id,route] of Object.entries(routes))for(const [index,step] of route.stages.entries()){
  if(step.points.length<2)continue;if(!floors.has(step.floor))floors.set(step.floor,readIndexedPng(path.join(assetRoot,'floor-'+step.floor+'.png')));const floor=floors.get(step.floor);
  for(let i=1;i<step.points.length;i++){const a=step.points[i-1],b=step.points[i],length=Math.max(Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1]));
   for(let n=0;n<=length;n++){const x=Math.round(a[0]+(b[0]-a[0])*n/Math.max(length,1)),y=Math.round(a[1]+(b[1]-a[1])*n/Math.max(length,1)),color=floor.color(x-31812,y-31370);
    assert(!['000000','000033','993300'].includes(color),`${id}: etapa ${index+1} cruza fundo ou parede em ${x},${y},${step.floor}`);samples++;
   }
  }
 }
 return samples;
};
