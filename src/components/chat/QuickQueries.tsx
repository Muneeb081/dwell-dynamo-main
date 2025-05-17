import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Building, DollarSign, LineChart, Key } from 'lucide-react';

interface QuickQueriesProps {
  onQuerySelect: (query: string) => void;
  isDropdown?: boolean;
}

const categories = [
  {
    icon: Building,
    label: 'Buying',
    color: 'text-blue-500',
    queries: [
      'How to buy property in Islamabad?',
      'What should I check before buying?',
      'How can I finance my property purchase?',
      'What documents are needed for property purchase?',
      'How to inspect property before buying?',
    ]
  },
  {
    icon: Key,
    label: 'Renting',
    color: 'text-green-500',
    queries: [
      'Process for renting a property?',
      'Tips for first-time renters?',
      'Documents needed for renting?',
      'What to check before renting a property?',
      'How to draft a rental agreement?',
    ]
  },
  {
    icon: DollarSign,
    label: 'Investment',
    color: 'text-purple-500',
    queries: [
      'Best areas for investment in Islamabad?',
      'ROI on property investment?',
      'Property investment risks?',
      'Commercial vs residential investment?',
    ]
  },
  {
    icon: LineChart,
    label: 'Trends',
    color: 'text-orange-500',
    queries: [
      'Current property market trends?',
      'Property price trends in Islamabad?',
      'Future development projects?',
      'Market forecast?',
    ]
  },
];

export function QuickQueries({ onQuerySelect, isDropdown = false }: QuickQueriesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // In dropdown mode (AI Chat), show all queries in a simple list
  if (isDropdown) {
    return (
      <div className="max-h-64 overflow-y-auto">
        <div className="flex flex-col gap-2 p-2">
          {categories.flatMap(category => 
            category.queries.map(query => (
              <Button
                key={query}
                variant="ghost"
                className="w-full justify-start h-auto py-2 px-3 text-sm font-normal hover:bg-accent hover:text-accent-foreground"
                onClick={() => onQuerySelect(query)}
              >
                {query}
              </Button>
            ))
          )}
        </div>
      </div>
    );
  }

  // In regular mode (Query-Based), show categories and their queries
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Button
            key={category.label}
            variant={selectedCategory === category.label ? 'default' : 'outline'}
            className="flex items-center gap-2 h-auto py-3"
            onClick={() => setSelectedCategory(
              selectedCategory === category.label ? null : category.label
            )}
          >
            <category.icon className={`h-5 w-5 ${category.color}`} />
            {category.label}
          </Button>
        ))}
      </div>
      {selectedCategory && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories
            .find(c => c.label === selectedCategory)
            ?.queries.map((query) => (
              <Button
                key={query}
                variant="ghost"
                className="w-full justify-start h-auto py-2 px-3 text-sm font-normal hover:bg-accent hover:text-accent-foreground"
                onClick={() => onQuerySelect(query)}
              >
                {query}
              </Button>
            ))}
        </div>
      )}
    </div>
  );
} 