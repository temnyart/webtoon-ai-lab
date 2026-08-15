export const runtime = 'nodejs';
export async function GET(){
  return Response.json({ok:true, openaiConfigured:Boolean(process.env.OPENAI_API_KEY), imageModel:process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1.5', storyboardImageModel:process.env.OPENAI_STORYBOARD_IMAGE_MODEL || process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1.5'});
}
