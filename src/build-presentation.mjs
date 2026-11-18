import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const repoDir=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const outDir=path.resolve(process.argv[2]||path.join(repoDir,'work/export'));

import {Presentation,PresentationFile} from '@oai/artifact-tool';
var spec = JSON.parse(await fs.readFile(path.join(repoDir,'src/slides.json'),'utf8'));
const presentation=Presentation.create({slideSize:{width:1280,height:720}});
{
  while(presentation.slides.items.length) presentation.slides.getItem(0).delete();
  presentation.theme.defaultFont='Hiragino Maru Gothic ProN';
  const root=path.join(repoDir,'assets')+path.sep;
  const blobs={}; for(const f of ['background.jpg',...['A','B'].flatMap(c=>Array.from({length:6},(_,i)=>c+i+'.jpg'))]) blobs[f]=new Uint8Array(await fs.readFile(root+(f==='background.jpg'?f:'illustrations/'+f)));
  const ink='#102C50', coral='#D9634C', blue='#347AA1', green='#357F68';
  const label={JP:'Meta公式（日本提供）',BIZ:'Meta公式（事業者向け）',SPACES:'Meta公式（Spaces）',SHIFT:'SHIFT AI ニュース',SHISHI:'SHISHIGAMI TECH CH',WONDER:'AI is in wonderland'};
  function text(s,name,str,x,y,w,h,size=30,bold=false,color=ink,align='left'){
    const t=s.shapes.add({geometry:'textbox',name,position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
    t.text=str;t.text.style={typeface:bold?'Hiragino Sans':'Hiragino Maru Gothic ProN',fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:0,lineSpacing:1.2}; return t;
  }
  function art(s,key,x=755,y=200,w=445,h=415){
    const n=+key[1], col=n%3,row=Math.floor(n/3);
    const ranges=key[0]==='A'?{xs:[.012,.339,.668],xe:[.331,.661,.988],ys:[.022,.509],ye:[.490,.979]}:{xs:[.011,.339,.669],xe:[.330,.661,.986],ys:[.068,.506],ye:[.492,.951]};
    s.images.add({blob:blobs[key+'.jpg'],contentType:'image/jpeg',alt:'説明用のAI生成イラスト',position:{left:x,top:y,width:w,height:h},fit:'contain'});
  }
  function bottom(s,str,color=coral){text(s,'takeaway',str,94,605,1090,43,25,true,color);}
  for (let i=0;i<spec.slides.length;i++){
    const d=spec.slides[i],s=presentation.slides.add({width:1280,height:720});
    s.background.fill='#FAF7ED';s.images.add({blob:blobs['background.jpg'],contentType:'image/jpeg',alt:'生成りの方眼ノート背景',position:{left:0,top:0,width:1280,height:720},fit:'cover'});
    text(s,'page',String(i+1).padStart(2,'0'),1185,672,50,28,17,false,blue,'right');
    if(d.type!=='cover')text(s,'title',d.title,70,65,1055,73,43,true);
    if(i===2)d.body='Metaが開発したパーソナルAI。\n計画を立て、アプリやWebで作業。\nWeb・スマホで基本機能を無料から。\n利用量に応じた有料プランもあります。'; if(d.type==='cover'){
      text(s,'eyebrow','MetaのパーソナルAIエージェント',75,72,1020,50,32,true);
      text(s,'muse','Muse',77,202,610,120,103,true);
      text(s,'cover-title','超活用講座',78,335,660,100,69,true);
      text(s,'subtitle',d.subtitle,82,475,660,58,31,true,coral);
      text(s,'cover-tag',d.tag,83,563,600,42,26);
      text(s,'date',spec.date+' 時点',135,660,950,30,18,false,blue);art(s,d.art,753,203,444,421);
    } else if(d.type==='agenda'){
      d.items.forEach((v,j)=>{const x=j%2===0?95:685,y=j<2?205:392;text(s,'agenda-n-'+j,v[0],x,y,80,62,46,true,coral);text(s,'agenda-t-'+j,v[1],x+98,y+3,440,48,34,true);text(s,'agenda-b-'+j,v[2],x+98,y+65,425,95,25);});bottom(s,d.bottom);
    } else if(d.type==='steps'){
      d.steps[3][2]='記憶と成果物を\n次の作業に生かす'; d.steps.forEach((v,j)=>{const x=85+j*300;text(s,'step-n-'+j,v[0],x,205,70,70,54,true,coral);text(s,'step-t-'+j,v[1],x,310,275,62,31,true);text(s,'step-b-'+j,v[2],x,400,275,124,26);});bottom(s,d.bottom);
    } else if(d.type==='apps'){
      d.groups.forEach((v,j)=>{const y=190+j*132;text(s,'apps-label-'+j,v[0],92,y,310,50,33,true,[blue,green,coral][j]);text(s,'apps-name-'+j,v[1],420,y,760,45,31,true);text(s,'apps-b-'+j,v[2],420,y+52,760,50,26);});bottom(s,d.bottom,blue);
    } else if(d.type==='hero'){
      text(s,'lead',d.lead,88,200,660,125,35,true,coral);
      text(s,'body',d.body,90,371,650,175,28);
      art(s,d.art);bottom(s,d.bottom);
      if(d.art==='B1')text(s,'illustration-label','画面はイメージ',925,573,255,30,17,false,blue,'right');
    } else if(d.type==='use'){
      text(s,'lead',d.lead,88,188,680,60,34,true,coral);
      text(s,'body',d.body,92,274,640,155,28);
      text(s,'prompt-label','頼み方の例',92,449,610,40,23,true,blue);
      text(s,'prompt',d.prompt,92,495,665,120,25);
      art(s,d.art,779,204,414,389);
      text(s,'evidence',d.evidence,92,632,1050,33,19,false,blue);
    } else if(d.type==='prompt'){
      text(s,'lead',d.lead,88,197,790,62,34,true,coral);
      text(s,'prompt-example',d.example,92,305,695,235,31);
      art(s,d.art,820,276,370,310);bottom(s,d.bottom);
    } else if(d.type==='workshop'){
      text(s,'lead',d.lead,88,195,770,62,34,true,coral);
      d.tasks.forEach((v,j)=>{text(s,'work-n-'+j,String(j+1),92,305+j*84,50,55,34,true,blue);text(s,'work-t-'+j,v,155,310+j*84,630,68,27);});art(s,d.art,844,270,350,310);bottom(s,d.bottom);
    } else if(d.type==='sources'){
      text(s,'video-label','YouTube：字幕・概要欄を確認',88,180,1080,44,27,true,coral);
      const videos=[['SHIFT AI ニュース','基本機能・メールとDM・商談準備・SNS活用','SHIFT','2026.11.11'],['SHISHIGAMI TECH CH','経営者・営業向けの活用提案','SHISHI','2026.10.30'],['AI is in wonderland','クラウドの作業場・画像と動画の実演','WONDER','2026.11.15']];
      videos.forEach((v,j)=>{const y=241+j*93;const t=text(s,'video-'+j,v[0]+'  '+v[3],94,y,1100,38,25,true);t.text.get(v[0]).link={uri:spec.sources[v[2]],isExternal:true};text(s,'video-desc-'+j,v[1],94,y+41,1100,38,22);});
      text(s,'official-label','Meta公式：提供状況と機能を照合',88,535,1090,42,26,true,coral);
      [['日本での提供開始','JP'],['小規模事業者向け','BIZ'],['Spaces','SPACES']].forEach((v,j)=>{let t=text(s,'official-'+j,v[0],94+j*375,592,355,42,24,true,blue);t.text.get(v[0]).link={uri:spec.sources[v[1]],isExternal:true};});
      text(s,'asof','情報確認日：2026年11月18日。機能・連携先・料金は提供状況により変わります。',135,650,1075,35,18);
    }
    if(!['cover','sources','use'].includes(d.type)&&d.sources.length){text(s,'source', '出典：'+d.sources.map(k=>label[k]).join(' ／ '),135,660,1050,27,16,false,blue);}
    s.speakerNotes.text=(d.notes||'')+'\n\n出典\n'+d.sources.map(k=>label[k]+'\n'+spec.sources[k]).join('\n\n')+'\n\n情報確認日：2026年11月18日。挿絵はAI生成の説明用イラスト。';
  }

  await fs.mkdir(outDir,{recursive:true});
  await (await PresentationFile.exportPptx(presentation)).save(path.join(outDir,"muse-ai-seminar.pptx"));
}
