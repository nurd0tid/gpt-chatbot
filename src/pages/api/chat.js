// pages/api/chat.js
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
      const response = await openai.chat.completions.create({
        messages: [{ role: "system", content: text }],
        model: "gpt-3.5-turbo",
      });

      const replyContent = response.choices[0].message.content;

      // Insert response into Supabase
      const { data: insertedReply, error: replyError } = await supabase
        .from('message')
        .insert([{ content: replyContent, role: 'system' }]);

      if (replyError) throw new Error(replyError.message);

      res.status(200).json({ message: 'Successfully sending message!' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
