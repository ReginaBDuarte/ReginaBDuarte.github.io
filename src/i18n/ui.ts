// Translation dictionary + small routing helpers for the bilingual site.
// English is the default locale (unprefixed routes); Portuguese lives under /pt/.
// Pattern: every page/component reads its own language via `Astro.currentLocale`
// (URL-derived, works the same whether a file is rendered directly as a page or
// re-used as a component from a /pt/ wrapper route — see src/pages/pt/*).

export const defaultLang = 'en' as const;
export const languages = { en: 'English', pt: 'Português' } as const;
export type Lang = keyof typeof languages;

const en = {
  nav: {
    research: 'Research',
    about: 'About',
    contact: 'Contact',
  },
  hero: {
  headline: 'How people and AI make decisions together?',
  lead: "I study decision-making processes assisted by AI. Right now that means the micro scale: a person has a decision to make, an AI suggests an answer, and the person has to decide whether to follow it. Next, I want to understand what that adds up to in a macro scale: how AI is reshaping hospitals and research institutions, and what policy should do about it.",
  subline: 'PhD candidate, IST, University of Lisbon & INESC-ID · Lisbon, Portugal',
  },
  frameworkCard: {
    version: 'Version',
    updated: 'Updated',
    cta: 'Read the framework →',
  },
  selectedResearch: {
    heading: 'Selected research',
    allLink: 'All publications →',
  },
  currently: {
    heading: 'Where the work is heading',
    items: [
      {
        label: 'Finishing',
        text: 'Final year of my PhD on computer science focused on AI-assisted decision-making.',
      },
      {
        label: 'Next',
        text: 'A postgraduate in Public Policy Evaluation at IPPS-ISCTE, focused on AI policy for science and health.',
      },
    ],
  },
  about: {
  paragraph1:
    "I am a PhD candidate in Computer Science and Engineering at Instituto Superior Técnico, University of Lisbon, and a researcher at INESC-ID and the Center for Responsible AI. I study AI-assisted decision-making: what happens to human judgment when an AI system recommends an answer, and how these systems should be designed so that people rely on them when they are right and disagree with them when they are not.",
  paragraph2:
    "I hold a BSc in Applied Mathematics from the Faculty of Sciences of the University of Lisbon and an MSc in Data Science and Engineering from Instituto Superior Técnico. Before the PhD, I spent three years in industry: first as a Data & AI Consultant at Unipartner, then as a Risk Data Scientist at BNP Paribas Personal Finance, working on credit risk models, regulatory compliance and retail forecasting.",
  paragraph3:
    "My studies span clinical assessment, misinformation detection and group decision-making, with publications at ACM CHI and in ACM Transactions on Computing for Healthcare. I am currently running two field studies. One in heathcare domain, in collaboration with Hospital da Luz and, the other, in day-to-day decision making using generative AI tools. This work sits at the level of the individual decision. What I want to understand next is what those decisions add up to: how AI is changing the way healthcare systems and research institutions work, and what that requires of the people who regulate, fund and adopt these systems.",
  paragraph4:
    "This is why I am starting a postgraduate degree in Evaluation of Public Policy at ISCTE in September 2026. My training is technical, but my interest in the social and political sciences is long-standing. I am interested in how scientific evidence reaches decision-makers, in public policy for AI in healthcare and science, and in the role AI itself can play in making the path from evidence to policy faster and more rigorous.",
},
  researchPage: {
    heading: 'Research',
    framing:
      "My research asks how people rely on AI in decision-making settings: when they over-rely, when they override, and when they follow AI suggestions appropriately, and what interventions should be used to improve collaboration and decision performance. I've run studies across several settings: clinical assessment, misinformation detection, and group decision-making. Alongside those studies, I've built a framework for AI-assisted decision-making that pulls the field's findings into one structure, for researchers and practitioners who need to design or evaluate these systems, and for a general audience looking to improve their AI literacy and understanding of AI's impact.",
    allPublications: 'All publications',
    pdf: 'PDF',
    doi: 'DOI',
    code: 'Code',
  },
  frameworkPage: {
    citeThis: 'Cite this →',
    citation: (name: string, version: string, updated: string) =>
      `${name} (Version ${version}). ${updated}. Working draft.`,
    feedbackPrefix: "Spot something off, or have a correction? I'd genuinely like to hear it: ",
    maintainedByPrefix: 'This framework is maintained by ',
    dataNote:
      "This framework's evidence base (the factors, mechanisms, and studies below) is only available in English for now. It's dense, technical material, and I'd rather translate it properly than machine-translate it.",
    aboutHeading: 'AI-assisted decision-making',
    whatItIsHeading: 'What it is',
    whatItIsText: [
      "AI-assisted decision-making describes any process where a person makes the final call but an AI system shapes it along the way, sometimes with an explicit recommendation, sometimes with something softer: a risk score, a highlighted region of an image, a short explanation. A radiologist reads a mammogram while a model flags suspicious tissue. A credit analyst sees a predicted probability that an applicant will default. A judge is shown a recidivism risk score.",
      "The appeal is that the two should cover each other's weaknesses: people are inconsistent and carry biases, models are consistent but brittle outside the cases they were trained on. The evidence for that promise is thinner than it sounds. Human-AI teams usually beat people working alone, but they often fall short of the AI working alone.",
      "The reason is reliance. Over-reliance means accepting a recommendation that is wrong; under-reliance means rejecting one that is right. Either is enough to undo the benefit, and neither is fixed simply by showing the person more information about the model.",
      "This has made AI-assisted decision-making an intensively studied problem, and a large body of experiments now tests interventions (explanation designs, confidence displays, protocols that withhold the recommendation until the person has committed to their own judgement) to work out which techniques and designs genuinely improve the collaboration, curb over- and under-reliance, and raise the quality of the decision.",
    ],
    whyItMattersHeading: 'Why it matters',
    whyItMattersText: [
      'Since 2 August 2026, this is no longer only a research question. Article 14 of the EU AI Act obliges providers of high-risk AI systems (a category that covers medical devices, creditworthiness assessment, recruitment, education and law enforcement) to design them so that they can be "effectively overseen by natural persons" while in use. The Act is unusually specific about what that oversight has to withstand. Among the capacities the system must enable is:',
    ],
    whyItMattersQuote:
      'to remain aware of the possible tendency of automatically relying or over-relying on the output produced by a high-risk AI system (automation bias), in particular for high-risk AI systems used to provide information or recommendations for decisions to be taken by natural persons.',
    whyItMattersQuoteCitation: 'Regulation (EU) 2024/1689, Article 14(4)(b)',
    whyItMattersOutro: [
      'The regulation names the precise failure this literature has spent a decade measuring. It names the other side too: Article 14(4)(d) requires that the overseer be able to "disregard, override or reverse" the output, the capacity whose overuse is under-reliance.',
      'What the law does not say is how. "Remain aware" is a goal, not a mechanism, and the obvious routes to awareness turn out not to work reliably. Explanations frequently fail to reduce over-reliance and sometimes increase it. Interventions that do reduce it can cost accuracy, speed, or the user\'s willingness to adopt the system at all. A legal duty to counter automation bias is only actionable if we know which design choices actually move it, for whom, and on which tasks, and that is an empirical question about human behaviour, not a question about the model.',
    ],
    disclaimer: [
      'This framework is my own work. I built it, and I am responsible for its content and for any errors in it.',
      'I used AI assistance in the process: to help edit text, to extract study details into the common coding scheme, and to propose links between studies and mechanisms. Every paper in the evidence base was read by me, every coded field was checked by me, and every mechanism and link was my decision.',
    ],
    theFrameworkHeading: 'The framework',
    theFrameworkIntro: [
      "This framework is an attempt to put that evidence in order. It collects experimental studies of AI-assisted decision making, codes each one the same way, and asks what is actually known about how people behave when they decide alongside a machine, for researchers who need to see where the evidence is thin, for practitioners designing these systems, and for anyone who wants the picture without reading a hundred papers.",
      "It divides the setting into three components. The <strong>human</strong> is who decides: their expertise, whether they work alone or in a group. The <strong>task</strong> is what is being decided: how hard it is, what it costs to be wrong, whether there is time to think, whether the answer can be verified at all. Both are largely inherited (a hospital cannot staff radiology with non-radiologists). The <strong>AI ecosystem</strong>, the model's accuracy, how its output is presented, whether it explains itself, is the part that is designed, and where interventions live. Within each sit the factors that shift decision performance and reliance.",
      "It does not stop at organising the literature. Each factor carries mechanisms: short, directional claims about what causes what, linked to the studies that support them and the studies that contradict them. Mechanisms are ordered by how much support they have, from the most-replicated finding down to a single study. The aim is a resource that answers where the evidence permits an answer, and says so plainly where it does not.",
    ],
    simplificationNote:
      "Every framework is a simplification, and this one is no exception. The factors shown here are deliberately coarse; individual studies contain distinctions, conditions and caveats that no diagram can hold. Where a study is richer than its position in the framework suggests, that detail sits on the study's own page.",
    evidenceHeading: 'Where the evidence stands',
    evidenceLead: (count: number) =>
      `${count} mechanisms, ordered by how many studies support each, from the most-replicated finding down to one still resting on a single study.`,
    showAllMechanisms: (count: number) => `Show all ${count} mechanisms →`,
    aboutEvidenceHeading: 'About the evidence base',
    aboutEvidenceText: [
      "I didn't start with a framework. I started with papers: experimental studies of people making decisions with AI. What became obvious quickly was that the same handful of variables kept reappearing: who the decision-maker was, what kind of task they faced, how the AI presented itself and how good it was. Different labs, different domains, different vocabulary, but a recurring set of things being varied and measured. Those recurrences became the framework's nine factors, grouped into the three components that seemed to organise them, the human, the task, and the AI ecosystem. The factors came out of the papers rather than out of theory, which is a strength and a limitation at once: they describe what this literature has chosen to study, not necessarily what matters most about human-AI decision-making.",
      "Once the factors existed I went back and coded every study against the same fixed schema, recording what each one manipulated, what it held constant, and what it simply didn't report. A shared schema makes studies comparable that were never designed to be compared, and it makes disagreement visible. From there I could read off claims (e.g. this factor moves that outcome, under these conditions) that more than one study speaks to. Those are the mechanisms, and each one carries both the studies that support it and the studies that contradict it.",
    ],
    aboutEvidenceLinksPre: 'The coding is open. Every study sits in the ',
    aboutEvidenceLink1Label: 'Framework Evidence Base',
    aboutEvidenceLinksMid: ' with its full codification and the prose behind each judgement, and every code is defined in the ',
    aboutEvidenceLink2Label: 'Codebook',
    aboutEvidenceLinksPost: '. Any claim on this site can be traced back to a paper.',
    coverageNotePre:
      'This framework covers the studies I know about. It is not a systematic review, and it is certainly incomplete. If you know of experimental work that belongs here, especially work that contradicts something on this page, please ',
    coverageNoteLinkText: 'send it to me',
    coverageNotePost: ' and I will code it in.',
  },
  writingPage: {
    heading: 'Writing',
  },
  footer: {
  heading: "If you're working on how AI interacts with professionals, in micro or macro scale, I'd like to hear from you.",
  body: "Open to collaborations, talks, and to conversations with people who see this happening from the inside: clinicians, researchers, and the institutions deciding what to adopt.",
  cvLabel: 'CV (PDF)',
  location: 'Lisbon, Portugal',
  },
  meta: {
    homeTitle: 'Regina de Brito Duarte · Human-AI Interaction Research and Policy',
    homeDescription:
      "I study how people and AI make decisions together, and I'm moving that work toward health systems and public policy.",
    researchTitle: 'Research · Regina de Brito Duarte',
    researchDescription:
      'Publications on human-AI decision-making, reliance, and evidence for institutional AI adoption.',
    frameworkTitle: 'Framework · Regina de Brito Duarte',
    frameworkDescription:
      'A working-draft framework for human-AI decision-making: when to trust the machine, and when the design should make it easier to say no.',
    aboutTitle: 'About · Regina de Brito Duarte',
    aboutDescription:
      'PhD candidate at IST and INESC-ID, working on human-AI decision-making and its move toward health systems and public policy.',
    writingTitle: 'Writing · Regina de Brito Duarte',
    writingDescription: 'Policy briefs and notes on AI, human decision-making, and health systems.',
  },
};

