import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  IndianRupee,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

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
  onNext: (data: { dayPlans: DayPlan[]; hotels: any[] }) => void;
  onBack: () => void;
  destination: string;
  departure: string;
  budget: number;
  currency: string;
  totalTravellers: number;
  startDate: Date;
  endDate: Date;
}

export const DayWiseActivityPlanner = ({
  activities,
  duration,
  onNext,
  onBack,
  destination,
  departure,
  budget,
  currency,
  totalTravellers,
  startDate,
  endDate,
}: DayWiseActivityPlannerProps) => {
  const [dayPlans, setDayPlans] = useState<DayPlan[]>(
    Array.from({ length: duration }, (_, i) => ({
      day: i + 1,
      activities: [],
      totalDuration: 0,
      totalCost: 0,
    }))
  );
  const [unassignedActivities, setUnassignedActivities] =
    useState<Activity[]>(activities);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (activities.length > 0) {
      const newDayPlans = Array.from({ length: duration }, (_, i) => ({
        day: i + 1,
        activities: [] as Activity[],
        totalDuration: 0,
        totalCost: 0,
      }));

      activities.forEach((activity, index) => {
        const dayIndex = index % duration;
        newDayPlans[dayIndex].activities.push(activity);
        newDayPlans[dayIndex].totalDuration += activity.duration;
        newDayPlans[dayIndex].totalCost += activity.cost;
      });

      setDayPlans(newDayPlans);
      setUnassignedActivities([]);

      toast({
        title: "Activities Auto-Assigned",
        description:
          "We've created a draft plan for you. Feel free to make changes.",
      });
    }
  }, [activities, duration, toast]);

  const assignActivityToDay = (activity: Activity, dayNumber: number) => {
    const newDayPlans = [...dayPlans];
    const dayIndex = dayNumber - 1;

    newDayPlans[dayIndex].activities.push(activity);
    newDayPlans[dayIndex].totalDuration += activity.duration;
    newDayPlans[dayIndex].totalCost += activity.cost;

    const newUnassigned = unassignedActivities.filter(
      (a) => a.id !== activity.id
    );

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

    newDayPlans[dayIndex].activities = newDayPlans[dayIndex].activities.filter(
      (a) => a.id !== activity.id
    );
    newDayPlans[dayIndex].totalDuration -= activity.duration;
    newDayPlans[dayIndex].totalCost -= activity.cost;

    const newUnassigned = [...unassignedActivities, activity];

    setDayPlans(newDayPlans);
    setUnassignedActivities(newUnassigned);

    toast({
      title: "Activity Removed",
      description: `${activity.name} removed from Day ${dayNumber}`,
    });
  };

  const handleNext = async () => {
    if (unassignedActivities.length > 0) {
      toast({
        title: "Unassigned Activities",
        description:
          "Please assign all activities to specific days or remove them.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const travel_params = {
      destination,
      departure,
      budget: budget.toString(),
      currency,
      totalTravellers: totalTravellers.toString(),
      durationDays: duration.toString(),
      startDate: format(startDate, "yyyy-MM-dd"),
      returnDate: format(endDate, "yyyy-MM-dd"),
      travelClass: "economy",
      accommodationType: "hotel",
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/travel-planner/chat-structured`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query_type: "hotels",
            session_id: localStorage.getItem("session_id"),
            user_id: localStorage.getItem("user_id"),
            travel_params,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch hotels");
      }

      const hotelsResponse = await response.json();
      onNext({ dayPlans, hotels: hotelsResponse.data.data });
    } catch (error) {
      console.error("Error fetching hotels:", error);
      toast({
        title: "Error",
        description: "Could not fetch hotel suggestions. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Plan Your Days</h2>
        <p className="text-muted-foreground">
          Assign your selected activities to specific days of your {duration}
          -day trip to {destination}
        </p>
      </div>

      {unassignedActivities.length > 0 && (
        <Card className="border-yellow-400/20 bg-yellow-400/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-500">
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
                        <h4 className="font-semibold text-sm">
                          {activity.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {activity.location}
                        </p>
                      </div>
                      <span className="text-lg">{activity.icon}</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {activity.duration}h
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs flex items-center"
                      >
                        <IndianRupee className="w-3 h-3 mr-1" />
                        {activity.cost}
                      </Badge>
                      <Badge
                        className={`text-xs border ${getDifficultyColor(
                          activity.difficulty
                        )}`}
                      >
                        {activity.difficulty}
                      </Badge>
                    </div>

                    <Select
                      onValueChange={(value) =>
                        assignActivityToDay(activity, parseInt(value))
                      }
                    >
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
                  <IndianRupee className="w-3 h-3" />
                  {dayPlan.totalCost.toLocaleString()}
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
                          <h4 className="font-medium text-sm truncate">
                            {activity.name}
                          </h4>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {activity.duration}h
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="text-xs flex items-center"
                          >
                            <IndianRupee className="w-3 h-3 mr-1" />
                            {activity.cost}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {activity.location}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          removeActivityFromDay(activity, dayPlan.day)
                        }
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

      <div className="flex justify-between items-center">
        <Button onClick={onBack} variant="outline">
          ← Back to Activities
        </Button>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {unassignedActivities.length === 0 ? (
              <span className="text-green-500 font-medium">
                All activities assigned!
              </span>
            ) : (
              <span className="text-yellow-500 font-medium">
                {unassignedActivities.length} activities need to be assigned
              </span>
            )}
          </p>
        </div>
        <Button
          onClick={handleNext}
          variant="travel"
          disabled={unassignedActivities.length > 0 || isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Continue to Hotels →
        </Button>
      </div>
    </div>
  );
};
