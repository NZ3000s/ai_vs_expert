import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative z-10 mx-auto flex min-h-dvh max-w-7xl flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-lg font-medium text-slate-900">Page not found</h1>
      <p className="text-sm text-slate-600">
        The page you requested does not exist.
      </p>
      <Link
        href="/"
        className="text-sm font-medium text-blue-600 underline underline-offset-2 hover:text-blue-800"
      >
        Back to experiment
      </Link>
    </main>
  );
}
