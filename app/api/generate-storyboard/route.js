export const runtime='nodejs';
export const maxDuration=300;
function imageResult(response){
 for(const item of response?.output||[]){
  if(item?.type==='image_generation_call'){if(item.result)return item.result;if(item.b64_json)return item.b64_json;if(item.output?.b64_json)return item.output.b64_json}
  for(const c of item?.content||[])if(c?.type==='output_image'&&(c.image_base64||c.b64_json))return c.image_base64||c.b64_json;
 }return null
}
export async function POST(req){
 try{
  if(!process.env.OPENAI_API_KEY)return Response.json({error:'OPENAI_API_KEY가 없습니다.'},{status:503});
  const b=await req.json();
  const prompt=[
   'Create a ROUGH PRODUCTION STORYBOARD FRAME for a Korean vertical webtoon.',
   'PURPOSE: review composition, staging, camera, blocking and story readability BEFORE final artwork.',
   'STYLE: monochrome storyboard drawing, clean loose pencil/ink lines, simple gray values, minimal rendering, no polished painting, no decorative detail.',
   'Do not make this look like finished webtoon art. Keep faces simplified but character positions and body acting readable.',
   'NO speech bubbles, NO captions, NO letters, NO sound-effect typography, NO watermark.',
   `SCENE: ${b.scene||''}`,`CUT: ${b.cutId} · ${b.title||''}`,`SHOT: ${b.shot||''}`,`CAMERA: ${b.camera||''}`,`ACTION/BLOCKING: ${b.action||''}`,
   `CHARACTERS: ${JSON.stringify(b.characters||[])}`,`BACKGROUND: ${JSON.stringify(b.backgrounds||[])}`,`PROPS: ${JSON.stringify(b.props||[])}`,
   `STORY/ACTING: ${JSON.stringify(b.storyActing||{})}`,
   `SPACE/CAMERA MAP: ${JSON.stringify(b.spatialContext||{})}`,
   `CHARACTER STATE: ${JSON.stringify(b.characterState||{})}`,
   b.storyboardNote?`DIRECTOR REVIEW NOTE FROM PREVIOUS CONTE: ${b.storyboardNote}. Correct the new storyboard to satisfy this note while preserving the CUT story beat.`:'',
   'MASTER references, if provided, are for identity and spatial recognition only. Preserve the intended shot instead of copying MASTER camera angles.',
   'Final check: a director should be able to approve or reject this frame based on camera, pose, screen direction and staging alone.'
  ].join('\n');
  const content=[{type:'input_text',text:prompt}];
  for(const r of b.references||[]){if(r?.dataUrl){content.push({type:'input_text',text:`REFERENCE · ${r.type||''} · ${r.name||''}`});content.push({type:'input_image',image_url:r.dataUrl,detail:'low'})}}
  const orchestrator=process.env.OPENAI_ORCHESTRATOR_MODEL||'gpt-5';
  const imageModel=process.env.OPENAI_STORYBOARD_IMAGE_MODEL||process.env.OPENAI_IMAGE_MODEL||'gpt-image-1.5';
  const payload={model:orchestrator,input:[{role:'user',content}],tools:[{type:'image_generation',model:imageModel,quality:'low',output_format:'webp',output_compression:80}],tool_choice:{type:'image_generation'}};
  const r=await fetch('https://api.openai.com/v1/responses',{signal:req.signal,method:'POST',headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify(payload)});
  const data=await r.json();if(!r.ok)return Response.json({error:data?.error?.message||'Storyboard generation failed'},{status:r.status});
  const b64=imageResult(data);if(!b64)return Response.json({error:'콘티 이미지 결과를 찾지 못했습니다.'},{status:502});
  return Response.json({ok:true,image:`data:image/webp;base64,${b64}`,model:imageModel,prompt});
 }catch(e){console.error(e);return Response.json({error:e?.message||'Unexpected server error'},{status:500})}
}
