"use client"

import type React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Calendar, Clock, ArrowLeft, Share2, Heart, Bookmark, MessageSquare, ChevronRight, Tag } from "lucide-react"

interface BlogPost {
  id: number
  title: string
  content: string
  image: string
  date: string
  category: string
  readTime: string
  author: {
    name: string
    avatar: string
    role: string
  }
  tags: string[]
  relatedPosts?: number[]
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Willkommen in LifeVerse!",
    content: `
      <p>LifeVerse ist das erste 1:1-Spiel, das das echte Leben vollständig simuliert. In diesem Artikel erfährst du alles über unser revolutionäres Konzept.</p>
      
      <h2>Eine neue Ära des Gamings</h2>
      <p>Mit LifeVerse betreten wir Neuland in der Welt der Videospiele. Unser Ziel ist es, eine virtuelle Welt zu erschaffen, die so detailliert und realistisch ist, dass sie kaum von der Realität zu unterscheiden ist. Doch anders als in der Realität bietet LifeVerse dir die Freiheit, jede Entscheidung zu treffen, jeden Weg einzuschlagen und jede Möglichkeit zu erkunden – ohne die Konsequenzen des echten Lebens fürchten zu müssen.</p>
      
      <p>In LifeVerse kannst du:</p>
      <ul>
        <li>Jeden Beruf erlernen und ausüben, von traditionellen Karrieren bis hin zu exotischen Tätigkeiten</li>
        <li>Beziehungen aufbauen, Freundschaften schließen und sogar eine Familie gründen</li>
        <li>Immobilien kaufen, gestalten und verkaufen</li>
        <li>Unternehmen gründen und zum Tycoon aufsteigen</li>
        <li>Die Welt bereisen und verschiedene Kulturen kennenlernen</li>
        <li>Hobbys und Fähigkeiten entwickeln, von Musik und Kunst bis hin zu Sport und Wissenschaft</li>
      </ul>
      
      <h2>Technologie hinter LifeVerse</h2>
      <p>Um eine so detaillierte Simulation zu ermöglichen, nutzen wir modernste Technologien:</p>
      <p>Unsere proprietäre Engine ermöglicht eine fotorealistische Grafik, die selbst auf mittleren Systemen flüssig läuft. Die KI-gesteuerten NPCs verhalten sich so realistisch, dass du kaum unterscheiden kannst, wer ein echter Spieler und wer ein NPC ist. Jede Entscheidung, die du triffst, hat Auswirkungen auf die Welt um dich herum, dank unseres komplexen Butterfly-Effect-Systems.</p>
      
      <h2>Community und soziale Aspekte</h2>
      <p>LifeVerse ist nicht nur ein Spiel – es ist eine lebendige, atmende Welt, die von Millionen von Spielern bevölkert wird. Du kannst Freundschaften schließen, Clubs und Gilden beitreten, an Events teilnehmen und sogar virtuelle Beziehungen eingehen. Unsere Community-Features ermöglichen es dir, dich mit Gleichgesinnten zu verbinden und gemeinsam Abenteuer zu erleben.</p>
      
      <p>Wir können es kaum erwarten, dich in LifeVerse willkommen zu heißen und zu sehen, welchen Weg du in deinem zweiten Leben einschlagen wirst!</p>
    `,
    image: "https://fakeimg.pl/600x400?text=LifeVerse",
    date: "05. März 2025",
    category: "Ankündigungen",
    readTime: "5 min",
    author: {
      name: "Maria Weber",
      avatar: "https://avatar.iran.liara.run/public?text=MW",
      role: "Lead Game Designer",
    },
    tags: ["Ankündigung", "Gameplay", "Features", "Community"],
    relatedPosts: [2, 3, 5],
  },
  {
    id: 2,
    title: "Gameplay-Mechaniken enthüllt",
    content: `
      <p>In LifeVerse kannst du arbeiten, studieren, Freunde treffen und sogar eine Familie gründen. Hier erfährst du, wie unser Real-Life-Gameplay funktioniert.</p>
      
      <h2>Lebensnahe Simulation</h2>
      <p>LifeVerse simuliert alle Aspekte des täglichen Lebens mit unglaublicher Detailtreue. Von grundlegenden Bedürfnissen wie Hunger und Müdigkeit bis hin zu komplexen emotionalen Zuständen – alles wird realistisch dargestellt und beeinflusst dein Spielerlebnis.</p>
      
      <h2>Skill-System</h2>
      <p>Jede Fähigkeit, die du im echten Leben erlernen könntest, kannst du auch in LifeVerse meistern. Ob Kochen, Programmieren, Malen oder Sportarten – je mehr du übst, desto besser wirst du. Unser fortschrittliches Skill-System belohnt regelmäßiges Training und ermöglicht es dir, in verschiedenen Bereichen zum Experten zu werden.</p>
      
      <h2>Karriere und Wirtschaft</h2>
      <p>Die Wirtschaft in LifeVerse ist vollständig spielergesteuert. Du kannst einen traditionellen Karriereweg einschlagen, dein eigenes Unternehmen gründen oder als Freiberufler arbeiten. Jeder Beruf bietet einzigartige Gameplay-Mechaniken und Herausforderungen.</p>
      
      <h2>Soziale Interaktionen</h2>
      <p>Unsere KI-gesteuerten NPCs reagieren auf deine Handlungen und entwickeln eigene Persönlichkeiten. Du kannst tiefgründige Beziehungen aufbauen, die sich über die Zeit entwickeln und verändern. Das soziale Netzwerk in LifeVerse ist komplex und dynamisch – jede Interaktion kann unerwartete Folgen haben.</p>
      
      <h2>Entscheidungsfreiheit</h2>
      <p>In LifeVerse gibt es keine vorgegebenen Ziele oder Missionen. Du entscheidest, was du erreichen möchtest und wie du dein virtuelles Leben gestaltest. Diese Freiheit ermöglicht es jedem Spieler, seine eigene einzigartige Geschichte zu erschaffen.</p>
      
      <p>Wir werden in den kommenden Wochen weitere Details zu spezifischen Gameplay-Mechaniken veröffentlichen. Bleib gespannt!</p>
    `,
    image: "https://fakeimg.pl/600x400?text=Gameplay",
    date: "20. Februar 2025",
    category: "Features",
    readTime: "8 min",
    author: {
      name: "Thomas Schmidt",
      avatar: "https://avatar.iran.liara.run/public?text=TS",
      role: "Gameplay Director",
    },
    tags: ["Gameplay", "Mechaniken", "Skills", "Karriere"],
    relatedPosts: [1, 5, 6],
  },
  {
    id: 3,
    title: "Roadmap 2025",
    content: `
      <p>Unsere Roadmap für 2025 zeigt dir alle geplanten Features, darunter Immobilien, Unternehmen und sogar eine Wirtschaftssimulation!</p>
      
      <h2>Q1 2025: Grundlegende Systeme</h2>
      <p>Im ersten Quartal 2025 konzentrieren wir uns auf die Fertigstellung und Optimierung der grundlegenden Spielsysteme:</p>
      <ul>
        <li>Charakter-Erstellung und Anpassung</li>
        <li>Grundlegende Lebensmechaniken (Bedürfnisse, Emotionen, Gesundheit)</li>
        <li>Erste Berufe und Karrierewege</li>
        <li>Soziale Interaktionen und Beziehungssystem</li>
        <li>Wohnungssystem mit ersten Anpassungsoptionen</li>
      </ul>
      
      <h2>Q2 2025: Wirtschaft und Unternehmen</h2>
      <p>Im zweiten Quartal erweitern wir die wirtschaftlichen Aspekte des Spiels:</p>
      <ul>
        <li>Vollständiges Wirtschaftssystem mit Inflation und Marktdynamik</li>
        <li>Unternehmensgründung und -management</li>
        <li>Aktienmarkt und Investitionsmöglichkeiten</li>
        <li>Erweiterte Karriereoptionen in verschiedenen Branchen</li>
        <li>Immobilienmarkt mit Kauf-, Verkaufs- und Mietoptionen</li>
      </ul>
      
      <h2>Q3 2025: Bildung und Fähigkeiten</h2>
      <p>Das dritte Quartal widmen wir dem Bildungssystem und der Skill-Entwicklung:</p>
      <ul>
        <li>Universitäten und Bildungseinrichtungen</li>
        <li>Erweitertes Skill-System mit Spezialisierungen</li>
        <li>Kreative Werkzeuge für Kunst, Musik und Literatur</li>
        <li>Sportarten und Wettkämpfe</li>
        <li>Forschung und wissenschaftliche Karrieren</li>
      </ul>
      
      <h2>Q4 2025: Community und Events</h2>
      <p>Zum Jahresende fokussieren wir uns auf Community-Features und soziale Aspekte:</p>
      <ul>
        <li>Clubs, Vereine und Organisationen</li>
        <li>Event-System für spieler- und entwicklergesteuerte Veranstaltungen</li>
        <li>Politisches System mit Wahlen und Ämtern</li>
        <li>Erweiterte Familienmechaniken</li>
        <li>Feiertage und saisonale Events</li>
      </ul>
      
      <p>Diese Roadmap gibt einen Überblick über unsere Pläne, kann sich aber im Laufe der Entwicklung noch ändern. Wir werden regelmäßig Updates veröffentlichen und auf das Feedback unserer Community reagieren, um sicherzustellen, dass LifeVerse das bestmögliche Erlebnis bietet.
      </p>
      
      <h2>Langfristige Vision</h2>
      <p>Über 2025 hinaus haben wir große Pläne für LifeVerse. Wir arbeiten bereits an Konzepten für neue Regionen, kulturelle Erweiterungen und technologische Innovationen, die das Spielerlebnis weiter vertiefen werden. Unser Ziel ist es, LifeVerse kontinuierlich zu erweitern und zu verbessern, um eine virtuelle Welt zu schaffen, die über Jahre hinweg wachsen und sich entwickeln kann.</p>
      
      <p>Wir freuen uns darauf, diesen Weg gemeinsam mit unserer Community zu gehen und LifeVerse zu einem zweiten Zuhause für Millionen von Spielern zu machen.</p>
    `,
    image: "https://fakeimg.pl/600x400?text=Roadmap",
    date: "10. Januar 2025",
    category: "Entwicklung",
    readTime: "6 min",
    author: {
      name: "Alexander Müller",
      avatar: "https://avatar.iran.liara.run/public?text=AM",
      role: "Projektmanager",
    },
    tags: ["Roadmap", "Entwicklung", "Features", "Zukunft"],
    relatedPosts: [1, 2, 4],
  },
  {
    id: 4,
    title: "Community Spotlight: Die ersten Tester",
    content: `
      <p>Wir stellen euch die ersten Spieler vor, die LifeVerse testen durften. Erfahrt, was sie über ihre Erfahrungen berichten und welche Aspekte des Spiels sie am meisten begeistert haben.</p>
      
      <h2>Die Pioniere von LifeVerse</h2>
      <p>In den letzten Monaten hatten ausgewählte Tester die Möglichkeit, eine frühe Version von LifeVerse zu erleben. Diese mutigen Pioniere haben uns wertvolles Feedback gegeben und geholfen, das Spiel zu verbessern. Hier sind einige ihrer Geschichten.</p>
      
      <h2>Julia, 28, Grafikdesignerin</h2>
      <p>"Was mich an LifeVerse am meisten beeindruckt hat, ist die visuelle Qualität. Als Grafikdesignerin achte ich besonders auf Details, und die Welt von LifeVerse ist voller kleiner, liebevoller Details. Ich habe in der virtuellen Welt einen Job als Innenarchitektin angenommen und konnte meine kreativen Fähigkeiten voll ausleben. Die Werkzeuge zur Raumgestaltung sind intuitiv und mächtig zugleich."</p>
      
      <h2>Markus, 35, Lehrer</h2>
      <p>"Als Lehrer war ich besonders an den Bildungsmöglichkeiten in LifeVerse interessiert. Ich habe an der virtuellen Universität Kurse belegt und war erstaunt, wie viel ich tatsächlich gelernt habe. Die Mischung aus theoretischem Wissen und praktischer Anwendung ist brillant umgesetzt. Ich habe sogar begonnen, im Spiel Unterricht zu geben, und die Interaktion mit anderen Spielern war unglaublich bereichernd."</p>
      
      <h2>Sophie, 22, Studentin</h2>
      <p>"Für mich war der soziale Aspekt von LifeVerse am faszinierendsten. Ich habe Menschen aus der ganzen Welt kennengelernt und echte Freundschaften geschlossen. Wir haben gemeinsam eine WG gegründet und verbringen viel Zeit damit, zusammen zu kochen, Filme zu schauen oder einfach zu reden. Es fühlt sich erstaunlich real an, obwohl wir uns nie persönlich getroffen haben."</p>
      
      <h2>Michael, 42, Unternehmer</h2>
      <p>"Als Unternehmer in der realen Welt war ich skeptisch, ob LifeVerse die Komplexität des Geschäftslebens realistisch darstellen kann. Ich wurde positiv überrascht! Ich habe ein kleines Café eröffnet, Mitarbeiter eingestellt und mit den wirtschaftlichen Herausforderungen gekämpft. Die Wirtschaftssimulation ist beeindruckend detailliert, und der Erfolg fühlt sich genauso befriedigend an wie im echten Leben."</p>
      
      <h2>Gemeinsame Erfahrungen</h2>
      <p>Trotz ihrer unterschiedlichen Hintergründe und Interessen teilen unsere Tester einige gemeinsame Erfahrungen:</p>
      <ul>
        <li>Die Lernkurve ist sanft, aber die Tiefe des Spiels ist enorm</li>
        <li>Die Freiheit, eigene Entscheidungen zu treffen, schafft ein einzigartiges Spielerlebnis</li>
        <li>Die sozialen Interaktionen fühlen sich natürlich und bedeutungsvoll an</li>
        <li>Die Welt wirkt lebendig und reagiert auf die Handlungen der Spieler</li>
      </ul>
      
      <p>Wir sind dankbar für das Engagement und die Leidenschaft unserer ersten Tester. Ihr Feedback hat maßgeblich dazu beigetragen, LifeVerse zu dem Erlebnis zu machen, das es heute ist. Wir können es kaum erwarten, diese Welt mit noch mehr Spielern zu teilen.</p>
    `,
    image: "https://fakeimg.pl/600x400?text=Community",
    date: "28. Dezember 2024",
    category: "Community",
    readTime: "7 min",
    author: {
      name: "Lisa Becker",
      avatar: "https://avatar.iran.liara.run/public?text=LB",
      role: "Community Manager",
    },
    tags: ["Community", "Tester", "Erfahrungen", "Feedback"],
    relatedPosts: [1, 3, 6],
  },
  {
    id: 5,
    title: "Karrieremöglichkeiten in LifeVerse",
    content: `
      <p>Entdecke die vielfältigen Berufswege, die dir in LifeVerse offenstehen. Von traditionellen Karrieren bis hin zu kreativen Berufen - in unserer virtuellen Welt kannst du jeden Weg einschlagen.</p>
      
      <h2>Unbegrenzte Möglichkeiten</h2>
      <p>In LifeVerse gibt es keine Grenzen für deine berufliche Entwicklung. Du kannst traditionelle Karrierewege verfolgen, kreative Berufe ausüben oder völlig neue Tätigkeiten erfinden, die es in der realen Welt noch gar nicht gibt. Jeder Beruf bietet einzigartige Gameplay-Mechaniken, Herausforderungen und Belohnungen.</p>
      
      <h2>Traditionelle Karrieren</h2>
      <p>Für Spieler, die einen strukturierten Karriereweg bevorzugen, bietet LifeVerse zahlreiche traditionelle Berufe:</p>
      <ul>
        <li><strong>Medizin:</strong> Werde Arzt, Chirurg, Krankenpfleger oder Therapeut und heile virtuelle Patienten</li>
        <li><strong>Recht:</strong> Arbeite als Anwalt, Richter oder Notar und navigiere durch komplexe Rechtsfälle</li>
        <li><strong>Finanzen:</strong> Verwalte als Banker, Börsenmakler oder Finanzberater das Geld anderer Spieler</li>
        <li><strong>Bildung:</strong> Unterrichte als Lehrer oder Professor und gib dein Wissen an andere Spieler weiter</li>
        <li><strong>Technologie:</strong> Entwickle als Programmierer, Ingenieur oder Wissenschaftler neue virtuelle Technologien</li>
      </ul>
      
      <h2>Kreative Berufe</h2>
      <p>Für kreative Köpfe bietet LifeVerse eine Vielzahl von künstlerischen und gestalterischen Berufen:</p>
      <ul>
        <li><strong>Kunst:</strong> Erschaffe als Maler, Bildhauer oder Fotograf Kunstwerke, die in virtuellen Galerien ausgestellt werden können</li>
        <li><strong>Musik:</strong> Komponiere, produziere oder performiere Musik und gib Konzerte für andere Spieler</li>
        <li><strong>Design:</strong> Gestalte als Mode-, Innen- oder Grafikdesigner einzigartige Kreationen</li>
        <li><strong>Gastronomie:</strong> Eröffne als Koch, Bäcker oder Barkeeper dein eigenes Restaurant oder Café</li>
        <li><strong>Unterhaltung:</strong> Arbeite als Schauspieler, Regisseur oder Autor und erschaffe unterhaltsame Inhalte</li>
      </ul>
      
      <h2>Unternehmertum</h2>
      <p>Für ambitionierte Spieler bietet LifeVerse umfangreiche Möglichkeiten, ein eigenes Unternehmen zu gründen:</p>
      <ul>
        <li><strong>Einzelhandel:</strong> Eröffne Geschäfte und verkaufe Waren an andere Spieler</li>
        <li><strong>Dienstleistungen:</strong> Biete spezialisierte Dienstleistungen an, von Reinigung bis hin zu Beratung</li>
        <li><strong>Immobilien:</strong> Kaufe, verkaufe und vermiete Immobilien und werde zum Immobilienmogul</li>
        <li><strong>Produktion:</strong> Stelle Waren her und verkaufe sie auf dem Markt</li>
        <li><strong>Technologie:</strong> Gründe ein Tech-Startup und entwickle innovative virtuelle Produkte</li>
      </ul>
      
      <h2>Skill-Entwicklung und Fortschritt</h2>
      <p>Jeder Beruf in LifeVerse erfordert spezifische Fähigkeiten, die du durch Übung, Bildung und Erfahrung entwickeln kannst. Je mehr du in einem Bereich arbeitest, desto besser wirst du darin. Mit zunehmender Expertise schaltest du neue Möglichkeiten, Werkzeuge und Spezialisierungen frei.</p>
      
      <p>Die Karrierewege in LifeVerse sind nicht linear – du kannst jederzeit den Beruf wechseln, mehrere Tätigkeiten gleichzeitig ausüben oder völlig neue Wege gehen. Diese Flexibilität ermöglicht es dir, dein virtuelles Leben genau nach deinen Vorstellungen zu gestalten.</p>
      
      <p>Wir freuen uns darauf zu sehen, welche Karrierewege unsere Spieler einschlagen werden und wie sie die Wirtschaft und Gesellschaft von LifeVerse prägen werden.</p>
    `,
    image: "https://fakeimg.pl/600x400?text=Karriere",
    date: "15. Dezember 2024",
    category: "Features",
    readTime: "10 min",
    author: {
      name: "Julia Hoffmann",
      avatar: "https://avatar.iran.liara.run/public?text=JH",
      role: "Content Designer",
    },
    tags: ["Karriere", "Berufe", "Wirtschaft", "Skills"],
    relatedPosts: [1, 2, 6],
  },
  {
    id: 6,
    title: "Interview mit dem Entwicklerteam",
    content: `
      <p>Ein exklusives Gespräch mit den Köpfen hinter LifeVerse. Erfahre mehr über die Inspiration, Herausforderungen und Visionen der Entwickler für die Zukunft des Spiels.</p>
      
      <h2>Die Entstehung von LifeVerse</h2>
      <p><strong>Frage:</strong> Wie ist die Idee zu LifeVerse entstanden?</p>
      <p><strong>David Berger (Creative Director):</strong> "Die Idee entstand während der Pandemie, als viele von uns gezwungen waren, ihr soziales Leben einzuschränken. Wir haben uns gefragt, wie wir eine virtuelle Welt erschaffen könnten, die so reich und detailliert ist, dass sie ein echtes zweites Leben bieten kann. Nicht als Ersatz für die Realität, sondern als Erweiterung – ein Ort, an dem Menschen zusammenkommen, Neues ausprobieren und Erfahrungen sammeln können, die in der realen Welt vielleicht nicht möglich sind."</p>
      
      <h2>Technische Herausforderungen</h2>
      <p><strong>Frage:</strong> Was waren die größten technischen Herausforderungen bei der Entwicklung?</p>
      <p><strong>Sarah Chen (Technical Director):</strong> "Die größte Herausforderung war definitiv die Schaffung einer persistenten, dynamischen Welt, die sich organisch entwickelt und auf die Handlungen der Spieler reagiert. Wir mussten eine völlig neue Engine entwickeln, die in der Lage ist, Millionen von Entscheidungen und Interaktionen in Echtzeit zu verarbeiten und dabei die Auswirkungen auf die Wirtschaft, Gesellschaft und Umwelt zu simulieren. Ein weiteres Hindernis war die Entwicklung der KI für die NPCs, die so realistisch sein musste, dass sie von echten Spielern kaum zu unterscheiden ist."</p>
      
      <h2>Soziale Aspekte</h2>
      <p><strong>Frage:</strong> Wie geht ihr mit den sozialen Aspekten und potenziellen Problemen wie Toxizität um?</p>
      <p><strong>Elena Rodriguez (Community Director):</strong> "Wir nehmen die soziale Verantwortung sehr ernst. LifeVerse ist darauf ausgelegt, positive Interaktionen zu fördern und toxisches Verhalten zu minimieren. Wir haben robuste Moderationssysteme implementiert, die von KI und menschlichen Moderatoren unterstützt werden. Gleichzeitig haben wir ein Reputationssystem entwickelt, das positives Verhalten belohnt und negative Konsequenzen für schädliches Verhalten hat – ähnlich wie im echten Leben. Unser Ziel ist es, eine inklusive, respektvolle Community aufzubauen, in der sich jeder willkommen fühlt."</p>
      
      <h2>Wirtschaftliches Modell</h2>
      <p><strong>Frage:</strong> Wie funktioniert das wirtschaftliche Modell von LifeVerse?</p>
      <p><strong>Marcus Weber (Business Director):</strong> "LifeVerse basiert auf einem Free-to-Play-Modell mit optionalen In-Game-Käufen. Wichtig ist uns dabei, dass es keine Pay-to-Win-Mechaniken gibt. Käufliche Items sind rein kosmetischer Natur oder bieten Komfortfunktionen, aber keinen spielerischen Vorteil. Die In-Game-Wirtschaft selbst ist vollständig spielergesteuert, mit eigener Währung, Märkten und Wirtschaftszyklen. Spieler können durch ihre Arbeit, Kreativität und Unternehmertum echten Wert in der virtuellen Welt schaffen."</p>
      
      <h2>Zukunftspläne</h2>
      <p><strong>Frage:</strong> Wie seht ihr die Zukunft von LifeVerse?</p>
      <p><strong>David Berger:</strong> "Wir betrachten LifeVerse als ein langfristiges Projekt, das über viele Jahre wachsen und sich entwickeln wird. Unsere Vision geht weit über das hinaus, was wir zum Launch anbieten werden. Wir planen, kontinuierlich neue Regionen, Kulturen, Berufe und Möglichkeiten hinzuzufügen. Langfristig sehen wir LifeVerse nicht nur als Spiel, sondern als eine parallele Welt, in der Menschen arbeiten, lernen, kreativ sein und bedeutungsvolle Verbindungen knüpfen können. Die Grenzen zwischen virtueller und realer Welt werden zunehmend verschwimmen, und wir wollen an der Spitze dieser Entwicklung stehen."</p>
      
      <h2>Persönliche Erfahrungen</h2>
      <p><strong>Frage:</strong> Was ist eure persönliche Lieblingsbeschäftigung in LifeVerse?</p>
      <p><strong>Sarah Chen:</strong> "Ich verbringe erstaunlich viel Zeit damit, in meinem virtuellen Garten zu arbeiten. Es ist entspannend und befriedigend, Pflanzen wachsen zu sehen und die Früchte meiner Arbeit zu ernten."</p>
      <p><strong>Elena Rodriguez:</strong> "Ich liebe es, virtuelle Konzerte zu besuchen und mit Freunden aus der ganzen Welt zu feiern. Die Atmosphäre ist unglaublich, und die Musik klingt fantastisch."</p>
      <p><strong>Marcus Weber:</strong> "Ich habe eine kleine Bäckerei eröffnet und experimentiere gerne mit neuen Rezepten. Es macht Spaß, die Reaktionen der Kunden zu sehen und mein Geschäft wachsen zu lassen."</p>
      <p><strong>David Berger:</strong> "Ich erkunde gerne die Welt und dokumentiere meine Reisen in einem virtuellen Blog. Es gibt so viele versteckte Orte und Details zu entdecken, selbst für uns Entwickler ist die Welt voller Überraschungen."</p>
      
      <p>Wir danken dem Entwicklerteam für dieses aufschlussreiche Gespräch und freuen uns darauf, bald selbst in die Welt von LifeVerse eintauchen zu können.</p>
    `,
    image: "https://fakeimg.pl/600x400?text=Interview",
    date: "01. Dezember 2024",
    category: "Hinter den Kulissen",
    readTime: "12 min",
    author: {
      name: "Robert Klein",
      avatar: "https://avatar.iran.liara.run/public?text=RK",
      role: "Redakteur",
    },
    tags: ["Interview", "Entwickler", "Hinter den Kulissen", "Vision"],
    relatedPosts: [1, 3, 5],
  },
]

