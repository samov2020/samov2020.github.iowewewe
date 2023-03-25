import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export async function getServerSideProps(context) {
    try{
        const req = await fetch(`${process.env.URL}/api/event/${context.params.id}`);
        const result = await req.json();

        

        if(!result.ok){
            throw 'error';
        }

        return {
            props: { event: result.event },
        }
    }catch(errors){
        return {
            props: { notfound: true },
        }
    }
}

const Event = ({ event, notfound = false }) => {
    const router = useRouter();
    const [disabled, setDisabled] = useState(false);
    const [formError, setFormError] = useState(false);
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        setDisabled(true);
        setFormError(false);

        const boxes = Array.from(document.getElementsByClassName('checkbox'));
        let checkedBoxes = [];

        boxes.map(box => {
            if(box.checked){
                checkedBoxes.push(parseInt(box.value));
            }
        });

        try{
            if(checkedBoxes.length < 1){
                throw {type: 'handled', msg: 'You haven\'t picked any dates.'};
            }

            const req = await fetch(`/api/event/${event._id}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ dates: checkedBoxes, participant: name })
            });
    
            const result = await req.json();
    
            if(!result.ok){
                throw {type: 'handled', msg: result.msg};
            }
    
            router.push('/');
        }catch(errors){
            if(errors && errors.type === 'handled'){
                setFormError(errors.msg);
            }else{
                setFormError('There is a problem submitting this form, Try again later .');
            }
            setDisabled(false);
        }
    }

    return(
        notfound ? 'Not found' :
        <section className="event box">
            <div className="event-top">
                <h2>{event && event.name}</h2>
                <Link href={`/event/edit/${event._id}`}>Mod</Link>
            </div>
            <p>{event && event.description}</p>
            <form className="event-dates" onSubmit={e => handleSubmit(e)}>
                <div>
                    <h3>Dates :</h3>
                    <small>
                        <b>Pick the dates that are convenient for you then fill the name and click submit .</b><br />
                        (To pick a date click on the box with the date you want - It will turn blue .)<br />
                        (To undo click again - It will turn gray .)
                    </small>
                </div>
                <ul>
                    {event && event.dates.map((dateObject, index) => {
                        return(
                            <li key={index}>
                                <input className="checkbox" id={`DateCheckbox[${index}]`} type="checkbox" value={index} />
                                <label htmlFor={`DateCheckbox[${index}]`}>
                                    <ul>
                                        <li><b>Date: </b>{new Intl.DateTimeFormat("en-US", {}).format(new Date(dateObject.date))}</li>
                                        <li><b>Day: </b>{new Intl.DateTimeFormat("en-US", { weekday: 'long' }).format(new Date(dateObject.date))}</li>
                                        <li><b>Time: </b>{new Date(dateObject.date).toLocaleTimeString()}</li>
                                    </ul>
                                </label>
                            </li>
                        );
                    })}
                </ul>
                <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
                <button type="submit" disabled={disabled}>Submit</button>
            </form>
            <div className="form-errors">
                {formError && <p>{formError}</p>}
            </div>
        </section>
    )
}

export default Event;