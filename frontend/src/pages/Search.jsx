import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import SongCard from "../components/ui/SongCard";
import { searchFeed } from "../features/feed/feedAPI";
import useDebounce from "../hooks/useDebounce";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    let mounted = true;

    const loadResults = async () => {
      setIsLoading(true);
      const data = await searchFeed(debouncedQuery);
      if (mounted) {
        setResults(data);
        setIsLoading(false);
      }
    };

    loadResults();

    return () => {
      mounted = false;
    };
  }, [debouncedQuery]);

  const handleChange = (event) => {
    const nextQuery = event.target.value;
    setSearchParams(nextQuery.trim() ? { q: nextQuery } : {});
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <Layout>
      <section className="glass-panel rounded-[2rem] p-5 lg:p-7">
        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-beatPink">Search</p>
            <h1 className="mt-2 text-3xl font-extrabold text-white">Find your next repeat</h1>
          </div>
          <Button variant="secondary">
            <SlidersHorizontal className="h-5 w-5" /> Filters
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <SearchIcon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
          <input
            value={query}
            onChange={handleChange}
            placeholder="Search by song, artist, album..."
            className="h-14 w-full rounded-3xl border border-white/10 bg-white/[0.07] pl-14 pr-5 text-sm font-semibold text-white outline-none transition duration-300 placeholder:text-white/35 focus:border-beatPink/50 focus:shadow-glow"
          />
        </form>
      </section>

      <section className="mt-7">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white">
            {query ? `Results for "${query}"` : "Popular on BeatFlow"}
          </h2>
          <span className="text-sm font-semibold text-white/45">{results.length} tracks</span>
        </div>

        {isLoading ? (
          <Loader variant="cards" />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {results.map((song) => (
              <SongCard key={song.id} song={song} queue={results} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Search;
