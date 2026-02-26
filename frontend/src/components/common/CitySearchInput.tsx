import { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, MapPin } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { WORLD_CITIES } from '@/data/worldCities';

interface CitySearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const MAX_RESULTS = 60;

export default function CitySearchInput({
  value,
  onChange,
  placeholder = 'Select city',
  className,
}: CitySearchInputProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredCities = useMemo(() => {
    if (!search.trim()) {
      // Show popular Indian cities first when no search
      return WORLD_CITIES.filter((c) => c.country === 'India').slice(0, MAX_RESULTS);
    }
    const q = search.toLowerCase().trim();
    return WORLD_CITIES.filter((c) => c.searchTerm.includes(q)).slice(0, MAX_RESULTS);
  }, [search]);

  // Group filtered cities by country
  const grouped = useMemo(() => {
    const map = new Map<string, typeof filteredCities>();
    for (const city of filteredCities) {
      if (!map.has(city.country)) map.set(city.country, []);
      map.get(city.country)!.push(city);
    }
    return map;
  }, [filteredCities]);

  const handleSelect = (cityName: string) => {
    onChange(cityName);
    setOpen(false);
    setSearch('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between rounded-xl font-body h-10 text-sm font-normal',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <span className="flex items-center gap-2 truncate">
            <MapPin size={14} className="text-saffron-dark flex-shrink-0" />
            <span className="truncate">{value || placeholder}</span>
          </span>
          <ChevronsUpDown size={14} className="ml-2 flex-shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 rounded-xl" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search city or country..."
            value={search}
            onValueChange={setSearch}
            className="font-body text-sm"
          />
          <CommandList className="max-h-64">
            <CommandEmpty className="py-4 text-center text-sm text-muted-foreground font-body">
              No cities found.
            </CommandEmpty>
            {Array.from(grouped.entries()).map(([country, cities]) => (
              <CommandGroup key={country} heading={country} className="font-body">
                {cities.map((city) => (
                  <CommandItem
                    key={`${city.country}-${city.name}`}
                    value={city.name}
                    onSelect={() => handleSelect(city.name)}
                    className="font-body text-sm cursor-pointer"
                  >
                    <Check
                      size={14}
                      className={cn(
                        'mr-2 flex-shrink-0',
                        value === city.name ? 'opacity-100 text-saffron-dark' : 'opacity-0'
                      )}
                    />
                    {city.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
