
import { Button } from '@/components/ui/button';
import PropertySearch from '@/components/search/PropertySearch';

const HeroSection = () => {
  return (
    <section className="relative">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=3292&auto=format&fit=crop" 
            alt="Islamabad cityscape" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
        </div>
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 animate-fade-in">
            Find Your Dream Property in Islamabad
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Discover the perfect home, plot or commercial space with DwellDynamo.
          </p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg max-w-4xl animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <PropertySearch />
        </div>
        
        <div className="mt-12 flex flex-wrap gap-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-teal-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-3">
              <span className="text-xl font-bold">5K+</span>
            </div>
            <span className="text-white/90">Properties Listed</span>
          </div>
          
          <div className="flex items-center">
            <div className="w-12 h-12 bg-teal-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-3">
              <span className="text-xl font-bold">2K+</span>
            </div>
            <span className="text-white/90">Happy Clients</span>
          </div>
          
          <div className="flex items-center">
            <div className="w-12 h-12 bg-teal-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-3">
              <span className="text-xl font-bold">100+</span>
            </div>
            <span className="text-white/90">Top Agents</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
