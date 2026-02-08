import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container-app max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">Termos de Uso</h1>
          
          <div className="prose prose-gray max-w-none space-y-6">
            <p className="text-muted-foreground">
              Última atualização: Janeiro 2024
            </p>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">1. Sobre o ServiçoJá</h2>
              <p className="text-muted-foreground">
                O ServiçoJá é uma plataforma online que conecta clientes a profissionais 
                prestadores de serviços em Moçambique. A plataforma funciona como um 
                marketplace, facilitando o encontro entre quem precisa de serviços e 
                quem os oferece.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">2. Papel da Plataforma</h2>
              <p className="text-muted-foreground">
                O ServiçoJá atua exclusivamente como intermediário, conectando clientes 
                e profissionais. A plataforma NÃO:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
                <li>Presta serviços diretamente</li>
                <li>Emprega os profissionais cadastrados</li>
                <li>Garante a qualidade dos serviços prestados</li>
                <li>Intermedia pagamentos entre as partes</li>
                <li>É responsável por acordos feitos entre clientes e profissionais</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">3. Cadastro e Conta</h2>
              <p className="text-muted-foreground">
                Para usar certas funcionalidades da plataforma, é necessário criar uma conta.
                Ao se cadastrar, você concorda em:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
                <li>Fornecer informações verdadeiras e actualizadas</li>
                <li>Manter a segurança da sua conta e senha</li>
                <li>Notificar-nos imediatamente sobre uso não autorizado</li>
                <li>Ser responsável por todas as actividades na sua conta</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">4. Para Profissionais</h2>
              <p className="text-muted-foreground">
                Profissionais que se cadastram na plataforma concordam em:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
                <li>Fornecer informações precisas sobre seus serviços</li>
                <li>Manter seus dados de contacto actualizados</li>
                <li>Responder aos pedidos de forma profissional</li>
                <li>Cumprir os acordos feitos com clientes</li>
                <li>Não utilizar a plataforma para actividades ilegais</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">5. Pagamentos</h2>
              <p className="text-muted-foreground">
                Todos os pagamentos por serviços são acordados e realizados diretamente 
                entre o cliente e o profissional. O ServiçoJá não processa, intermedia 
                ou é responsável por qualquer transação financeira entre as partes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">6. Avaliações</h2>
              <p className="text-muted-foreground">
                O sistema de avaliações permite que clientes compartilhem suas experiências.
                Avaliações devem ser honestas, baseadas em experiências reais e respeitar
                as regras da comunidade. Avaliações falsas ou maliciosas podem resultar 
                em suspensão da conta.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">7. Limitação de Responsabilidade</h2>
              <p className="text-muted-foreground">
                O ServiçoJá não se responsabiliza por:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
                <li>Qualidade dos serviços prestados pelos profissionais</li>
                <li>Disputas entre clientes e profissionais</li>
                <li>Danos resultantes do uso da plataforma</li>
                <li>Informações incorretas fornecidas por usuários</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">8. Contacto</h2>
              <p className="text-muted-foreground">
                Para questões sobre estes termos, entre em contacto:
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