"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/config/i18n.config';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactFormClient({
  lang,
  dictionary,
}: {
  lang: Locale;
  dictionary: Dictionary;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    console.log("Contact Form Data:", data);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    toast({
      title: dictionary?.common.appName === "MADE Global Timber" ? "Message Sent" : "Mensaje Enviado",
      description: dictionary?.common.appName === "MADE Global Timber" ? "We'll get back to you soon." : "Nos pondremos en contacto contigo pronto.",
    });
    form.reset();
  };

  const tCommon = dictionary.common;
  const tCheckout = dictionary.checkoutPage;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">{tCommon.contact}</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          {lang === 'es' ? '¿Tienes preguntas o necesitas ayuda? Contáctanos.' : 'Have questions or need assistance? Get in touch with us.'}
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>{lang === 'es' ? 'Nuestra Información' : 'Our Information'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-md">
              <div className="flex items-start">
                <MapPin className="h-6 w-6 mr-3 mt-1 text-primary shrink-0" />
                <div>
                  <h3 className="font-semibold">{tCommon.address}</h3>
                  <p>Km. 13 1/2 de la Autopista Duarte, Santo Domingo Oeste</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-6 w-6 mr-3 mt-1 text-primary shrink-0" />
                <div>
                  <h3 className="font-semibold">{tCommon.phone}</h3>
                  <p>809-683-5778</p>
                  <p>WhatsApp: 1-829-603-3058</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-6 w-6 mr-3 mt-1 text-primary shrink-0" />
                <div>
                  <h3 className="font-semibold">{tCommon.email}</h3>
                  <p>maderies@gmail.com</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>{tCommon.hours}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-md">
              <p><span className="font-semibold">{tCommon.monFri}:</span> 8:00 AM - 5:00 PM</p>
              <p><span className="font-semibold">{tCommon.saturday}:</span> 8:00 AM - 12:00 PM</p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div>
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>{lang === 'es' ? 'Envíanos un Mensaje' : 'Send Us a Message'}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tCheckout.fullName}</FormLabel>
                      <FormControl><Input placeholder={lang === 'es' ? "Tu Nombre" : "Your Name"} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tCheckout.emailAddress}</FormLabel>
                      <FormControl><Input type="email" placeholder={lang === 'es' ? "Tu Correo Electrónico" : "Your Email"} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="subject" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{lang === 'es' ? 'Asunto' : 'Subject'}</FormLabel>
                      <FormControl><Input placeholder={lang === 'es' ? "Asunto de tu mensaje" : "Subject of your message"} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{lang === 'es' ? 'Mensaje' : 'Message'}</FormLabel>
                      <FormControl><Textarea placeholder={lang === 'es' ? "Escribe tu mensaje aquí..." : "Type your message here..."} {...field} rows={5} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    {lang === 'es' ? 'Enviar Mensaje' : 'Send Message'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
