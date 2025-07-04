import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onClick: () => void;
};

export function FloatingAddButton({ onClick }: Props) {
  return (
    <div className="fixed bottom-5 right-16">
      <Button onClick={onClick}>
        <Plus />
      </Button>
    </div>
  );
}
