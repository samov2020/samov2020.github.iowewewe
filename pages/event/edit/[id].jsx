import { useState } from "react";
import { useRouter } from "next/router";

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

const EditEvent = ({ event, notfound = false }) => {
    const router = useRouter();
    const [notauth, setNotAuth] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [formError, setFormError] = useState(false);
    const [editPassword, setEditPassword] = useState('');
    const [name, setName] = useState(event.name);
    const [description, setDescription] = useState(event.description);
    const [dates, setDates] = useState(event.dates);

    const auth = (e) => {
        e.preventDefault();

        setDisabled(true);

        if(editPassword === event.editPassword){
            setNotAuth(false);
            setFormError(false);
        }else{
            setFormError('Entered key is incorrect');
        }
        setDisabled(false);
    }

    const addDate = () => {
        const newDates = [...dates];
        const today = new Date();
        newDates.push({date: today.toISOString(), participants: []});
        setDates(newDates);
    }

    const updateDate = (index, value) => {
        const newDates = [...dates];
        newDates[index].date = value;
        setDates(newDates);
    }

    const deleteDate = (index) => {
        const newDates = [...dates];
        newDates.splice(index, '1');
        setDates(newDates);
    }

    const putData = async (e) => {
        e.preventDefault();

        setDisabled(true);
        setFormError(false);

        try{
            if(name.length < 1 || editPassword.length < 1 || dates.length < 1){
                throw {type: 'handled', msg: 'You must include name and at least 1 date.'};
            }

            const req = await fetch(`/api/event/${event._id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, description, dates })
            });

            const result = await req.json();

            if(!result.ok){
                throw {type: 'handled', msg: result.msg};
            }

            router.push(`/event/${event._id}`);
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
        <section className="new-event">
            <div className="box"><h2>Manage Event</h2></div>
            {notauth ?
            <>
                <div className="box">
                    <h3>Authenticate</h3>
                    <p>Enter your edit password to manage your event .</p>
                    <form className="mid-margin-top" onSubmit={e => auth(e)}>
                        <input placeholder="Edit Password" type="text" value={editPassword} onChange={e => setEditPassword(e.target.value)} required />
                        <button type="submit" disabled={disabled}>Submit</button>
                    </form>
                    <div className="form-errors mid-margin-top">
                        {formError && <p>{formError}</p>}
                    </div>
                </div>
            </>
            :
            <>
                <div className="edit-event-results box">
                    <h3>View Results</h3>
                    <ul className="mid-margin-top">
                        {event.dates.map((date, index) => (
                            <li className="edit-event-result" key={index}>
                                <p><b>Date: {new Intl.DateTimeFormat("en-US", {}).format(new Date(date.date))}, {new Date(date.date).toLocaleTimeString()}</b></p>
                                <ul>
                                    {date.participants.length < 1 && <li>No submits for this date</li>}
                                    {date.participants.map((name, index) => (<li key={index}>{name}</li>))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="box">
                    <h3>Update Event</h3>
                    <p>Fill the form and then click 'Update' to update this event details .</p>
                    <form className="mid-margin-top" onSubmit={e => putData(e)}>
                        <input type="text" name="name" placeholder="Event Name" value={name} onChange={e => {setName(e.target.value)}} required />
                        <textarea name="description" placeholder="Event Description" value={description} onChange={e => {setDescription(e.target.value)}}></textarea>
                        <div className="new-event-dates">
                            <ul>
                            {dates.map((dateObject, index) => {
                                return (
                                    <li key={index}>
                                        <input type="datetime-local" value={dateObject.date} onChange={e => updateDate(index, e.target.value)} />
                                        <button type="button" onClick={() => deleteDate(index)}>x</button>
                                    </li>
                                );
                            })}
                            </ul>
                            <button type="button" onClick={addDate}>Add Date</button>
                        </div>
                        <button id="SubmitButton" type="submit" disabled={disabled}>Update</button>
                    </form>
                    <div className="form-errors mid-margin-top">
                        {formError && <p>{formError}</p>}
                    </div>
                </div>
            </>
            }
        </section>
    )
}

export default EditEvent;