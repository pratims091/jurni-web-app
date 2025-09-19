import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Plus, 
  Trash2, 
  User, 
  Calendar, 
  UserCheck,
  AlertCircle
} from 'lucide-react';

interface TripMember {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
}

interface TripMembersData {
  members: TripMember[];
  totalMembers: number;
}

interface TripMembersStepProps {
  onNext: (data: TripMembersData) => void;
  onBack: () => void;
  totalTravelers: number;
  userEmail: string;
  userName: string;
}

export const TripMembersStep = ({ onNext, onBack, totalTravelers, userEmail, userName }: TripMembersStepProps) => {
  const [members, setMembers] = useState<TripMember[]>([
    {
      id: 'user',
      name: userName || 'You',
      age: 25,
      gender: 'male'
    }
  ]);
  const [currentMember, setCurrentMember] = useState({
    name: '',
    age: '',
    gender: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const validateMember = (member: any): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!member.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!member.age || member.age < 1 || member.age > 100) {
      newErrors.age = 'Please enter a valid age (1-100)';
    }
    if (!member.gender) {
      newErrors.gender = 'Gender is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addMember = () => {
    if (!validateMember(currentMember)) {
      return;
    }

    if (members.length >= totalTravelers) {
      toast({
        title: "Maximum travelers reached",
        description: `You can only add ${totalTravelers} travelers for this trip.`,
        variant: "destructive"
      });
      return;
    }

    const newMember: TripMember = {
      id: Date.now().toString(),
      name: currentMember.name.trim(),
      age: parseInt(currentMember.age),
      gender: currentMember.gender as 'male' | 'female' | 'other'
    };

    setMembers([...members, newMember]);
    setCurrentMember({ name: '', age: '', gender: '' });
    setErrors({});

    toast({
      title: "Member added",
      description: `${newMember.name} has been added to the trip.`
    });
  };

  const removeMember = (memberId: string) => {
    if (memberId === 'user') {
      toast({
        title: "Cannot remove yourself",
        description: "You cannot remove yourself from the trip.",
        variant: "destructive"
      });
      return;
    }

    setMembers(members.filter(member => member.id !== memberId));
    toast({
      title: "Member removed",
      description: "Member has been removed from the trip."
    });
  };

  const updateMember = (memberId: string, field: string, value: any) => {
    setMembers(members.map(member => 
      member.id === memberId 
        ? { ...member, [field]: field === 'age' ? parseInt(value) : value }
        : member
    ));
  };

  const handleNext = () => {
    if (members.length === 0) {
      toast({
        title: "No members added",
        description: "Please add at least yourself to continue.",
        variant: "destructive"
      });
      return;
    }

    if (members.length > totalTravelers) {
      toast({
        title: "Too many members",
        description: `You can only have ${totalTravelers} travelers for this trip.`,
        variant: "destructive"
      });
      return;
    }

    const data: TripMembersData = {
      members,
      totalMembers: members.length
    };

    onNext(data);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Who's Going on This Trip?</h2>
        <p className="text-muted-foreground">
          Add details for all {totalTravelers} travelers to personalize your experience
        </p>
      </div>

      {/* Current Members Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Trip Members ({members.length}/{totalTravelers})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    {member.id === 'user' ? <UserCheck className="w-5 h-5 text-primary" /> : <User className="w-5 h-5 text-muted-foreground" />}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{member.name}</p>
                      {member.id === 'user' && <Badge variant="secondary">You</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {member.age} years old • {member.gender.charAt(0).toUpperCase() + member.gender.slice(1)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {member.id === 'user' ? (
                    <div className="flex gap-2">
                      <Select 
                        value={member.age.toString()} 
                        onValueChange={(value) => updateMember(member.id, 'age', value)}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 80 }, (_, i) => i + 16).map(age => (
                            <SelectItem key={age} value={age.toString()}>{age}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select 
                        value={member.gender} 
                        onValueChange={(value) => updateMember(member.id, 'gender', value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMember(member.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add New Member */}
      {members.length < totalTravelers && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Trip Member
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="member-name">Full Name</Label>
                <Input
                  id="member-name"
                  placeholder="Enter full name"
                  value={currentMember.name}
                  onChange={(e) => {
                    setCurrentMember({ ...currentMember, name: e.target.value });
                    setErrors({ ...errors, name: '' });
                  }}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="member-age">Age</Label>
                <Input
                  id="member-age"
                  type="number"
                  placeholder="Age"
                  min="1"
                  max="100"
                  value={currentMember.age}
                  onChange={(e) => {
                    setCurrentMember({ ...currentMember, age: e.target.value });
                    setErrors({ ...errors, age: '' });
                  }}
                  className={errors.age ? 'border-destructive' : ''}
                />
                {errors.age && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.age}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="member-gender">Gender</Label>
                <Select
                  value={currentMember.gender}
                  onValueChange={(value) => {
                    setCurrentMember({ ...currentMember, gender: value });
                    setErrors({ ...errors, gender: '' });
                  }}
                >
                  <SelectTrigger className={errors.gender ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.gender}
                  </p>
                )}
              </div>
            </div>

            <Button 
              onClick={addMember}
              disabled={!currentMember.name || !currentMember.age || !currentMember.gender}
              className="w-full"
              variant="travel"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Members Summary */}
      {members.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Trip Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{members.length}</p>
                <p className="text-sm text-muted-foreground">Total Members</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {Math.round(members.reduce((sum, member) => sum + member.age, 0) / members.length)}
                </p>
                <p className="text-sm text-muted-foreground">Average Age</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {members.filter(m => m.age < 18).length}
                </p>
                <p className="text-sm text-muted-foreground">Minors</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Status */}
      {members.length < totalTravelers && (
        <Card className="border-dashed border-muted-foreground/50">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">
              Add {totalTravelers - members.length} more member(s) to complete your trip details
            </p>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between max-w-4xl mx-auto">
        <Button onClick={onBack} variant="outline">
          ← Back to Login
        </Button>
        <Button 
          onClick={handleNext}
          disabled={members.length === 0}
          variant="travel"
        >
          Save Trip →
        </Button>
      </div>
    </div>
  );
};