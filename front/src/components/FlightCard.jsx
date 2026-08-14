import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function FlightCard({ flight }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg" dir="ltr">
          ✈ {flight.id}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">חברת תעופה</p>
        <p className="font-medium">{flight.airline}</p>
        <p className="mt-2 text-sm text-muted-foreground">מספר נוסעים</p>
        <p className="font-medium">{flight.passengers}</p>
      </CardContent>
    </Card>
  )
}
