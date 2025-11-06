'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  runGenerateImageDescription,
} from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, XCircle, FileImage, Loader2, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { DiagnosticInterview } from './DiagnosticInterview';

type AnalysisStep = 'idle' | 'analyzingImage' | 'interview' | 'error';

type ImageAnalyzerProps = {
  initialImageFile?: File;
  initialImageDataUri?: string;
  onReset?: () => void;
};


export function ImageAnalyzer({ initialImageFile, initialImageDataUri, onReset }: ImageAnalyzerProps) {
  const [imageFile, setImageFile] = useState<File | null>(initialImageFile || null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(initialImageDataUri || null);
  const [analysisStep, setAnalysisStep] = useState<AnalysisStep>('idle');
  const [imageDescription, setImageDescription] = useState<string | null>(null);
  const [isImageValid, setIsImageValid] = useState(false);
  const [heatmapOpacity, setHeatmapOpacity] = useState(0.5);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const startAnalysis = useCallback(async (dataUri: string) => {
    setAnalysisStep('analyzingImage');
    try {
      const result = await runGenerateImageDescription({ photoDataUri: dataUri });
      setImageDescription(result.description);
      setIsImageValid(result.isValid);

      if (!result.isValid) {
        setError(result.description);
        setAnalysisStep('error');
        toast({
          title: "Analysis Failed",
          description: "Image not valid for analysis.",
          variant: "destructive",
        });
      } else {
        setAnalysisStep('interview');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to analyze image. ${errorMessage}`);
      setAnalysisStep('error');
      toast({
        title: "Analysis Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast]);
  
  useEffect(() => {
    if (initialImageFile && initialImageDataUri) {
      setImageFile(initialImageFile);
      setImageUrl(URL.createObjectURL(initialImageFile));
      setImageDataUri(initialImageDataUri);
      startAnalysis(initialImageDataUri);
    }
     // Cleanup function to revoke the object URL
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialImageFile, initialImageDataUri]);


  const resetState = () => {
    if(onReset) {
      onReset();
    }
    setImageFile(null);
    if(imageUrl) {
        URL.revokeObjectURL(imageUrl);
    }
    setImageUrl(null);
    setImageDataUri(null);
    setAnalysisStep('idle');
    setImageDescription(null);
    setIsImageValid(false);
    setHeatmapOpacity(0.5);
    setError(null);
  };
  
  const handleImageChange = (file: File | null) => {
    if (!file || !file.type.startsWith('image/')) {
        toast({
            title: "Invalid File Type",
            description: "Please upload an image file (e.g., PNG, JPG).",
            variant: "destructive",
        });
        return;
    }
    
    resetState();

    setImageFile(file);
    const newImageUrl = URL.createObjectURL(file);
    setImageUrl(newImageUrl);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUri = e.target?.result as string;
      setImageDataUri(dataUri);
      startAnalysis(dataUri);
    };
    reader.readAsDataURL(file);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if(dropzoneRef.current) dropzoneRef.current.classList.add('border-primary', 'bg-primary/10');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if(dropzoneRef.current) dropzoneRef.current.classList.remove('border-primary', 'bg-primary/10');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if(dropzoneRef.current) dropzoneRef.current.classList.remove('border-primary', 'bg-primary/10');
    const file = e.dataTransfer.files[0];
    handleImageChange(file);
  };
  

  const AnalysisWorkspace = () => (
    <div className="grid md:grid-cols-2 gap-6 h-full">
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileImage /> Image Analysis
          </CardTitle>
          {isImageValid ? (
             <CardDescription>{imageDescription}</CardDescription>
          ) : (
            <CardDescription className='text-destructive'>{imageDescription || "Analyzing..."}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center">
            {imageUrl && (
              <div className="space-y-4">
                <div className="relative aspect-video rounded-md overflow-hidden border bg-black">
                  <img src={imageUrl} alt="Uploaded for analysis" className="object-contain w-full h-full" />
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-red-500/80 via-yellow-500/50 to-green-500/80 mix-blend-multiply"
                    style={{ opacity: heatmapOpacity, transition: 'opacity 0.2s' }}
                    data-ai-hint="anemia detection heatmap"
                  />
                </div>
                <div className="space-y-2">
                    <label htmlFor="heatmap-opacity" className="text-sm font-medium">Heatmap Transparency</label>
                    <Slider
                        id="heatmap-opacity"
                        min={0}
                        max={1}
                        step={0.05}
                        value={[heatmapOpacity]}
                        onValueChange={(value) => setHeatmapOpacity(value[0])}
                    />
                </div>
              </div>
            )}
        </CardContent>
      </Card>

      <div className='flex flex-col gap-6 h-full'>
        {analysisStep === 'interview' && (
           <DiagnosticInterview 
             imageDescription={imageDescription}
             onAnalysisError={(err) => {
                setError(err);
                setAnalysisStep('error');
             }}
             onReset={resetState}
            />
        )}
      </div>
    </div>
  );


  return (
    <div className="h-full">
        {analysisStep === 'idle' && (
            <div className="text-center p-8 h-full flex flex-col justify-center items-center">
              <div ref={dropzoneRef} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className="w-full max-w-lg border-2 border-dashed rounded-lg transition-colors p-8">
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Upload an Image</h3>
                <p className="mt-1 text-sm text-muted-foreground">Drag & drop or click to upload a clear photo of your skin, under-eye, or fingernails.</p>
                <Input type="file" accept="image/*" className="sr-only" id="image-upload" onChange={(e) => handleImageChange(e.target.files ? e.target.files[0] : null)} />
                <Button asChild className="mt-4">
                    <label htmlFor="image-upload">Browse Files</label>
                </Button>
              </div>

              <div className="relative my-6 w-full max-w-lg">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                    Or
                    </span>
                </div>
            </div>

            <div className="w-full max-w-lg">
                 <Button asChild variant="outline" className="w-full">
                    <Link href="/dashboard/live-analysis">
                      <Camera className="mr-2" />
                       Use Live Camera
                    </Link>
                </Button>
                 <p className="mt-2 text-center text-xs text-muted-foreground">
                    Use your device's camera for a real-time analysis.
                </p>
            </div>
          </div>
        )}

        {analysisStep === 'analyzingImage' && (
             <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /> <p className='ml-2 text-lg'>Analyzing Image...</p></div>
        )}

        {analysisStep === 'interview' && <AnalysisWorkspace />}
        
        {analysisStep === 'error' && (
            <div className="h-full flex flex-col justify-center items-center">
            <Alert variant="destructive" className="max-w-lg">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Analysis Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                <Button variant="outline" size="sm" className="mt-4" onClick={resetState}>Try Again</Button>
            </Alert>
            </div>
        )}
    </div>
  );
}
