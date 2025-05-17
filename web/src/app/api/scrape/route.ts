//import {userPrompt} from './userPrompt';
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

console.log("women in stem");

export async function POST(req: NextRequest) {
  const openai = new OpenAI({
    // creates new openai client
    apiKey: process.env.OPENAI_API_KEY, // accesses the api key from the .env file
  });

  try {
    const { website } = await req.json(); // resume is a string; instagramData is a json object
    const userPrompt = `here is the website link: ${website} Extract a detailed description of every procedure. RETURN WHATEVER RESPONSE IT IS IN QUOTATION MARKS`; // this is the user prompt that will be sent to the model
    const local_userPrompt = userPrompt; // the user prompt is the input that the model will respond to

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [
        { role: "user", content: local_userPrompt }, // user --> the question
        // assistant --> if u wanted to save chat history i guess (keep it context aware)
      ],
      temperature: 0.4,
    });


    const response = completion.choices[0].message.content; //chatgpt returns an array of choices, so u chose the first one or something idk
    
    console.log("IS THIS WORKINGIGNIGN")
    console.log(response);

    const data = {
      "response": response
      }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json({ error: "mehek messed up" }, { status: 500 });
  }
}