import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { pricingCards, projects, statusIcons } from "@/lib/constants";
import { ProjectCard } from "@/components/ui/card_buildboard";
import { Check } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export default function Home() {
  return (
    <>
      <section className="min-h-screen w-full relative flex items-center justify-center flex-col px-4 pt-24">
        <div className="absolute z-[-10] bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Hero Section with improved responsive spacing */}
        <div className="w-full max-w-6xl mx-auto space-y-6 text-center">
          <p className="text-center font-bold text-lg sm:text-xl md:text-2xl px-4 mb-4">
            Administra tus proyectos, en un solo lugar
          </p>
          <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative px-4">
            <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-11xl font-bold text-center leading-tight">
              BuildBoard
            </h1>
          </div>
        </div>

        {/* Projects Grid with improved spacing */}
        <div className="flex justify-center flex-wrap gap-4 mt-12 w-full max-w-6xl mx-auto">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} statusIcons={statusIcons} />
          ))}
        </div>
      </section>

      {/* Pricing Section with improved spacing */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-8">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Elige el plan perfecto para tu empresa
            </h2>
            <p className="text-gray-500 text-base sm:text-lg">
              Desbloquea el máximo potencial de tu organización con opciones diseñadas para crecer contigo
            </p>
          </div>

          <div className="flex justify-center gap-6 flex-wrap mt-6">
            {pricingCards.map((card) => (
              <Card 
                key={card.title} 
                className={clsx(
                  'w-full w-[300px] flex flex-col shadow-lg justify-between transition-transform duration-200 hover:scale-105',
                  {'border-2 border-primary': card.title === 'Profesional'}
                )}
              >
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-4xl font-bold">${card.price}</span>
                  <span className="text-muted-foreground"> USD/mes</span>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-4">
                  <div className="space-y-2">
                    {card.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex gap-2 items-center"
                      >
                        <Check className="text-green-500 shrink-0" />
                        <p className="text-sm">{feature}</p>
                      </div>
                    ))}
                  </div>
                  <Link 
                    href={`/organization?plan/${card.priceId}`}
                    className={clsx(
                      'w-full text-center bg-primary p-2 rounded-md',
                      {'!bg-gray-600': card.title !== 'Profesional'}
                    )}
                  >
                    <span className="text-white">Empieza Ahora</span>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

