
import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/home/HeroSection';
import PropertyTypes from '@/components/home/PropertyTypes';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import ServicesSection from '@/components/home/ServicesSection';

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <PropertyTypes />
      <FeaturedProperties />
      <ServicesSection />
    </MainLayout>
  );
};

export default Index;
