import { useState } from "react";
import "./App.css";
import axios from "axios";
import { Button } from "@/components/ui/Button";

function App() {
  const [database, setDatabase] = useState("");
  const [schema, setSchema] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState(null);

  async function submitData(e) {
    e.preventDefault();
    const apiResponse = await axios.post("http://localhost:8000/", {
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

        {response && <p className=" text-base leading-7 text-foreground max-w-prose bg-card border border-border p-8 rounded-xl w-[450px] flex items-center justify-center text-secondary-foreground text-2xl font-bold text-foreground">{response.response.sql}</p>}
      </div>
    </>
  );
}

export default App;
