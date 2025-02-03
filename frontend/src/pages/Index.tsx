import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <Layout>
      <section className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center text-center gap-8 animate-fade-up">
        <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium tracking-wide">
          Your Personal Music Journey
        </span>
        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight max-w-2xl leading-tight">
          Discover Your Music Story Through Data
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl">
          Connect with Spotify to unlock insights about your listening habits, discover new music, and visualize your musical journey.
        </p>
        <Button 
          size="lg"
          className="mt-4 text-lg font-medium tracking-wide"
          onClick={() => {
            // TODO: Implement Spotify login
            console.log("Login with Spotify");
          }}
        >
          Connect with Spotify
        </Button>
      </section>

      <section className="py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="p-6 rounded-xl border bg-card animate-fade-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </section>
    </Layout>
  );
};

const features = [
  {
    title: "Listening Analytics",
    description: "Dive deep into your music preferences with detailed statistics and trends over time.",
  },
  {
    title: "Smart Playlists",
    description: "Automatically curated playlists based on your listening habits and preferences.",
  },
  {
    title: "Genre Evolution",
    description: "Track how your music taste evolves over time with beautiful visualizations.",
  },
  {
    title: "Language Learning",
    description: "Discover music in new languages and expand your linguistic horizons.",
  },
  {
    title: "Artist Insights",
    description: "See your top artists and how they've influenced your musical journey.",
  },
  {
    title: "Monthly Discoveries",
    description: "Keep track of new artists and songs you've discovered each month.",
  },
];

export default Index;