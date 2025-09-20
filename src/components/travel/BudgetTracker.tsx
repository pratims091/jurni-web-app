import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, IndianRupee } from 'lucide-react';

interface BudgetTrackerProps {
  totalBudget: number;
  spent: number;
  isFlexible: boolean;
}

export const BudgetTracker = ({ totalBudget, spent, isFlexible }: BudgetTrackerProps) => {
  if (isFlexible) {
    return (
      <Card className="mb-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <IndianRupee className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-semibold text-primary">Flexible Budget</h3>
              <p className="text-sm text-muted-foreground">We'll suggest the best options for you</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const remaining = totalBudget - spent;
  const spentPercentage = totalBudget > 0 ? Math.min((spent / totalBudget) * 100, 100) : 0;
  const isOverBudget = spent > totalBudget;
  const isNearLimit = spentPercentage > 80 && !isOverBudget;

  return (
    <Card className={`mb-6 ${isOverBudget ? 'bg-destructive/5 border-destructive/20' : isNearLimit ? 'bg-warning/5 border-warning/20' : 'bg-success/5 border-success/20'}`}>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IndianRupee className={`w-5 h-5 ${isOverBudget ? 'text-destructive' : isNearLimit ? 'text-warning' : 'text-success'}`} />
              <h3 className="font-semibold">Budget Tracker</h3>
              {isOverBudget && <AlertTriangle className="w-4 h-4 text-destructive" />}
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">
                ₹{spent.toLocaleString()} / ₹{totalBudget.toLocaleString()}
              </div>
              <div className={`text-sm ${isOverBudget ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                {isOverBudget 
                  ? `Over budget by ₹${Math.abs(remaining).toLocaleString()}` 
                  : `₹${remaining.toLocaleString()} remaining`
                }
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Progress 
              value={spentPercentage} 
              className={`h-3 ${isOverBudget ? '[&>div]:bg-destructive' : isNearLimit ? '[&>div]:bg-warning' : '[&>div]:bg-success'}`}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₹0</span>
              <span>{spentPercentage.toFixed(0)}% used</span>
              <span>₹{totalBudget.toLocaleString()}</span>
            </div>
          </div>

          {isOverBudget && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-destructive">Budget Exceeded</p>
                  <p className="text-xs text-muted-foreground">Consider removing some activities or increasing your budget</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};