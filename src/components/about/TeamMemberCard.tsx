
import React from "react";
import { Book } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TeamMemberCardProps {
  name: string;
  title: string;
  description: string;
}

const TeamMemberCard = ({ name, title, description }: TeamMemberCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all">
      <CardHeader className="text-center">
        <CardTitle className="text-xl space-y-1">
          <div>{name}</div>
          <div className="text-sm font-medium text-primary">{title}</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-gray-700">
        <p>{description}</p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="cta-outline" size="sm" className="gap-2">
          <Book size={16} /> Read Bio
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TeamMemberCard;
