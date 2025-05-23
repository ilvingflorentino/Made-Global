
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Video, Warehouse, Scissors, Store, Briefcase } from 'lucide-react' // Changed Cutter to Scissors
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/config/i18n.config'

interface VirtualTourPageProps {
  params: { lang: Locale }
}

export default async function VirtualTourPage({ params: { lang } }: VirtualTourPageProps) {
  const dictionary = await getDictionary(lang);
  const t = dictionary.virtualTourPage;
  const tCommon = dictionary.common;

  const tourAreas = [
    { id: 'warehouse', name: t.warehouse, icon: Warehouse, embedUrl: 'https://placehold.co/1200x700/3D7748/FFFFFF?text=Almacen+Virtual', dataAiHint: "warehouse interior" },
    { id: 'cutting', name: t.cuttingArea, icon: Scissors, embedUrl: 'https://placehold.co/1200x700/745437/FFFFFF?text=Area+de+Corte+Virtual', dataAiHint: "wood cutting" }, // Changed Cutter to Scissors
    { id: 'showroom', name: t.showroom, icon: Store, embedUrl: 'https://placehold.co/1200x700/1b4721/FFFFFF?text=Exhibicion+Virtual', dataAiHint: "wood showroom" },
    { id: 'office', name: t.office, icon: Briefcase, embedUrl: 'https://placehold.co/1200x700/F0F4F1/333333?text=Oficina+Virtual', dataAiHint: "office interior" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">{tCommon.virtualTour}</h1>
        <p className="text-muted-foreground mt-2">Explora nuestras instalaciones desde la comodidad de tu hogar.</p>
      </header>

      <Card className="shadow-xl">
        <CardContent className="p-0 md:p-2">
          <Tabs defaultValue={tourAreas[0].id} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 p-2 bg-muted rounded-t-lg">
              {tourAreas.map(area => (
                <TabsTrigger key={area.id} value={area.id} className="flex-col md:flex-row h-auto py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <area.icon className="h-5 w-5 mb-1 md:mb-0 md:mr-2" />
                  <span>{area.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            {tourAreas.map(area => (
              <TabsContent key={area.id} value={area.id} className="mt-0 rounded-b-lg overflow-auto">
                <div className="aspect-video bg-black relative" data-ai-hint={area.dataAiHint}>
                  {/* Placeholder for <VideoEmbed> or <IframeViewer> */}
                  <iframe
                    src={area.embedUrl}
                    title={area.name}
                    className="absolute top-0 left-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                  {/* Fallback if iframe fails */}
                   <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xl z-[-1]">
                     {area.name} - {tCommon.loading}...
                   </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>¿Tienes Preguntas?</CardTitle>
          <CardDescription>Nuestro experto en maderas está listo para ayudarte. Inicia un chat para más información.</CardDescription>
        </CardHeader>
        <CardContent>
           {/* The ChatbotLauncher is globally available via MainLayout, but you could add a specific CTA here too */}
          <p className="text-sm text-muted-foreground">Haz clic en el ícono de chat en la esquina inferior derecha para hablar con nuestro asistente virtual.</p>
        </CardContent>
      </Card>

    </div>
  );
}

