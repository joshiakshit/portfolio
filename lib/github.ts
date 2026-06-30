export type Repo = {
  name: string;
  description: string | null;
  html_url: string;
  updated_at: string;
};

export async function getRepos(): Promise<Repo[]> {
  const res = await fetch('https://api.github.com/users/joshiakshit/repos?per_page=100&sort=updated', {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return [];

  const repos: Repo[] = await res.json();
  return repos
    .sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at));
}