const BlogView: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const post = blogPosts.find((p) => p.id === Number(id))

  const relatedPosts = post?.relatedPosts
    ? blogPosts.filter((p) => post.relatedPosts?.includes(p.id))
    : blogPosts.filter((p) => p.id !== Number(id)).slice(0, 3)

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
        <Navbar />
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900/30 rounded-full filter blur-3xl opacity-30"></div>
            <div className="absolute top-60 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900/30 rounded-full filter blur-3xl opacity-30"></div>
          </div>

          <div className="relative z-10 min-h-[70vh] flex flex-col items-center justify-center px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-6 text-center">
              Artikel nicht gefunden
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md text-center mb-8">
              Der gesuchte Artikel existiert nicht oder wurde entfernt.
            </p>
            <button
              onClick={() => navigate("/news")}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Zurück zur Übersicht
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900/30 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute top-60 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900/30 rounded-full filter blur-3xl opacity-30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ x: -5 }}
            className="mb-8 flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Zurück</span>
          </motion.button>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                    {post.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.readTime} Lesezeit
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">{post.title}</h1>

                <div className="flex items-center mb-8">
                  <img
                    src={post.author.avatar || "/placeholder.svg"}
                    alt={post.author.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{post.author.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{post.author.role}</p>
                  </div>
                </div>

                <div className="mb-8 rounded-xl overflow-hidden">
                  <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-auto object-cover" />
                </div>

                <div
                  className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <Heart className="h-5 w-5" />
                      <span>Like</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <MessageSquare className="h-5 w-5" />
                      <span>Kommentar</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <Bookmark className="h-5 w-5" />
                      <span>Speichern</span>
                    </button>
                  </div>
                  <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <Share2 className="h-5 w-5" />
                    <span>Teilen</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Comments Section Placeholder */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Kommentare</h2>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Sei der Erste, der diesen Artikel kommentiert.
                  </p>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    Kommentar schreiben
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Author Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Über den Autor</h2>
                <div className="flex items-center mb-4">
                  <img
                    src={post.author.avatar || "/placeholder.svg"}
                    alt={post.author.name}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{post.author.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{post.author.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {post.author.name} ist ein erfahrenes Mitglied des LifeVerse-Teams und teilt regelmäßig Einblicke in
                  die Entwicklung und Features des Spiels.
                </p>
                <button className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                  Alle Artikel von diesem Autor
                </button>
              </div>
            </div>

            {/* Related Posts */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-green-500 to-teal-500"></div>
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Verwandte Artikel</h2>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <div
                      key={relatedPost.id}
                      className="flex gap-3 cursor-pointer group"
                      onClick={() => navigate(`/news/${relatedPost.id}`)}
                    >
                      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                        <img
                          src={relatedPost.image || "/placeholder.svg"}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{relatedPost.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500"></div>
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Kategorien</h2>
                <div className="space-y-2">
                  {Array.from(new Set(blogPosts.map((p) => p.category))).map((category) => (
                    <div
                      key={category}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => navigate(`/news?category=${category}`)}
                    >
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-gray-700 dark:text-gray-300">{category}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Newsletter abonnieren</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Erhalte die neuesten Updates und Artikel direkt in dein Postfach.
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Deine E-Mail-Adresse"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Abonnieren
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default BlogView

