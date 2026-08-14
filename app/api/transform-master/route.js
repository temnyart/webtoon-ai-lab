export const runtime='nodejs';
export const maxDuration=300;

function imageResult(response){
  for(const item of response?.output||[]){
    if(item?.type==='image_generation_call'){
      if(item.result) return item.result;
      if(item.b64_json) return item.b64_json;
      if(item.output?.b64_json) return item.output.b64_json;
    }
    for(const content of item?.content||[]){
      if(content?.type==='output_image'&&(content.image_base64||content.b64_json)) return content.image_base64||content.b64_json;
    }
  }
  return null;
}

export async function POST(req){
  try{
    if(!process.env.OPENAI_API_KEY) return Response.json({error:'OPENAI_API_KEY가 Vercel 환경변수에 등록되지 않았습니다.'},{status:503});
    const body=await req.json();
    const {name='',type='CHARACTER',dataUrl='',projectStyle='',visualBible=''}=body||{};
    if(!dataUrl||!/^data:image\/(png|jpeg|webp);base64,/i.test(dataUrl)) return Response.json({error:'MASTER 이미지가 필요합니다.'},{status:400});

    const common=[
      'This is a MASTER STYLE CONVERSION task, not a redesign and not a new scene.',
      'Preserve the exact original framing, camera position, perspective, subject placement, scale, silhouette and composition.',
      'Do not add or remove people, objects, furniture, architecture, weapons, accessories, doors, windows, decorations or scenery.',
      'Do not change pose, gesture, facial expression, body orientation or spatial position.',
      'Only translate the rendering language into a consistent Korean action/martial-arts webtoon production style.',
      'Target style: strong clean controlled line art, simplified 2-3 step cel shading, restrained texture, readable shapes, production-friendly webtoon rendering.',
      'Avoid photorealism, 3D render appearance, painterly novel-cover rendering, excessive material micro-detail, cinematic depth-of-field blur, or glossy skin.',
      projectStyle?`Project style: ${projectStyle}`:'',
      visualBible?`Visual Bible: ${visualBible.slice(0,7000)}`:''
    ];
    const typeRules=type==='BACKGROUND'?[
      'BACKGROUND MASTER LOCK: this image represents an exact recurring physical set.',
      'Preserve architecture geometry, wall proportions, floor plane, ceiling height, door and window locations, furniture positions, object spacing, pathways and perspective lines.',
      'Do not redesign the room/building to look more dramatic. Do not move the bed, table, shelves, doors, windows, pillars, stairs or major props.',
      'Materials may be simplified into webtoon cel-shaded surfaces, but their identity and placement must remain the same.',
      'The output should function as a reusable background production MASTER of the exact same set.'
    ]:type==='CHARACTER'?[
      'CHARACTER MASTER LOCK: this image represents the exact recurring character identity.',
      'Preserve face shape, eye shape and spacing, nose/mouth proportions, age impression, hairstyle silhouette, bangs/parting, body proportions, costume design, costume layering and major colors.',
      'Do not beautify, age up/down, change hairstyle, alter costume design or substitute a similar person.',
      'Preserve the exact pose and framing from the input because this is a style-conversion MASTER, not a new character illustration.',
      'The output should function as a reusable production character MASTER in the final webtoon rendering style.'
    ]:[
      'PROP MASTER LOCK: preserve exact silhouette, construction, materials, proportions, orientation, framing and identifiable details.',
      'Only simplify rendering into the final webtoon line-and-cel-shading style.'
    ];

    const content=[
      {type:'input_text',text:[`MASTER NAME: ${name}`,`MASTER TYPE: ${type}`,...common,...typeRules,'FINAL CHECK: same design, same geometry, same pose, same composition; only the drawing/rendering style changes.'].filter(Boolean).join('\n')},
      {type:'input_image',image_url:dataUrl,detail:'high'}
    ];
    const payload={
      model:process.env.OPENAI_ORCHESTRATOR_MODEL||'gpt-5',
      input:[{role:'user',content}],
      tools:[{type:'image_generation',model:process.env.OPENAI_IMAGE_MODEL||'gpt-image-1.5',quality:'high',size:type==='BACKGROUND'?'1536x1024':type==='CHARACTER'?'1024x1536':'1024x1024',input_fidelity:'high',output_format:'webp',output_compression:94}],
      tool_choice:{type:'image_generation'}
    };
    const r=await fetch('https://api.openai.com/v1/responses',{
      method:'POST',
      headers:{'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify(payload)
    });
    const data=await r.json();
    if(!r.ok) return Response.json({error:data?.error?.message||'OpenAI MASTER transform request failed',details:data?.error||null},{status:r.status});
    const b64=imageResult(data);
    if(!b64) return Response.json({error:'변환 이미지 결과를 찾지 못했습니다.',responseId:data?.id||null},{status:502});
    return Response.json({ok:true,image:`data:image/webp;base64,${b64}`,model:process.env.OPENAI_IMAGE_MODEL||'gpt-image-1.5',responseId:data.id});
  }catch(err){
    console.error(err);
    return Response.json({error:err?.message||'Unexpected server error'},{status:500});
  }
}
