import Link from "next/link";
import Image from "next/image";

const Home = () => (
  <section className="home box">
    <h2>Welcome To Event Scheduler</h2>
    <p>
      Event Scheduler lets us find the best time to have our events .<br />
      This tool made having events much easier and a lot more fun .
    </p>
    <h3>Start using Event Scheduler :</h3>
    <div className="home-buttons">
      <ul>
        <li>
          <Link href="/event/new" className="home-create-event">
            <Image src="/images/icons/plus.png" alt="new event" width={64} height={64}/>
            <p>Create Event</p>
          </Link>
        </li>
        <li>
          <Link href="/event" className="home-join-event">
            <Image src="/images/icons/schedule.png" alt="existing event" width={64} height={64}/>
            <p>Join Event</p>
          </Link>
        </li>
      </ul>
    </div>
  </section>
)

export default Home;
