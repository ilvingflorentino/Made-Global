
"use client" 

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/config/i18n.config'
import { use, useEffect, useState } from 'react'
import type { Dictionary } from '@/lib/dictionaries'
import { useQuote } from '@/context/QuoteContext' // Added import
import Link from 'next/link' // Added import
import { ShoppingBag } from 'lucide-react' // Added import

// Define Zod schema for form validation
const checkoutSchema = z.object({
  fullName: z.string().min(3, "Nombre completo es requerido"),
  phone: z.string().min(10, "Número de teléfono inválido"),
  email: z.string().email("Correo electrónico inválido"),
  address: z.string().min(5, "Dirección es requerida"),
  province: z.string().min(1, "Provincia es requerida"),
  paymentMethod: z.enum(['azul', 'cardnet', 'qr', 'cash']),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

interface CheckoutPageProps {
  params: Promise<{ lang: Locale }> 
}

export default function CheckoutPage(props: CheckoutPageProps) {
  const resolvedParams = use(props.params); 
  const { lang } = resolvedParams; 

  const [dictionary, setDictionary] = useState<Dictionary | null>(null)
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  
  const { quoteItems, totalPrice: quoteTotalPrice, clearQuote } = useQuote(); // Use quote context

  useEffect(() => {
    const fetchDictionary = async () => {
      const dict = await getDictionary(lang)
      setDictionary(dict)
    }
    fetchDictionary()
  }, [lang])

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      address: '',
      province: '',
      paymentMethod: 'azul',
    },
  })

  const onSubmit = (data: CheckoutFormData) => {
    console.log("Checkout Data:", data)
    console.log("Order Items:", quoteItems)
    setOrderNumber(`MADE-${Math.floor(Math.random() * 90000) + 10000}`)
    setOrderConfirmed(true)
    clearQuote(); // Clear quote after order confirmed
  }

  if (!dictionary) {
    return <div className="container mx-auto px-4 py-8 text-center">Cargando...</div>;
  }
  const t = dictionary.checkoutPage;
  const tCommon = dictionary.common;

  const taxRate = 0.18; // Assuming 18% ITBIS
  const subtotal = quoteTotalPrice;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  if (orderConfirmed) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl text-primary">{t.orderConfirmation}</CardTitle>
            <CardDescription>{t.orderSuccess}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">{t.orderNumber} <span className="font-semibold">{orderNumber}</span></p>
            <p className="text-muted-foreground">Recibirás un correo electrónico de confirmación en breve.</p>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button size="lg" asChild className="w-full">
              <Link href={`/${lang}/history`}>{t.viewMyOrder}</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href={`/${lang}/catalog`}>Seguir Comprando</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (quoteItems.length === 0 && !orderConfirmed) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
        <ShoppingBag className="h-24 w-24 text-muted-foreground mb-6" />
        <h2 className="text-2xl font-semibold mb-2">{t.emptyQuoteTitle || "Tu cotización está vacía"}</h2>
        <p className="text-muted-foreground mb-6">{t.emptyQuoteMessage || "Añade productos a tu cotización para continuar."}</p>
        <Button asChild size="lg">
          <Link href={`/${lang}/catalog`}>{tCommon.exploreCatalog}</Link>
        </Button>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">{tCommon.checkout}</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>{t.customerDetails}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="fullName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.fullName}</FormLabel>
                    <FormControl><Input placeholder="Juan Pérez" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.phone}</FormLabel>
                      <FormControl><Input type="tel" placeholder="809-123-4567" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.emailAddress}</FormLabel>
                      <FormControl><Input type="email" placeholder="juan.perez@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.deliveryAddress}</FormLabel>
                    <FormControl><Input placeholder="Calle Falsa 123, Ensanche Ozama" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="province" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.province}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Selecciona una provincia" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="santo-domingo">Santo Domingo</SelectItem>
                        <SelectItem value="santiago">Santiago</SelectItem>
                        <SelectItem value="la-altagracia">La Altagracia</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>{t.paymentMethod}</CardTitle></CardHeader>
              <CardContent>
                <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2">
                        <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md hover:border-primary transition-colors">
                          <FormControl><RadioGroupItem value="azul" /></FormControl>
                          <Label className="font-normal flex-grow">{t.creditCardAzul}</Label>
                          <Image src="https://placehold.co/40x25/0078C1/FFFFFF?text=AZUL" alt="AZUL" width={40} height={25} data-ai-hint="payment logo"/>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md hover:border-primary transition-colors">
                          <FormControl><RadioGroupItem value="cardnet" /></FormControl>
                          <Label className="font-normal flex-grow">{t.creditCardCardNet}</Label>
                           <Image src="https://placehold.co/40x25/D9232D/FFFFFF?text=CardNet" alt="CardNet" width={40} height={25} data-ai-hint="payment logo"/>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md hover:border-primary transition-colors">
                          <FormControl><RadioGroupItem value="qr" /></FormControl>
                          <Label className="font-normal flex-grow">{t.qrBanreservas}</Label>
                           <Image src="https://placehold.co/40x25/00AEEF/FFFFFF?text=QR" alt="QR Banreservas" width={40} height={25} data-ai-hint="payment logo"/>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md hover:border-primary transition-colors">
                          <FormControl><RadioGroupItem value="cash" /></FormControl>
                          <Label className="font-normal flex-grow">{t.cashOnDelivery}</Label>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>
            
            <Button type="submit" size="lg" className="w-full">{t.placeOrder}</Button>
          </form>
        </Form>

        <aside className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader><CardTitle>{t.orderSummary}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {quoteItems.map(item => (
                <div key={item.id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Image 
                      src={item.imageUrl || 'https://placehold.co/64x64.png'} 
                      alt={item.name} 
                      width={64} 
                      height={64} 
                      className="rounded-md border shadow-md" 
                      data-ai-hint={item.dataAiHint || 'product image'}
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {t.quantity || 'Cantidad'}: {item.quantity}
                        {item.selectedMedidaLabel && ( <span className="block text-xs">Medida: {item.selectedMedidaLabel}</span> )}
                        {item.selectedAcabadoLabel && ( <span className="block text-xs">Acabado: {item.selectedAcabadoLabel}</span> )}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">RD${(item.pricePerUnit * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              {quoteItems.length > 0 && <Separator />}
              <div className="space-y-1">
                <div className="flex justify-between text-sm"><p>{t.subtotal}:</p><p>RD${subtotal.toFixed(2)}</p></div>
                <div className="flex justify-between text-sm"><p>{t.tax}:</p><p>RD${tax.toFixed(2)}</p></div>
                <Separator />
                <div className="flex justify-between text-lg font-bold"><p>{t.total}:</p><p>RD${total.toFixed(2)}</p></div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
