import { useState } from "react";
import "./App.css";
import axios from "axios";
import { Button } from "./components/ui/button";

function App() {
  const [database, setDatabase] = useState("");
  const [schema, setSchema] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState(null);
  const [isLoading,setIsLoading] = useState(false);

  async function submitData(e) {
    e.preventDefault();
    setIsLoading(true);
    try{

      const apiResponse = await axios.post("https://sql-generator-bf95a45b.fastapicloud.dev/", {
        database,
        table_schema: schema,
        message,
      });
      setResponse(apiResponse.data);
      console.log(apiResponse.data);
      setDatabase("");
      setSchema("");
      setMessage("");
    }
    catch(error){
      console.log(error)
    }
    finally{
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="min-h-screen flex flex-col  gap-10 items-center justify-center bg-background">
        <form onSubmit={submitData} className="flex flex-col gap-4 bg-card border border-border p-8 rounded-xl w-[450px]">
          <input
            type="text"
            placeholder="Database"
            value={database}
            onChange={(e) => setDatabase(e.target.value)}
            className="border border-input rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-ring "
          />

          <input
            type="text"
            placeholder="Schema"
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
            className=" border border-input rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
          />

          <input
            type="text"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border border-input rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
          />

          <Button
            type="submit"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg"
          >
            Generate SQL
          </Button>
        </form>
        {isLoading && <p className="text-base leading-7 text-foreground max-w-prose bg-card border border-border p-8 rounded-xl w-[450px] flex items-center justify-center text-secondary-foreground text-2xl font-bold text-foreground">Generating SQL ..</p>}
        {response && <p className=" text-base leading-7 text-foreground max-w-prose bg-card border border-border p-8 rounded-xl w-[450px] flex items-center justify-center text-secondary-foreground text-2xl font-bold text-foreground">{response.response.sql}</p>}
      </div>
    </>
  );
}

export default App;
