import { SchematicCard, StopHeader } from '@/components/ui/primitives';
import { SKILL_DOMAINS, STACK_LAYERS } from '@/lib/site-data';

export function SkillsStop() {
  return (
    <section id="stop-3" className="stop stop-skills" aria-labelledby="skills-title">
      <div className="txt skills-txt">
        <StopHeader
          tag="03  ·  SYSTEMS & TOOLING"
          title="Core tools & stack"
          titleId="skills-title"
          lead="Java, Python, C, SQL — plus the runtime and security primitives underneath."
          body="The languages, storage engines, and network tools I reach for when building reliable backend services and low-level simulations."
        />

        <div className="skills-domains">
          {SKILL_DOMAINS.map((domain) => (
            <div key={domain.index} className="skill-domain-card">
              <span className="domain-index">{domain.index}</span>
              <h3 className="domain-name">{domain.name}</h3>
              <p className="domain-items">{domain.items}</p>
              <p className="domain-desc">{domain.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="anchor" data-stop="skills">
        <SchematicCard
          leftLabel="stack.layers // arch_03"
          rightLabel="depth: 3 tiers"
          viewBox="0 0 360 220"
          className="skills-schematic"
        >
          {STACK_LAYERS.map(({ y, label, sub, accent }) => (
            <g key={label}>
              <rect
                x="24"
                y={y}
                width="312"
                height="48"
                rx="6"
                className={accent ? 'sch-box sch-box-accent' : 'sch-box'}
              />
              <text x="42" y={y + 22} className="sch-label">
                {label}
              </text>
              <text x="42" y={y + 37} className="sch-sub">
                {sub}
              </text>
            </g>
          ))}
        </SchematicCard>
      </div>
    </section>
  );
}
