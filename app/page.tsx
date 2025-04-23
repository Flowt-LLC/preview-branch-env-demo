export default function Home() {
  return (
    <div className="grid">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h2 className="text-4xl font-bold text-center">DEMO_VAR</h2>
        {process.env.DEMO_VAR ? (
          <pre>
            <code>{process.env.DEMO_VAR}</code>
          </pre>
        ) : (
          "process.env.DEMO_VAR is undefined"
        )}
      </main>
    </div>
  );
}
