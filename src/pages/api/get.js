// pages/api/getchat.js
import supabase from '../../../supabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Mengambil seluruh data chat dari tabel 'message'
      const { data: messages, error } = await supabase.from('message').select('*');

      if (error) {
        throw error;
      }

      // Mengirimkan data chat ke klien
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
