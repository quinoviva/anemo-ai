'use client';

import { AnalysisHistoryList } from '@/components/anemo/AnalysisHistoryList';
import { LabReportCapture } from '@/components/anemo/LabReportCapture';
import { Button } from '@/components/ui/button';
import { Upload, FileText } from 'lucide-react';
import { useState } from 'react';

export default function HistoryPage() {
  const [showLabCapture, setShowLabCapture] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Track & History</h1>
          <p className="text-muted-foreground">
            Review past analysis reports and upload new lab results.
          </p>
        </div>
        <Button onClick={() => setShowLabCapture(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Lab Report
        </Button>
      </div>

      <LabReportCapture
        isOpen={showLabCapture}
        onClose={() => setShowLabCapture(false)}
      />

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Analysis Reports
          </h2>
          <p className="text-muted-foreground">
            Your history of AI-powered image and questionnaire analyses.
          </p>
        </div>
        <AnalysisHistoryList />
      </div>
    </div>
  );
}
