'use client';

import React, { useRef, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ReportType } from './AnalysisHistoryList';

type AnalysisReportViewerProps = {
  report: ReportType | null;
  isOpen: boolean;
  onClose: () => void;
  startDownload?: boolean;
};

export function AnalysisReportViewer({ report, isOpen, onClose, startDownload = false }: AnalysisReportViewerProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownloadPdf = async () => {
    const input = reportRef.current;
    if (!input) {
      toast({
        title: 'Download Error',
        description: 'Could not find report content.',
        variant: 'destructive',
      });
      return;
    }

    setIsDownloading(true);

    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      const width = pdfWidth - 20; // with margin
      const height = width / ratio;

      pdf.addImage(imgData, 'PNG', 10, 10, width, height);
      pdf.save(`anemocheck-report-${report?.id}.pdf`);

      toast({
        title: 'Download Started',
        description: 'Your report is being downloaded.',
      });
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'An error occurred while creating the PDF.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
      onClose(); // Close the dialog after download attempt
    }
  };
  
  useEffect(() => {
    if (isOpen && startDownload) {
      // Use a timeout to allow the dialog to render before starting the download.
      const timer = setTimeout(() => {
        handleDownloadPdf();
      }, 100);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, startDownload]);


  if (!report) return null;

  const isAnemiaPositive = report.summary?.toLowerCase().includes('anemia');

  return (
    <Dialog open={isOpen && !startDownload} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Analysis Report</DialogTitle>
          <DialogDescription>
            Report from {report.createdAt ? format(report.createdAt.toDate(), 'PPP, p') : 'N/A'}. This is not medical advice.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] my-4">
            <div ref={reportRef} className="p-4 rounded-lg border bg-background">
                <div className="space-y-4">
                <Alert variant={isAnemiaPositive ? 'destructive' : 'default'}>
                    <AlertTitle>Summary</AlertTitle>
                    <AlertDescription>{report.summary}</AlertDescription>
                </Alert>

                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Parameter</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {report.parameters.map((p: any, i: number) => (
                        <TableRow key={i}>
                        <TableCell className="font-medium">{p.parameter}</TableCell>
                        <TableCell>{p.value} {p.unit}</TableCell>
                        <TableCell>
                            <Badge variant={p.isNormal ? 'default' : 'destructive'}>
                            {p.isNormal ? 'Normal' : 'Out of Range'}
                            </Badge>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </div>
            </div>
        </ScrollArea>

        <DialogFooter>
          <Button onClick={handleDownloadPdf} variant="outline" disabled={isDownloading}>
            {isDownloading ? <Loader2 className="mr-2 animate-spin" /> : <Download className="mr-2" />}
            Download PDF
          </Button>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
