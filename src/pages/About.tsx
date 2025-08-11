import { useTranslation } from "@/hooks/use-translation";
import useIntersectionObserver from "@/hooks/use-intersection-observer";
import { FC, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { cn } from "@/lib/utils";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { Globe, FlaskConical, ShieldCheck, FileText, Recycle, ChevronDown, MapPin, FileDown, MessageCircle } from "lucide-react";

const Seo: FC = () => {
    const { t } = useTranslation();
    const title = `About zayna | ${t.positioning}`;
    const description = t.story.split('.').slice(0, 2).join('.') + '.';

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "zayna",
        "url": "https://zayna.ma", // Placeholder URL
        "logo": "https://zayna.ma/logo.png", // Placeholder URL
        "sameAs": [
            "https://www.facebook.com/zayna",
            "https://www.instagram.com/zayna"
        ]
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": t.faq.map(item => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.a
            }
        }))
    };

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
            <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        </Helmet>
    );
};

const AnimatedSection: FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const entry = useIntersectionObserver(ref, { freezeOnceVisible: true, threshold: 0.1 });
    const isVisible = !!entry?.isIntersecting;

    return (
        <div ref={ref} className={cn("transition-opacity duration-700 ease-in-out", isVisible ? "opacity-100" : "opacity-0", "transform", isVisible ? "translate-y-0" : "translate-y-4", className)}>
            {children}
        </div>
    );
};

