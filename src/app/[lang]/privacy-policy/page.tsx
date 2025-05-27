
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldCheck } from 'lucide-react'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/config/i18n.config'

interface PrivacyPolicyPageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function PrivacyPolicyPage({ params }: PrivacyPolicyPageProps) {
  const { lang } = await params;

  const dictionary = await getDictionary(lang);
  const tCommon = dictionary.common;

  const isSpanish = lang === 'es';

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-3">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-bold">{tCommon.privacyPolicy}</CardTitle>
          <CardDescription>
            {isSpanish 
              ? "Última actualización: 24 de Julio de 2024" 
              : "Last updated: July 24, 2024"}
          </CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert">
          {isSpanish ? (
            <>
              <p>En {tCommon.appName}, accesible desde madeespinal.com, una de nuestras principales prioridades es la privacidad de nuestros visitantes. Este documento de Política de Privacidad contiene tipos de información que se recopila y registra por {tCommon.appName} y cómo la usamos.</p>

              <h2>Consentimiento</h2>
              <p>Al utilizar nuestro sitio web, usted acepta nuestra Política de Privacidad y acepta sus términos.</p>

              <h2>Información que recopilamos</h2>
              <p>La información personal que se le pide que proporcione, y las razones por las que se le pide que la proporcione, se le aclararán en el momento en que le pidamos que proporcione su información personal.</p>
              <p>Si se comunica con nosotros directamente, podemos recibir información adicional sobre usted, como su nombre, dirección de correo electrónico, número de teléfono, el contenido del mensaje y/o los archivos adjuntos que pueda enviarnos, y cualquier otra información que elija proporcionar.</p>
              <p>Cuando se registra para una Cuenta, podemos pedirle su información de contacto, incluyendo elementos como nombre, nombre de la empresa, dirección, dirección de correo electrónico y número de teléfono.</p>

              <h2>Cómo usamos su información</h2>
              <p>Usamos la información que recopilamos de varias maneras, incluyendo para:</p>
              <ul>
                <li>Proveer, operar y mantener nuestro sitio web</li>
                <li>Mejorar, personalizar y expandir nuestro sitio web</li>
                <li>Entender y analizar cómo utiliza nuestro sitio web</li>
                <li>Desarrollar nuevos productos, servicios, características y funcionalidades</li>
                <li>Comunicarnos con usted, ya sea directamente o a través de uno de nuestros socios, incluido el servicio al cliente, para proporcionarle actualizaciones y otra información relacionada con el sitio web, y con fines de marketing y promoción</li>
                <li>Enviarle correos electrónicos</li>
                <li>Encontrar y prevenir el fraude</li>
              </ul>

              <h2>Archivos de Registro</h2>
              <p>{tCommon.appName} sigue un procedimiento estándar de uso de archivos de registro. Estos archivos registran a los visitantes cuando visitan sitios web. Todas las empresas de alojamiento hacen esto y forma parte de los análisis de los servicios de alojamiento. La información recopilada por los archivos de registro incluye direcciones de protocolo de Internet (IP), tipo de navegador, proveedor de servicios de Internet (ISP), marca de fecha y hora, páginas de referencia/salida y posiblemente el número de clics. Estos no están vinculados a ninguna información que sea personalmente identificable. El propósito de la información es analizar tendencias, administrar el sitio, rastrear el movimiento de los usuarios en el sitio web y recopilar información demográfica.</p>
              
              {/* Add more sections as needed: Cookies, Third-Party Policies, CCPA/GDPR rights, Children's Information etc. */}

              <h2>Contáctenos</h2>
              <p>Si tiene preguntas adicionales o requiere más información sobre nuestra Política de Privacidad, no dude en contactarnos.</p>
            </>
          ) : (
            <>
              <p>At {tCommon.appName}, accessible from madeespinal.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by {tCommon.appName} and how we use it.</p>

              <h2>Consent</h2>
              <p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>

              <h2>Information we collect</h2>
              <p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.</p>
              <p>If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.</p>
              <p>When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.</p>

              <h2>How we use your information</h2>
              <p>We use the information we collect in various ways, including to:</p>
              <ul>
                <li>Provide, operate, and maintain our website</li>
                <li>Improve, personalize, and expand our website</li>
                <li>Understand and analyze how you use our website</li>
                <li>Develop new products, services, features, and functionality</li>
                <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
                <li>Send you emails</li>
                <li>Find and prevent fraud</li>
              </ul>

              <h2>Log Files</h2>
              <p>{tCommon.appName} follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.</p>

              {/* Add more sections as needed: Cookies, Third-Party Policies, CCPA/GDPR rights, Children's Information etc. */}
              
              <h2>Contact Us</h2>
              <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
