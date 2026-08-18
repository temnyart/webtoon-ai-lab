export const runtime='nodejs';
export const maxDuration=300;
function textOf(data){for(const item of data?.output||[])for(const c of item?.content||[])if(c?.type==='output_text'&&c.text)return c.text;return data?.output_text||''}
function parseJSON(t){const x=String(t||'').replace(/^```json\s*/i,'').replace(/```$/,'').trim();try{return JSON.parse(x)}catch(e){const m=x.match(/\{[\s\S]*\}/);if(m)return JSON.parse(m[0]);throw e}}
export async function POST(req){
 try{
  if(!process.env.OPENAI_API_KEY)return Response.json({error:'OPENAI_API_KEY가 없습니다.'},{status:503});
  const b=await req.json();
  const chars=b.characters||[];if(!chars.length)return Response.json({ok:true,states:{}});
  const prompt=`You are a webtoon production continuity state tracker.\nInfer each character's PHYSICAL/VISUAL STATE AT THE END OF THE CURRENT CUT.\nUse the previous state as the default and carry it forward unless the current cut clearly changes it. Never invent injuries, blood, costume changes, equipment changes, dirt, hairstyle changes, or healing without evidence.\nStory emotions may change, but permanent/visible physical state persists until explicitly changed or treated.\nIf a field does not change, preserve the previous value exactly.\n\nEPISODE: ${b.episodeId}\nCUT: ${b.cutId}\nSCENE: ${b.scene}\nCHARACTERS: ${JSON.stringify(chars)}\nPREVIOUS STATES: ${JSON.stringify(b.previous||{})}\nCURRENT CUT: ${JSON.stringify(b.cut||{})}\nSTORY ACTING: ${JSON.stringify(b.storyActing||{})}\nSCENE DIRECTING: ${JSON.stringify(b.sceneDirecting||{})}\n\nReturn ONLY JSON with this exact shape:\n{"states":{"CHARACTER_NAME":{"condition":"정상/피로/부상 등","injury":"없음 or precise injury","blood":"없음 or location/amount","clothes":"visible wardrobe state","equipment":"carried/worn items state","hair":"hair state","body":"physical posture/state that should persist if relevant","emotionResidue":"emotion remaining into next cut","location":"where the character ends this cut","notes":"short Korean continuity note","changedFields":["field"]}}}`;
  const model=process.env.OPENAI_STATE_MODEL||process.env.OPENAI_ORCHESTRATOR_MODEL||'gpt-5';
  const r=await fetch('https://api.openai.com/v1/responses',{signal:req.signal,method:'POST',headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model,input:prompt,max_output_tokens:2200})});
  const data=await r.json();if(!r.ok)return Response.json({error:data?.error?.message||'OpenAI state tracking failed'},{status:r.status});
  const parsed=parseJSON(textOf(data));
  return Response.json({ok:true,model,states:parsed.states||{}});
 }catch(e){console.error(e);return Response.json({error:e?.message||'Unexpected server error'},{status:500})}
}
