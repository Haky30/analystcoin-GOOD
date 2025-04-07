import React from 'react';
import { 
  ArrowRight, 
  TrendingUp, 
  Shield, 
  Zap, 
  Bell, 
  DollarSign, 
  BarChart3,
  Users, 
  Clock,
  CheckCircle,
  MessageCircle,
  Award
} from 'lucide-react';

export function Home() {
  const features = [
    { icon: Clock, title: "Analyse 24/7", description: "Surveillance continue du marché des cryptomonnaies" },
    { icon: Bell, title: "Alertes Personnalisées", description: "Notifications en temps réel sur vos cryptos préférées" },
    { icon: BarChart3, title: "Graphiques Avancés", description: "Outils techniques professionnels et indicateurs avancés" },
    { icon: Users, title: "Communauté Active", description: "Échangez avec des milliers d'investisseurs passionnés" }
  ];

  const pricingFeatures = [
    "Analyses en temps réel",
    "Recommandations IA personnalisées",
    "Alertes prix configurables",
    "Rapports hebdomadaires détaillés",
    "Support prioritaire 24/7",
    "Accès aux webinaires exclusifs"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            AnalystCoin
          </h1>
          <p className="text-2xl text-gray-300 mb-4">
            Transformez votre expérience d'investissement en cryptomonnaies
          </p>
          <p className="text-xl text-gray-400 mb-8">
            Votre partenaire idéal pour naviguer dans le monde complexe des monnaies virtuelles, 
            propulsé par l'intelligence artificielle de pointe.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg flex items-center gap-2 text-lg font-semibold transition-all transform hover:scale-105"
            >
              Commencer maintenant <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="/demo"
              className="border border-blue-600 px-8 py-4 rounded-lg flex items-center gap-2 text-lg font-semibold hover:bg-blue-600/10 transition-all"
            >
              Voir la démo
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="bg-gray-800/50 p-8 rounded-lg hover:bg-gray-800/70 transition-all transform hover:-translate-y-1">
            <TrendingUp className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Analyse en Temps Réel</h3>
            <p className="text-gray-400">
              Visualisez les tendances du marché avec nos graphiques interactifs. 
              Accédez aux indicateurs RSI, MACD et bien plus encore.
            </p>
          </div>
          <div className="bg-gray-800/50 p-8 rounded-lg hover:bg-gray-800/70 transition-all transform hover:-translate-y-1">
            <Zap className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-3">IA Prédictive</h3>
            <p className="text-gray-400">
              Notre IA analyse des millions de données pour vous fournir des 
              prédictions précises et des recommandations personnalisées.
            </p>
          </div>
          <div className="bg-gray-800/50 p-8 rounded-lg hover:bg-gray-800/70 transition-all transform hover:-translate-y-1">
            <Shield className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Gestion des Risques</h3>
            <p className="text-gray-400">
              Protégez votre portefeuille avec nos outils de gestion des risques 
              et nos systèmes d'alerte intelligents.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mt-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-800/30 p-6 rounded-lg hover:bg-gray-800/50 transition-all">
              <feature.icon className="w-8 h-8 text-blue-400 mb-3" />
              <h4 className="font-semibold mb-2">{feature.title}</h4>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-24 text-center">
          <div className="p-6">
            <div className="text-4xl font-bold text-blue-500 mb-2">+10k</div>
            <div className="text-gray-400">Utilisateurs actifs</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-blue-500 mb-2">95%</div>
            <div className="text-gray-400">Taux de satisfaction</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-blue-500 mb-2">24/7</div>
            <div className="text-gray-400">Support client</div>
          </div>
        </div>

        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-2">Commencez dès aujourd'hui</h2>
          <p className="text-gray-400 mb-12">Investissez dans votre succès avec notre offre premium</p>
          
          <div className="bg-gray-800/50 p-8 rounded-lg max-w-md mx-auto transform hover:scale-105 transition-all">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-600 text-sm font-medium px-3 py-1 rounded-full">
                Offre populaire
              </span>
            </div>
            <DollarSign className="w-12 h-12 text-blue-500 mb-4 mx-auto" />
            <h3 className="text-2xl font-bold mb-2">15€/mois</h3>
            <p className="text-gray-400 mb-6">Accès complet à toutes les fonctionnalités premium</p>
            
            <div className="space-y-3 mb-8">
              {pricingFeatures.map((feature, index) => (
                <div key={index} className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            <a
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg inline-flex items-center gap-2 text-lg font-semibold transition-all"
            >
              S'abonner maintenant <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">Ils nous font confiance</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800/30 p-6 rounded-lg">
              <p className="text-gray-300 italic mb-4">
                "AnalystCoin a complètement transformé ma façon d'investir. Les analyses sont précises et faciles à comprendre."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="font-bold">JM</span>
                </div>
                <div>
                  <div className="font-semibold">Jean Martin</div>
                  <div className="text-gray-400 text-sm">Investisseur depuis 2022</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/30 p-6 rounded-lg">
              <p className="text-gray-300 italic mb-4">
                "Le système d'alertes est incroyable. Je ne rate plus aucune opportunité d'investissement."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="font-bold">SL</span>
                </div>
                <div>
                  <div className="font-semibold">Sophie Laurent</div>
                  <div className="text-gray-400 text-sm">Trader professionnelle</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}