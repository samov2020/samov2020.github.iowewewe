import Link from "next/link";

const Header = () => (
    <header>
        <h1>Event Scheduler</h1>
        <nav className="box">
            <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/event/new">Create Event</Link></li>
                <li><Link href="/event">Join Event</Link></li>
            </ul>
        </nav>
    </header>
)

export default Header;