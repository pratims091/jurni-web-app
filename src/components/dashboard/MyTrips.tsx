import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FinalItinerary } from "../travel/FinalItinerary";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

export const MyTrips = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  const authToken = localStorage.getItem("auth_token") || null;

  // Fetch trips from API
  useEffect(() => {
    const fetchTrips = async () => {
      if (!authToken) {
        toast({
          title: t("unauthorized"),
          description: t("please_login_to_view_trips"),
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/trips`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || t("failed_to_fetch_trips"));
        }

        const data = await res.json();
        setTrips(data.trips || []); // adjust depending on API response
      } catch (err: any) {
        console.error("Error fetching trips:", err);
        toast({
          title: t("error"),
          description: err.message || t("could_not_load_trips"),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [authToken, t]);

  // Fetch user profile to get email
  useEffect(() => {
    const fetchProfile = async () => {
      if (!authToken) return;

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/auth/me`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (!res.ok) return;

        const data = await res.json();
        setUserEmail(data.email || "");
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [authToken]);

  const handleCreateNewTrip = () => {
    navigate("/");
  };

  const handleViewDetails = (trip: any) => {
    setSelectedTrip(trip);
  };

  const handleCloseDialog = () => {
    setSelectedTrip(null);
  };

  const safeCreateDate = (dateString: string | undefined): Date | undefined => {
    if (!dateString) return undefined;
    const date = new Date(dateString); // API should already return ISO date
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateString);
      return undefined;
    }
    return date;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t("my_trips")}</h2>
        <Button onClick={handleCreateNewTrip}>{t("create_new_trip")}</Button>
      </div>

      {loading ? (
        <p>{t("loading_trips")}</p>
      ) : trips.length === 0 ? (
        <p>{t("no_trips_found")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip: any) => (
            <Card key={trip.id}>
              <CardHeader>
                <CardTitle>{trip.destination}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("duration_days", { duration: trip.duration })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("budget", { budget: trip.totalBudget })}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleViewDetails(trip)}
                >
                  {t("view_details")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={!!selectedTrip}
        onOpenChange={(isOpen) => !isOpen && handleCloseDialog()}
      >
        <DialogContent className="max-w-4xl">
          {selectedTrip && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTrip.destination}</DialogTitle>
              </DialogHeader>
              <FinalItinerary
                locationInfo={{
                  destination: selectedTrip.destination,
                  travelers: Array.isArray(selectedTrip.travelers)
                    ? selectedTrip.travelers
                    : Array.from({ length: selectedTrip.travelers || 0 }).map(
                        (_, i) => ({
                          name: `Traveler ${i + 1}`,
                          email: "",
                          role: "Traveler",
                        })
                      ),
                }}
                budgetDurationData={{
                  budget: Number(selectedTrip.total_budget) || 0,
                  startDate: safeCreateDate(selectedTrip.start_date),
                  endDate: safeCreateDate(selectedTrip.end_date),
                }}
                activitiesData={{
                  dayPlans: [], // ignoring activities for now
                  totalCost: 0,
                }}
                selectedHotel={
                  selectedTrip.accommodation?.[0]
                    ? {
                        id: selectedTrip.accommodation[0].id,
                        name: selectedTrip.accommodation[0].name,
                        price: selectedTrip.accommodation[0].totalPrice,
                        rating: Math.round(
                          selectedTrip.accommodation[0].rating
                        ),
                        location: selectedTrip.accommodation[0].location,
                      }
                    : undefined
                }
                selectedFlight={
                  selectedTrip.flight?.[0]
                    ? {
                        ...selectedTrip.flight[0],
                        id: selectedTrip.flight[0].id,
                        airline: selectedTrip.flight[0].airline || "",
                        flightNumber: selectedTrip.flight[0].flightNumber || "",
                        price: selectedTrip.flight[0].price || 0,
                        duration: selectedTrip.flight[0].duration || "",
                        departure: selectedTrip.flight[0].departure || "",
                        arrival: selectedTrip.flight[0].arrival || "",
                        departureDate:
                          selectedTrip.flight[0].departureDate || "",
                        arrivalDate: selectedTrip.flight[0].arrivalDate || "",
                        stops: selectedTrip.flight[0].stops || 0,
                        aircraft: selectedTrip.flight[0].aircraft || "",
                        class_: selectedTrip.flight[0].class_ || "",
                        amenities: selectedTrip.flight[0].amenities || [],
                        baggage: selectedTrip.flight[0].baggage || "",
                        departureAirport:
                          selectedTrip.flight[0].departureAirport || "",
                        arrivalAirport:
                          selectedTrip.flight[0].arrivalAirport || "",
                        layovers: selectedTrip.flight[0].layovers || [],
                      }
                    : undefined
                }
                userEmail={userEmail}
                onConfirm={() => {}}
                onStartOver={() => {}}
                showBudget={false}
                showActions={false}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
