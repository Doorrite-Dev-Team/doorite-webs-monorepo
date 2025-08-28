"use client";

import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Html5Qrcode } from "html5-qrcode";
import { useRef, useState } from "react";



export function useScanner() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const start = async () => {
    if (!ref.current) return;
    const scanner = new Html5Qrcode(ref.current.id || "scanner");
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decoded) => setResult(decoded),
        (err) => setError(err)
      );
    } catch (err: any ) {
      setError(err.message || "Failed to start scanner");
    }
  };

  const stop = async () => {
    try {
      await scannerRef.current?.stop();
      await scannerRef.current?.clear();
    } catch (err) {
      console.warn("Failed to stop scanner:", err);
    }
  };

  return { ref, result, error, start, stop };
}

export function Scanner() {
  const { ref, result, error, start, stop } = useScanner();

  return (
    <Card className="max-w-md mx-auto mt-6 shadow-lg">
      <CardHeader>
        <CardTitle>QR Scanner</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          id="scanner"
          ref={ref}
          className="aspect-video rounded-md border"
        />

        <div className="flex gap-2">
          <Button onClick={start}>Start</Button>
          <Button variant="outline" onClick={stop}>
            Stop
          </Button>
        </div>

        {result && (
          <Alert className="bg-green-50 border-green-300 text-green-800">
            <AlertTitle>✅ Scan Successful</AlertTitle>
            <AlertDescription>
              <Badge variant="outline" className="text-sm">
                {result}
              </Badge>
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTitle>⚠️ Scan Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
