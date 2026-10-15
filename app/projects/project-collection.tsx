'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { featuredProjects, ProjectId } from '@/lib/project-catalog';
import type { Repo } from '@/lib/github';

function ProjectGlyph({ id }: { id: ProjectId }) {
  return <svg className="project-glyph" viewBox="0 0 160 100" fill="none" aria-hidden="true">
    {id==='axis' && <><rect x="54" y="7" width="52" height="86" rx="9" /><path d="M72 13h16m-23 60h30m-30 8h20" /><circle cx="80" cy="46" r="16" /><path d="m72 46 6 6 12-13" /></>}
    {id==='auth-service' && <><circle cx="80" cy="48" r="37" strokeDasharray="2 5" /><path d="M65 45V31a15 15 0 0 1 30 0v14" /><rect x="56" y="44" width="48" height="35" rx="6" /><circle cx="80" cy="58" r="4" /><path d="M80 62v7" /></>}
    {id==='electronic-warfare' && <><path d="M20 15v65h120M25 63h110" />{[22,43,31,57,18,48,37].map((h,i)=><rect key={i} x={30+i*15} y={76-h} width="8" height={h} />)}<rect x="71" y="11" width="18" height="72" strokeDasharray="3 4" /></>}
    {id==='music' && <>{[20,35,58,27,70,45,58,35,15].map((h,i)=><path key={i} d={`M${32+i*12} ${48-h/2}v${h}`} />)}<path d="M30 87h100" /></>}
    {id==='impromptu' && <><path d="m29 22 83-7 5 58-83 7Z" /><path d="m43 38 51-4m-49 15 44-4m-43 15 31-3" /><circle cx="119" cy="72" r="20" /><path d="M119 59v13l7 4" /></>}
    {id==='table-stakes' && <><ellipse cx="80" cy="57" rx="60" ry="29" /><rect x="44" y="18" width="26" height="38" rx="3" transform="rotate(-14 44 18)" /><rect x="74" y="14" width="26" height="38" rx="3" transform="rotate(8 74 14)" />{[0,1,2].map(i=><ellipse key={i} cx="100" cy={62-i*5} rx="14" ry="5" />)}</>}
  </svg>;
}

const featuredNames=new Set<string>(featuredProjects.map(project=>project.repo));

export default function ProjectCollection({ repos }: { repos: Repo[] }) {
  const [query,setQuery]=useState('');
  const [language,setLanguage]=useState('all');
  const languages=useMemo(()=>Array.from(new Set([...repos.map(repo=>repo.language),...featuredProjects.map(project=>project.language)].filter((value):value is string=>Boolean(value)))).sort(),[repos]);
  const needle=query.trim().toLowerCase();
  const featured=featuredProjects.filter(project=>(language==='all'||project.language===language)&&`${project.name} ${project.description} ${project.stack.join(' ')}`.toLowerCase().includes(needle));
  const others=repos.filter(repo=>!featuredNames.has(repo.name)&&(language==='all'||repo.language===language)&&`${repo.name} ${repo.description??''} ${repo.language??''}`.toLowerCase().includes(needle));
  const total=featured.length+others.length;
  return <>
    <div className="collection-controls"><label className="project-search"><span className="sr-only">Search projects</span><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8" cy="8" r="5" /><path d="m12 12 5 5" /></svg><input type="search" placeholder="Find a project…" value={query} onChange={event=>setQuery(event.target.value)} /></label><label className="language-filter"><span className="sr-only">Filter by language</span><select value={language} onChange={event=>setLanguage(event.target.value)}><option value="all">All languages</option>{languages.map(value=><option key={value}>{value}</option>)}</select></label></div>
    <p className="collection-count" role="status">{needle||language!=='all'?`${total} matching ${total===1?'project':'projects'}`:'Six projects to start with. More repositories below.'}</p>
    {featured.length>0 && <section className="featured-collection" aria-labelledby="featured-heading"><div className="collection-section-heading"><h2 id="featured-heading">Selected projects</h2><span>01 / BUILT & EXPLORED</span></div><div className="featured-grid">{featured.map(project=><article className="collection-card" data-project={project.id} key={project.id}><div className="card-visual"><span className="card-index">0{featuredProjects.indexOf(project)+1}</span><ProjectGlyph id={project.id} /><span className="card-type">{project.type}</span></div><div className="card-body"><p className="card-kicker">{project.type}</p><h3><a href={`https://github.com/joshiakshit/${project.repo}`} target="_blank" rel="noopener noreferrer">{project.name}<span aria-hidden="true">↗</span></a></h3><p>{project.description}</p><ul className="stack-list" aria-label="Built with">{project.stack.map(item=><li key={item}>{item}</li>)}</ul><div className="card-actions"><Link href={`/#${project.id}`}>play with the sketch <span aria-hidden="true">↗</span></Link><a href={`https://github.com/joshiakshit/${project.repo}`} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.name} source`}>source ↗</a></div></div></article>)}</div></section>}
    {others.length>0 && <section className="repository-collection" aria-labelledby="repositories-heading"><div className="collection-section-heading"><h2 id="repositories-heading">More from the workbench</h2><span>{others.length} REPOSITORIES</span></div><ul className="repository-list">{others.map(repo=><li key={repo.name}><a href={repo.html_url} target="_blank" rel="noopener noreferrer"><div><h3>{repo.name}<span aria-hidden="true">↗</span></h3>{repo.description && <p>{repo.description}</p>}</div><span className="repo-language">{repo.language??'Repository'}</span></a></li>)}</ul></section>}
    {total===0 && <div className="collection-empty"><p>No projects match those filters.</p><button onClick={()=>{setQuery('');setLanguage('all');}}>Clear filters ↻</button></div>}
    {repos.length===0 && <p className="repository-unavailable">The rest of the repositories are available <a href="https://github.com/joshiakshit?tab=repositories" target="_blank" rel="noopener noreferrer">on GitHub ↗</a>.</p>}
  </>;
}
