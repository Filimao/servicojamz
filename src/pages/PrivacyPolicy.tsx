import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container-app max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">Política de Privacidade</h1>
          
          <div className="prose prose-gray max-w-none space-y-6">
            <p className="text-muted-foreground">
              Última atualização: Janeiro 2024
            </p>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">1. Introdução</h2>
              <p className="text-muted-foreground">
                O ServiçoJá está comprometido em proteger a privacidade dos seus usuários.
                Esta política descreve como coletamos, usamos e protegemos suas informações
                pessoais.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">2. Informações que Coletamos</h2>
              <p className="text-muted-foreground">
                Coletamos as seguintes informações quando você usa nossa plataforma:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
                <li><strong>Dados de cadastro:</strong> nome, email, telefone, cidade</li>
                <li><strong>Dados de perfil profissional:</strong> categoria de serviço, descrição, experiência</li>
                <li><strong>Dados de uso:</strong> páginas visitadas, buscas realizadas</li>
                <li><strong>Avaliações:</strong> comentários e notas deixados por usuários</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">3. Como Usamos suas Informações</h2>
              <p className="text-muted-foreground">
                Usamos suas informações para:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
                <li>Permitir o funcionamento da plataforma</li>
                <li>Conectar clientes a profissionais</li>
                <li>Exibir perfis públicos de profissionais</li>
                <li>Enviar notificações sobre pedidos e novidades</li>
                <li>Melhorar nossos serviços</li>
                <li>Prevenir fraudes e abusos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">4. Compartilhamento de Dados</h2>
              <p className="text-muted-foreground">
                Não vendemos suas informações pessoais. Compartilhamos dados apenas:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
                <li>Com outros usuários da plataforma (perfis públicos de profissionais)</li>
                <li>Com prestadores de serviços que nos ajudam a operar a plataforma</li>
                <li>Quando exigido por lei ou autoridades competentes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">5. Segurança</h2>
              <p className="text-muted-foreground">
                Implementamos medidas de segurança para proteger suas informações,
                incluindo criptografia de dados sensíveis e controles de acesso.
                No entanto, nenhum sistema é 100% seguro, e não podemos garantir
                segurança absoluta.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">6. Seus Direitos</h2>
              <p className="text-muted-foreground">
                Você tem direito a:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir informações incorretas</li>
                <li>Solicitar exclusão da sua conta</li>
                <li>Retirar consentimento para comunicações</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">7. Cookies</h2>
              <p className="text-muted-foreground">
                Usamos cookies para melhorar sua experiência na plataforma,
                manter você conectado e analisar como o site é usado.
                Você pode configurar seu navegador para recusar cookies,
                mas isso pode afetar algumas funcionalidades.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">8. Alterações nesta Política</h2>
              <p className="text-muted-foreground">
                Podemos atualizar esta política periodicamente. Notificaremos sobre
                mudanças significativas por email ou através da plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">9. Contacto</h2>
              <p className="text-muted-foreground">
                Para questões sobre privacidade, entre em contacto:
              </p>
              <ul className="list-none mt-2 text-muted-foreground space-y-1">
                <li>📧 Email: filimaofelix10@gmail.com</li>
                <li>📱 WhatsApp: +258 879 132 543</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}