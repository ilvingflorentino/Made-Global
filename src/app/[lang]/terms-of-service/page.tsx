
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText } from 'lucide-react'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/config/i18n.config'

interface TermsOfServicePageProps {
  params: { lang: Locale }
}

export default async function TermsOfServicePage({ params: { lang } }: TermsOfServicePageProps) {
  const dictionary = await getDictionary(lang);
  const tCommon = dictionary.common;

  const isSpanish = lang === 'es';

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-3">
            <FileText className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-bold">{tCommon.termsOfService}</CardTitle>
          <CardDescription>
            {isSpanish 
              ? "Última actualización: 24 de Julio de 2024" 
              : "Last updated: July 24, 2024"}
          </CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert">
          {isSpanish ? (
            <>
              <h2>1. Términos</h2>
              <p>Al acceder al sitio web en madeespinal.com, usted acepta estar sujeto a estos términos de servicio, todas las leyes y regulaciones aplicables, y acepta que es responsable del cumplimiento de las leyes locales aplicables. Si no está de acuerdo con alguno de estos términos, tiene prohibido usar o acceder a este sitio. Los materiales contenidos en este sitio web están protegidos por las leyes de derechos de autor y marcas registradas aplicables.</p>

              <h2>2. Licencia de Uso</h2>
              <ol type="a">
                <li>Se concede permiso para descargar temporalmente una copia de los materiales (información o software) en el sitio web de {tCommon.appName} solo para visualización transitoria personal y no comercial. Esta es la concesión de una licencia, no una transferencia de título, y bajo esta licencia no puede:
                  <ol type="i">
                      <li>modificar o copiar los materiales;</li>
                      <li>usar los materiales para cualquier propósito comercial, o para cualquier exhibición pública (comercial o no comercial);</li>
                      <li>intentar descompilar o aplicar ingeniería inversa a cualquier software contenido en el sitio web de {tCommon.appName};</li>
                      <li>eliminar cualquier derecho de autor u otras anotaciones de propiedad de los materiales; o</li>
                      <li>transferir los materiales a otra persona o "reflejar" los materiales en cualquier otro servidor.</li>
                  </ol>
                </li>
                <li>Esta licencia terminará automáticamente si viola cualquiera de estas restricciones y puede ser terminada por {tCommon.appName} en cualquier momento. Al terminar su visualización de estos materiales o al terminar esta licencia, debe destruir cualquier material descargado en su posesión, ya sea en formato electrónico o impreso.</li>
              </ol>

              <h2>3. Descargo de Responsabilidad</h2>
              <p>Los materiales en el sitio web de {tCommon.appName} se proporcionan "tal cual". {tCommon.appName} no ofrece garantías, expresas o implícitas, y por la presente renuncia y niega todas las demás garantías, incluidas, entre otras, las garantías implícitas o condiciones de comerciabilidad, idoneidad para un propósito particular o no infracción de la propiedad intelectual u otra violación de derechos.</p>
              <p>Además, {tCommon.appName} no garantiza ni hace ninguna representación con respecto a la precisión, los resultados probables o la confiabilidad del uso de los materiales en su sitio web o de otro modo relacionados con dichos materiales o en cualquier sitio vinculado a este sitio.</p>
              
              {/* Add more sections as needed: Limitations, Accuracy of materials, Links, Modifications, Governing Law etc. */}

              <h2>Contáctenos</h2>
              <p>Si tiene alguna pregunta sobre estos Términos, por favor contáctenos.</p>
            </>
          ) : (
            <>
              <h2>1. Terms</h2>
              <p>By accessing the website at madeespinal.com, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.</p>

              <h2>2. Use License</h2>
              <ol type="a">
                <li>Permission is granted to temporarily download one copy of the materials (information or software) on {tCommon.appName}'s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                  <ol type="i">
                      <li>modify or copy the materials;</li>
                      <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                      <li>attempt to decompile or reverse engineer any software contained on {tCommon.appName}'s website;</li>
                      <li>remove any copyright or other proprietary notations from the materials; or</li>
                      <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
                  </ol>
                </li>
                <li>This license shall automatically terminate if you violate any of these restrictions and may be terminated by {tCommon.appName} at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.</li>
              </ol>
              
              <h2>3. Disclaimer</h2>
              <p>The materials on {tCommon.appName}'s website are provided on an 'as is' basis. {tCommon.appName} makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
              <p>Further, {tCommon.appName} does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.</p>

              {/* Add more sections as needed: Limitations, Accuracy of materials, Links, Modifications, Governing Law etc. */}
              
              <h2>Contact Us</h2>
              <p>If you have any questions about these Terms, please contact us.</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