const HeroIntro: FC = () => {
  const { t } = useTranslation();
  const summary = t.story.split('.').slice(0, 2).join('.') + '.';
  const certBadges = [
      { key: "cosmos", label: t.certifications[0], tooltip: t.tooltips.cosmos },
      { key: "crueltyFree", label: t.certifications[1], tooltip: t.tooltips.crueltyFree },
      { key: "vegan", label: t.certifications[2], tooltip: t.tooltips.vegan },
  ];

  return (
    <Card className="rounded-card shadow-soft overflow-hidden">
      <div className="grid md:grid-cols-2">
        <div className="bg-muted/40 min-h-[280px] md:min-h-[400px] flex items-center justify-center">
          <img src="/placeholder.svg" alt="zayna brand placeholder" className="w-1/2 opacity-30" loading="lazy" />
        </div>
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h1 className="font-head text-3xl md:text-4xl font-bold text-primary mb-4">{t.positioning}</h1>
          <p className="text-muted-foreground mb-6">{summary}</p>
          <div className="flex flex-wrap gap-2">
            {certBadges.map((cert) => (
              <Tooltip key={cert.key}>
                <TooltipTrigger>
                    <Badge variant="secondary" className="text-sm">{cert.label}</Badge>
                </TooltipTrigger>
                <TooltipContent>{cert.tooltip}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

const ValueCard: FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="text-center">
    <div className="flex justify-center mb-4">
      <div className="bg-secondary text-primary rounded-full size-16 flex items-center justify-center">
        {icon}
      </div>
    </div>
    <h3 className="font-head text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </div>
);

const MissionValues: FC = () => {
  const { t } = useTranslation();
  const icons = [ <Globe size={28} />, <FlaskConical size={28} />, <ShieldCheck size={28} />, <FileText size={28} />, <Recycle size={28} /> ];

  return (
    <section className="text-center">
      <h2 className="font-head text-3xl font-bold mb-4">{t.mission}</h2>
      <p className="text-muted-foreground max-w-2xl mx-auto mb-12">We are committed to clean, effective, and transparent beauty, rooted in Moroccan heritage.</p>
      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
        {t.valuePillars.map((pillar, index) => (
          <ValueCard key={pillar.title} icon={icons[index]} title={pillar.title} description={pillar.description} />
        ))}
      </div>
    </section>
  );
};

const OurStory: FC = () => {
  const { t } = useTranslation();
  const paragraphs = t.story.split('\n\n');
  const lastParagraphParts = paragraphs[2].split('compact line');

  return (
    <section className="bg-secondary rounded-card py-12 px-8 md:px-16 text-center">
      <h2 className="font-head text-3xl font-bold mb-4">{t.ourStory}</h2>
      <Collapsible>
        <div className="prose prose-lg max-w-3xl mx-auto text-muted-foreground space-y-4">
          <p>{paragraphs[0]}</p>
          <CollapsibleContent className="space-y-4">
            <p>{paragraphs[1]}</p>
            <p>
              {lastParagraphParts[0]}
              <Link to="/shop" className="text-primary hover:underline font-semibold story-link">compact line</Link>
              {lastParagraphParts[1]}
            </p>
          </CollapsibleContent>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="mt-4 group">
            Read more <ChevronDown className="ml-2 h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </Button>
        </CollapsibleTrigger>
      </Collapsible>
    </section>
  );
};

const SourcingGridItem: FC<{ item: { name: string; region: string; blurb: string } }> = ({ item }) => (
  <Card className="p-6">
    <h3 className="font-head font-semibold text-lg mb-2">{item.name}</h3>
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
      <MapPin size={14} />
      <span>{item.region}</span>
    </div>
    <p className="text-sm">{item.blurb}</p>
  </Card>
);

const IngredientsSourcing: FC = () => {
  const { t } = useTranslation();
    const sourcingBadges = [
      { key: "localSourcing", label: t.badges.locallySourced, tooltip: t.tooltips.localSourcing },
      { key: "crueltyFree", label: t.badges.crueltyFree, tooltip: t.tooltips.crueltyFree },
      { key: "noNasties", label: t.badges.noNasties, tooltip: t.tooltips.noNasties },
  ];

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="font-head text-3xl font-bold mb-4">{t.ingredients}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We source our key actives from the rich ecosystems of Morocco, partnering with cooperatives that empower local communities.
        </p>
      </div>
      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-8 grid md:grid-cols-2 gap-6">
          {t.sourcingInfo.map((item) => (
            <SourcingGridItem key={item.name} item={item} />
          ))}
        </div>
        <div className="md:col-span-4 bg-muted/40 rounded-card min-h-[200px] flex items-center justify-center">
          <img src="/placeholder.svg" alt="Map of Morocco placeholder" className="w-1/3 opacity-30" loading="lazy" />
        </div>
      </div>
      <div className="mt-12 flex flex-wrap justify-center gap-4">
        {sourcingBadges.map(badge => (
             <Tooltip key={badge.key}>
                <TooltipTrigger>
                    <Badge variant="secondary" className="text-base px-4 py-2">{badge.label}</Badge>
                </TooltipTrigger>
                <TooltipContent>{badge.tooltip}</TooltipContent>
              </Tooltip>
        ))}
      </div>
    </section>
  );
}

const calculateProgress = (stat: string, goal: string): number | null => {
  const statNum = parseFloat(stat.match(/-?[\d.]+/)?.
[0] || 'NaN');
  const goalNum = parseFloat(goal.match(/-?[\d.]+/)?.
[0] || 'NaN');

  if (isNaN(statNum) || isNaN(goalNum) || goalNum === 0) return null;

  if (stat.includes('%') && goal.includes('%') && !stat.includes('-')) {
    if (goalNum > statNum) {
      return (statNum / goalNum) * 100;
    }
  }

  if (stat.includes('%') && goal.includes('%') && stat.includes('-')) {
    return (Math.abs(statNum) / Math.abs(goalNum)) * 100;
  }

  return null;
};

const StatCard: FC<{ kpi: { stat: string; goal: string; label: string; target: string } }> = ({ kpi }) => {
  const progress = calculateProgress(kpi.stat, kpi.goal);

  return (
    <Card className="p-6 flex flex-col">
      <div className="text-4xl font-bold text-primary mb-2">{kpi.stat}</div>
      <p className="text-sm text-muted-foreground flex-grow">{kpi.label}</p>
      {progress !== null && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progress</span>
            <span>Goal: {kpi.goal}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1 text-right">{kpi.target}</p>
        </div>
      )}
    </Card>
  );
};

const SustainabilityKPIs: FC = () => {
  const { t } = useTranslation();
  return (
    <section className="bg-secondary rounded-card py-12 px-8 md:px-16">
      <div className="text-center mb-12">
        <h2 className="font-head text-3xl font-bold mb-4">{t.sustainability}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We are committed to continuous improvement in our environmental and social impact.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {t.sustainabilityKPIs.map((kpi) => (
          <StatCard key={kpi.label} kpi={kpi} />
        ))}
      </div>
       <p className="text-xs text-muted-foreground text-center mt-8">
        For more details on our sustainability goals, see our <a href="#" className="underline">full policy report</a>.
      </p>
    </section>
  );
};

const QualitySafety: FC = () => {
  const { t } = useTranslation();
  const items = [t.quality.formulation, t.quality.testing, t.quality.allergen];

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="font-head text-3xl font-bold mb-4">{t.quality.title}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our commitment to safety and transparency is at the core of every product we create.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
          {items.map((item, index) => (
            <AccordionItem key={item.title} value={`item-${index}`}>
              <AccordionTrigger>{item.title}</AccordionTrigger>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="bg-muted/40 rounded-card p-8 text-center flex flex-col items-center justify-center h-full">
            <h3 className="font-head font-semibold text-lg mb-2">Certificate of Analysis</h3>
            <p className="text-sm text-muted-foreground mb-4">Download a sample COA for our Argan Oil.</p>
            <Button asChild>
                <a href="/mock-coa.pdf" download>
                    <FileDown className="mr-2 h-4 w-4" />
                    Download PDF
                </a>
            </Button>
        </div>
      </div>
    </section>
  );
};

const TeamCard: FC<{ member: { name: string; role: string; bio: string } }> = ({ member }) => (
    <div className="text-center">
        <Avatar className="mx-auto size-24 mb-4">
            <AvatarImage loading="lazy" src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${member.name}`} />
            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h3 className="font-head font-semibold text-lg">{member.name}</h3>
        <p className="text-primary/80 text-sm mb-2">{member.role}</p>
        <p className="text-muted-foreground text-sm">{member.bio}</p>
    </div>
);

const Team: FC = () => {
    const { t } = useTranslation();
    return (
        <section className="bg-secondary rounded-card py-12 px-8 md:px-16">
            <div className="text-center mb-12">
                <h2 className="font-head text-3xl font-bold mb-4">{t.teamSection}</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Meet the people behind zayna, dedicated to bringing you the best of Moroccan beauty.
                </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {t.team.map((member) => (
                    <TeamCard key={member.name} member={member} />
                ))}
            </div>
            <div className="text-center mt-12">
                <Button variant="outline" asChild>
                    <Link to="/careers">We're hiring! Join our team</Link>
                </Button>
            </div>
        </section>
    );
};

const PressCommunity: FC = () => {
    const { t } = useTranslation();
    const pressLogos = ["Vogue Arabia", "Femmes du Maroc", "TelQuel", "Hespéris-Tamuda", "Yabiladi"];

    return (
        <section>
            <div className="text-center mb-12">
                <h2 className="font-head text-3xl font-bold mb-4">{t.press}</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    zayna is celebrated for its commitment to quality and Moroccan heritage.
                </p>
            </div>
            <div className="mb-16">
                <div className="flex justify-center items-center gap-x-12 gap-y-4 flex-wrap">
                    {pressLogos.map(logo => (
                        <span key={logo} className="font-head text-muted-foreground font-medium text-lg">{logo}</span>
                    ))}
                </div>
            </div>
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent>
                    {t.ugc.map((item, index) => (
                         <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                            <div className="p-1">
                                <Card className="overflow-hidden">
                                    <div className="bg-muted/40 h-64 flex items-center justify-center">
                                        <img src="/placeholder.svg" alt="UGC placeholder" className="w-1/3 opacity-30" loading="lazy" />
                                    </div>
                                    <div className="p-4">
                                        <p className="italic">"{item.caption}"</p>
                                    </div>
                                </Card>
                            </div>
                         </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
            </Carousel>
        </section>
    );
};
const FAQ: FC = () => {
    const { t } = useTranslation();
    return (
        <section className="bg-secondary rounded-card py-12 px-8 md:px-16">
            <div className="text-center mb-12">
                <h2 className="font-head text-3xl font-bold mb-4">{t.faqSection}</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Have questions? We've got answers.
                </p>
            </div>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
                {t.faq.map((item, index) => (
                    <AccordionItem key={item.q} value={`item-${index}`}>
                        <AccordionTrigger>{item.q}</AccordionTrigger>
                        <AccordionContent>{item.a}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </section>
    );
};

const CallToAction: FC = () => {
    const { t } = useTranslation();
    const whatsappLink = "https://wa.me/212607076940?text=Hi%20I’m%20interested%20in%20your%20products";

    return (
        <section className="text-center">
            <h2 className="font-head text-3xl font-bold mb-4">Ready to try zayna?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Explore our bestsellers or get in touch with us directly on WhatsApp for personalized recommendations.
            </p>
            <div className="flex justify-center gap-4">
                <Button asChild size="lg">
                    <Link to="/shop">{t.cta.shop}</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="mr-2 h-5 w-5" />
                        {t.cta.whatsapp}
                    </a>
                </Button>
            </div>
        </section>
    );
}


const AboutPage = () => {
  const { t, locale, dir } = useTranslation();

  return (
    <div dir={dir} lang={locale}>
      <Seo />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-16 md:space-y-24">
            <AnimatedSection><HeroIntro /></AnimatedSection>
            <AnimatedSection><MissionValues /></AnimatedSection>
            <AnimatedSection><OurStory /></AnimatedSection>
            <AnimatedSection><IngredientsSourcing /></AnimatedSection>
            <AnimatedSection><SustainabilityKPIs /></AnimatedSection>
            <AnimatedSection><QualitySafety /></AnimatedSection>
            <AnimatedSection><Team /></AnimatedSection>
            <AnimatedSection><PressCommunity /></AnimatedSection>
            <AnimatedSection><FAQ /></AnimatedSection>
            <AnimatedSection><CallToAction /></AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
