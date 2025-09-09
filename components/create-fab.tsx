"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { FloatingActionButton } from "@/components/floating-action-button";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

interface CreateFABContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CreateFABContext = React.createContext<CreateFABContextType | null>(null);

function useCreateFAB() {
  const context = React.useContext(CreateFABContext);
  if (!context) {
    throw new Error("useCreateFAB must be used within CreateFAB");
  }
  return context;
}

interface CreateFABProps {
  children: React.ReactNode;
  title?: string;
  fabVariant?: "default" | "secondary" | "destructive";
  fabSize?: "default" | "sm" | "lg";
  fabPosition?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

function CreateFAB({
  children,
  title = "Create",
  fabVariant = "default",
  fabSize = "default",
  fabPosition = "bottom-right",
}: CreateFABProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const contextValue = React.useMemo(() => ({ isOpen, setIsOpen }), [isOpen, setIsOpen]);

  return (
    <CreateFABContext.Provider value={contextValue}>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <FloatingActionButton variant={fabVariant} size={fabSize} position={fabPosition} aria-label={title}>
            <Plus className="h-6 w-6" />
          </FloatingActionButton>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6">{children}</div>
        </DrawerContent>
      </Drawer>
    </CreateFABContext.Provider>
  );
}

interface CreateOptionProps {
  icon?: React.ReactNode;
  label: string;
  description?: string;
  onClick: () => void;
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost";
}

function CreateOption({ icon, label, description, onClick, variant = "ghost" }: CreateOptionProps) {
  const { setIsOpen } = useCreateFAB();

  const handleClick = () => {
    onClick();
    setIsOpen(false);
  };

  return (
    <Button variant={variant} className="h-auto justify-start p-4 text-left" onClick={handleClick}>
      <div className="flex w-full items-start gap-3">
        {icon && <div className="text-muted-foreground mt-0.5 shrink-0">{icon}</div>}
        <div className="flex flex-col gap-1">
          <div className="font-medium">{label}</div>
          {description && <div className="text-muted-foreground text-sm">{description}</div>}
        </div>
      </div>
    </Button>
  );
}

function CreateOptions({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

export { CreateFAB, CreateOption, CreateOptions, useCreateFAB };
