import React, { useState } from 'react';
import { ChevronRight, Pill, Stethoscope, Truck } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

const onboardingSlides = [
  {
    icon: Pill,
    title: "Find Your Medicines",
    description: "Search and discover medicines from verified pharmacies with detailed information and reviews.",
    color: "text-blue-500"
  },
  {
    icon: Stethoscope,
    title: "Consult Pharmacists",
    description: "Get expert advice from licensed pharmacists through our secure consultation platform.",
    color: "text-green-500"
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Order medicines for home delivery or schedule pickup from nearby pharmacies at your convenience.",
    color: "text-purple-500"
  }
];

export default function OnboardingScreen({ onNext, onSkip }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onNext();
    }
  };

  const slide = onboardingSlides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Skip Button */}
      <div className="flex justify-end p-4">
        <Button variant="ghost" onClick={onSkip}>
          Skip
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <Card className="p-8 w-full max-w-sm text-center shadow-lg">
          <div className="mb-6">
            <div className={`inline-flex p-4 rounded-full bg-background ${slide.color}`}>
              <Icon size={48} />
            </div>
          </div>
          
          <h1 className="mb-4">{slide.title}</h1>
          <p className="text-muted-foreground mb-8">{slide.description}</p>

          {/* Slide Indicators */}
          <div className="flex justify-center space-x-2 mb-8">
            {onboardingSlides.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <Button onClick={nextSlide} className="w-full">
            {currentSlide === onboardingSlides.length - 1 ? 'Get Started' : 'Next'}
            <ChevronRight className="ml-2" size={16} />
          </Button>
        </Card>
      </div>

      {/* Brand */}
      <div className="p-8 text-center">
        <h2 className="text-primary">PharmaCare</h2>
        <p className="text-sm text-muted-foreground">Your trusted pharmacy companion</p>
      </div>
    </div>
  );
}