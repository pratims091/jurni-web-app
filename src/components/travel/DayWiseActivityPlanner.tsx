import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Activity {
  id: string;
  name: string;
  category: string;
  duration: number;
  cost: number;
  difficulty: string;
  groupSize: string;
  location: string;
  icon: string;
  description: string;
}

interface DayPlan {
  day: number;
  activities: Activity[];
  totalDuration: number;
  totalCost: number;
}

interface DayWiseActivityPlannerProps {
  activities: Activity[];
  duration: number;
  onNext: (dayPlans: DayPlan[]) => void;
  onBack: () => void;
  destination: string;
}

export const DayWiseActivityPlanner = ({ 
  activities, 
  duration, 
  onNext, 
  onBack, 
  destination 
}: DayWiseActivityPlannerProps) => {
  const [dayPlans, setDayPlans] = useState<DayPlan[]>(
    Array.from({ length: duration }, (_, i) => ({
      day: i + 1,
      activities: [],
      totalDuration: 0,
      totalCost: 0
    }))
  );
  const [unassignedActivities, setUnassignedActivities] = useState<Activity[]>(activities);
  const { toast } = useToast();

  const assignActivityToDay = (activity: Activity, dayNumber: number) => {
    const newDayPlans = [...dayPlans];
    const dayIndex = dayNumber - 1;
    
    // Add activity to day
    newDayPlans[dayIndex].activities.push(activity);
    newDayPlans[dayIndex].totalDuration += activity.duration;
    newDayPlans[dayIndex].totalCost += activity.cost;
    
    // Remove from unassigned
    const newUnassigned = unassignedActivities.filter(a => a.id !== activity.id);
    
    setDayPlans(newDayPlans);
    setUnassignedActivities(newUnassigned);
    
    toast({
      title: "Activity Assigned",
      description: `${activity.name} added to Day ${dayNumber}`,
    });
  };

  const removeActivityFromDay = (activity: Activity, dayNumber: number) => {
    const newDayPlans = [...dayPlans];
    const dayIndex = dayNumber - 1;
    
    // Remove activity from day
    newDayPlans[dayIndex].activities = newDayPlans[dayIndex].activities.filter(a => a.id !== activity.id);
    newDayPlans[dayIndex].totalDuration -= activity.duration;
    newDayPlans[dayIndex].totalCost -= activity.cost;
    
    // Add back to unassigned
    const newUnassigned = [...unassignedActivities, activity];
    
    setDayPlans(newDayPlans);
    setUnassignedActivities(newUnassigned);
    
    toast({
      title: "Activity Removed",
      description: `${activity.name} removed from Day ${dayNumber}`,
    });
  };

  const handleNext = () => {
    if (unassignedActivities.length > 0) {
      toast({
        title: "Unassigned Activities",
        description: "Please assign all activities to specific days or remove them.",
        variant: "destructive"
      });
      return;
    }
    
    onNext(dayPlans);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Plan Your Days</h2>
        <p className="text-muted-foreground">
          Assign your selected activities to specific days of your {duration}-day trip to {destination}
        </p>
      </div>

      {/* Unassigned Activities */}
      {unassignedActivities.length > 0 && (
        <Card className="border-warning/20 bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertCircle className="w-5 h-5" />
              Unassigned Activities ({unassignedActivities.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unassignedActivities.map((activity) => (
                <Card key={activity.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-sm">{activity.name}</h4>
                        <p className="text-xs text-muted-foreground">{activity.location}</p>
                      </div>
                      <span className="text-lg">{activity.icon}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {activity.duration}h
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        ${activity.cost}
                      </Badge>
                      <Badge className={`text-xs border ${getDifficultyColor(activity.difficulty)}`}>
                        {activity.difficulty}
                      </Badge>
                    </div>
                    
                    <Select onValueChange={(value) => assignActivityToDay(activity, parseInt(value))}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Assign to day..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: duration }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            Day {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Day Plans */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dayPlans.map((dayPlan) => (
          <Card key={dayPlan.day} className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Day {dayPlan.day}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {dayPlan.totalDuration}h
                </div>
                <div className="flex items-center gap-1">
                  <span>$</span>
                  {dayPlan.totalCost}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {dayPlan.activities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No activities planned</p>
                  <p className="text-xs">Assign activities from above</p>
                </div>
              ) : (
                dayPlan.activities.map((activity) => (
                  <Card key={activity.id} className="p-3 bg-muted/20">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm">{activity.icon}</span>
                          <h4 className="font-medium text-sm truncate">{activity.name}</h4>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {activity.duration}h
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            ${activity.cost}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{activity.location}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeActivityFromDay(activity, dayPlan.day)}
                        className="ml-2 h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        ×
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button onClick={onBack} variant="outline">
          ← Back to Activities
        </Button>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {unassignedActivities.length === 0 ? (
              <span className="text-success font-medium">All activities assigned!</span>
            ) : (
              <span className="text-warning font-medium">
                {unassignedActivities.length} activities need to be assigned
              </span>
            )}
          </p>
        </div>
        <Button 
          onClick={handleNext} 
          variant="travel"
          disabled={unassignedActivities.length > 0}
        >
          Continue to Hotels →
        </Button>
      </div>
    </div>
  );
};