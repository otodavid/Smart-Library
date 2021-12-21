import { createContext, useState } from "react";
import "../styles/globals.css";

const DataContext = createContext();

function MyApp({ Component, pageProps }) {
  const [title, setTitle] = useState('')

  return (
    <DataContext.Provider value={{ title, setTitle }}>
      <Component {...pageProps} />
    </DataContext.Provider>
  );
}

export default MyApp;
