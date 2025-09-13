import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, DollarSign, Trash2, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { BookingStep } from './TravelBookingFlow';

interface SavedPlan extends BookingStep {
  id: string;
  savedAt: Date;
  planName: string;
}

interface SavedPlansManagerProps {
  onLoadPlan: (plan: BookingStep) => void;
}

export const SavedPlansManager = ({ onLoadPlan }: SavedPlansManagerProps) => {
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const { toast } = useToast();

  const deletePlan = (planId: string) => {
    setSavedPlans(plans => plans.filter(p => p.id !== planId));
    toast({
      title: "Plan Deleted",
      description: "The saved plan has been removed.",
    });
  };

  const loadPlan = (plan: SavedPlan) => {
    onLoadPlan(plan);
    toast({
      title: "Plan Loaded",
      description: `Continuing with ${plan.planName}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Saved Travel Plans</h2>
        <p className="text-muted-foreground">Continue planning your saved trips</p>
      </div>

      {savedPlans.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No saved plans yet. Start planning a trip to save it!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {savedPlans.map((plan) => (
            <Card key={plan.id} className="hover:shadow-elevation transition-smooth">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {plan.planName}
                  </CardTitle>
                  <Button 
                    onClick={() => deletePlan(plan.id)}
                    variant="ghost" 
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <CardDescription>
                  Saved on {plan.savedAt.toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {(plan.selectedCity || plan.customCity) && (
                    <Badge variant="secondary">
                      {plan.selectedCity?.name || plan.customCity}
                    </Badge>
                  )}
                  {(plan.selectedDuration || plan.customDuration) && (
                    <Badge variant="secondary">
                      <Calendar className="w-3 h-3 mr-1" />
                      {plan.selectedDuration?.days || plan.customDuration} days
                    </Badge>
                  )}
                  {(plan.budget || plan.budgetFlexible) && (
                    <Badge variant="secondary">
                      <DollarSign className="w-3 h-3 mr-1" />
                      {plan.budgetFlexible ? 'Flexible' : `$${plan.budget}`}
                    </Badge>
                  )}
                </div>
                <Button onClick={() => loadPlan(plan)} variant="travel" className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Continue Planning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};