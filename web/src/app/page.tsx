import Image from "next/image";
import Chat from "./Chat";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">
        Plastic Surgeon's Website
      </h1>

      <div className="fixed bottom-4 right-4">
        <Chat />
      </div>
    </div>
  );
}
