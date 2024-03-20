import supabase from '../../../supabase';
import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { text, sender } = req.body;
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    try {
      // Insert original message into Supabase
      const { data: insertedMessage, error } = await supabase
        .from('message')
        .insert([{ content: text, role: sender }]);

      if (error) throw new Error(error.message);

      // Call OpenAI API for response
      const response = await openai.beta.threads.messages.create(
        process.env.THREAD_ID,
        {
          role: sender,
          content: text
        }
      );

      // Create Run Instruction
      const run = await openai.beta.threads.runs.create(
        process.env.THREAD_ID,
        { 
          assistant_id: process.env.ASSISTANT_ID,
        }
      );

      // Checking Run Status
      let runStatus = await openai.beta.threads.runs.retrieve(
        process.env.THREAD_ID,
        run.id
      );

      // If Complete Status Get Lat Message
      while (runStatus.status !== "completed") {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        runStatus = await openai.beta.threads.runs.retrieve(process.env.THREAD_ID, run.id);
      }

      // Get the last assistant message from the messages array
      const messages = await openai.beta.threads.messages.list(process.env.THREAD_ID,);

      // Find the last message for the current run
      const lastMessageForRun = messages.data
        .filter(
          (message) => message.run_id === run.id && message.role === "assistant"
        )
        .pop();

      // If an assistant message is found, console.log() it
      if (lastMessageForRun) {
         // Insert response into Supabase
        const { data: insertedReply, error: replyError } = await supabase
          .from('message')
          .insert([{ content: lastMessageForRun.content[0].text.value, role: 'assistant' }]);

          if (replyError) throw new Error(replyError.message);
      }

      res.status(200).json({ message: 'Successfully sending message!' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}