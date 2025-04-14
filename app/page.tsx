const Hero = () => {
  return (
    <div className="flex w-full max-w-[var(--max-content-width)] h-64 bg-green-200">
      <div></div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="flex w-full h-full justify-center bg-red-200 ">
      <Hero />
    </div>
  );
}
