import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";

const handler = async (req, res) => {
  switch(req.method){
    case 'POST':
      try{
        await dbConnect();
        const event = await Event.create(req.body);
        return res.status(201).json({ ok: true, event });
      }catch(errors){
        return res.status(400).json({ ok: false, msg: 'There is a problem connecting to the database, try again later.' });
      }
      break;
  }
}

export default handler;