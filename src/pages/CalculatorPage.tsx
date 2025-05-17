
import MainLayout from '@/components/layout/MainLayout';
import ConstructionCostCalculator from '@/components/calculator/ConstructionCostCalculator';
import { Calculator, TrendingUp, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CalculatorPage = () => {
  return (
    <MainLayout>
      <div className="bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold">Construction Cost Calculator</h1>
            <p className="text-muted-foreground mt-2">
              Estimate the cost of building your dream property with our detailed construction calculator
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Calculator className="h-5 w-5 mr-2 text-primary" />
                  Accurate Estimates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get reliable cost estimates based on current market rates for materials and labor in Pakistan
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                  Budget Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Plan your construction budget effectively with detailed breakdowns of all major cost components
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                  Compare Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Compare different material qualities and labor rates to find the best option for your needs
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <ConstructionCostCalculator />

          <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-heading font-semibold mb-4">Important Notes</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>
                These calculations provide an estimate only. Actual costs may vary based on market conditions, 
                specific material choices, and other factors.
              </li>
              <li>
                Additional costs like permits, design fees, landscaping, and furnishing are not included in this calculation.
              </li>
              <li>
                For a more detailed and personalized estimate, we recommend consulting with a professional contractor 
                or architect.
              </li>
              <li>
                The calculator uses average costs for Islamabad and surrounding areas. Costs may differ in other regions.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CalculatorPage;
