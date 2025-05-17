import { systemPrompt } from "./systemPrompt";
//import {userPrompt} from './userPrompt';
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

console.log("women in stem");

// graveyard for the non working stuf 🪦🪦🪦🪦🪦🪦🪦🪦🪦🪦🪦🪦

// POST is used to send data to a server to create/update a resource

// dummy temp stuff
let messageHistory: ChatCompletionMessageParam[]  = [{ role: "system", content: systemPrompt}];

export async function POST(req: NextRequest) {
  const openai = new OpenAI({
    // creates new openai client
    apiKey: process.env.OPENAI_API_KEY, // accesses the api key from the .env file
  });

  try {
    const { prompt, factors, website } = await req.json(); // resume is a string; instagramData is a json object

    // NEED TO BUILD THE USER PROMPT HERE
    const userPrompt = `prompt: ${prompt} factors: ${JSON.stringify(factors)} website: ${website}`; // this is the user prompt that will be sent to the model

    const local_systemPrompt = systemPrompt; // the system prompt is a set of instructions that tells the model how to behave
    const local_userPrompt = userPrompt; // the user prompt is the input that the model will respond to

    messageHistory.push({role: "user", content: local_userPrompt}); // add the user prompt to the message history

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      // messages: [
      //   { role: "system", content: local_systemPrompt }, // system --> set behavior
      //   { role: "user", content: local_userPrompt }, // user --> the question
      //   // assistant --> if u wanted to save chat history i guess (keep it context aware)
      // ],
      messages: messageHistory,
      temperature: 0.4,
    }) ;

    const response = completion.choices[0].message.content; //chatgpt returns an array of choices, so u chose the first one or something idk
    console.log(response);


    // Save assistant's reply to context
    messageHistory.push({ role: "assistant", content: response! });

    // const data = JSON.parse(response);

    const data = {
      "response": response
      }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json({ error: "alan lalwani messed up" }, { status: 500 });
  }
}