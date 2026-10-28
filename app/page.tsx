import FormButton from "./form-button";
import Socials from "./socials";

// Hub for tapt; links to each repo go here.
export default function Home() {
  return (
    <>
      {/* Absolute so the links below center on the full viewport, not the space under the bar. */}
      <header className="absolute inset-x-0 top-0 flex justify-center p-6">
        <Socials />
      </header>
      <main className="flex flex-1 items-center justify-center px-4">
        <FormButton />
      </main>
    </>
  );
}
