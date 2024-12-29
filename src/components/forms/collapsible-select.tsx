import React from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { FormControl } from "@/components/ui/form"

interface CollapsibleSelectProps {
  onChange: (value: string) => void;
  value: string;
  name: string;
  disabled?: boolean;
}

const CollapsibleSelect = React.forwardRef<HTMLDivElement, CollapsibleSelectProps>(
  ({ onChange, value, name, disabled }: CollapsibleSelectProps, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const options = [
      "Préstamo Bancario",
      "Tarjeta de Crédito",
      "Proveedores",
      "Préstamos de Familiares / Amistades",
      "Ninguno / Capital Propio"
    ];

    const handleSelect = (selectedOption: string) => {
      const newSelection = value ? 
        (value.includes(selectedOption) 
          ? value.split(", ").filter((item: string) => item !== selectedOption) 
          : [...value.split(", ").filter(Boolean), selectedOption]
        ) : [selectedOption];
      
      onChange(newSelection.join(", "));
    };

    const selectedOptions = value ? value.split(", ").filter(Boolean) : [];

    return (
      <FormControl>
        <div className="w-full" ref={ref}>
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="w-full space-y-2"
          >
                  <CollapsibleTrigger className="w-full rounded-md ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
            <div className="flex h-10 shadow-sm w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
              <h4 className="text-sm text-muted-foreground">
                {selectedOptions.length === 0 ? "Selecciona tus fuentes de financiamiento" : 
                  `${selectedOptions.length} fuentes seleccionadas`}
              </h4>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 opacity-50 cursor-pointer" />
                  ) : (
                    <ChevronDown className="h-4 w-4 opacity-50 cursor-pointer" />
                  )}
            </div>
              </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="rounded-md border shadow-sm bg-background px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  {options.map((option) => (
                    <Button
                      key={option}
                      variant={selectedOptions.includes(option) ? "default" : "outline"}
                      onClick={() => handleSelect(option)}
                      type="button"
                      className="text-sm"
                      disabled={disabled}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </FormControl>
    );
  }
);

CollapsibleSelect.displayName = 'CollapsibleSelect';

export { CollapsibleSelect };

const CollapsibleSelect2 = React.forwardRef<HTMLDivElement, CollapsibleSelectProps>(
  ({ onChange, value, name, disabled }: CollapsibleSelectProps, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const options = [
      "Tarjeta de Crédito",
      "Tarjeta de Débito",
      "Efectivo",
      "Transferencia Bancaria",
      "Cheque",
      "Pago a Plazos",
      "Plataformas digitales (Stripe PayPal etc.)",
      "Criptomonedas",
      "Otro"
    ];

    const handleSelect = (selectedOption: string) => {
      const newSelection = value ? 
        (value.includes(selectedOption) 
          ? value.split(", ").filter((item: string) => item !== selectedOption) 
          : [...value.split(", ").filter(Boolean), selectedOption]
        ) : [selectedOption];
      
      onChange(newSelection.join(", "));
    };

    const selectedOptions = value ? value.split(", ").filter(Boolean) : [];

    return (
      <FormControl>
        <div className="w-full" ref={ref}>
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="w-full space-y-2"
          >
                  <CollapsibleTrigger className="w-full rounded-md ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
            <div className="flex h-10 shadow-sm w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
              <h4 className="text-sm text-muted-foreground">
                {selectedOptions.length === 0 ? "Selecciona los métodos de pago que ofrecen" : 
                  `${selectedOptions.length} métodos seleccionados`}
              </h4>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 opacity-50 cursor-pointer" />
                  ) : (
                    <ChevronDown className="h-4 w-4 opacity-50 cursor-pointer" />
                  )}
            </div>
              </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="rounded-md border shadow-sm bg-background px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  {options.map((option) => (
                    <Button
                      key={option}
                      variant={selectedOptions.includes(option) ? "default" : "outline"}
                      onClick={() => handleSelect(option)}
                      type="button"
                      className="text-sm"
                      disabled={disabled}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </FormControl>
    );
  }
);

CollapsibleSelect2.displayName = 'CollapsibleSelect2';

export { CollapsibleSelect2 };