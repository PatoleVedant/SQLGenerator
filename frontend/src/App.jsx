import { useState } from "react";
import "./App.css";
import axios from "axios";
import { Button } from "./components/ui/button";
import { tailChase } from 'ldrs'
tailChase.register()


function App() {
  const [database, setDatabase] = useState("");
  const [schema, setSchema] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function submitData(e) {
    e.preventDefault();
    setIsLoading(true);
    const userMessage = {
      role: "user",
      content: message
    };

    const updatedMessages = [
      ...messages,
      userMessage
    ];

    try {

      const apiResponse = await axios.post("https://sql-generator-bf95a45b.fastapicloud.dev/",
        {
          database,
          table_schema: schema,
          message,
          conversation_history: updatedMessages
        }
      );
      const assistantMessage = {
        role: "assistant",
        content:
          apiResponse.data.response.needs_clarification
            ? apiResponse.data.response.clarification_question
            : apiResponse.data.response.sql
      };

      setMessages([
        ...updatedMessages,
        assistantMessage
      ]);
      setMessage("")
    }
    catch (error) {
      console.log(error)
    }
    finally {
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
            disabled={isLoading}
          >
            Generate SQL
          </Button>
        </form>
        {isLoading && (<l-tail-chase
          size="40"
          speed="1.75"
          color="white"
        ></l-tail-chase>)}
        <div className="w-[700px] space-y-4">

          {messages.map((msg, index) => (

            <div
              key={index}
              className={
                msg.role === "user"
                  ? "flex justify-end"
                  : "flex justify-start"
              }
            >

              <div
                className={`
          max-w-[80%]
          p-4
          rounded-xl
          border
          ${msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card"
                  }
        `}
              >
                {msg.content}
              </div>

            </div>

          ))}

        </div>
      </div>
    </>
  );
}

export default App;
