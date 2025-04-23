export default function Home() {
  return (
    <main className="flex flex-col">
      <h2>DEMO_VAR</h2>
      {process.env.DEMO_VAR ? (
        <pre>
          <code>{process.env.DEMO_VAR}</code>
        </pre>
      ) : (
        "process.env.DEMO_VAR is undefined"
      )}
    </main>
  );
}
