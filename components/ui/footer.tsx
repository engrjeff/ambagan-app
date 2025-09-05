export function Footer() {
  return (
    <footer className="border-t p-4">
      <div className="max-w-6xl mx-auto text-sm text-muted-foreground flex items-center justify-between">
        <p>Ambagan App. Copyright &copy; {new Date().getFullYear()}</p>
        <p>
          Made by{' '}
          <a
            href="http://jeffsegovia.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            Jeff Segovia
          </a>
        </p>
      </div>
    </footer>
  );
}
