import UrlForm from "@/components/UrlForm";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-black">Blog Summariser</h1>
        <p className="text-center text-gray-600 mb-6">Enter a blog URL to get a smart AI-powered summary in English and Urdu.</p>
        <UrlForm />
      </div>
    </div>
  );
}
