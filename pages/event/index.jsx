import { useRouter } from "next/router";
import { useState } from "react";

const JoinEvent = () => {
    const router = useRouter();
    const [disabled, setDisabled] = useState(false);
    const [formError, setFormError] = useState(false);
    const [id, setId] = useState('');

    const checkEventExist = async (e) => {
        e.preventDefault();

        setFormError(false);
        setDisabled(true);

        if(id.length < 1){
            throw {type: 'handled', msg: 'You must enter an id .'};
        }

        try{
            const req = await fetch(`/api/event/${id}`);
            const result = await req.json();

            if(!result.ok){
                throw {type: 'handled', msg: result.msg};
            }
            
            router.push(`/event/${id}`);
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
        <section className="join-event box">
            <h2>Join Event</h2>
            <p>Enter Event id and then click 'Join' .</p>
            <form onSubmit={e => checkEventExist(e)}>
                <input type="text" placeholder="Event id" value={id} onChange={e => setId(e.target.value)} required />
                <button type="submit" disabled={disabled}>Join</button>
            </form>
            <div className="form-errors">
                {formError && <p>{formError}</p>}
            </div>
        </section>
    )
}

export default JoinEvent;