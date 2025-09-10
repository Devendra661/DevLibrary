export default function Footer() {
  return (
        <footer className="text-black font-semibold py-4 mt-10">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <span className="text-sm">
          © {new Date().getFullYear()} DevLibrary Management System. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}
