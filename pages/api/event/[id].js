import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";
import { isValidObjectId } from "mongoose";

const handler = async (req, res) => {
    const { id } = req.query;

    switch(req.method){
        case 'POST':
            // Insert participant dates
            try{
                await dbConnect();
                const event = await Event.findById(id);
                event.dates.map((date, index) => {
                    if(req.body.dates.includes(index)){
                        date.participants.push(req.body.participant);
                    }
                });
                await Event.updateOne({ _id: id }, { dates: event.dates });
                return res.status(201).json({ ok: true });
            }catch(errors){
                return res.status(400).json({ ok: false, msg: 'There is a problem connecting to the database, try again later.' });
            }
            break;
        case 'PUT':
            // Update event
            try{
                await dbConnect();
                await Event.updateOne({ _id: id }, {
                    name: req.body.name,
                    description: req.body.description,
                    dates: req.body.dates
                });
                return res.status(201).json({ ok: true });
            }catch(errors){
                console.log(errors)
                return res.status(400).json({ ok: false, msg: 'There is a problem connecting to the database, try again later.' });
            }
            break;
        case 'GET':
            try{
                await dbConnect();
                if(!isValidObjectId(id)){
                    throw { type: 'handled', msg: 'Couldn\'t find event with this id .' };
                }
                const event = await Event.findById(id);
                if(event === null){
                    throw { type: 'handled', msg: 'Couldn\'t find event with this id .' };
                }
                return res.status(200).json({ ok: true, event });
            }catch(errors){
                if(errors && errors.type === 'handled'){
                    return res.status(400).json({ ok: false, msg: errors.msg });
                }
                return res.status(400).json({ ok: false, msg: 'There is a problem connecting to the database, try again later.' });
            }
    }
}

export default handler;