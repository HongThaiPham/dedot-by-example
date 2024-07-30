import { FEATURES } from "@/lib/constants";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";

const FeaturesGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {FEATURES.map((feature) => (
        <Link key={feature.name} href={feature.href}>
          <Card>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default FeaturesGrid;
