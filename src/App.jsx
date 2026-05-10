import AdminRoadmap from "./components/AdminRoadmap";
import AdvancedQuote from "./components/AdvancedQuote";
import BusinessControlCenter from "./components/BusinessControlCenter";
import Categories from "./components/Categories";
import CatalogExperience from "./components/CatalogExperience";
import CommercialImpact from "./components/CommercialImpact";
import ContactForm from "./components/ContactForm";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import GoogleReviews from "./components/GoogleReviews";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Location from "./components/Location";
import PickupAndPayments from "./components/PickupAndPayments";
import ProfessionalClients from "./components/ProfessionalClients";
import ProfessionalPortal from "./components/ProfessionalPortal";
import Promotions from "./components/Promotions";
import QuickLists from "./components/QuickLists";
import SocialLinks from "./components/SocialLinks";
import TrustBar from "./components/TrustBar";
import WhatsAppButton from "./components/WhatsAppButton";
import WhyChooseUs from "./components/WhyChooseUs";

function AdminApp() {
  return (
    <main>
      <BusinessControlCenter />
      <AdminRoadmap />
    </main>
  );
}

function PublicApp() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <Categories />
        <CatalogExperience />
        <Promotions />
        <CommercialImpact />
        <PickupAndPayments />
        <WhyChooseUs />
        <ProfessionalPortal />
        <ProfessionalClients />
        <QuickLists />
        <AdvancedQuote />
        <ContactForm />
        <FAQ />
        <GoogleReviews />
        <Location />
        <SocialLinks />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

export default function App() {
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  return isAdminRoute ? <AdminApp /> : <PublicApp />;
}
