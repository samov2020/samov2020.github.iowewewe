import { useState } from "react";
import { useRouter } from "next/router";

const NewEvent = () => {
    const router = useRouter();
    const [formError, setFormError] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [dates, setDates] = useState([]);
    const [editPassword, setEditPassword] = useState('');

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

    const postData = async (e) => {
        e.preventDefault();

        setFormError(false);
        setDisabled(true);

        try{
            if(name.length < 1 || editPassword.length < 1 || dates.length < 1){
                console.log('x');
                throw {type: 'handled', msg: 'You must include name and password and at least 1 date.'}
            }
            
            const req = await fetch('/api/event', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, description, editPassword, dates })
            });

            const result = await req.json();

            if(!result.ok){
                throw {type: 'handled', msg: result.msg};
            }

            router.push(`/event/${result.event._id}`);
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
        <section className="new-event box">
            <h2>Create Event</h2>
            <p>Fill the form and then click 'Create' to create a new event .</p>
            <form onSubmit={e => postData(e)}>
                <input type="text" placeholder="Event Name" value={name} onChange={e => {setName(e.target.value)}} required />
                <textarea placeholder="Event Description" value={description} onChange={e => {setDescription(e.target.value)}}></textarea>
                <input type="text" placeholder="Password for edit" value={editPassword} onChange={e => {setEditPassword(e.target.value)}} required />
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
                <button id="SubmitButton" type="submit" disabled={disabled}>Create</button>
            </form>
            <div className="form-errors">
                {formError && <p>{formError}</p>}
            </div>
        </section>
    )
}

export default NewEvent;