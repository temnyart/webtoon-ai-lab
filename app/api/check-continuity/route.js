export const runtime='nodejs';
export const maxDuration=300;

function extractText(data){
 for(const item of data?.output||[]){
  for(const c of item?.content||[])if((c?.type==='output_text'||c?.type==='text')&&c.text)return c.text;
 }
 return data?.output_text||'';
}
function parseJSON(text){
 const clean=String(text||'').replace(/^```json\s*/i,'').replace(/```$/,'').trim();
 try{return JSON.parse(clean)}catch(e){
  const m=clean.match(/\{[\s\S]*\}/);if(m)return JSON.parse(m[0]);throw e;
 }
}
export async function POST(req){
 try{
  if(!process.env.OPENAI_API_KEY)return Response.json({error:'OPENAI_API_KEY가 없습니다.'},{status:503});
  const b=await req.json();
  if(!b.currentImage)return Response.json({error:'currentImage가 필요합니다.'},{status:400});
  const schema=`Return ONLY JSON:
{"severity":"ok|warning|critical","summary":"Korean summary","issues":[
{"type":"color_temperature","status":"ok|warning|critical","detail":"Korean","fix":"Korean"},
{"type":"character_identity","status":"ok|warning|critical","detail":"Korean","fix":"Korean"},
{"type":"wardrobe","status":"ok|warning|critical","detail":"Korean","fix":"Korean"},
{"type":"background_structure","status":"ok|warning|critical","detail":"Korean","fix":"Korean"},
{"type":"prop_position","status":"ok|warning|critical","detail":"Korean","fix":"Korean"},
{"type":"damage_state","status":"ok|warning|critical","detail":"Korean","fix":"Korean"}]}`;
  const prompt=[
   'You are a strict continuity QC supervisor for a Korean vertical webtoon.',
   'The FIRST image is CURRENT CUT. Remaining images are labeled previous/next cuts or MASTER references.',
   'Do NOT judge artistic beauty. Detect only continuity errors that should remain stable across the same scene/story state.',
   'Check: color temperature/light/exposure; face/hair identity; wardrobe; background architecture/furniture geometry; prop identity/position where narrative continuity requires it; injury/blood/torn-clothes/body-state continuity.',
   'A different camera angle, crop, pose, expression, or intentional story action is NOT an error by itself.',
   'If evidence is insufficient, do not invent a mismatch. Mark that category ok and say evidence is insufficient.',
   `SCENE: ${b.scene||''}`,
   `SCENE LOOK LOCK: ${JSON.stringify(b.sceneLook||{})}`,
   `CURRENT CUT SPEC: ${JSON.stringify(b.cut||{})}`,
   `STORY/ACTING: ${JSON.stringify(b.storyActing||{})}`,
   `EXPECTED CHARACTER STATE: ${JSON.stringify(b.characterState||{})}. Treat injury, blood, clothing damage, equipment and persistent physical state mismatches against this as continuity errors.`,
   `EXPECTED SPACE MAP / CAMERA: ${JSON.stringify(b.spatialContext||{})}. Treat impossible movement of fixed architecture/furniture, wall swaps, door/window relocation, or spatial relations that contradict this map as background_structure continuity errors. Different camera angles are allowed when they obey the same map.`,
   `MASTER NAMES: ${JSON.stringify(b.masterNames||[])}`,
   schema
  ].join('\n');
  const content=[{type:'input_text',text:prompt},{type:'input_text',text:'CURRENT CUT'},{type:'input_image',image_url:b.currentImage,detail:'high'}];
  for(const r of b.references||[]){
   if(!r.dataUrl)continue;
   content.push({type:'input_text',text:`REFERENCE: ${r.role}${r.cutId?` CUT ${r.cutId}`:''}${r.name?` · ${r.name}`:''}${r.type?` · ${r.type}`:''}`});
   content.push({type:'input_image',image_url:r.dataUrl,detail:'high'});
  }
  const model=process.env.OPENAI_QC_MODEL||process.env.OPENAI_ORCHESTRATOR_MODEL||'gpt-5';
  const resp=await fetch('https://api.openai.com/v1/responses',{signal:req.signal,method:'POST',headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model,input:[{role:'user',content}],max_output_tokens:1800})});
  const data=await resp.json();if(!resp.ok)return Response.json({error:data?.error?.message||'OpenAI continuity QC failed'},{status:resp.status});
  const report=parseJSON(extractText(data));
  const order={ok:0,warning:1,critical:2};let sev='ok';
  for(const x of report.issues||[])if((order[x.status]||0)>order[sev])sev=x.status;
  report.severity=sev;
  return Response.json({ok:true,model,report});
 }catch(e){console.error(e);return Response.json({error:e?.message||'Unexpected server error'},{status:500})}
}
