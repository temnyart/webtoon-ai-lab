export const runtime = 'nodejs';
export const maxDuration = 300;

function imageResult(response){
  for(const item of response?.output || []){
    if(item?.type === 'image_generation_call'){
      if(item.result) return item.result;
      if(item.b64_json) return item.b64_json;
      if(item.output?.b64_json) return item.output.b64_json;
    }
    for(const content of item?.content || []){
      if(content?.type === 'output_image' && (content.image_base64 || content.b64_json)) return content.image_base64 || content.b64_json;
    }
  }
  return null;
}

export async function POST(req){
  try{
    if(!process.env.OPENAI_API_KEY) return Response.json({error:'OPENAI_API_KEY가 Vercel 환경변수에 등록되지 않았습니다.'},{status:503});
    const body = await req.json();
    const {cutId,prompt,references=[],continuity,shot,camera,action} = body || {};
    if(!prompt) return Response.json({error:'prompt is required'},{status:400});
    if(references.length > 6) return Response.json({error:'MASTER reference는 최대 6개까지 전송할 수 있습니다.'},{status:400});
    const content=[{type:'input_text',text:[
      'Create exactly one vertical Korean martial-arts webtoon panel.',
      'Preserve registered MASTER character identity, face, hair, body proportions, costume design, and MASTER background structure whenever reference images are supplied.',
      'Clean controlled line art, 2-3 step cel shading, clearly readable webtoon composition.',
      'Do not render speech bubbles, captions, sound effects, letters, logos, watermarks, or UI.',
      'Avoid photorealism, 3D render appearance, novel-cover illustration style, excessive skin texture, unnecessary ornaments or invented props.',
      `CUT: ${String(cutId).padStart(3,'0')}`,
      `Continuity: ${continuity||'LOCKED'}`,
      `Shot: ${shot||''}`,
      `Camera: ${camera||''}`,
      `Action: ${action||''}`,
      `Production specification: ${prompt}`
    ].join('\n')}];
    for(const ref of references){
      if(ref?.dataUrl && /^data:image\/(png|jpeg|webp);base64,/i.test(ref.dataUrl)) content.push({type:'input_image',image_url:ref.dataUrl,detail:'high'});
    }
    const payload={
      model: process.env.OPENAI_ORCHESTRATOR_MODEL || 'gpt-5',
      input:[{role:'user',content}],
      tools:[{type:'image_generation',model:process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1.5',quality:'high',size:'1024x1536',input_fidelity:'high',output_format:'webp',output_compression:92}],
      tool_choice:{type:'image_generation'}
    };
    const r=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const data=await r.json();
    if(!r.ok) return Response.json({error:data?.error?.message || 'OpenAI API request failed',details:data?.error || null},{status:r.status});
    const b64=imageResult(data);
    if(!b64) return Response.json({error:'이미지 결과를 찾지 못했습니다.',responseId:data?.id || null},{status:502});
    return Response.json({ok:true,cutId,image:`data:image/webp;base64,${b64}`,responseId:data.id,model:process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1.5'});
  }catch(err){
    console.error(err);
    return Response.json({error:err?.message || 'Unexpected server error'},{status:500});
  }
}
