/**
 * Textes légaux site vitrine + application mobile (alignés sur l’app Dandela House).
 * Les flags `is_accepted_terms` / `is_accepted_privacy` de l’app renvoient à cette version.
 * Copie TypeScript alignée : `app/lib/i18n/legal-content.ts`.
 */

const sharedFr = {
  disclaimer:
    "Document commun au site dandela.house et à l’application Dandela House. Une mention de version peut être affichée lors de l’acceptation dans l’app.",
  platformNote:
    "En naviguant sur ce site ou en utilisant l’application, vous reconnaissez avoir pris connaissance des documents ci-dessous.",
  relatedTerms: "Conditions d’utilisation",
  relatedPrivacy: "Politique de confidentialité",
  backHome: "Retour à l’accueil",
};

export const LEGAL_CONTENT = {
  fr: {
    ...sharedFr,
    terms: {
      title: "Conditions d’utilisation",
      updated: "Dernière mise à jour · novembre 2026",
      intro:
        "Les présentes conditions régissent l’accès au site vitrine DANDELA House et à l’application mobile Dandela House (réservation de chambres, gestion de séjours, services numériques), pour l’ensemble des maisons du réseau.",
      sections: [
        {
          title: "1. Objet du service",
          paragraphs: [
            "Le site présente la maison, les chambres et les tarifs indicatifs, et permet de prendre contact (notamment via WhatsApp).",
            "L’application permet de consulter les disponibilités, réserver, suivre vos séjours et accéder à des services numériques (notifications, clé digitale à terme).",
            "Certaines intégrations (paiement en ligne AppyPay, synchronisation complète des comptes) peuvent être déployées progressivement.",
          ],
        },
        {
          title: "2. Compte utilisateur (application)",
          paragraphs: [
            "L’inscription dans l’app requiert un numéro de téléphone valide vérifié par SMS (Firebase). Vous êtes responsable des codes reçus et de l’activité réalisée depuis votre compte.",
            "Les informations fournies doivent être exactes. Dandela House peut suspendre un compte en cas d’usage frauduleux ou contraire au règlement de la résidence.",
            "Le site vitrine ne nécessite pas de compte pour être consulté.",
          ],
        },
        {
          title: "3. Réservations et séjours",
          paragraphs: [
            "Une réservation confirmée engage les dates, le nombre de voyageurs et le tarif convenu. Les conditions d’annulation en vigueur à la résidence s’appliquent.",
            "Les prix affichés sur le site sont indicatifs ; le prix final est confirmé à la réservation. La taxe de séjour peut s’appliquer selon la réglementation locale.",
            "Les horaires de check-in et check-out sont communiqués par la conciergerie.",
          ],
        },
        {
          title: "4. Propriété intellectuelle",
          paragraphs: [
            "La marque Dandela House, les visuels, textes, plan des chambres et interfaces (site et app) sont protégés. Toute reproduction non autorisée est interdite.",
          ],
        },
        {
          title: "5. Limitation de responsabilité",
          paragraphs: [
            "Dandela House met en œuvre des moyens raisonnables pour assurer la disponibilité du site et de l’application, sans garantir l’absence d’interruptions.",
            "Les informations du site peuvent être mises à jour ; des écarts mineurs par rapport à l’établissement physique peuvent survenir.",
          ],
        },
        {
          title: "6. Droit applicable",
          paragraphs: [
            "Les présentes conditions sont régies par le droit angolais. En cas de litige, les tribunaux compétents de Luanda seront saisis, sous réserve des dispositions impératives applicables au consommateur.",
          ],
        },
      ],
    },
    privacy: {
      title: "Politique de confidentialité",
      updated: "Dernière mise à jour · novembre 2026",
      intro:
        "Dandela House protège vos données personnelles (site et application) selon les principes de minimisation, de transparence et de sécurité. Cette politique décrit les traitements associés à votre visite du site et à l’utilisation de l’app.",
      sections: [
        {
          title: "1. Données collectées",
          paragraphs: [
            "Site : préférences de langue et de thème d’affichage uniquement si vous acceptez les cookies (bannière « Cookies ») ; pas de compte obligatoire.",
            "Contact : numéro, messages et métadonnées si vous nous écrivez via WhatsApp, e-mail ou téléphone (vous initiez l’échange).",
            "Application : identité (prénom, nom, téléphone, e-mail facultatif, photo de profil), réservations, dates, chambre, préférences de notification.",
            "Technique : journaux serveur, identifiants d’appareil, langue, prestataires d’authentification (Firebase) et de paiement (AppyPay) lorsque ces services sont actifs.",
          ],
        },
        {
          title: "2. Finalités",
          paragraphs: [
            "Présentation du réseau Dandela House et prise de contact / réservation.",
            "Gestion du compte, authentification SMS et exécution des réservations dans l’app.",
            "Envoi de notifications liées au séjour et amélioration du service (langue, accessibilité, support).",
            "Sécurisation des accès, prévention de la fraude et respect des obligations légales.",
          ],
        },
        {
          title: "3. Base légale",
          paragraphs: [
            "Exécution de mesures précontractuelles et du contrat de prestation d’hébergement pour les réservations.",
            "Intérêt légitime pour la sécurité du site, de l’app et la lutte contre la fraude.",
            "Consentement pour les cookies non essentiels, les notifications marketing le cas échéant, et l’acceptation explicite dans l’app (`is_accepted_terms`, `is_accepted_privacy`).",
          ],
        },
        {
          title: "4. Conservation",
          paragraphs: [
            "Données de séjour et facturation : durée imposée par les obligations comptables et fiscales.",
            "Cookies et préférences locales : selon votre choix (acceptation ou refus) ; révocable à tout moment en effaçant les cookies du navigateur.",
            "Compte application : tant qu’il est actif, puis archivage légal si nécessaire.",
          ],
        },
        {
          title: "5. Partage",
          paragraphs: [
            "Vos données ne sont pas vendues. Elles peuvent être communiquées aux sous-traitants strictement nécessaires (hébergement, SMS, paiement, cartographie) sous contrat de confidentialité.",
            "Les autorités compétentes peuvent recevoir des informations lorsque la loi l’exige.",
          ],
        },
        {
          title: "6. Vos droits",
          paragraphs: [
            "Vous pouvez demander l’accès, la rectification ou la suppression de vos données via house@dandela.com ou la conciergerie Dandela House.",
            "Dans l’application, les paramètres du profil et les consentements (`conditions` / `confidentialité`) pourront être mis à jour lorsque le back-end est connecté.",
            "Vous pouvez retirer votre consentement aux notifications ou aux cookies non essentiels à tout moment.",
          ],
        },
      ],
    },
  },
  en: {
    disclaimer:
      "Shared document for the dandela.house website and the Dandela House mobile app. A version notice may be shown when you accept these terms in the app.",
    platformNote:
      "By browsing this site or using the app, you acknowledge that you have read the documents below.",
    relatedTerms: "Terms of use",
    relatedPrivacy: "Privacy policy",
    backHome: "Back to home",
    terms: {
      title: "Terms of use",
      updated: "Last updated · November 2026",
      intro:
        "These terms govern access to the DANDELA House showcase website and the Dandela House mobile app (room booking, stay management, digital services) across the network’s properties.",
      sections: [
        {
          title: "1. Purpose of the service",
          paragraphs: [
            "The website presents the guest house, rooms and indicative rates, and lets you get in touch (including via WhatsApp).",
            "The app lets you check availability, book, track stays and use digital services (notifications, digital key over time).",
            "Some integrations (AppyPay online payment, full account sync) may roll out progressively.",
          ],
        },
        {
          title: "2. User account (app)",
          paragraphs: [
            "App registration requires a valid phone number verified by SMS (Firebase). You are responsible for verification codes and activity on your account.",
            "Information must be accurate. Dandela House may suspend accounts for fraud or misuse of the residence rules.",
            "No account is required to browse the website.",
          ],
        },
        {
          title: "3. Bookings and stays",
          paragraphs: [
            "A confirmed booking binds dates, guest count and agreed rate. The residence’s cancellation rules apply.",
            "Prices on the website are indicative; final price is confirmed when booking. Local taxes may apply.",
            "Check-in and check-out times are provided by the concierge.",
          ],
        },
        {
          title: "4. Intellectual property",
          paragraphs: [
            "The Dandela House brand, visuals, copy, floor plan and interfaces (site and app) are protected. Unauthorised reproduction is prohibited.",
          ],
        },
        {
          title: "5. Limitation of liability",
          paragraphs: [
            "We use reasonable efforts to keep the website and app available but do not guarantee uninterrupted service.",
            "Website content is updated regularly; minor differences from the physical property may occur.",
          ],
        },
        {
          title: "6. Governing law",
          paragraphs: [
            "These terms are governed by Angolan law. Disputes shall be submitted to the competent courts of Luanda, subject to mandatory consumer protections.",
          ],
        },
      ],
    },
    privacy: {
      title: "Privacy policy",
      updated: "Last updated · November 2026",
      intro:
        "Dandela House protects your personal data (website and app) with transparency and security. This policy describes processing linked to your visit and app use.",
      sections: [
        {
          title: "1. Data we collect",
          paragraphs: [
            "Website: language and theme preferences only if you accept cookies (“Cookies” banner); no mandatory account.",
            "Contact: phone, messages and metadata when you reach us via WhatsApp, email or phone (you initiate the exchange).",
            "App: identity (name, phone, optional email, profile photo), bookings, dates, room, notification preferences.",
            "Technical: server logs, device identifiers, language, authentication (Firebase) and payment (AppyPay) providers when active.",
          ],
        },
        {
          title: "2. Purposes",
          paragraphs: [
            "Presenting the Dandela House network and handling contact / bookings.",
            "Account management, SMS authentication and fulfilling app bookings.",
            "Stay-related notifications and improving the service (language, accessibility, support).",
            "Securing access, fraud prevention and legal compliance.",
          ],
        },
        {
          title: "3. Legal basis",
          paragraphs: [
            "Pre-contractual steps and performance of the lodging contract for bookings.",
            "Legitimate interest for site and app security and fraud prevention.",
            "Consent for non-essential cookies, marketing communications where applicable, and explicit in-app acceptance (`is_accepted_terms`, `is_accepted_privacy`).",
          ],
        },
        {
          title: "4. Retention",
          paragraphs: [
            "Stay and billing data: periods required by accounting and tax law.",
            "Cookies and local preferences: according to your choice; revoke anytime by clearing browser cookies.",
            "App account: while active, then legal archiving if required.",
          ],
        },
        {
          title: "5. Sharing",
          paragraphs: [
            "We do not sell your data. It may be shared with essential processors (hosting, SMS, payment, maps) under confidentiality agreements.",
            "Authorities when required by law.",
          ],
        },
        {
          title: "6. Your rights",
          paragraphs: [
            "You may request access, rectification or erasure via house@dandela.com or Dandela House concierge.",
            "In the app, profile settings and consents can be updated when connected to the backend.",
            "You can withdraw consent to notifications or non-essential cookies at any time.",
          ],
        },
      ],
    },
  },
  pt: {
    disclaimer:
      "Documento comum ao site dandela.house e à aplicação móvel Dandela House. Uma referência de versão pode ser mostrada ao aceitar na app.",
    platformNote:
      "Ao navegar neste site ou usar a aplicação, declara ter tomado conhecimento dos documentos abaixo.",
    relatedTerms: "Termos de utilização",
    relatedPrivacy: "Política de privacidade",
    backHome: "Voltar ao início",
    terms: {
      title: "Termos de utilização",
      updated: "Última atualização · novembro de 2026",
      intro:
        "Estes termos regulam o acesso ao site vitrine DANDELA House e à aplicação Dandela House (reserva de quartos, gestão de estadias, serviços digitais), para todas as casas da rede.",
      sections: [
        {
          title: "1. Objeto do serviço",
          paragraphs: [
            "O site apresenta a casa, os quartos e tarifas indicativas e permite contacto (nomeadamente via WhatsApp).",
            "A aplicação permite consultar disponibilidades, reservar, acompanhar estadias e aceder a serviços digitais (notificações, chave digital futura).",
            "Algumas integrações (pagamento AppyPay, sincronização completa de contas) podem ser activadas progressivamente.",
          ],
        },
        {
          title: "2. Conta de utilizador (aplicação)",
          paragraphs: [
            "O registo na app exige número de telefone válido verificado por SMS (Firebase). É responsável pelos códigos recebidos e pela actividade na conta.",
            "A informação deve ser exacta. A Dandela House pode suspender contas em caso de fraude ou uso contrário ao regulamento.",
            "O site vitrine não exige conta para consulta.",
          ],
        },
        {
          title: "3. Reservas e estadias",
          paragraphs: [
            "Uma reserva confirmada vincula datas, hóspedes e tarifa acordada. Aplicam-se as regras de cancelamento da residência.",
            "Os preços no site são indicativos; o valor final é confirmado na reserva. Taxas locais podem aplicar-se.",
            "Check-in e check-out são indicados pelo concierge.",
          ],
        },
        {
          title: "4. Propriedade intelectual",
          paragraphs: [
            "A marca Dandela House, visuais, textos, planta e interfaces (site e app) estão protegidos. É proibida a reprodução não autorizada.",
          ],
        },
        {
          title: "5. Limitação de responsabilidade",
          paragraphs: [
            "Empregamos meios razoáveis para manter o site e a app disponíveis, sem garantir ausência total de interrupções.",
            "O conteúdo do site pode ser actualizado; pequenas diferenças face ao estabelecimento físico podem ocorrer.",
          ],
        },
        {
          title: "6. Lei aplicável",
          paragraphs: [
            "Estes termos regem-se pela lei angolana. Litígios serão submetidos aos tribunais competentes de Luanda, sem prejuízo de normas imperativas de protecção do consumidor.",
          ],
        },
      ],
    },
    privacy: {
      title: "Política de privacidade",
      updated: "Última actualização · novembro de 2026",
      intro:
        "A Dandela House protege os dados pessoais (site e aplicação) com transparência e segurança. Esta política descreve os tratamentos ligados à sua visita e uso da app.",
      sections: [
        {
          title: "1. Dados recolhidos",
          paragraphs: [
            "Site: preferências de idioma e tema apenas se aceitar cookies (banner « Cookies »); sem conta obrigatória.",
            "Contacto: número, mensagens e metadados se nos contactar via WhatsApp, e-mail ou telefone (inicia o contacto).",
            "Aplicação: identidade (nome, telefone, e-mail opcional, foto), reservas, datas, quarto, preferências de notificação.",
            "Técnicos: registos de servidor, identificadores de dispositivo, idioma, Firebase e AppyPay quando activos.",
          ],
        },
        {
          title: "2. Finalidades",
          paragraphs: [
            "Apresentar a rede Dandela House e gerir contacto / reservas.",
            "Gestão de conta, autenticação SMS e execução de reservas na app.",
            "Notificações de estadia e melhoria do serviço (idioma, acessibilidade, apoio).",
            "Segurança, prevenção de fraude e cumprimento legal.",
          ],
        },
        {
          title: "3. Base legal",
          paragraphs: [
            "Medidas pré-contratuais e execução do contrato de alojamento.",
            "Interesse legítimo para segurança do site e da app e prevenção de fraude.",
            "Consentimento para cookies não essenciais, marketing quando aplicável e aceitação explícita na app (`is_accepted_terms`, `is_accepted_privacy`).",
          ],
        },
        {
          title: "4. Conservação",
          paragraphs: [
            "Dados de estadia e facturação: prazos legais contabilísticos e fiscais.",
            "Cookies e preferências locais: conforme a sua escolha; revogável apagando cookies do navegador.",
            "Conta na app: enquanto activa, depois arquivo legal se necessário.",
          ],
        },
        {
          title: "5. Partilha",
          paragraphs: [
            "Os dados não são vendidos. Podem ser partilhados com subcontratantes essenciais (alojamento, SMS, pagamento, mapas) com contrato de confidencialidade.",
            "Autoridades quando a lei o exigir.",
          ],
        },
        {
          title: "6. Os seus direitos",
          paragraphs: [
            "Pode solicitar acesso, rectificação ou eliminação via house@dandela.com ou concierge Dandela House.",
            "Na app, definições de perfil e consentimentos podem ser actualizados com ligação ao back-end.",
            "Pode retirar consentimento a notificações ou cookies não essenciais a qualquer momento.",
          ],
        },
      ],
    },
  },
};

export function getLegalContent(locale, kind) {
  const lang = LEGAL_CONTENT[locale] ? locale : "pt";
  const bundle = LEGAL_CONTENT[lang];
  const doc = bundle[kind];
  if (!doc) return null;
  return {
    disclaimer: bundle.disclaimer,
    platformNote: bundle.platformNote,
    relatedTerms: bundle.relatedTerms,
    relatedPrivacy: bundle.relatedPrivacy,
    backHome: bundle.backHome,
    ...doc,
  };
}

export function getLegalMeta(locale, kind) {
  const doc = getLegalContent(locale, kind);
  if (!doc) return { title: "DANDELA House", description: "" };
  return {
    title: `${doc.title} — DANDELA House`,
    description: doc.intro,
  };
}