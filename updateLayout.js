const fs = require('fs');
const file = 'components/audience/audience-page.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldReturnStr = `  return (
    <section dir={dir} className="mx-auto max-w-7xl space-y-10 px-4 py-12">
      <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-indigo-950 p-8 text-white md:p-12">
        <SearchCheck className="h-12 w-12 text-indigo-300" />
        <h1 className="mt-6 text-4xl font-black md:text-6xl">{t.researchTitle}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">{t.researchDescription}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/methodology" className="btn bg-white text-slate-950">
            {t.methodology}
          </Link>
          <Link href={\`/\${locale}/universities\`} className="btn border border-white/20 text-white">
            {t.exploreData}
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <StatCard label={t.universities} value={stats.universities} />
        <StatCard label={t.programs} value={stats.programs} />
        <StatCard label={t.sectors} value={stats.sectors} />
        <StatCard label={t.businesses} value={stats.businesses} />
        <StatCard label={t.reviews} value={stats.reviews} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ActionCard title={t.actions.educationData} description={t.actions.educationDataDesc} href={\`/\${locale}/universities\`} Icon={TableProperties} />
        <ActionCard title={t.actions.economyData} description={t.actions.economyDataDesc} href="/economy" Icon={Database} />
        <ActionCard title={t.actions.methodology} description={t.actions.methodologyDesc} href="/methodology" Icon={FileSearch} />
        <ActionCard title={t.actions.quality} description={t.actions.qualityDesc} href="/admin" Icon={ShieldCheck} />
      </div>

      <div className="card p-6">
        <h2 className="text-2xl font-black">{t.portalTitle}</h2>
        <p className="mt-3 max-w-3xl text-slate-600">{t.portalDescription}</p>
      </div>
    </section>
  );`;

const newReturnStr = `  return (
    <section dir={dir} className="mx-auto max-w-7xl space-y-10 px-4 py-12">
      <div className="rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 p-8 text-white md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl"></div>
        
        <div className="relative z-10">
          <FlaskConical className="h-12 w-12 text-purple-400" />
          <h1 className="mt-6 text-4xl font-black md:text-6xl tracking-tight">{t.researchTitle}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-purple-100">{t.researchDescription}</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/add-research" className="btn bg-purple-600 hover:bg-purple-700 text-white border-none shadow-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              {t.actions.addIdea}
            </Link>
            <Link href="/add-problem" className="btn bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm flex items-center gap-2">
              <Target className="w-5 h-5" />
              {t.actions.addProblem}
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <StatCard label={t.universities} value={stats.universities} />
        <StatCard label={t.programs} value={stats.programs} />
        <StatCard label={t.sectors} value={stats.sectors} />
        <StatCard label={t.businesses} value={stats.businesses} />
        <StatCard label={t.reviews} value={stats.reviews} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ActionCard title={t.actions.addIdea} description={t.actions.addIdeaDesc} href="/add-research" Icon={Lightbulb} />
        <ActionCard title={t.actions.addProblem} description={t.actions.addProblemDesc} href="/add-problem" Icon={Target} />
        <ActionCard title={t.actions.researchData} description={t.actions.researchDataDesc} href={\`/\${locale}/universities\`} Icon={BookOpen} />
        <ActionCard title={t.actions.educationData} description={t.actions.educationDataDesc} href={\`/\${locale}/universities\`} Icon={TableProperties} />
        <ActionCard title={t.actions.economyData} description={t.actions.economyDataDesc} href="/economy" Icon={Database} />
        <ActionCard title={t.actions.methodology} description={t.actions.methodologyDesc} href="/methodology" Icon={FileSearch} />
      </div>

      <div className="card p-6 border-purple-100 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-900/10">
        <h2 className="text-2xl font-black text-purple-950 dark:text-purple-300">{t.portalTitle}</h2>
        <p className="mt-3 max-w-3xl text-purple-800/80 dark:text-purple-200/70">{t.portalDescription}</p>
      </div>
    </section>
  );`;

if (content.includes(oldReturnStr)) {
  content = content.replace(oldReturnStr, newReturnStr);
  fs.writeFileSync(file, content);
  console.log('Successfully updated the research section layout.');
} else {
  console.log('Could not find the exact old return string. Please check formatting.');
}
