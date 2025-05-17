
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Calculator, ArrowRight, Building, Ruler, Users, Banknote, PieChart } from 'lucide-react';
import { materialTypes, laborRates, calculateConstructionCost } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';

const ConstructionCostCalculator = () => {
  const { toast } = useToast();
  const [area, setArea] = useState<number>(1000);
  const [materialType, setMaterialType] = useState(materialTypes[1].id); // Medium quality as default
  const [laborRate, setLaborRate] = useState(laborRates[1].id); // Skilled labor as default
  const [duration, setDuration] = useState<number>(90); // 90 days as default
  const [result, setResult] = useState<{
    materialCost: number;
    laborCost: number;
    additionalCosts: number;
    totalCost: number;
  } | null>(null);

  const handleCalculate = () => {
    if (!area || area <= 0) {
      toast({
        title: "Invalid Area",
        description: "Please enter a valid area greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (!duration || duration <= 0) {
      toast({
        title: "Invalid Duration",
        description: "Please enter a valid duration in days",
        variant: "destructive",
      });
      return;
    }

    const calculation = calculateConstructionCost(area, materialType, laborRate, duration);
    
    if (calculation.success) {
      setResult(calculation.breakdown);
      toast({
        title: "Calculation Complete",
        description: "Your construction cost estimate is ready!",
      });
    } else {
      toast({
        title: "Calculation Error",
        description: calculation.error || "An error occurred while calculating costs",
        variant: "destructive",
      });
    }
  };

  const getSelectedMaterial = () => {
    return materialTypes.find(m => m.id === materialType);
  };

  const getSelectedLabor = () => {
    return laborRates.find(l => l.id === laborRate);
  };

  const getPieChartData = () => {
    if (!result) return [];
    
    return [
      { name: 'Material', value: result.materialCost, fill: '#8884d8' },
      { name: 'Labor', value: result.laborCost, fill: '#82ca9d' },
      { name: 'Additional', value: result.additionalCosts, fill: '#ffc658' }
    ];
  };

  const getBarChartData = () => {
    if (!result) return [];

    return [
      {
        name: 'Cost Breakdown',
        'Material Cost': result.materialCost,
        'Labor Cost': result.laborCost,
        'Additional Costs': result.additionalCosts,
      }
    ];
  };

  const getCostComparisonData = () => {
    if (!result) return [];

    const costPerSqFt = result.totalCost / area;
    const avgMarketRate = 12000; // Average market rate for construction in PKR
    
    return [
      {
        name: 'Your Estimate',
        value: costPerSqFt
      },
      {
        name: 'Avg. Market Rate',
        value: avgMarketRate
      }
    ];
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="mr-2 h-5 w-5" />
            Construction Cost Calculator
          </CardTitle>
          <CardDescription>
            Estimate the cost of construction based on area, material quality, and labor rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="area">Property Area (sq.ft.)</Label>
              <Input
                id="area"
                type="number"
                placeholder="Enter property area"
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
              />
              <p className="text-sm text-muted-foreground">
                Standard plot sizes in Pakistan: 5 marla = 1125 sq.ft. | 10 marla = 2250 sq.ft. | 1 kanal = 4500 sq.ft.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="material-type">Material Quality</Label>
              <Select
                value={materialType}
                onValueChange={setMaterialType}
              >
                <SelectTrigger id="material-type">
                  <SelectValue placeholder="Select material quality" />
                </SelectTrigger>
                <SelectContent>
                  {materialTypes.map((material) => (
                    <SelectItem key={material.id} value={material.id}>
                      {material.name} (PKR {material.costPerSqFt.toLocaleString()}/sq.ft.)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">{getSelectedMaterial()?.description}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="labor-rate">Labor Rate</Label>
              <Select
                value={laborRate}
                onValueChange={setLaborRate}
              >
                <SelectTrigger id="labor-rate">
                  <SelectValue placeholder="Select labor rate" />
                </SelectTrigger>
                <SelectContent>
                  {laborRates.map((labor) => (
                    <SelectItem key={labor.id} value={labor.id}>
                      {labor.name} (PKR {labor.ratePerDay.toLocaleString()}/day)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">{getSelectedLabor()?.description}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Construction Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="Enter construction duration"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
              <p className="text-sm text-muted-foreground">
                Typical durations: Small house (90-180 days) | Medium house (180-270 days) | Large house (270-360 days)
              </p>
            </div>

            <Button 
              onClick={handleCalculate} 
              className="w-full mt-4"
              size="lg"
            >
              Calculate Cost
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="mr-2 h-5 w-5" />
            Cost Breakdown
          </CardTitle>
          <CardDescription>
            Detailed breakdown of estimated construction costs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!result ? (
            <div className="text-center py-16 space-y-4">
              <Calculator className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">Complete the form and click Calculate to see your cost estimate</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <Ruler className="h-5 w-5 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Area</p>
                  <p className="text-lg font-semibold">{area.toLocaleString()} sq.ft.</p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <Users className="h-5 w-5 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Team Size</p>
                  <p className="text-lg font-semibold">{Math.ceil(area / 1000) + 2} workers</p>
                </div>
              </div>

              <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="text">Text View</TabsTrigger>
                  <TabsTrigger value="charts">Charts</TabsTrigger>
                </TabsList>
                
                <TabsContent value="text" className="space-y-4">
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-muted-foreground">Material Cost</span>
                    <span className="font-medium">{formatPrice(result.materialCost)}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-muted-foreground">Labor Cost</span>
                    <span className="font-medium">{formatPrice(result.laborCost)}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-muted-foreground">Additional Costs (18%)</span>
                    <span className="font-medium">{formatPrice(result.additionalCosts)}</span>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Cost</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-primary">{formatPrice(result.totalCost)}</span>
                      <p className="text-sm text-muted-foreground">{formatPrice(result.totalCost / area)} per sq.ft.</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="charts" className="space-y-6">
                  <div>
                    <h4 className="font-medium text-sm text-center mb-2">Cost Distribution</h4>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={getPieChartData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {getPieChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatPrice(Number(value))} />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-center mb-2">Cost Breakdown</h4>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={getBarChartData()}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                          <Tooltip formatter={(value) => formatPrice(Number(value))} />
                          <Legend />
                          <Bar dataKey="Material Cost" fill="#8884d8" />
                          <Bar dataKey="Labor Cost" fill="#82ca9d" />
                          <Bar dataKey="Additional Costs" fill="#ffc658" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="rounded-lg bg-muted/50 p-4 mt-6">
                <div className="flex items-start">
                  <Banknote className="h-5 w-5 mt-0.5 mr-2 text-orange-500" />
                  <div>
                    <h4 className="font-semibold">Cost Saving Tips</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                      <li>• Consider phased construction to manage cash flow</li>
                      <li>• Buy materials directly from manufacturers</li>
                      <li>• Optimize design to reduce material wastage</li>
                      <li>• Consider locally sourced materials where possible</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConstructionCostCalculator;
