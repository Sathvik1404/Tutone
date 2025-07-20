import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import NavbarDark from "./NavbarDark";
export default function AI() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [data, setData] = useState(null);
    const [fields, setFields] = useState(null);
    const [chat, setChat] = useState(null);
    const { id } = useParams();
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    const genAI = new GoogleGenerativeAI(API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    useEffect(() => {
        async function fetch() {
            try {
                const res = await axios.get('http://localhost:3000/api/course');
                const f1 = res.data.fields.map(({ _id, ...rest }) => rest);
                const y = res.data.responses.map(({ _id, submittedAt, ...rest }) => rest);
                setFields(f1);
                setData(y);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetch();
    }, [id]);

    useEffect(() => {
        const initializeChat = async () => {
            try {
                const initialPrompt = `You are an AI assistant analyzing form data. Format your response using well-structured HTML for readability and ensure tables are properly formatted. 
                        Guidelines:  
                        - Use <h1> for main headings and <h2> for subheadings.  
                        - Use <strong> for bold text.  
                        - Use <br> for line breaks.  
                        - Use a well-structured table format with <table>, <thead>, <tbody>, <tr>, <th>, and <td>.  
                        - Ensure all tables include headers inside <thead> and body content inside <tbody>.  
                        - also write css for tabular format, like this:<style>
                        table {
                          font-family: arial, sans-serif;
                          border-collapse: collapse;
                          width: 100%;
                        }
                        
                        td, th {
                          border: 1px solid #dddddd;
                          text-align: left;
                          padding: 8px;
                        }
                        
                        tr:nth-child(even) {
                          background-color: #dddddd;
                        }
                        </style>git commit -m "Your commit message"

                        - Use proper indentation for clarity.  
                        - Do not mention that you are using HTML.  

                        Here is the data you need to analyze:  

                        Form Fields: ${JSON.stringify(fields)}  
                        Responses: ${JSON.stringify(data)}`;

                const chatInstance = model.startChat({
                    history: [{ role: "user", parts: [{ text: initialPrompt }] }],
                });


                setChat(chatInstance);
            } catch (error) {
                console.error("Error initializing chat:", error);
            }
        };
        if (data !== null && fields !== null) {
            initializeChat();
        } else {
            console.log("no data");
        }
    }, [fields, data]);

    const handleSend = async () => {
        if (!chat) {
            console.error("Chat instance is not initialized");
            return;
        }
        if (input.trim() === '') return;

        const newMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, newMessage]);

        try {
            const result = await chat.sendMessage(input);
            console.log(result.response.text())
            let botReplyText = result.response.text();

            // Format text to make **bold** parts appear in bold
            botReplyText = botReplyText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            const formattedText = botReplyText.replace(/\*/g, '<br>');


            const botReply = { sender: 'bot', text: formattedText };
            setMessages(prev => [...prev, botReply]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I couldn't process that request." }]);
        }
        setInput('');
    };

    return (
        <>
            <NavbarDark />
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-5 flex flex-col h-[90vh]">
                    <h1 className="text-xl font-semibold text-gray-800 mb-4">Dynamic Form Chatbot</h1>

                    <div className="flex-1 overflow-y-auto p-3 bg-gray-50 rounded-lg border border-gray-300" style={{ maxHeight: '70vh' }}>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`p-2 rounded-lg max-w-xs ${msg.sender === 'user'
                                    ? 'bg-blue-500 text-white self-end ml-auto'
                                    : 'bg-gray-300 text-gray-800 self-start'
                                    } mb-2`}
                                dangerouslySetInnerHTML={{ __html: msg.text }}
                            />
                        ))}
                    </div>

                    <div className="flex border-t border-gray-300 pt-2">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Ask me about the form data..."
                            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleSend}
                            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}