import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-notfound">
      {/* Conteúdo centralizado verticalmente */}
      <div className="sub-container">
        <Card className="card">
          <CardContent className="card-content">
            <div className="content-notfound">
              <AlertCircle className="alert-circle" />
              <h1 className="text-notfound">
                404 Page Not Found
              </h1>
            </div>

            <p className="description-notfound">
              Did you forget to add the page to the router?
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}