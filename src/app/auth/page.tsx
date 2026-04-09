import AuthForm from "@/components/AuthForm";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="relative w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-700/30 via-transparent to-transparent rounded-3xl pointer-events-none" />
        <AuthForm />
      </div>
    </div>
  );
}
