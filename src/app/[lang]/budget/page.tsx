"use client" // This page needs client-side interactivity for the form

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UploadCloud, Loader2 } from 'lucide-react'
import { getDictionary } from '@/lib/dictionaries' // This won't work directly in client component
import type { Locale } from '@/config/i18n.config'
import { useEffect, useState } from 'react' // For fetching dictionary
import type { Dictionary } from '@/lib/dictionaries'
import { useToast } from "@/hooks/use-toast"

// Define Zod schema for form validation
const budgetSchema = z.object({
  product: z.string().optional(),
  description: z.string().min(10, "Por favor, describe tus necesidades con más detalle (mínimo 10 caracteres)."),
  file: z.any().optional(), // For file uploads, more specific validation might be needed
  name: z.string().min(2, "Nombre es requerido."),
  email: z.string().email("Correo electrónico inválido."),
  phone: z.string().min(7, "Teléfono es requerido."),
})

type BudgetFormData = z.infer<typeof budgetSchema>

// Mock product list
const products = [
  { id: 'roble', name: 'Roble Americano' },
  { id: 'caoba', name: 'Caoba Dominicana' },
  { id: 'pino', name: 'Pino Tratado' },
  { id: 'otro', name: 'Otro (Especificar)' },
]

interface BudgetPageProps {
  params: { lang: Locale }
}

export default function BudgetPage({ params: { lang } }: BudgetPageProps) {
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDictionary = async () => {
      const dict = await getDictionary(lang);
      setDictionary(dict);
    }
    fetchDictionary();
  }, [lang]);

  const form = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      product: '',
      description: '',
      name: '',
      email: '',
      phone: '',
    },
  })

  const onSubmit = async (data: BudgetFormData) => {
    setIsSubmitting(true);
    console.log("Budget Request Data:", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    toast({
      title: "Cotización Enviada",
      description: "Hemos recibido tu solicitud. Nos pondremos en contacto contigo pronto.",
      variant: "default", // 'default' for success-like, or create a 'success' variant
    });
    form.reset();
  }

  if (!dictionary) {
    return <div className="container mx-auto px-4 py-8 text-center">Cargando...</div>;
  }
  const t = dictionary.budgetPage;
  const tCheckout = dictionary.checkoutPage; // For common fields like name, email, phone
  const tCommon = dictionary.common;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl md:text-4xl font-bold">{t.requestQuote}</CardTitle>
          <CardDescription>Completa el formulario y te enviaremos una cotización personalizada.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="product" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.selectProduct}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecciona un producto..." /></SelectTrigger></FormControl>
                    <SelectContent>
                      {products.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.describeNeeds}</FormLabel>
                  <FormControl><Textarea placeholder="Ej: Necesito 10 tablas de roble de 2x4x8 para un proyecto de estantería..." {...field} rows={5} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="file" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.attachFile}</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center justify-center w-full">
                        <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Haz clic para subir</span> o arrastra y suelta</p>
                                <p className="text-xs text-muted-foreground">SVG, PNG, JPG o PDF (MAX. 5MB)</p>
                            </div>
                            <Input id="file-upload" type="file" className="hidden" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} />
                        </label>
                    </div> 
                  </FormControl>
                  {field.value && <FormDescription>Archivo seleccionado: {(field.value as File).name}</FormDescription>}
                  <FormMessage />
                </FormItem>
              )} />
              
              <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tCheckout.fullName}</FormLabel>
                    <FormControl><Input placeholder="Tu Nombre Completo" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tCheckout.phone}</FormLabel>
                    <FormControl><Input type="tel" placeholder="Tu Número de Teléfono" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
               <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tCheckout.emailAddress}</FormLabel>
                    <FormControl><Input type="email" placeholder="Tu Correo Electrónico" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />


              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {t.getEstimate}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
