import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilterOptions } from '@/types/crocodile';
import { X, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

interface FilterSidebarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  isOpen,
  onToggle
}) => {
  console.log('FilterSidebar rendered with filters:', filters);

  const species = [
    'Crocodylus niloticus',
    'Alligator mississippiensis',
    'Caiman crocodilus',
    'Crocodylus porosus',
    'Gavialis gangeticus',
    'Osteolaemus tetraspis'
  ];

  const careLevels = ['Beginner', 'Intermediate', 'Expert'];
  const categories = ['Baby', 'Juvenile', 'Adult', 'Breeding Pair'];

  const handleSpeciesChange = (species: string, checked: boolean) => {
    console.log('Species filter changed:', species, checked);
    const newSpecies = checked
      ? [...filters.species, species]
      : filters.species.filter(s => s !== species);
    
    onFiltersChange({
      ...filters,
      species: newSpecies
    });
  };

  const handleCareLevelChange = (level: string, checked: boolean) => {
    console.log('Care level filter changed:', level, checked);
    const newCareLevels = checked
      ? [...filters.careLevel, level]
      : filters.careLevel.filter(l => l !== level);
    
    onFiltersChange({
      ...filters,
      careLevel: newCareLevels
    });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    console.log('Category filter changed:', category, checked);
    const newCategories = checked
      ? [...filters.category, category]
      : filters.category.filter(c => c !== category);
    
    onFiltersChange({
      ...filters,
      category: newCategories
    });
  };

  const handlePriceRangeChange = (value: number[]) => {
    console.log('Price range changed:', value);
    onFiltersChange({
      ...filters,
      priceRange: [value[0], value[1]]
    });
  };

  const handleInStockChange = (checked: boolean) => {
    console.log('In stock filter changed:', checked);
    onFiltersChange({
      ...filters,
      inStock: checked
    });
  };

  const activeFiltersCount = 
    filters.species.length + 
    filters.careLevel.length + 
    filters.category.length + 
    (filters.inStock ? 1 : 0);

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={onToggle}
          className="w-full justify-start"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filter Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: isOpen ? 0 : -320,
          opacity: isOpen ? 1 : 0
        }}
        className={`
          fixed lg:relative top-0 left-0 z-40 h-full lg:h-auto
          w-80 lg:w-full bg-background lg:bg-transparent
          border-r lg:border-r-0 lg:translate-x-0 lg:opacity-100
          ${isOpen ? 'block' : 'hidden lg:block'}
        `}
      >
        <div className="p-4 lg:p-0 space-y-4 max-h-screen overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between lg:hidden">
            <h2 className="text-lg font-semibold">Filtros</h2>
            <Button variant="ghost" size="icon" onClick={onToggle}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="w-full"
              size="sm"
            >
              Limpiar Filtros ({activeFiltersCount})
            </Button>
          )}

          {/* Price Range */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Rango de Precio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Slider
                value={filters.priceRange}
                onValueChange={handlePriceRangeChange}
                max={50000}
                min={0}
                step={1000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>${filters.priceRange[0].toLocaleString()}</span>
                <span>${filters.priceRange[1].toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Species Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Especies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {species.map((s) => (
                <div key={s} className="flex items-center space-x-2">
                  <Checkbox
                    id={s}
                    checked={filters.species.includes(s)}
                    onCheckedChange={(checked) => handleSpeciesChange(s, checked as boolean)}
                  />
                  <Label htmlFor={s} className="text-xs leading-tight">
                    {s}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Care Level Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Nivel de Cuidado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {careLevels.map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox
                    id={level}
                    checked={filters.careLevel.includes(level)}
                    onCheckedChange={(checked) => handleCareLevelChange(level, checked as boolean)}
                  />
                  <Label htmlFor={level} className="text-sm">
                    {level}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Category Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Categoría</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={filters.category.includes(category)}
                    onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                  />
                  <Label htmlFor={category} className="text-sm">
                    {category}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Stock Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Disponibilidad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inStock"
                  checked={filters.inStock}
                  onCheckedChange={handleInStockChange}
                />
                <Label htmlFor="inStock" className="text-sm">
                  Solo en stock
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default FilterSidebar;