import '@/styles/globals.css';
import Header from '@/components/Header';

const App = ({ Component, pageProps }) => {
  return (
    <main>
      <div className="container">
        <Header />
        <Component {...pageProps} />
      </div>
    </main>
  );
}

export default App;