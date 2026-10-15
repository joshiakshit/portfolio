export type Repo = {
  name: string;
  description: string | null;
  html_url: string;
  updated_at: string;
  language: string | null;
};

export async function getRepos(): Promise<Repo[]> {
  try {
    const res = await fetch('https://api.github.com/users/joshiakshit/repos?per_page=100&sort=updated', {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const repos: Repo[] = await res.json();
    if (!Array.isArray(repos)) return [];
    // Only serialize fields the collection uses; GitHub returns many more.
    return repos.map(({ name, description, html_url, updated_at, language }) => ({
      name, description, html_url, updated_at, language,
    })).sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at));
  } catch {
    return [];
  }
}
