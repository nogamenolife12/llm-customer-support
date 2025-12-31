import { ChatContainer } from "./Components/ChatContainer";

function App() {
  return (
    <div className="h-screen min-w-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-slate-900 via-gray-900 to-black flex flex-col items-center justify-center p-4">
      
      <div className="w-full max-w-2xl mb-6 text-center">
        <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
          Support <span className="text-blue-500">AI</span>
        </h1>
        <p className="mt-2 text-gray-400 font-medium">
          How can i help you?.
        </p>
      </div>

      <main className="w-full max-w-2xl transform transition-all duration-500 hover:shadow-2xl">
        <ChatContainer />
      </main>

      <footer className="mt-8 text-gray-500 text-xs">
        &copy; {new Date().getFullYear()} TechWorld.
      </footer>
    </div>
  );
}
export default App;