const pt: typeof en = {
  nav: {
    research: 'Investigação',
    about: 'Sobre',
    contact: 'Contacto',
  },
  hero: {
    headline: 'Como é que as pessoas e a IA tomam decisões em conjunto?',
    lead: 'Estudo processos de tomada de decisão assistidos por IA. Para já, isso significa as interações em micro escala: uma pessoa tem uma decisão a tomar, uma IA sugere uma resposta, e essa pessoa tem de decidir se confia nela. A seguir, quero perceber no que é que isso se traduz à escala macro: como a IA está a transformar hospitais e instituições de investigação, e o que as políticas públicas deviam fazer quanto a isso.',
    subline: 'Doutoranda, IST e INESC-ID · Lisboa, Portugal',
  },
  frameworkCard: {
    version: 'Versão',
    updated: 'Atualizado',
    cta: 'Ler a framework →',
  },
  selectedResearch: {
    heading: 'Investigação selecionada',
    allLink: 'Todas as publicações →',
  },
  currently: {
    heading: 'Para onde o trabalho está a ir',
    items: [
      {
        label: 'A terminar',
        text: 'Último ano do meu doutoramento em engenharia informática, focado em tomada de decisão assistida por IA.',
      },
      {
        label: 'A seguir',
        text: 'Uma pós-graduação em Avaliação de Políticas Públicas no IPPS-ISCTE, focada em políticas de IA para a ciência e a saúde.',
      },
    ],
  },
  about: {
    paragraph1:
      'Sou doutoranda em Engenharia Informática no Instituto Superior Técnico da Universidade de Lisboa, e investigadora no INESC-ID e no Center for Responsible AI. Estudo a tomada de decisão assistida por IA: o que acontece à tomada de decisão humana quando um sistema de IA recomenda uma resposta, e como estes sistemas devem ser concebidos para que as pessoas confiem neles quando estão certos e discordem quando não estão.',
    paragraph2:
      'Sou licenciada em Matemática Aplicada pela Faculdade de Ciências da Universidade de Lisboa e tenho um mestrado em Data Science and Engineering pelo Instituto Superior Técnico. Antes do doutoramento, passei três anos na indústria: primeiro como Data & AI Consultant na Unipartner, depois como Risk Data Scientist na BNP Paribas Personal Finance, a trabalhar em modelos de risco de crédito, conformidade regulatória e previsão de retalho.',
    paragraph3:
      'Os meus estudos abrangem avaliação clínica, deteção de desinformação e tomada de decisão em grupo, com publicações na ACM CHI e na ACM Transactions on Computing for Healthcare. Atualmente, estou a conduzir dois estudos de campo: um na área da saúde, em colaboração com o Hospital da Luz, e outro sobre a tomada de decisão no dia a dia com o uso de ferramentas de IA generativa. Este trabalho situa-se ao nível da decisão individual. O que quero perceber a seguir é no que é que essas decisões se traduzem: como a IA está a mudar o funcionamento dos sistemas de saúde e das instituições de investigação, e o que isso exige de quem regula, financia e adota estes sistemas.',
    paragraph4:
      'É por isso que vou iniciar uma pós-graduação em Avaliação de Políticas Públicas no ISCTE, em setembro de 2026. A minha formação é técnica, mas o meu interesse pelas ciências sociais e políticas é antigo. Interessa-me perceber como a evidência científica chega a quem decide, as políticas públicas para a IA na saúde e na ciência, e o papel que a própria IA pode desempenhar para tornar o caminho da evidência à política mais rápido e mais rigoroso.',
  },
  researchPage: {
    heading: 'Investigação',
    framing:
      'A minha investigação pergunta como as pessoas confiam na IA em contextos de tomada de decisão: quando confiam demasiado, quando contrariam as sugestões da IA e quando as seguem de forma apropriada, e que intervenções deviam ser usadas para melhorar a colaboração e o resultado da decisão. Já conduzi estudos em vários contextos: avaliação clínica, deteção de desinformação e tomada de decisão em grupo. A par desses estudos, construí uma framework conceptual para a tomada de decisão assistida por IA que reúne as conclusões da área numa única estrutura, para investigadores e profissionais que precisam de conceber ou avaliar estes sistemas, e para um público mais geral que queira melhorar a sua literacia em IA e a compreensão do seu impacto.',
    allPublications: 'Todas as publicações',
    pdf: 'PDF',
    doi: 'DOI',
    code: 'Código',
  },
  frameworkPage: {
    citeThis: 'Citar →',
    citation: (name: string, version: string, updated: string) =>
      `${name} (Versão ${version}). ${updated}. Rascunho em curso.`,
    feedbackPrefix: 'Reparou nalgum erro ou tem uma correção? Gostava mesmo de saber: ',
    maintainedByPrefix: 'Esta framework é mantida por ',
    dataNote:
      'A base de evidência desta framework (os fatores, mecanismos e estudos abaixo) está, por agora, disponível apenas em inglês. É material denso e técnico, e prefiro traduzi-lo com cuidado a fazer uma tradução automática.',
    aboutHeading: 'Tomada de decisão assistida por IA',
    whatItIsHeading: 'O que é',
    whatItIsText: [
      'A tomada de decisão assistida por IA descreve qualquer processo em que uma pessoa toma a decisão final, mas um sistema de IA a molda ao longo do caminho, por vezes com uma recomendação explícita, por vezes com algo mais subtil: uma pontuação de risco, uma região destacada numa imagem, uma breve explicação. Um radiologista lê uma mamografia enquanto um modelo assinala tecido suspeito. Um analista de crédito vê uma probabilidade prevista de que um requerente entre em incumprimento. Um juiz é confrontado com uma pontuação de risco de reincidência.',
      'O apelo está em que os dois deveriam cobrir as fraquezas um do outro: as pessoas são inconsistentes e transportam enviesamentos, os modelos são consistentes mas frágeis fora dos casos em que foram treinados. A evidência para essa promessa é mais ténue do que parece. As equipas humano-IA costumam superar as pessoas a trabalhar sozinhas, mas frequentemente ficam aquém da IA a trabalhar sozinha.',
      'A razão é a confiança. Confiança excessiva significa aceitar uma recomendação que está errada; confiança insuficiente significa rejeitar uma que está certa. Qualquer uma delas basta para anular o benefício, e nenhuma se resolve apenas por mostrar à pessoa mais informação sobre o modelo.',
      'Isto tornou a tomada de decisão assistida por IA um problema intensivamente estudado, e um vasto conjunto de experiências testa hoje intervenções (desenhos de explicação, indicadores de confiança, protocolos que retêm a recomendação até a pessoa se comprometer com o seu próprio julgamento) para perceber que técnicas e desenhos melhoram genuinamente a colaboração, reduzem a confiança excessiva e insuficiente, e elevam a qualidade da decisão.',
    ],
    whyItMattersHeading: 'Porque é que importa',
    whyItMattersText: [
      'Desde 2 de agosto de 2026, esta deixou de ser apenas uma questão de investigação. O artigo 14.º do Regulamento de IA da UE obriga os fornecedores de sistemas de IA de risco elevado (uma categoria que abrange dispositivos médicos, avaliação de solvabilidade de crédito, recrutamento, educação e aplicação da lei) a concebê-los de modo a que possam ser "efetivamente supervisionados por pessoas singulares" durante a sua utilização. O Regulamento é invulgarmente específico quanto ao que essa supervisão tem de resistir. Entre as capacidades que o sistema deve permitir está:',
    ],
    whyItMattersQuote:
      'to remain aware of the possible tendency of automatically relying or over-relying on the output produced by a high-risk AI system (automation bias), in particular for high-risk AI systems used to provide information or recommendations for decisions to be taken by natural persons.',
    whyItMattersQuoteCitation: 'Regulation (EU) 2024/1689, Article 14(4)(b)',
    whyItMattersOutro: [
      'O Regulamento nomeia exatamente a falha que esta literatura investiga. Nomeia também o lado oposto: o artigo 14.º, n.º 4, alínea d), exige que o supervisor seja capaz de "desconsiderar, anular ou inverter" o resultado, a capacidade cujo uso excessivo é a confiança insuficiente.',
      'O que a lei não diz é como. "Manter-se consciente" é um objetivo, não um mecanismo, e os caminhos óbvios para essa consciência revelam-se pouco fiáveis. As explicações frequentemente não conseguem reduzir a confiança excessiva, e por vezes até a aumentam. As intervenções que a reduzem podem custar precisão, rapidez, ou a disponibilidade da pessoa para adotar o sistema. Um dever legal de combater o enviesamento de automação só é acionável se soubermos que opções de design realmente o alteram, para quem, e em que tarefas, e essa é uma questão empírica sobre o comportamento humano, não uma questão sobre o modelo.',
    ],
    disclaimer: [
      'Esta framework é trabalho meu. Fui eu que a construí, e sou responsável pelo seu conteúdo e por quaisquer erros que possa conter.',
      'Recorri a assistência de IA no processo: para ajudar a editar texto, para extrair detalhes dos estudos para o esquema de codificação comum, e para propor ligações entre estudos e mecanismos. Todos os artigos da base de evidência foram lidos por mim, todos os campos codificados foram verificados por mim, e cada mecanismo e ligação foi decisão minha.',
    ],
    theFrameworkHeading: 'A framework',
    theFrameworkIntro: [
      'Esta framework é uma tentativa de estruturar a literatura e as evidências ciêntificas. Reúne estudos experimentais sobre tomada de decisão assistida por IA, codifica cada um da mesma forma, e pergunta o que realmente se sabe sobre como as pessoas se comportam quando decidem ao lado de uma máquina, para investigadores que precisam de ver onde a evidência é escassa, para profissionais que desenham estes sistemas, e para quem quiser perceber o panorama sem ler uma centena de artigos.',
      'Divide o cenário em três componentes. O <strong>humano</strong> é quem decide: a sua experiência, se trabalha sozinho ou em grupo. A <strong>tarefa</strong> é o que está a ser decidido: quão difícil é, quanto custa errar, se há tempo para pensar, se a resposta pode sequer ser verificada. Ambos são, em grande medida, fixos para uma dado processo de decisão (um hospital não pode preencher a radiologia com não-radiologistas). O <strong>ecossistema de IA</strong>, a performance do modelo, a forma como apresenta o seu resultado, se se explica a si próprio, é a parte que é desenhada e pode ser alterada, e onde vivem as intervenções. Dentro de cada um estão os fatores que alteram o desempenho da decisão e a confiança.',
      'Não fica pela organização da literatura. Cada fator carrega mecanismos: afirmações curtas sobre o que causa o quê, ligadas aos estudos que os apoiam e aos estudos que os contradizem. Os mecanismos são ordenados pelo grau de apoio que têm, desde a conclusão mais replicada até um único estudo. O objetivo é um recurso que responda onde a evidência permite uma resposta, e o diga claramente onde não permite.',
    ],
    simplificationNote:
      'Toda a framework é uma simplificação, e esta não é exceção. Os fatores aqui apresentados são deliberadamente amplos; estudos individuais contêm distinções, condições e ressalvas que nenhum diagrama consegue detalhar ao promenor. Quando um estudo é mais rico do que a sua posição na framework sugere, esse detalhe está disponível na página do próprio estudo.',
    evidenceHeading: 'Onde está a evidência',
    evidenceLead: (count: number) =>
      `${count} mecanismos, ordenados pelo número de estudos que apoiam cada um, desde a conclusão mais replicada até um que ainda assenta num único estudo.`,
    showAllMechanisms: (count: number) => `Ver todos os ${count} mecanismos →`,
    aboutEvidenceHeading: 'Sobre a base de evidência',
    aboutEvidenceText: [
      'Este trabalho não começou com uma framework teórica. Começou com artigos: estudos experimentais sobre pessoas a tomar decisões com IA. O que se tornou óbvio rapidamente foi que o mesmo punhado de variáveis continuava a reaparecer: quem era a pessoa a decidir, que tipo de tarefa enfrentava, como a IA se apresentava e quão boa era. Centros de investigação diferentes, domínios diferentes, vocabulário diferente, mas um conjunto recorrente de coisas a ser variado e medido. Essas recorrências tornaram-se os fatores da framework, agrupados nas três componentes que pareciam organizá-los: o humano, a tarefa e o ecossistema de IA. Os fatores surgiram dos artigos e não da teoria, o que é ao mesmo tempo uma força e uma limitação: descrevem o que a literatura escolheu estudar, não necessariamente o que mais importa na tomada de decisão humano-IA.',
      'Depois de os fatores existirem, voltei atrás e codifiquei cada estudo segundo o mesmo esquema fixo, registando o que cada um manipulou, o que manteve constante e o que simplesmente não reportou. Um esquema partilhado torna comparáveis estudos que nunca foram concebidos para o ser, e torna visível o desacordo entre eles. A partir daí consegui extrair afirmações (por exemplo, este fator altera aquele resultado, nestas condições) sobre as quais mais do que um estudo se pronuncia. Essas são os mecanismos, e cada um carrega tanto os estudos que o apoiam como os estudos que o contradizem.',
    ],
    aboutEvidenceLinksPre: 'A codificação é aberta. Cada estudo está na ',
    aboutEvidenceLink1Label: 'Framework Evidence Base',
    aboutEvidenceLinksMid: ', com a sua codificação completa e o texto por trás de cada avaliação, e cada código está definido no ',
    aboutEvidenceLink2Label: 'Codebook',
    aboutEvidenceLinksPost: '. Qualquer afirmação feita neste site pode ser rastreada até um artigo.',
    coverageNotePre:
      'Esta framework cobre os estudos que conheço. Não é uma revisão sistemática, e está certamente incompleta. Se conhecer trabalho experimental que devesse estar aqui, especialmente trabalho que contradiga algo nesta página, por favor ',
    coverageNoteLinkText: 'envie-mo',
    coverageNotePost: ' e eu codifico-o.',
  },
  writingPage: {
    heading: 'Textos',
  },
  footer: {
    heading: 'Se o teu trabalho tem que ver com a forma como a IA interage com profissionais, sejam em micro ou macro escala, entra em contacto comigo.',
    body: 'Aberta a colaborações, trabalho de políticas públicas, palestras e conversas com quem vê isto a acontecer por dentro: clínicos, investigadores e as instituições que decidem o que adotar.',
    cvLabel: 'CV (PDF)',
    location: 'Lisboa, Portugal',
  },
  meta: {
    homeTitle: 'Regina de Brito Duarte · IA, IHC, políticas baseadas em evidência',
    homeDescription:
      'Estudo como as pessoas e a IA tomam decisões em conjunto, e estou a orientar esse trabalho para os sistemas de saúde e as políticas públicas.',
    researchTitle: 'Investigação · Regina de Brito Duarte',
    researchDescription:
      'Publicações sobre tomada de decisão humano-IA, confiança e evidência para a adoção institucional de IA.',
    frameworkTitle: 'Framework · Regina de Brito Duarte',
    frameworkDescription:
      'Uma framework em rascunho para a tomada de decisão humano-IA: quando confiar na máquina, e quando o design deve tornar mais fácil dizer que não.',
    aboutTitle: 'Sobre · Regina de Brito Duarte',
    aboutDescription:
      'Doutoranda no IST e no INESC-ID, a trabalhar em tomada de decisão humano-IA e na sua aplicação aos sistemas de saúde e às políticas públicas.',
    writingTitle: 'Textos · Regina de Brito Duarte',
    writingDescription: 'Policy briefs e textos sobre IA, tomada de decisão humana e sistemas de saúde.',
  },
};

export const ui = { en, pt };

export function useTranslations(lang: string | undefined) {
  return ui[(lang as Lang) in ui ? (lang as Lang) : defaultLang];
}

// Strips a `/pt` prefix (if present) to get the language-neutral path, e.g.
// "/pt/research/" -> "/research/", "/research/" -> "/research/".
export function getCanonicalPath(pathname: string): string {
  if (pathname === '/pt' || pathname.startsWith('/pt/')) {
    const rest = pathname.slice(3);
    return rest === '' ? '/' : rest;
  }
  return pathname;
}

// Adds the `/pt` prefix for non-default locales, e.g. localizePath("/research/", "pt") -> "/pt/research/".
export function localizePath(canonicalPath: string, lang: Lang): string {
  if (lang === defaultLang) return canonicalPath;
  return canonicalPath === '/' ? '/pt/' : `/pt${canonicalPath}`;
}
