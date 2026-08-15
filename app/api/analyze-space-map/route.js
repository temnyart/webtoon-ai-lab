export const runtime='nodejs';
export const maxDuration=300;
function textOf(d){for(const i of d?.output||[])for(const c of i?.content||[])if(c?.type==='output_text'&&c.text)return c.text;return d?.output_text||''}
function parseJSON(t){const x=String(t||'').replace(/^```json\s*/i,'').replace(/```$/,'').trim();try{return JSON.parse(x)}catch(e){const m=x.match(/\{[\s\S]*\}/);if(m)return JSON.parse(m[0]);throw e}}
export async function POST(req){
 try{
  if(!process.env.OPENAI_API_KEY)return Response.json({error:'OPENAI_API_KEY가 없습니다.'},{status:503});
  const b=await req.json();if(!b.image)return Response.json({error:'BACKGROUND MASTER 이미지가 필요합니다.'},{status:400});
  const prompt=`Analyze this BACKGROUND MASTER as a persistent webtoon production set.
Create a simple top-down spatial map. Infer only stable visible architecture/furniture; do not hallucinate hidden rooms.
Coordinates: x=0 west/left, x=100 east/right, y=0 north/back, y=100 south/front.
For perspective-ambiguous items, still give an approximate location and keep the list compact.
Return ONLY JSON:
{"map":{"geometry":"Korean description of room/set shape","orientation":"N/E/S/W interpretation","entrances":"doors/openings","fixedRules":"what must never move between cuts","anchors":[{"name":"침대","zone":"fixed|furniture|prop|path","x":20,"y":65,"fixed":true}]}}
BACKGROUND: ${b.name||''}`;
  const model=process.env.OPENAI_QC_MODEL||process.env.OPENAI_ORCHESTRATOR_MODEL||'gpt-5';
  const r=await fetch('https://api.openai.com/v1/responses',{signal:req.signal,method:'POST',headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model,input:[{role:'user',content:[{type:'input_text',text:prompt},{type:'input_image',image_url:b.image,detail:'high'}]}],max_output_tokens:1800})});
  const data=await r.json();if(!r.ok)return Response.json({error:data?.error?.message||'Space map analysis failed'},{status:r.status});
  return Response.json({ok:true,model,map:parseJSON(textOf(data)).map});
 }catch(e){return Response.json({error:e?.message||'Unexpected server error'},{status:500})}
}
