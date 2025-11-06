'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Download } from 'lucide-react';

const mockHistory = [
  { id: 'ANL-001', date: '2024-07-28', riskScore: 65, status: 'High Risk' },
  { id: 'ANL-002', date: '2024-06-15', riskScore: 30, status: 'Low Risk' },
  { id: 'ANL-003', date: '2024-05-20', riskScore: 45, status: 'Moderate Risk' },
];

export function AnalysisHistoryList() {
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'High Risk':
        return 'destructive';
      case 'Moderate Risk':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Analysis ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Risk Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockHistory.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.riskScore}/100</TableCell>
                <TableCell>
                  <Badge variant={getBadgeVariant(item.status)}>{item.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View Report</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download Report</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
